--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2 (Debian 15.2-1.pgdg110+1)
-- Dumped by pg_dump version 15.2 (Debian 15.2-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE DATABASE db_cuidadores;
\connect db_cuidadores;

--
-- Name: id; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.id OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sede; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sede (
    id integer DEFAULT nextval('public.id'::regclass) NOT NULL,
    address character varying NOT NULL,
    max_cupo integer NOT NULL,
    horarios json,
    name character varying NOT NULL,
    latitude character varying,
    longitude character varying
);


ALTER TABLE public.sede OWNER TO postgres;

--
-- Name: sede_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sede_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sede_id_seq OWNER TO postgres;

--
-- Name: sede_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sede_id_seq OWNED BY public.sede.id;


--
-- Name: sede_reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sede_reservations (
    id integer NOT NULL,
    user_id integer NOT NULL,
    sede_id integer NOT NULL,
    horario character varying NOT NULL,
    date character varying NOT NULL
);


ALTER TABLE public.sede_reservations OWNER TO postgres;

--
-- Name: sede_reservations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sede_reservations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sede_reservations_id_seq OWNER TO postgres;

--
-- Name: sede_reservations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sede_reservations_id_seq OWNED BY public.sede_reservations.id;


--
-- Name: user_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_type (
    user_type_number character varying(5) NOT NULL,
    user_type character varying(99) NOT NULL,
    id bigint NOT NULL
);


ALTER TABLE public.user_type OWNER TO postgres;

--
-- Name: user_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_type_id_seq OWNER TO postgres;

--
-- Name: user_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_type_id_seq OWNED BY public.user_type.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    description character varying(255),
    name character varying(255),
    last_name character varying(255),
    password character varying(255),
    mail character varying(255),
    type integer,
    created_at timestamp without time zone,
    modified_at timestamp without time zone,
    enabled boolean,
    hourly_rate double precision,
    average_review_score numeric,
    address character varying,
    profile_picture_url character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: sede_reservations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sede_reservations ALTER COLUMN id SET DEFAULT nextval('public.sede_reservations_id_seq'::regclass);


--
-- Name: user_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_type ALTER COLUMN id SET DEFAULT nextval('public.user_type_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: sede; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sede (id, address, max_cupo, horarios, name, latitude, longitude) FROM stdin;
8	Soler 4000, C1425BWP CABA, Argentina	7	{"horarios":["01:00","02:00","04:00"]}	New sedeee jamaica	\N	\N
9	Acevedo 865, Buenos Aires, Argentina	15	{}	Sede 91	\N	\N
4	Av. San Martín 2595, A4400 Salta, Argentina	456	{"horarios":["00:00","09:00","10:00","12:00", "13:00","17:00","18:00","19:00"]}	Amici sede funes	\N	\N
6	Mendoza 555, S2000BHK Rosario, Santa Fe, Argentina	15	{"horarios":["01:00","06:00","07:00","08:00","18:00","19:00","22:00","23:00"]}	NEW sedeee	\N	\N
3	Av. Pellegrini 4500, S2002 Rosario, Santa Fe, Argentina	888	{"horarios":["00:00","01:00","02:00","07:00","08:00"]}	Amici sede oeste	-32.9488075	-60.6873757
7	Necochea 1051, Rosario, Santa Fe, Argentina	25	{"horarios":["01:00","05:00","06:00","09:00","10:00","13:00","15:00","16:00","17:00"]}	New sede 2	-32.9539631	-60.6255006
1	Av. San Martín 1575, S2000 Rosario, Santa Fe, Argentina	123	{"horarios":["00:00","01:00","02:00","03:00","04:00","10:00","14:00","16:00"]}	ASD mayuscula	-32.9562589	-60.6388613
2	Av. San Martín 2595, S2000 Rosario, Santa Fe, Argentina	512	{"horarios":["00:00","02:00"]}	asd minuscula	-32.9676447	-60.6416295
\.


--
-- Data for Name: sede_reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sede_reservations (id, user_id, sede_id, horario, date) FROM stdin;
8	50	1	04:00	12/07/2023
9	50	1	01:00	12/07/2023
10	50	1	01:00	12/07/2023
11	50	1	01:00	12/07/2023
12	50	1	01:00	12/07/2023
13	50	1	01:00	12/07/2023
14	50	1	00:00	12/07/2023
15	50	1	01:00	12/07/2023
16	50	1	01:00	12/07/2023
17	50	1	01:00	12/07/2023
18	50	1	01:00	12/07/2023
19	50	1	01:00	12/07/2023
2	155	1	21:00	10/07/2023
5	50	1	14:00	15/07/2023
3	50	1	16:00	11/07/2023
4	50	1	16:00	12/07/2023
1	50	1	16:00	10/07/2023
20	50	1	01:00	12/07/2023
21	50	1	01:00	12/07/2023
22	50	1	01:00	12/07/2023
23	50	1	01:00	12/07/2023
24	50	1	01:00	12/07/2023
25	50	1	01:00	12/07/2023
26	50	1	01:00	12/07/2023
27	50	1	01:00	12/07/2023
28	50	1	01:00	12/07/2023
29	50	1	01:00	12/07/2023
30	50	6	01:00	12/07/2023
\.


--
-- Data for Name: user_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_type (user_type_number, user_type, id) FROM stdin;
0	client	1
1	cuidador	2
2	admin	3
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, description, name, last_name, password, mail, type, created_at, modified_at, enabled, hourly_rate, average_review_score, address, profile_picture_url) FROM stdin;
1	desccc	111111111111	111111111	\N	11111111111	1	2023-04-09 18:04:41.672	2023-05-11 15:47:46.231	f	45	\N	\N	\N
53	\N	name	lastname	$2b$10$kkKaP6YOO.P/xgn1mpUFjOXf/IXXKnZm4FuDqVC237vQCGW5R.DGW	newwwuser@hotmail.com	0	2023-06-18 23:38:16.92	\N	t	\N	\N	direcc	\N
48	newwdescccc	updatedAgain	lastname	$2a$10$N0IU4mQeWMBBx0JacWifdOgSXsiKg3AejjuaWQ4RIJ9CUbsJTPOIi	asd	1	2023-04-09 18:04:41.672	2023-06-02 14:30:02.391	t	21	9.42	\N	\N
6	The description	Josh	Peck	$2y$10$iKJBVKYUMF6u967o8KWBae8rcBYfyugYgO38WeBWSdXXQV56PQ6Z2	email@hotmail.com	1	2023-04-09 18:04:41.672	2023-05-11 15:58:45.628	t	75	7.55	\N	\N
2	2222222	22222	222222	\N	222222	0	2023-04-09 18:04:41.672	2023-05-11 15:47:46.231	t	\N	\N	\N	\N
4	1111111111	11111111	111111111111	\N	111111111	1	2023-04-09 18:04:41.672	2023-05-11 16:49:46.464	t	27	9.25	\N	\N
998	descriptionnnn	998firstname	asdasdsda	$2b$10$FKEeFnI1rC6cwkaLD2ncJO1CvEX/58WKfUqNIfrW5fxhiOWE4h3NO	client998	0	2023-06-03 12:53:35.977	2023-06-24 18:14:50.48	t	\N	\N	Avenida 9 de Julio 5, Buenos Aires, Argentina	\N
52	descc	nombreUpdated20.03	apellido	$2b$10$iQHsqBx9LB7xNtmAxM5tmOBrMAzFC5iJFbErpTwPLldwAGL5XV1Hy	newuserrr@hotmail.com	0	2023-06-18 23:37:21.661	2023-07-01 20:03:56.631	t	\N	\N	\N	\N
30	dasdsadsa	nombre20.04	wqwqrweqr	\N	wqeeqw	1	2023-04-09 18:04:41.672	2023-07-01 20:04:16.729	t	\N	\N	\N	\N
54	admin_descriptionnnn	admin_firstnamee	admin_lastnameat20.15	$2b$10$FKEeFnI1rC6cwkaLD2ncJO1CvEX/58WKfUqNIfrW5fxhiOWE4h3NO	admin	2	2023-06-03 12:53:35.977	2023-07-01 20:15:12.732	t	\N	\N	\N	\N
55	asdasd	firstname	lastname	$2b$10$P1czp6ry81PQinRtjjCQoOoaUWGIy1BV3bSlkisZ4rAcDwm1M0B26	testing_create	1	2023-07-01 20:24:51.472	\N	t	\N	\N	\N	\N
56	asdasddesc	firstname	lastname	$2b$10$aOBLXMe1eY/B.uzSLvT1wOrHtc8lWz9/e2iC9XBbJhjUPB/0DlK3e	testing_create2	0	2023-07-01 20:25:56.981	\N	t	\N	\N	\N	\N
51	descccccc	firstname	lastname	$2b$10$1SBtjnQPPuCXZIyuUErEMOctccTOXxl0lQzfUuBe5XYlTkATfPMpG	cuidador	1	2023-04-09 18:04:41.672	\N	t	55	9.51	\N	\N
755	descriptionnnn	firstname	Actualizado11-07-dos	$2b$10$FKEeFnI1rC6cwkaLD2ncJO1CvEX/58WKfUqNIfrW5fxhiOWE4h3NO	cuidador755	1	2023-06-03 12:53:35.977	2023-07-11 16:51:36.457	t	\N	\N	Avenida 9 de Julio 5, Buenos Aires, Argentina	\N
31	qweeqw	123	actualizando1107	\N	adsasd	0	2023-04-09 18:04:41.672	2023-07-11 16:51:57.297	t	\N	\N	Av. Rivadavia 5170, C1424CET CABA, Argentina	\N
50	descriptionnnn	50updatedat20.05	asdasdsda	$2b$10$FKEeFnI1rC6cwkaLD2ncJO1CvEX/58WKfUqNIfrW5fxhiOWE4h3NO	client	0	2023-06-03 12:53:35.977	2023-07-01 20:09:01.517	t	\N	\N	\N	images/random_face.jpg
\.


--
-- Name: id; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.id', 9, true);


--
-- Name: sede_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sede_id_seq', 3, true);


--
-- Name: sede_reservations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sede_reservations_id_seq', 71, true);


--
-- Name: user_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_type_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 57, true);


--
-- Name: sede sede_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sede
    ADD CONSTRAINT sede_pkey PRIMARY KEY (id);


--
-- Name: sede_reservations sede_reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sede_reservations
    ADD CONSTRAINT sede_reservations_pkey PRIMARY KEY (id);


--
-- Name: user_type user_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_type
    ADD CONSTRAINT user_type_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

