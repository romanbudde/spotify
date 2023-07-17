const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

require('dotenv').config();

const { Client } = require('pg');
const client = new Client();

const passport = require('passport');
const LocalStrategy = require('passport-local');

const flash = require('express-flash');
const session = require('express-session');

const port = process.env.PORT; 
const ngrok_auth_token = process.env.NGROK_TOKEN; 

// setting GMT -3 Timezone.
process.env.TZ = 'America/Sao_Paulo';

// middleware
app.use(cors());
app.use(express.json());
app.use(flash())

app.use(bodyParser.json());

app.use(express.static('public'));

// initialize PassportJS and enable session support
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(router);

app.use(cors({
    origin: "http://localhost:3000"
}))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Maximum file size of 5MB
    }
});

passport.use(new LocalStrategy(
	{usernameField:"email", passwordField:"password"},
    async function(email, password, done) {
        // Authenticate the user
        console.log('--- AT login localStrategy ---');
        const { rows } = await pool.query(
            'SELECT * FROM users WHERE mail = $1',
            [email]
        );
        const user = rows[0];
        if (!user) {
            console.log('email no registrado');
            return done(null, false, { message: 'Email no registrado.' });
        }

        const match = await bcrypt.compare(password, user.password)
        .then((isMatch) => {
            if (isMatch) {
                console.log('matchhhhheeesss!!');
                return done(null, user);
                // return res.status(200).json({
                //     message: "logged in successfully!",
                //     user: {
                //         id: user.id,
                //         email: user.email
                //     }
                // });
            }
            else {
                console.log('DOES NOT MATCH!!');
                return done(null, false, { message: 'Contraseña incorrecta.' });
            }
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(async function(id, done) {
    // Retrieve user information from database
    try {
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        done(null, user.rows[0]);
    }
    catch (error) {
        done (err)
    }
});

// Routes

// login cuidador
app.post('/login', passport.authenticate('local'), (req, res) => {
	console.log(req.user);
    console.log('Login has been authenticated!');

	// generate the JWT that we're gonna send back as a response to the client.
	const payload = { userId: req.user.id };
	const secretKey = process.env.JWT_SECRET;
	// Generate token
	const token = jwt.sign(payload, secretKey);
	console.log("JWT Token: ", token);

	// send token back to the client
	res.json({
		"auth_token": token,
		"user_id": req.user.id,
		"user_type": req.user.type
	});


});

// create - un cuidador
app.post('/cuidadores', async(req, res) => {
    try {
        console.log('---- backend ----');
        console.log(req.body);
        const { description, password, email, userType, firstname, lastname } = req.body;
        
        console.log('---- current date ----');
        const created_at = new Date();
        console.log(created_at);

        console.log(password);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newCuidador = await pool.query(
            "INSERT INTO users (description, mail, password, type, created_at, enabled, name, last_name) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", 
            [description, email, hashedPassword, userType, created_at, 1, firstname, lastname]
        );

        // res.json(req.body);
        res.json(newCuidador.rows[0]);
    }
    catch (error) {
        console.error(error.message);
    }
});

// user login
// app.post('/login', async(req, res) => {
//     try {
//         console.log('---- backend (login route) ----');
//         console.log(req.body);
//         const { email, password } = req.body;
//         // const hashedPassword = await bcrypt.hash(password, 10);

//         const { rows } = await pool.query(
//             'SELECT * FROM users WHERE mail = $1',
//             [email]
//         );
//         const user = rows[0];
//         // res.json({"user": user});

//         if(!user){
//             return res.status(401).json({ error: 'Email no registrado.' });
//         }

//         // Compare the password with the hashed password in the database
//         const hashedPassword = await bcrypt.hash(password, 10);
//         console.log('hashed password: ', hashedPassword);
//         console.log('users password: ', user.password);
//         console.log('passed password: ', password);
//         // console.log('hashedPassword: ', hashedPassword);
//         const match = await bcrypt.compare(password, user.password)
//             .then((isMatch) => {
//                 if (isMatch) {
//                     console.log('matchhhhheeesss!!');
//                     // return done(null, user);
//                     return res.status(200).json({
//                         message: "logged in successfully!",
//                         user: {
//                             id: user.id,
//                             email: user.email
//                         }
//                     });
//                 }
//                 else {
//                     console.log('DOES NOT MATCH!!');
//                     return res.status(401).json({ error: 'Contraseña incorrecta.' });
//                 }
//             });

//     }
//     catch (error) {
//         console.error(error.message);
//         return res.status(500).json({ error: error.message });
//     }
// });

// user register
app.post('/register', async(req, res) => {
    try {
        console.log('---- backend (register route) ----');
        console.log(req.body);
        const { email, password, firstname, lastname, address} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const created_at = new Date();


        const userExists = await pool.query(
            "SELECT * FROM users WHERE mail = $1",
            [email]
        );

        if(userExists.rows > 0) {
            return res.status(401).json({ error: 'Ups, el email ya está registrado con otro usuario.' });
        } 
        else {
            const newUser = await pool.query(
                "INSERT INTO users (mail, password, type, created_at, enabled, name, last_name, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", 
                [email, hashedPassword, '0', created_at, 1, firstname, lastname, address]
            );
    
            // Generate token
            const payload = { userEmail: email };
            const secretKey = process.env.JWT_SECRET;

            const token = jwt.sign(payload, secretKey);
            console.log("JWT Token: ", token);

            // send token back to the client
            
            res.json({
                "user": newUser.rows[0],
                "token": token
            });
        }

        // res.json(req.body);
        res.json(userExists.rows[0]);
    }
    catch (error) {
        console.error(error.message);
        res.json(error.message);
    }
});

// get all - users
app.get("/users", async(req, res) => {
    try {
        const allUsers = await pool.query("SELECT * from users")
        res.json(allUsers.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// get all - sedes
app.get("/sedes", async(req, res) => {
    try {
        const allSedes = await pool.query("SELECT * from sede")
        res.json(allSedes.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// get (by id) individual user
app.get("/users/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

        res.json(user.rows[0]);
    }
    catch (error) {
        console.error(error.message);
    }
});

// get a reservation by user id or sede_id
app.get("/reservas", async(req, res) => {
    try {
        const { user_id, sede_id } = req.query;

        let reservas;

        if (user_id && sede_id) {
            // Both user_id and sede_id are provided
            reservas = await pool.query(
                "SELECT * from sede_reservations WHERE user_id = $1 AND sede_id = $2",
                [user_id, sede_id]
            );
        } else if (user_id) {
            // Only user_id is provided
            reservas = await pool.query(
                "SELECT * from sede_reservations WHERE user_id = $1",
                [user_id]
            );
        } else if (sede_id) {
            // Only sede_id is provided
            reservas = await pool.query(
                "SELECT * from sede_reservations WHERE sede_id = $1",
                [sede_id]
            );
        } else {
            res.status(400).json({"message": "Error: ni user_id ni sede_id fueron especificados."});
        }

        console.log('reservas: ', reservas.rows);
        res.json(reservas.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// get a reservation by user id or sede_id
app.post("/reservas", async(req, res) => {
    try {
        const { user_id, sede_id, horario, date} = req.body;
        console.log('user_id: ', user_id);
        console.log('sede_id: ', sede_id);
        console.log('horario: ', horario);
        console.log('date: ', date);

        // chequear que los cupos de la sede, para esa hora (y en el dia de hoy) no esten todos cubiertos.
        // get cupos sede
        const sede = await pool.query(
            "SELECT * from sede WHERE id = $1",
            [sede_id]
        );

        const sede_data = sede.rows[0];
        
        // get reservations para la sede, contarlas y que sea menor al max_cupo de la sede.
        const reservas = await pool.query(
            "SELECT * from sede_reservations WHERE sede_id = $1",
            [sede_id]
        );

        console.log('reservas: ', reservas.rows)

        let reservas_counter = 0;
        reservas.rows.forEach(reserva => {
            console.log('------------- reserva.horario: ', reserva.horario);
            console.log('------------- horario: ', horario);
            console.log('------------- reserva.date: ', reserva.date);
            console.log('------------- date: ', date);
            if (reserva.horario === horario && reserva.date === date){
                reservas_counter++;
            }
        });

        console.log('------- reservas counter: ', reservas_counter);
        console.log('------- sede_data.max_cupo: ', sede_data.max_cupo);

        if (reservas_counter < sede_data.max_cupo){
            // crear reserva
            console.log('crear reserva!');
            const newReserva = await pool.query(
                "INSERT INTO sede_reservations (user_id, sede_id, horario, date) VALUES($1, $2, $3, $4) RETURNING *", 
                [user_id, sede_id, horario, date]
            );
            
            console.log('newReserva: ', newReserva.rows[0])
            
            res.status(200).json(newReserva.rows[0]);
        }
        else {
            console.log('ERROR!');
            res.status(400).json({"error": "Error: limite de cupos excedido."});
        }
            
    }
    catch(error){
        console.log(error);
    }
});

// update individual - cuidador
app.put("/sedes/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { address, name, cupo, horarios, latitude, longitude } = req.body;
        console.log('address: ', address);
        console.log('name: ', name);
        console.log('cupo: ', cupo);
        console.log('horarios: ', horarios);
        const updateSede = await pool.query(
            "UPDATE sede SET address = $1, max_cupo = $2, name = $3, horarios = $4, latitude = $5, longitude = $6 WHERE id = $7 RETURNING *",
            [address, cupo, name, horarios, latitude, longitude, id]
        );

        console.log('updateSede: ', updateSede)

        if(updateSede.rowCount > 0){
            res.json(updateSede.rows[0]);
            // res.json('asd');
        }
        else {
            res.json('Oops! No sede with given ID (' + id + ') has been found.');
        }
    }
    catch (error) {
        console.error(error.message);
    }
});

// create - una sede
app.post('/sedes', async(req, res) => {
    try {
        console.log('---- backend post /sedes ----');
        console.log(req.body);
        const { address, name, cupo, horarios, latitude, longitude } = req.body;
        
        console.log('---- current date ----');
        const created_at = new Date();
        console.log(created_at);

        const newSede = await pool.query(
            "INSERT INTO sede (address, max_cupo, name, horarios, latitude, longitude) VALUES($1, $2, $3, $4, $5, $6) RETURNING *", 
            [address, cupo, name, horarios, latitude, longitude]
        );

        // res.json(req.body);
        res.json(newSede.rows[0]);
    }
    catch (error) {
        console.error(error.message);
    }
});

// get users by different parametres
app.get("/users_filtered", async(req, res) => {
    try {
        console.log('----------------------------------------------------------------- AT /USERS GET ENDPOINT');
        let { user_email, user_firstname, user_lastname, status } = req.query;
        
        console.log('----------------------------------- user_email: ', user_email);
        console.log('----------------------------------- user_firstname: ', user_firstname);
        console.log('----------------------------------- user_lastname: ', user_lastname);
        console.log('----------------------------------- status: ', status);
        let users;
        
        let query = "SELECT * FROM users";
        // Array to store the conditions
        let conditions = [];
        let values = [];

        // Check if client_email is provided
        if (user_email ) {
            conditions.push(`(mail LIKE '%' || $1 || '%')`);
            values.push(user_email);
        }

        // Check if status is provided
        if (status && status !== 'all') {
            if(status === 'enabled') {
                conditions.push(`(enabled = $${values.length + 1})`);
                values.push(true);
            }
            if(status === 'disabled'){
                conditions.push(`(enabled = $${values.length + 1})`);
                values.push(false);
            }
        }

        if (user_firstname) {
            // conditions.push(`( customer_id = ANY($${values.length + 1}) OR caregiver_id = ANY($${values.length + 1}) )`);
            conditions.push(`(name LIKE '%' || $${values.length + 1} || '%')`);
            values.push(user_firstname);
        }

        if (user_lastname) {
            // conditions.push(`( customer_id = ANY($${values.length + 1}) OR caregiver_id = ANY($${values.length + 1}) )`);
            conditions.push(`(last_name LIKE '%' || $${values.length + 1} || '%')`);
            values.push(user_lastname);
        }

        // Join the conditions with AND
        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }
        
        console.log('query: ', query);
        console.log('values: ', values);
        users = await pool.query(query, values);
        
        // console.log('contracts: ', contracts.rows);
        
        console.log('user email: ', user_email);
        console.log('user firstname: ', user_firstname);
        console.log('user lastname: ', user_lastname);
        console.log('status: ', status);
        res.json(users.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

app.post('/upload_image', upload.single('file'), async (req, res) => {
    console.log('at upload image functionality.');

    if (req.file.size > 5 * 1024 * 1024) {
        console.log('El tamaño de la imagen supera el límite permitido.');
        return res.status(400).json({ error: 'El tamaño de la imagen supera el límite permitido' });
    }

    if (
        req.file.mimetype !== 'image/jpeg' &&
        req.file.mimetype !== 'image/png' &&
        req.file.mimetype !== 'image/webp'
    ) {
        console.log('El archivo no es una imagen válida.');
        return res.status(400).json({ error: 'La imagen está en un formato inválido (permitidos: .png, .jpg, .webp).' });
    }

    // update user's profile_picture_url value.
    const user_id = req.body.user_id;
    const file_name = req.file.filename;
    console.log('user_id is: ', user_id);
    console.log('req.file is: ', req.file);
    console.log('req.file.filename is: ', req.file.filename);
    console.log('req.file.path is: ', req.file.path);
    const updateUser = await pool.query(
        "UPDATE users SET profile_picture_url = $1 WHERE id = $2 RETURNING *", 
        [file_name, user_id]
    );
    
    res.json({})
});





















// get all - user types
app.get("/user_types", async(req, res) => {
    try {
        const userTypes = await pool.query("SELECT * from user_type")
        res.json(userTypes.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// filtrar cuidadores (desde el lado del usuario)
app.post("/search_cuidadores", async(req, res) => {
    try {
		const { min_rate, max_rate, lowest_score_acceptable } = req.body;
		console.log(min_rate);
		console.log(max_rate);
		console.log(lowest_score_acceptable);
		
		const values = [];
		values.push(lowest_score_acceptable);

		let query = "SELECT * FROM users WHERE type = '1' AND enabled = true AND average_review_score >= $1";


		if (min_rate && max_rate) {
			query += " AND hourly_rate BETWEEN $2 AND $3";
			values.push(min_rate);
			values.push(max_rate);
		} else if (min_rate) {
			query += " AND hourly_rate >= $2";
			values.push(min_rate);
		} else if (max_rate) {
			query += " AND hourly_rate <= $2";
			values.push(max_rate);
		}

        const allCuidadores = await pool.query(query, values);
		// console.log(allCuidadores);
        res.json(allCuidadores.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// add review for a caregiver and update users average_review_score
app.post("/caregiver_review", async(req, res) => {
    try {
		const { observation, caregiver_id, customer_id, review_score } = req.body;
		console.log('observation: ', observation);
		console.log('caregiver_id: ', caregiver_id);
		console.log('review_score: ', review_score);

        const caregiver = await pool.query("SELECT * FROM users WHERE type = '1' AND enabled = true AND id = $1", [caregiver_id]);
		if(caregiver.rows[0].id > 0) {
			let query = "INSERT INTO caregiver_score (caregiver_id, customer_id, score, observation, created_at) VALUES($1, $2, $3, $4, $5) RETURNING *";
	
			const created_at = new Date();
			const modified_at = new Date();
	
			const allCuidadores = await pool.query(query, [caregiver_id, customer_id, review_score, observation, created_at ]);
			// console.log(allCuidadores);
			res.json(allCuidadores.rows[0]);
	
			// check that the review has been created (it has an id greater than 0)
			// update users table with newer score average
			if(allCuidadores.rows[0].id > 0){
				const allScores = await pool.query("SELECT * FROM caregiver_score WHERE caregiver_id = $1", [caregiver_id]);
	
				// get new average
				let scores_amount = 0;
				let scores_accumulated = 0;
				let score_average = 0;
	
				if(allScores.rows.length > 0) {
					allScores.rows.forEach( review => {
						console.log("review.score: ", review.score);
						scores_accumulated = scores_accumulated + parseFloat(review.score);
						scores_amount++;
					});
					score_average = scores_accumulated / scores_amount;
					score_average = score_average.toFixed(2);
				} else {
					score_average = review_score;
				}
	
				console.log('scores_accumulated: ', scores_accumulated);
				console.log('scores_amount: ', scores_amount);
				console.log('scores_average: ', score_average);
	
				if(score_average){
					const updateCuidadorScore = await pool.query("UPDATE users SET average_review_score = $1, modified_at = $2 WHERE id = $3 RETURNING *", [score_average, modified_at, caregiver_id]);
				}
			}
		}
    }
    catch (error) {
        console.error(error.message);
    }
});

// get a contract by user id
app.get("/contract", async(req, res) => {
    try {
        const { user_id } = req.query;

        let contracts;

        contracts = await pool.query("SELECT * from contract WHERE caregiver_id = $1 OR customer_id = $1", [user_id]);

        console.log('contracts: ', contracts);
        res.json(contracts.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// get payment methods
app.get("/payment_methods", async(req, res) => {
    try {
        let payment_methods;

        payment_methods = await pool.query("SELECT * from payment_methods");

        console.log('payment_methods: ', payment_methods);
        res.json({
            "payment_methods": payment_methods.rows
        });
    }
    catch (error) {
        console.error(error.message);
    }
});

// get contracts by different parametres
app.get("/contracts", async(req, res) => {
    try {
        let { client_email, caregiver_email, start_date, end_date, status } = req.query;

        // bring from users table those that have similarities with client email or caregiver email
        let users;
		// users = await pool.query("SELECT * FROM users WHERE mail LIKE $1 OR mail LIKE $2", [client_email, caregiver_email]);

        if(client_email === '' && caregiver_email === '') {
            users = await pool.query
                ("SELECT * FROM users WHERE (type = '0' OR 'type' = '1')"
            );
        }

        if(client_email !== '' && caregiver_email !== '') {
            users = await pool.query
                ("SELECT * FROM users WHERE (mail LIKE '%' || $1 || '%' OR mail LIKE '%' || $2 || '%') AND (type = '0' OR 'type' = '1')", 
                [client_email, caregiver_email]
            );
        }
        else {
            if(client_email !== '') {
                users = await pool.query
                    ("SELECT * FROM users WHERE (mail LIKE '%' || $1 || '%') AND (type = '0')", 
                    [client_email]
                );
            }
            if(caregiver_email !== ''){
                users = await pool.query
                    ("SELECT * FROM users WHERE (mail LIKE '%' || $1 || '%') AND (type = '1')", 
                    [caregiver_email]
                );
            }
        }


        // console.log('client_email:', client_email.trim());
        console.log('caregiver email:', caregiver_email);
        console.log('matching users: ');
        console.log(users.rows);

        // res.json(users.rows);

        let userIdsArray = users.rows.map(user => user.id);

        let contracts;

        let query = "SELECT * FROM contract";
        // Array to store the conditions
        let conditions = [];
        let values = [];

        // Check if client_email is provided
        if (client_email || caregiver_email) {
            conditions.push(`( customer_id = ANY($${values.length + 1}) OR caregiver_id = ANY($${values.length + 1}) )`);
            values.push(userIdsArray);
        }

        // Check if start_date is provided
        if (start_date) {
            // conditions.push(`(date >= $${values.length + 1})`);
            conditions.push(`( TO_DATE(date, 'DD/MM/YYYY') >= TO_DATE($${values.length + 1}, 'DD/MM/YYYY') )`);
            values.push(start_date);
        }

        // Check if end_date is provided
        if (end_date) {
            conditions.push(`( TO_DATE(date, 'DD/MM/YYYY') <= TO_DATE($${values.length + 1}, 'DD/MM/YYYY') )`);
            values.push(end_date);
        }

        // Check if status is provided
        if (status && status !== 'all') {
            conditions.push(`(status = $${values.length + 1})`);
            values.push(status);
        }

        // Join the conditions with AND
        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }
        
        console.log('query: ', query);
        console.log('values: ', values);
        contracts = await pool.query(query, values);
        
        // console.log('contracts: ', contracts.rows);
        
        console.log('client email: ', client_email);
        console.log('caregiver email: ', caregiver_email);
        console.log('startDate: ', start_date);
        console.log('endDate: ', end_date);
        res.json(contracts.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// update a contract by its id
app.put("/contract/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const { status } = req.body;
        const modified_at = new Date();
        const update_contract = await pool.query(
            "UPDATE contract SET status = $1 WHERE id = $2 RETURNING *", 
            [status, id]
        );

        if(update_contract.rowCount > 0){
            res.status(200).json(update_contract.rows[0]);
        }
        else {
            res.json('Oops! No contract with given ID (' + id + ') has been found.');
        }
    }
    catch (error) {
        console.error(error.message);
    }
});

// app.get("/webhook-mercadopago", async(req, res) => {
//     try{
//         mercadopago.configure({
//             access_token: MERCADOPAGO_TEST_TOKEN
//         });
    
//         const result = await mercadopago.preferences.create({
//             items: [
//                 { 
//                     title: "Contrato 000001",
//                     unit_price: 29,
//                     currency_id: 'ARS',
//                     quantity: 1
//                 }
//             ],
//             notification_url: "",
//         })
    
//         console.log('result: ', result);
//     }
//     catch(error){
//         console.log('error: ', error);
//     }
// });

// create a contract
app.post("/contract", async(req, res) => {
    try {
		const { caregiver_id, customer_id, date, horarios, payment_method } = req.body;
		console.log('customer_id: ', customer_id);
		console.log('caregiver_id: ', caregiver_id);
		console.log('date: ', date);
		console.log('horarios: ', horarios);
		console.log('horarios.length: ', horarios.length);
		// console.log('------------- payment_method: ', payment_method);

        const caregiverQuery = await pool.query("SELECT * FROM users WHERE type = '1' AND enabled = true AND id = $1", [caregiver_id]);
        const clientQuery = await pool.query("SELECT * FROM users WHERE type = '0' AND enabled = true AND id = $1", [customer_id]);
        const created_at = new Date();
        const modified_at = new Date();

		if(caregiverQuery.rows[0].id > 0 && clientQuery.rows[0].id > 0) {
            
            const caregiver = caregiverQuery.rows[0];
            const client = clientQuery.rows[0];
            // calculate the total amount of the contract using cuidador's rate and the amount of horarios.
            let amount = horarios.length * caregiver.hourly_rate;
    
            console.log('total amount: ', amount);

            // si hay cliente y cuidador, tengo que traer las availabilities del cuidador, removerle aquellas en 'horarios', y volver a guardarlas en la DB.
            // update: si el metodo de pago es MP, las availabilities no las updateo ahora, sino que lo updateo en la respuesta del webhook
            if(payment_method !== 1) {
                const previousAvailabilities = await pool.query("SELECT * FROM caregiver_availability WHERE caregiver_id = $1", [caregiver_id]);
    
                console.log('caregiver availabilities for date: ', date);
                console.log(previousAvailabilities.rows[0].dates[date]);
    
                if(previousAvailabilities.rows[0].dates[date].length > 0) {
                    let allAvailabilities = previousAvailabilities.rows[0].dates;
                    let availabilitiesForDate = previousAvailabilities.rows[0].dates[date];
                    let filteredAvailabilities = availabilitiesForDate.filter(time => !horarios.includes(time));
    
                    console.log('filteredAvailabilities: ');
                    console.log(filteredAvailabilities);
                    allAvailabilities[date] = filteredAvailabilities;
    
                    console.log('allAvailabilities entero y updateado: ');
                    console.log(allAvailabilities);
    
                    const newAvailabilities = await pool.query("UPDATE caregiver_availability SET dates = $1 WHERE caregiver_id = $2 RETURNING *", [allAvailabilities, caregiver_id]);
                } else {
                    // return error because times for that date are NOT available.
                    return res.status(401).json({ error: 'Error: alguno de los horarios no esta disponible para la fecha elegida.' });
                }
            }


            // check that the client does not have an active contract for any of the horarios in the new contract.
            const clientExistingContracts = await pool.query("SELECT * FROM contract WHERE customer_id = $1 AND status = 'active' AND date = $2",
            [customer_id, date]);
            console.log('clientExistingContracts: ');
            console.log(clientExistingContracts.rows);
            if(clientExistingContracts.rows.length > 0) {
                for (let i = 0; i < clientExistingContracts.rows.length; i++) {
                    const contract = clientExistingContracts.rows[i];
                    if (contract.horarios.length > 0){
                        
                        let existingContractHorarios = contract.horarios;
                        console.log("existingContractHorarios:");
                        console.log(existingContractHorarios);
                        console.log("horarios: ");
                        console.log(horarios);
        
                        if (existingContractHorarios.some(time => horarios.includes(time))){
                            // then, the client already has a contract for that date in one or more of the selected times.
                            return res.status(401).json({ error: 'Ya tienes otro contrato existente para ese día en alguno de esos horarios.' });
                        }
                    }
                }
            }


            // create contract now that we have the caregiver availabilities updated, and we've checked that the client does NOT have a contract
            // for any of those times already.

			let query = "INSERT INTO contract (customer_id, caregiver_id, created_at, modified_at, amount, horarios, date, status, payment_method_id, payment_status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";

            let status = '';
            // if payment is via mercado pago, we do not set the contract as active right away, but rather wait for mercadopago's response
            if(payment_method === 1){
                status = 'inactive';
            }
            if(payment_method === 2){
                status = 'active';
            }

            console.log('horarios json encoded: ');
            console.log(JSON.stringify(horarios));

            let horarios_json = JSON.stringify(horarios);
	
			const newContract = await pool.query(query, [customer_id, caregiver_id, created_at, modified_at, amount, horarios_json, date, status, payment_method, 'pending' ]);
			// console.log(allCuidadores);
			res.json(newContract.rows[0]);

            console.log(' SUCCESS -------- CREATED NEW CONTRACT!');
	
			// check that the contract has been created (it has an id greater than 0)
			// if(newContract.rows[0].id > 0){
				
			// }
		}
    }
    catch (error) {
        console.error(error.message);
    }
});

// update available dates json for a specific caregiver
app.post("/caregiver_update_available_dates", async (req, res) => {
    try {
		const { dates, caregiver_id } = req.body;
		console.log('dates');
		console.log(dates);

		const previousAvailabilities = await pool.query("SELECT * FROM caregiver_availability WHERE caregiver_id = $1", [caregiver_id]);

		console.log('previousAvailabilities: ');
		// console.log(previousAvailabilities.rows[0]);

		let newAvailabilities;
        
		if(!previousAvailabilities.rows[0]){
			newAvailabilities = await pool.query("INSERT INTO caregiver_availability (dates, caregiver_id) VALUES ($1, $2) RETURNING *", [dates, caregiver_id]);
		}
		else {
			newAvailabilities = await pool.query("UPDATE caregiver_availability SET dates = $1 WHERE caregiver_id = $2 RETURNING *", [dates, caregiver_id]);
		}

		res.json({
			"newAvailabilities": newAvailabilities.rows[0]
		});
    }
    catch (error) {
        console.error(error.message);
    }
});

// caregiver: "delete" a single time (half hour period) from a caregiver's availability on a certain day. 
app.post("/caregiver_delete_single_time", async (req, res) => {
    try {
		const { date, timeToDelete, caregiver_id } = req.body;
		console.log('date');
		console.log(date);
		console.log('time');
		console.log(timeToDelete);

		const previousAvailabilities = await pool.query("SELECT * FROM caregiver_availability WHERE caregiver_id = $1", [caregiver_id]);

		console.log('previousAvailabilities: ');
		console.log(previousAvailabilities.rows[0]);

        // check that the caregiver does not have an active contract at the time being deleted.
        const caregiverExistingContracts = await pool.query("SELECT * FROM contract WHERE caregiver_id = $1 AND status = 'active' AND date = $2",
        [caregiver_id, date]);
        console.log('caregiverExistingContracts: ');
        console.log(caregiverExistingContracts.rows);
        if(caregiverExistingContracts.rows.length > 0) {
            for (let i = 0; i < caregiverExistingContracts.rows.length; i++) {
                const contract = caregiverExistingContracts.rows[i];
                if (contract.horarios.length > 0){
                    
                    let existingContractHorarios = contract.horarios;
                    console.log("existingContractHorarios:");
                    console.log(existingContractHorarios);
    
                    if (existingContractHorarios.some(time => time === timeToDelete)){
                        // then, the client already has a contract for that date in one or more of the selected times.
                        return res.status(401).json({ error: 'Error al eliminar disponibilidad: existe un contrato activo para ese horario.' });
                    }
                }
            }
        }

        console.log('previous availabilities en el dia a eliminar el time: ', previousAvailabilities.rows[0].dates[date]);

        let newAvailabilities = previousAvailabilities.rows[0].dates;
        newAvailabilities[date] = newAvailabilities[date].filter(time => time !== timeToDelete);
        console.log("availabilities filtradas sin el horario a eliminar: ", newAvailabilities[date]);

		newAvailabilitiesResponse = await pool.query("UPDATE caregiver_availability SET dates = $1 WHERE caregiver_id = $2 RETURNING *", [newAvailabilities, caregiver_id]);

		res.status(200).json({
			"newAvailabilities": newAvailabilitiesResponse.rows[0]
		});
    }
    catch (error) {
        console.error(error.message);
    }
});

// get available dates json for a specific caregiver
app.get("/caregiver_get_available_dates", async (req, res) => {
    try {
		const { caregiver_id } = req.query;
		// console.log('dates');
		console.log(req.params);

		const availabilities = await pool.query("SELECT * FROM caregiver_availability WHERE caregiver_id = $1", [caregiver_id]);

		res.json({
			"availabilities": availabilities.rows[0]
		});
    }
    catch (error) {
        console.error(error.message);
    }
});

// update individual - cuidador
app.put("/cuidadores/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const { description, email, firstname, lastname, userType, enabled, hourlyRate, address } = req.body;
        const modified_at = new Date();
        const updateUser = await pool.query(
            "UPDATE users SET description = $1, mail = $2, name = $3, last_name = $4, type = $5,  modified_at = $6, enabled = $7, hourly_rate = $8, address = $9 WHERE id = $10 RETURNING *", 
            [description, email, firstname, lastname, userType, modified_at, enabled, hourlyRate, address,	 id]
        );

        if(updateUser.rowCount > 0){
            res.json(updateUser.rows[0]);
            // res.json('asd');
        }
        else {
            res.json('Oops! No user with given ID (' + id + ') has been found.');
        }
    }
    catch (error) {
        console.error(error.message);
    }
});

// delete (by id) individual - cuidador
app.delete("/cuidadores/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const deleteUser = await pool.query(
            "UPDATE users SET enabled = false WHERE id = $1", 
            // "DELETE FROM users WHERE id = $1",
            [id]
        );

        if(deleteUser.rowCount > 0){
            res.json(deleteUser);
        }
        else {
            res.json('Oops! No user with given ID (' + id + ') has been found.');
        }
    }
    catch (error) {
        console.error(error.message);
    }
});

app.listen(port, () => {
    console.log('server started on port: ', port);
    // startNgrokTunnel();
});

// const startNgrokTunnel = async () => {
//     try {
//         console.log('At beginning of startNgrokTunnel');
//         ngrok.authtoken(ngrok_auth_token);
//         await ngrok.kill();
//         await ngrok.disconnect();
//         console.log('After ngrok.kill()');

        
//         const url = await ngrok.connect({
//             addr: port,
//             authtoken: ngrok_auth_token,
//             proto: "http"
//         });
//         console.log('new url: ', url);

        
//         // const url = await ngrok.connect({ authtoken: ngrok_auth_token });
//         // const api = ngrok.getApi();
//         // const tunnels = await api.listTunnels();
//         // console.log('tunnels after deleting existing tunnel: ', tunnels);
        
        
//         // if (tunnels.tunnels.length > 0) {
//         //     // There is already an active ngrok tunnel
//         //     const tunnel = tunnels.tunnels[0];
//         //     console.log(`Existing ngrok tunnel found: ${tunnel.public_url}`);
//         //     console.log("Open the ngrok dashboard at: https://localhost:4040\n");
            
//         //     await api.stopTunnel(tunnel.name);
//         //     const tunnels_updated = await api.listTunnels();
//         //     console.log('tunnels after deleting existing tunnel: ', tunnels_updated);

//         //     const url = await ngrok.connect({
//         //         addr: port,
//         //         authtoken: ngrok_auth_token,
//         //         proto: "http"
//         //     });
//         //     console.log(`Ngrok tunnel created: ${url}`);
//         //     global.ngrok_url = url;
//         // }

//     } catch (error) {
//         console.error('Error creating ngrok tunnel:', error);
//         process.exit(1);
//     }
// }