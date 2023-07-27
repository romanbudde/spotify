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
app.use(cors({
    origin: '*' 
}));
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
    origin: "*"
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

const audioStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/songs')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
});

const upload_audio = multer({ 
    storage: audioStorage
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
app.post('/users', async(req, res) => {
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

// get all - songs
app.get("/songs", async(req, res) => {
    try {
        const allSongs = await pool.query("SELECT * from song")
        res.json(allSongs.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// get songs by name
app.get("/songs-search", async(req, res) => {
    try {
        console.log('------------------------------- AT /songs-search GET ENDPOINT');
        let { name } = req.query;

        console.log('name: ', name)

        const allSongs = await pool.query("SELECT * from song WHERE LOWER(name) LIKE '%' || LOWER($1) || '%'", [name])
        res.json(allSongs.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// get all - artists
app.get("/artists", async(req, res) => {
    try {
        const allArtists = await pool.query("SELECT * from artist")
        res.json(allArtists.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// update individual - artista
app.put("/artist/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        console.log('name: ', name);
        console.log('id: ', id);
        const updateArtist = await pool.query(
            "UPDATE artist SET name = $1 WHERE id = $2 RETURNING *",
            [name, id]
        );

        console.log('updateArtist: ', updateArtist.rows[0])

        if(updateArtist.rowCount > 0){
            res.json(updateArtist.rows[0]);
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

// get playlist's songs
app.post("/playlist-songs", async(req, res) => {
    try {
        const { songs_ids } = req.body;

        console.log('songs_ids es: ', songs_ids);
        
        let parsed_songs_ids;
        if(songs_ids){
            parsed_songs_ids = songs_ids.map(id => parseInt(id));
            console.log('parsed_songs_ids es: ', parsed_songs_ids)
            
            let songs;
    
            songs = await pool.query(
                "SELECT * from song WHERE id = ANY($1)",
                [parsed_songs_ids]
            );
    
            if(!parsed_songs_ids) {
                return res.status(400).json({"message": "Error: songs_ids no fue especificado."});
            }
    
            console.log('songs: ', songs.rows);
            res.json(songs.rows);
        }
        else {
            res.json({})
        }
    }
    catch (error) {
        console.error(error.message);
    }
});

// get playlists by user id
app.get("/playlists", async(req, res) => {
    try {
        const { user_id } = req.query;

        let playlists;

        playlists = await pool.query(
            "SELECT * from playlist WHERE user_id = $1",
            [user_id]
        );

        if(!user_id) {
            res.status(400).json({"message": "Error: user_id no fue especificado."});
        }

        console.log('playlists: ', playlists.rows);
        res.json(playlists.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// delete playlist
app.delete("/playlist", async(req, res) => {
    try {
        const { id } = req.query;

        deleted_playlist = await pool.query(
            "UPDATE playlist SET enabled = false WHERE id = $1 RETURNING *",
            [id]
        );

        if(!id) {
            res.status(400).json({"message": "Error: id (de la playlist) no fue especificado."});
        }

        console.log('playlist deleted: ', deleted_playlist.rows);
        res.json(deleted_playlist.rows[0]);
    }
    catch (error) {
        console.error(error.message);
    }
});

// create - una playlist
app.post('/playlist', async(req, res) => {
    try {
        console.log('---- backend post /playlist ----');
        console.log(req.body);
        const { song, playlist_name, user_id } = req.body;

        let songs_ids = {};
        if(song){
            songs_ids = {
                "ids": [song.id]
            }
        }

        let name;
        if(!playlist_name){
            name = song.name;
        }
        else {
            name = playlist_name;
        }

        // console.log('songs_ids: ', songs_ids)

        const newPlaylist = await pool.query(
            "INSERT INTO playlist (name, user_id, songs_ids, enabled) VALUES($1, $2, $3, true) RETURNING *", 
            [name, user_id, songs_ids]
        );

        // res.json(req.body);
        res.json(newPlaylist.rows[0]);
    }
    catch (error) {
        console.error(error.message);
    }
});

// update playlist name
app.put('/playlist', async(req, res) => {
    try {
        console.log('---- backend post /playlist ----');
        console.log(req.body);
        const { playlist, new_name } = req.body;
        let name;
        if(new_name){
            name = new_name;
        }
        else {
            name = playlist.name;
        }

        const updatedPlaylist = await pool.query(
            "UPDATE playlist SET name = $1 WHERE id = $2 RETURNING *", 
            [name, playlist.id]
        );

        // res.json(req.body);
        res.json(updatedPlaylist.rows[0]);
    }
    catch (error) {
        console.error(error.message);
    }
});

// update playlist name
app.put('/playlist-add-song', async(req, res) => {
    try {
        console.log('---- backend post /playlist ----');
        console.log(req.body);
        const { id, songs_ids } = req.body;

		let songs_ids_formatted = {
			"ids": songs_ids
		}

		console.log('songs ids formatted: ', songs_ids_formatted)

        const updatedPlaylist = await pool.query(
            "UPDATE playlist SET songs_ids = $1 WHERE id = $2 RETURNING *", 
            [songs_ids_formatted, id]
        );

		console.log('updated Playlist: ', updatedPlaylist.rows[0])

        // res.json(req.body);
        res.json(updatedPlaylist.rows[0]);
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
app.put("/songs/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { enabled } = req.body;
        console.log('enabled: ', enabled);
        console.log('id: ', id);
        const updateSong = await pool.query(
            "UPDATE song SET enabled = $1 WHERE id = $2 RETURNING *",
            [enabled, id]
        );

        console.log('updateSong: ', updateSong.rows[0])

        if(updateSong.rowCount > 0){
            res.json(updateSong.rows[0]);
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

// create - una cancion
app.post('/songs', async(req, res) => {
    try {
        console.log('---- backend post /songs ----');
        console.log(req.body);
        const { name, artists, genres, file } = req.body;

        artists_ids = {
            "ids": artists.map(artist => artist.value )
        };
        genres_ids = {
            "ids": genres.map(genre => genre.value )
        };

        console.log('artists_ids: ', artists_ids);
        console.log('genres_ids: ', genres_ids);

        console.log('---- current date ----');
        const created_at = new Date();
        console.log(created_at);

        let song_path = 'songs/' + file;

        console.log('file: ', file);

        const newSong = await pool.query(
            "INSERT INTO song (name, artists_ids, genres_ids, song_path, enabled) VALUES($1, $2, $3, $4, $5) RETURNING *", 
            [name, artists_ids, genres_ids, song_path, true]
        );

        // res.json(req.body);
        res.json(newSong.rows[0]);
    }
    catch (error) {
        console.error(error.message);
    }
});

// delete (by id) individual - cuidador
app.delete("/songs/:id", async(req, res) => {
    try {
        const {id} = req.params;
        console.log('id to delete: ', id);
        const deleteSong = await pool.query(
            "UPDATE song SET enabled = false WHERE id = $1 RETURNING *", 
            [id]
        );

        console.log('deleted song: ', deleteSong.rows[0]);

        if(deleteSong.rowCount > 0){
            res.json(deleteSong);
        }
        else {
            res.json('Oops! No song with given ID (' + id + ') has been found.');
        }
    }
    catch (error) {
        console.error(error.message);
    }
});

// get all - genres
app.get("/genres", async(req, res) => {
    try {
        const allGenres = await pool.query("SELECT * from genre")
        res.json(allGenres.rows);
    }
    catch (error) {
        console.error(error.message);
    }
});

// create - un genero
app.post('/genre', async(req, res) => {
    try {
        console.log('---- backend post /genre ----');
        console.log(req.body);
        const { name } = req.body;

        console.log('---- current date ----');
        const created_at = new Date();
        console.log(created_at);

        const newSong = await pool.query(
            "INSERT INTO genre (name) VALUES($1) RETURNING *", 
            [name]
        );

        // res.json(req.body);
        res.json(newSong.rows[0]);
    }
    catch (error) {
        console.error(error.message);
    }
});


// update individual - genero
app.put("/genre/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        console.log('name: ', name);
        console.log('id: ', id);
        const updateGenre = await pool.query(
            "UPDATE genre SET name = $1 WHERE id = $2 RETURNING *",
            [name, id]
        );

        console.log('updateGenre: ', updateGenre.rows[0])

        if(updateGenre.rowCount > 0){
            res.json(updateGenre.rows[0]);
            // res.json('asd');
        }
        else {
            res.json('Oops! No genre with given ID (' + id + ') has been found.');
        }
    }
    catch (error) {
        console.error(error.message);
    }
});

// create - una cancion
app.post('/artist', async(req, res) => {
    try {
        console.log('---- backend post /artist ----');
        console.log(req.body);
        const { name } = req.body;

        console.log('---- current date ----');
        const created_at = new Date();
        console.log(created_at);

        const newSong = await pool.query(
            "INSERT INTO artist (name) VALUES($1) RETURNING *", 
            [name]
        );

        // res.json(req.body);
        res.json(newSong.rows[0]);
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

app.post('/upload_song', upload_audio.single('file'), async (req, res) => {
    console.log('at upload song functionality.');
    console.log('req.file is: ', req.file);

    if (req.file.size > 100 * 1024 * 1024) {
        console.log('El tamaño de la imagen supera el límite permitido.');
        return res.status(400).json({ error: 'El tamaño de la imagen supera el límite permitido' });
    }

    if (
        req.file.mimetype !== 'audio/mpeg' &&
        req.file.mimetype !== 'audio/wav'
    ) {
        console.log('El archivo no es una cancion en formato válido.');
        return res.status(400).json({ error: 'La cancion está en un formato inválido (permitidos: .wav, mp3, mp4).' });
    }

    // update user's profile_picture_url value.
    const user_id = req.body.user_id;
    const file_name = req.file.filename;
    console.log('user_id is: ', user_id);
    console.log('req.file is: ', req.file);
    console.log('req.file.filename is: ', req.file.filename);
    console.log('req.file.path is: ', req.file.path);
    // const uploadSong = await pool.query(
    //     "INSERT INTO song (artists_ids, genre_ids, name, song_path) VALUES($1, $2, $3, $4) RETURNING *",
    //     [artists_ids, genres_ids, name, song_path]
    // );
    
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

// update individual user
app.put("/users/:id", async(req, res) => {
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
app.delete("/users/:id", async(req, res) => {
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