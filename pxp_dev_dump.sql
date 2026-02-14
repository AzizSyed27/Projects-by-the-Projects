--
-- PostgreSQL database dump
--

\restrict eKKPOkMACr99IXf2wUv4lGa45zXamwSn9QaV4l1EzjRGVXzPFuAiZ2gBFX9EYZQ

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg13+1)

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_users (
    id bigint NOT NULL,
    username character varying(80) NOT NULL,
    password_hash text NOT NULL,
    role character varying(30) DEFAULT 'ADMIN'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_login_at timestamp with time zone
);


ALTER TABLE public.admin_users OWNER TO postgres;

--
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_users_id_seq OWNER TO postgres;

--
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- Name: email_outbox; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_outbox (
    id bigint NOT NULL,
    to_email character varying(254) NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    last_error text,
    next_attempt_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sent_at timestamp with time zone,
    html_body text,
    list_unsubscribe text
);


ALTER TABLE public.email_outbox OWNER TO postgres;

--
-- Name: email_outbox_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.email_outbox_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.email_outbox_id_seq OWNER TO postgres;

--
-- Name: email_outbox_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.email_outbox_id_seq OWNED BY public.email_outbox.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id bigint NOT NULL,
    title character varying(160) NOT NULL,
    short_desc text,
    location character varying(200),
    event_date date NOT NULL,
    image_url text,
    tags text,
    status character varying(20) DEFAULT 'DRAFT'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: flyway_schema_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


ALTER TABLE public.flyway_schema_history OWNER TO postgres;

--
-- Name: project_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_images (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    url text NOT NULL,
    alt text,
    kind character varying(20) DEFAULT 'GALLERY'::character varying NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.project_images OWNER TO postgres;

--
-- Name: project_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_images_id_seq OWNER TO postgres;

--
-- Name: project_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_images_id_seq OWNED BY public.project_images.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id bigint NOT NULL,
    slug character varying(120) NOT NULL,
    title character varying(180) NOT NULL,
    hero_blurb character varying(400),
    short_desc character varying(500),
    long_desc text,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    project_tags text,
    card_image_url text,
    main_image_url text,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: subscribers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscribers (
    id bigint NOT NULL,
    email character varying(254) NOT NULL,
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    verify_token text,
    unsubscribe_token text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    verified_at timestamp with time zone,
    unsubscribed_at timestamp with time zone
);


ALTER TABLE public.subscribers OWNER TO postgres;

--
-- Name: subscribers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subscribers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscribers_id_seq OWNER TO postgres;

--
-- Name: subscribers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subscribers_id_seq OWNED BY public.subscribers.id;


--
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- Name: email_outbox id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_outbox ALTER COLUMN id SET DEFAULT nextval('public.email_outbox_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: project_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_images ALTER COLUMN id SET DEFAULT nextval('public.project_images_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: subscribers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscribers ALTER COLUMN id SET DEFAULT nextval('public.subscribers_id_seq'::regclass);


--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_users (id, username, password_hash, role, created_at, last_login_at) FROM stdin;
1	pxp_Admin	$2a$10$tu1IUjwkmQvGu0Yz2XlFeeKx6emcQltaVcFP1dxla3P25GspUpYm6	ADMIN	2026-02-06 00:38:31.567005+00	2026-02-14 01:20:53.868357+00
\.


--
-- Data for Name: email_outbox; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_outbox (id, to_email, subject, body, status, attempts, last_error, next_attempt_at, created_at, sent_at, html_body, list_unsubscribe) FROM stdin;
13	azizsyed2016@gmail.com	New project underway: For the Ummah	Hello,\n\nA new project is underway:\nFor the Ummah\n\nView project:\n/projects/for-the-ummah\n\nUnsubscribe:\n/api/subscribers/unsubscribe?token=fh1NzqxyP1PdOj6_Np20QPsEjCeDFvKKTrZ5Cv6b9sA\n	SENT	0	\N	2026-02-08 00:49:57.394123+00	2026-02-08 00:49:57.394123+00	2026-02-08 00:50:21.755202+00	\N	\N
15	azizsyed2016@gmail.com	Upcoming event: Annual MNE BBQ	Hello,\n\nWe have an upcoming event:\n\nAnnual MNE BBQ\nJuly 6, 2026\n214 Markham Rd, Scarborough, ON\n\nThis isn’t just a BBQ, it’s a movement.\nPull up, vibe with the community, and walk away with more than just a plate.\n\nSee details on our website:\nhttp://localhost:5173/projects\n\nUnsubscribe:\nhttp://localhost:8080/api/subscribers/unsubscribe?token=fh1NzqxyP1PdOj6_Np20QPsEjCeDFvKKTrZ5Cv6b9sA\n	SENT	0	\N	2026-02-10 21:15:53.851648+00	2026-02-10 21:15:53.851648+00	2026-02-10 21:16:05.606796+00	\N	\N
16	azizsyed2016@gmail.com	Upcoming event: Annual MNE BBQ (2025)	Hello,\n\nWe have an upcoming event:\n\nAnnual MNE BBQ (2025)\nJuly 6, 2026\n214 Markham Rd, Scarborough, ON\n\nThis isn’t just a BBQ, it’s a movement.\nPull up, vibe with the community, and walk away with more than just a plate.\n\nSee details on our website:\nhttp://localhost:5173/projects\n\nUnsubscribe:\nhttp://localhost:8080/api/subscribers/unsubscribe?token=fh1NzqxyP1PdOj6_Np20QPsEjCeDFvKKTrZ5Cv6b9sA\n	SENT	0	\N	2026-02-10 23:07:10.714692+00	2026-02-10 23:07:10.714692+00	2026-02-10 23:07:15.433727+00	\N	\N
14	azizsyed2022@gmail.com	Confirm your subscription to Project X Projects	Hello,\n\nPlease confirm your subscription to Project X Projects updates:\nhttp://localhost:5173/subscribe/verify?token=40x8M1g4IIcZjFOHXqiVE8ASsH4pSs2PeslMtEGW-F4\n\nIf you didn’t request this, you can ignore this email.\n\nUnsubscribe at any time:\nhttp://localhost:5173/subscribe/unsubscribe?token=qHdTC_fPLE9k3hBUijGZvNM9n0-JRpLxU5bXKMAnw30\n	FAILED	8	Failed messages: org.eclipse.angus.mail.smtp.SMTPSendFailedException: 554 Message rejected: Email address is not verified. The following identities failed the check in region US-EAST-1: azizsyed2022@gmail.com\n	2026-02-11 01:18:52.478498+00	2026-02-10 21:10:30.913691+00	\N	\N	\N
17	azizsyed2016@gmail.com	Upcoming event: ANNUAL MNE BBQ (2024)	Hello,\n\nWe have an upcoming event:\n\nANNUAL MNE BBQ (2024)\nJuly 6, 2024\n214 Markham Road, Scarborough, ON\n\nThis isn’t just a BBQ, it’s a movement. Pull up, vibe with the community, and walk away with more than just a plate.\n\nSee details on our website:\nhttp://localhost:5173/projects\n\nUnsubscribe:\nhttp://localhost:8080/api/subscribers/unsubscribe?token=fh1NzqxyP1PdOj6_Np20QPsEjCeDFvKKTrZ5Cv6b9sA\n	SENT	0	\N	2026-02-11 20:36:57.92534+00	2026-02-11 20:36:57.92534+00	2026-02-11 20:37:04.312394+00	\N	\N
21	azizsyed2022@gmail.com	Confirm your subscription to Project X Projects	Hello,\n\nPlease confirm your subscription to Project X Projects updates:\nhttp://localhost:5173/subscribe/verify?token=40x8M1g4IIcZjFOHXqiVE8ASsH4pSs2PeslMtEGW-F4\n\nIf you didn’t request this, you can ignore this email.\n\nUnsubscribe at any time:\nhttp://localhost:5173/subscribe/unsubscribe?token=qHdTC_fPLE9k3hBUijGZvNM9n0-JRpLxU5bXKMAnw30\n	SENT	0	\N	2026-02-12 03:45:35.335821+00	2026-02-12 03:45:35.335821+00	2026-02-12 03:45:46.985094+00	\N	\N
22	test-3k2zpqhz3@srv1.mail-tester.com	Confirm your subscription to Project X Projects	Hello,\n\nPlease confirm your subscription to Project X Projects updates:\nhttp://localhost:5173/subscribe/verify?token=zQyVJiN4HcVCXUqimdXNetAQX5l3OyftqGKrYHNZn_0\n\nIf you didn’t request this, you can ignore this email.\n\nUnsubscribe at any time:\nhttp://localhost:5173/subscribe/unsubscribe?token=USDZvAYJIKxWTEJrzyw1MDAQ-qUebW6-F_mhofAp8GA\n	SENT	0	\N	2026-02-12 03:50:31.479623+00	2026-02-12 03:50:31.479623+00	2026-02-12 03:50:47.955469+00	\N	\N
18	shafiyasyed@hotmail.com	Confirm your subscription to Project X Projects	Hello,\n\nPlease confirm your subscription to Project X Projects updates:\nhttp://localhost:5173/subscribe/verify?token=V95mo6f7Q2C_WTRpEvRgGlwDdywgsxVxNW-3o9ADwtM\n\nIf you didn’t request this, you can ignore this email.\n\nUnsubscribe at any time:\nhttp://localhost:5173/subscribe/unsubscribe?token=pmAJsfxMR-nP0a_yB0oUy6Y8NDuoEdjsr51W6aoRbdg\n	SENT	5	\N	2026-02-12 04:06:23.965468+00	2026-02-12 03:03:27.107454+00	2026-02-12 22:12:55.080085+00	\N	\N
19	person1@gmail.com	Confirm your subscription to Project X Projects	Hello,\n\nPlease confirm your subscription to Project X Projects updates:\nhttp://localhost:5173/subscribe/verify?token=cM5NfD1KOUOfua-xMKkNVinJn4yWDJINgazBvyLILdY\n\nIf you didn’t request this, you can ignore this email.\n\nUnsubscribe at any time:\nhttp://localhost:5173/subscribe/unsubscribe?token=bHCMM5qAa6JOan6ChWq6eNCDgenHPq8TxqADK2wpe7s\n	SENT	5	\N	2026-02-12 04:07:26.570324+00	2026-02-12 03:04:32.610993+00	2026-02-12 22:12:55.863653+00	\N	\N
20	person2@gmail.com	Confirm your subscription to Project X Projects	Hello,\n\nPlease confirm your subscription to Project X Projects updates:\nhttp://localhost:5173/subscribe/verify?token=LSblWwIE_90bhQ1Goza6ltdP6mK7P8QfioOC6NHRSg0\n\nIf you didn’t request this, you can ignore this email.\n\nUnsubscribe at any time:\nhttp://localhost:5173/subscribe/unsubscribe?token=HhBzvTlGEiqEwSpxIQ2OZFQpIEsQwoEWaqbZudAYROg\n	SENT	5	\N	2026-02-12 04:08:29.124089+00	2026-02-12 03:05:38.090915+00	2026-02-12 22:12:56.624852+00	\N	\N
23	aziz.school.23@gmail.com	Project X Projects — Confirm your subscription	Hello,\n\nPlease confirm your subscription to Project X Projects updates:\nhttp://localhost:5173/subscribe/verify?token=RdXyb2jHpOTm_XdAhGh4MaBsDV93C4VmclgsOm2pBhY\n\nWhat you'll receive:\n- New projects & updates\n- Local event announcements\n\nIf you didn’t request this, you can ignore this email.\n\nUnsubscribe:\nhttp://localhost:5173/subscribe/unsubscribe?token=0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ\n\nProject X Projects • Ontario, Canada\nSupport: info@projectsxprojects.ca\n	SENT	2	\N	2026-02-12 23:22:05.329621+00	2026-02-12 23:15:44.47842+00	2026-02-12 23:22:25.749484+00	\t<!doctype html>\n\t<html>\n\t  <body style="margin:0;padding:0;background:#eef7f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">\n\t    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Updates from Project X Projects</span>\n\t    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef7f7;padding:28px 12px;">\n\t      <tr>\n\t        <td align="center">\n\t          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid rgba(15,23,42,.10);">\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#e6fbfc;border-bottom:1px solid rgba(15,23,42,.08);">\n\t                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">\n\t                  <tr>\n\t                    <td style="vertical-align:middle;">\n\t                      <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/email/pxp-logo.png" alt="Project X Projects" height="34" style="display:block;border:0;"/>\n\t                    </td>\n\t                    <td align="right" style="font-size:12px;color:rgba(15,23,42,.70);">\n\t                      Ontario, Canada\n\t                    </td>\n\t                  </tr>\n\t                </table>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:22px 20px;color:#0f172a;">\n\t                <div style="font-weight:900;font-size:22px;letter-spacing:-.01em;">Confirm your subscription</div>\n\t                <div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">Please confirm your subscription to <b>Project X Projects</b> updates.</div>\n\t                <div style="margin-top:16px;"><div style="margin-top:14px;">\n  <a href="http://localhost:5173/subscribe/verify?token=RdXyb2jHpOTm_XdAhGh4MaBsDV93C4VmclgsOm2pBhY" style="display:inline-block;padding:12px 16px;border-radius:10px;background:#11878D;color:#fff;text-decoration:none;font-weight:800;font-size:14px;">\n    Confirm subscription\n  </a>\n</div>\n</div>\n\t                <div style="margin-top:14px;"><ul style="margin:12px 0 0 18px;padding:0;color:rgba(15,23,42,.82);font-size:14px;line-height:1.65;"><li>New project announcements and updates</li><li>Local event notifications</li><li>Occasional impact stories</li></ul></div>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#f8fbfb;border-top:1px solid rgba(15,23,42,.08);">\n\t                <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);">\n  <div style="font-weight:900;margin-bottom:6px;">Project X Projects</div>\n  <div>Support: <a href="mailto:info@projectsxprojects.ca" style="color:#11878D;text-decoration:underline;">info@projectsxprojects.ca</a></div>\n  <div style="margin-top:8px;"><a href="http://localhost:5173/subscribe/unsubscribe?token=0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ" style="color:#11878D;text-decoration:underline;font-weight:700;">Unsubscribe</a></div>\n</div>\n\n\t              </td>\n\t            </tr>\n\t          </table>\n\n\t          <div style="max-width:640px;margin-top:10px;font-size:12px;color:rgba(15,23,42,.60);text-align:center;">\n\t            You’re receiving this because you signed up on http://localhost:5173.\n\t          </div>\n\t        </td>\n\t      </tr>\n\t    </table>\n\t  </body>\n\t</html>\n	http://localhost:5173/subscribe/unsubscribe?token=0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ
24	aziz.syed.23@gmail.com	Project X Projects — Confirm your subscription	Hello,\n\nPlease confirm your subscription to Project X Projects updates:\nhttp://localhost:5173/subscribe/verify?token=kox0NMGb6u-ZEPA_JHwGUddVQbV__yOzASEaUkkn0D0\n\nWhat you'll receive:\n- New projects & updates\n- Local event announcements\n\nIf you didn’t request this, you can ignore this email.\n\nUnsubscribe:\nhttp://localhost:5173/subscribe/unsubscribe?token=BzCYMinIy7osIXrHUlR2Y_o1HIGobR_6Xb9Uz_1kPrI\n\nProject X Projects • Ontario, Canada\nSupport: info@projectsxprojects.ca\n	SENT	0	\N	2026-02-12 23:24:54.270585+00	2026-02-12 23:24:54.270585+00	2026-02-12 23:24:56.66912+00	\t<!doctype html>\n\t<html>\n\t  <body style="margin:0;padding:0;background:#eef7f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">\n\t    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Updates from Project X Projects</span>\n\t    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef7f7;padding:28px 12px;">\n\t      <tr>\n\t        <td align="center">\n\t          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid rgba(15,23,42,.10);">\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#e6fbfc;border-bottom:1px solid rgba(15,23,42,.08);">\n\t                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">\n\t                  <tr>\n\t                    <td style="vertical-align:middle;">\n\t                      <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/email/pxp-logo.png" alt="Project X Projects" height="34" style="display:block;border:0;"/>\n\t                    </td>\n\t                    <td align="right" style="font-size:12px;color:rgba(15,23,42,.70);">\n\t                      Ontario, Canada\n\t                    </td>\n\t                  </tr>\n\t                </table>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:22px 20px;color:#0f172a;">\n\t                <div style="font-weight:900;font-size:22px;letter-spacing:-.01em;">Confirm your subscription</div>\n\t                <div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">Please confirm your subscription to <b>Project X Projects</b> updates.</div>\n\t                <div style="margin-top:16px;"><div style="margin-top:14px;">\n  <a href="http://localhost:5173/subscribe/verify?token=kox0NMGb6u-ZEPA_JHwGUddVQbV__yOzASEaUkkn0D0" style="display:inline-block;padding:12px 16px;border-radius:10px;background:#11878D;color:#fff;text-decoration:none;font-weight:800;font-size:14px;">\n    Confirm subscription\n  </a>\n</div>\n</div>\n\t                <div style="margin-top:14px;"><ul style="margin:12px 0 0 18px;padding:0;color:rgba(15,23,42,.82);font-size:14px;line-height:1.65;"><li>New project announcements and updates</li><li>Local event notifications</li><li>Occasional impact stories</li></ul></div>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#f8fbfb;border-top:1px solid rgba(15,23,42,.08);">\n\t                <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);">\n  <div style="font-weight:900;margin-bottom:6px;">Project X Projects</div>\n  <div>Support: <a href="mailto:info@projectsxprojects.ca" style="color:#11878D;text-decoration:underline;">info@projectsxprojects.ca</a></div>\n  <div style="margin-top:8px;"><a href="http://localhost:5173/subscribe/unsubscribe?token=BzCYMinIy7osIXrHUlR2Y_o1HIGobR_6Xb9Uz_1kPrI" style="color:#11878D;text-decoration:underline;font-weight:700;">Unsubscribe</a></div>\n</div>\n\n\t              </td>\n\t            </tr>\n\t          </table>\n\n\t          <div style="max-width:640px;margin-top:10px;font-size:12px;color:rgba(15,23,42,.60);text-align:center;">\n\t            You’re receiving this because you signed up on http://localhost:5173.\n\t          </div>\n\t        </td>\n\t      </tr>\n\t    </table>\n\t  </body>\n\t</html>\n	http://localhost:5173/subscribe/unsubscribe?token=BzCYMinIy7osIXrHUlR2Y_o1HIGobR_6Xb9Uz_1kPrI
12	azizsyed2016@gmail.com	Confirm your subscription to Project X Projects	Hello,\n\nPlease confirm your subscription to Project X Projects updates:\nhttp://localhost:5173/subscribe/verify?token=uz-8O3FsOoaz0buZrIsjDqSHLhV86AcKl1Np3WZTvcs\n\nIf you didn’t request this, you can ignore this email.\n\nUnsubscribe at any time:\nhttp://localhost:5173/subscribe/unsubscribe?token=fh1NzqxyP1PdOj6_Np20QPsEjCeDFvKKTrZ5Cv6b9sA\n	SENT	0	\N	2026-02-08 00:41:06.869391+00	2026-02-08 00:41:06.869391+00	2026-02-08 00:41:18.671895+00	\N	\N
25	aziz.school.23@gmail.com	Project X Projects — Confirm your subscription	Hello,\n\nPlease confirm your subscription to Project X Projects updates:\nhttp://localhost:5173/subscribe/verify?token=8H86O0Jp8FYogDbTmyxaVmnGDDpGTy1wU_R6W3Ze73M\n\nWhat you'll receive:\n- New projects & updates\n- Local event announcements\n\nIf you didn’t request this, you can ignore this email.\n\nUnsubscribe:\nhttp://localhost:5173/subscribe/unsubscribe?token=0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ\n\nProject X Projects • Ontario, Canada\nSupport: info@projectsxprojects.ca\n	SENT	0	\N	2026-02-12 23:26:41.649076+00	2026-02-12 23:26:41.649076+00	2026-02-12 23:26:57.556126+00	\t<!doctype html>\n\t<html>\n\t  <body style="margin:0;padding:0;background:#eef7f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">\n\t    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Updates from Project X Projects</span>\n\t    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef7f7;padding:28px 12px;">\n\t      <tr>\n\t        <td align="center">\n\t          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid rgba(15,23,42,.10);">\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#e6fbfc;border-bottom:1px solid rgba(15,23,42,.08);">\n\t                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">\n\t                  <tr>\n\t                    <td style="vertical-align:middle;">\n\t                      <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/email/pxp-logo.png" alt="Project X Projects" height="34" style="display:block;border:0;"/>\n\t                    </td>\n\t                    <td align="right" style="font-size:12px;color:rgba(15,23,42,.70);">\n\t                      Ontario, Canada\n\t                    </td>\n\t                  </tr>\n\t                </table>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:22px 20px;color:#0f172a;">\n\t                <div style="font-weight:900;font-size:22px;letter-spacing:-.01em;">Confirm your subscription</div>\n\t                <div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">Please confirm your subscription to <b>Project X Projects</b> updates.</div>\n\t                <div style="margin-top:16px;"><div style="margin-top:14px;">\n  <a href="http://localhost:5173/subscribe/verify?token=8H86O0Jp8FYogDbTmyxaVmnGDDpGTy1wU_R6W3Ze73M" style="display:inline-block;padding:12px 16px;border-radius:10px;background:#11878D;color:#fff;text-decoration:none;font-weight:800;font-size:14px;">\n    Confirm subscription\n  </a>\n</div>\n</div>\n\t                <div style="margin-top:14px;"><ul style="margin:12px 0 0 18px;padding:0;color:rgba(15,23,42,.82);font-size:14px;line-height:1.65;"><li>New project announcements and updates</li><li>Local event notifications</li><li>Occasional impact stories</li></ul></div>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#f8fbfb;border-top:1px solid rgba(15,23,42,.08);">\n\t                <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);">\n  <div style="font-weight:900;margin-bottom:6px;">Project X Projects</div>\n  <div>Support: <a href="mailto:info@projectsxprojects.ca" style="color:#11878D;text-decoration:underline;">info@projectsxprojects.ca</a></div>\n  <div style="margin-top:8px;"><a href="http://localhost:5173/subscribe/unsubscribe?token=0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ" style="color:#11878D;text-decoration:underline;font-weight:700;">Unsubscribe</a></div>\n</div>\n\n\t              </td>\n\t            </tr>\n\t          </table>\n\n\t          <div style="max-width:640px;margin-top:10px;font-size:12px;color:rgba(15,23,42,.60);text-align:center;">\n\t            You’re receiving this because you signed up on http://localhost:5173.\n\t          </div>\n\t        </td>\n\t      </tr>\n\t    </table>\n\t  </body>\n\t</html>\n	http://localhost:5173/subscribe/unsubscribe?token=0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ
26	samiullah-syed@hotmail.com	Project X Projects — Confirm your subscription	Hello,\n\nPlease confirm your subscription to Project X Projects updates:\nhttp://localhost:5173/subscribe/verify?token=edU2h4WAxWDZNGdAKlrV1TV0Tu3pm1lmZSa6qpwLv94\n\nWhat you'll receive:\n- New projects & updates\n- Local event announcements\n\nIf you didn’t request this, you can ignore this email.\n\nUnsubscribe:\nhttp://localhost:5173/subscribe/unsubscribe?token=Tjtn5S1ryZ6GwnOJINg0E_FvCXMhc-aOuWEdGDJMNpY\n\nProject X Projects • Ontario, Canada\nSupport: info@projectsxprojects.ca\n	SENT	0	\N	2026-02-12 23:28:47.546941+00	2026-02-12 23:28:47.546941+00	2026-02-12 23:28:58.450454+00	\t<!doctype html>\n\t<html>\n\t  <body style="margin:0;padding:0;background:#eef7f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">\n\t    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Updates from Project X Projects</span>\n\t    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef7f7;padding:28px 12px;">\n\t      <tr>\n\t        <td align="center">\n\t          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid rgba(15,23,42,.10);">\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#e6fbfc;border-bottom:1px solid rgba(15,23,42,.08);">\n\t                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">\n\t                  <tr>\n\t                    <td style="vertical-align:middle;">\n\t                      <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/email/pxp-logo.png" alt="Project X Projects" height="34" style="display:block;border:0;"/>\n\t                    </td>\n\t                    <td align="right" style="font-size:12px;color:rgba(15,23,42,.70);">\n\t                      Ontario, Canada\n\t                    </td>\n\t                  </tr>\n\t                </table>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:22px 20px;color:#0f172a;">\n\t                <div style="font-weight:900;font-size:22px;letter-spacing:-.01em;">Confirm your subscription</div>\n\t                <div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">Please confirm your subscription to <b>Project X Projects</b> updates.</div>\n\t                <div style="margin-top:16px;"><div style="margin-top:14px;">\n  <a href="http://localhost:5173/subscribe/verify?token=edU2h4WAxWDZNGdAKlrV1TV0Tu3pm1lmZSa6qpwLv94" style="display:inline-block;padding:12px 16px;border-radius:10px;background:#11878D;color:#fff;text-decoration:none;font-weight:800;font-size:14px;">\n    Confirm subscription\n  </a>\n</div>\n</div>\n\t                <div style="margin-top:14px;"><ul style="margin:12px 0 0 18px;padding:0;color:rgba(15,23,42,.82);font-size:14px;line-height:1.65;"><li>New project announcements and updates</li><li>Local event notifications</li><li>Occasional impact stories</li></ul></div>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#f8fbfb;border-top:1px solid rgba(15,23,42,.08);">\n\t                <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);">\n  <div style="font-weight:900;margin-bottom:6px;">Project X Projects</div>\n  <div>Support: <a href="mailto:info@projectsxprojects.ca" style="color:#11878D;text-decoration:underline;">info@projectsxprojects.ca</a></div>\n  <div style="margin-top:8px;"><a href="http://localhost:5173/subscribe/unsubscribe?token=Tjtn5S1ryZ6GwnOJINg0E_FvCXMhc-aOuWEdGDJMNpY" style="color:#11878D;text-decoration:underline;font-weight:700;">Unsubscribe</a></div>\n</div>\n\n\t              </td>\n\t            </tr>\n\t          </table>\n\n\t          <div style="max-width:640px;margin-top:10px;font-size:12px;color:rgba(15,23,42,.60);text-align:center;">\n\t            You’re receiving this because you signed up on http://localhost:5173.\n\t          </div>\n\t        </td>\n\t      </tr>\n\t    </table>\n\t  </body>\n\t</html>\n	http://localhost:5173/subscribe/unsubscribe?token=Tjtn5S1ryZ6GwnOJINg0E_FvCXMhc-aOuWEdGDJMNpY
27	shafiyasyed@hotmail.com	Project X Projects — Confirm your subscription	Hello,\n\nPlease confirm your subscription to Project X Projects updates:\nhttp://localhost:5173/subscribe/verify?token=sJm54ha63U_9eJuQpQlY7b759QfLbu9_KLiuv1XgF6E\n\nWhat you'll receive:\n- New projects & updates\n- Local event announcements\n\nIf you didn’t request this, you can ignore this email.\n\nUnsubscribe:\nhttp://localhost:5173/subscribe/unsubscribe?token=WqcbXreDKQlvII6GowtGlsvcGiN-EtAhLJkNVNVQ_q0\n\nProject X Projects • Ontario, Canada\nSupport: info@projectsxprojects.ca\n	SENT	0	\N	2026-02-12 23:42:58.172168+00	2026-02-12 23:42:58.172168+00	2026-02-12 23:43:19.716028+00	\t<!doctype html>\n\t<html>\n\t  <body style="margin:0;padding:0;background:#eef7f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">\n\t    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Updates from Project X Projects</span>\n\t    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef7f7;padding:28px 12px;">\n\t      <tr>\n\t        <td align="center">\n\t          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:5px;overflow:hidden;border:1px solid rgba(15,23,42,.10);">\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#e6fbfc;border-bottom:1px solid rgba(15,23,42,.08);">\n\t                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">\n\t                  <tr>\n\t                    <td style="vertical-align:middle;">\n\t                      <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/email/pxp-logo.png" alt="Project X Projects" height="34" style="display:block;border:0;"/>\n\t                    </td>\n\t                    <td align="right" style="font-size:12px;color:rgba(15,23,42,.70);">\n\t                      Ontario, Canada\n\t                    </td>\n\t                  </tr>\n\t                </table>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:22px 20px;color:#0f172a;">\n\t                <div style="font-weight:900;font-size:22px;letter-spacing:-.01em;">Confirm your subscription</div>\n\t                <div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">Please confirm your subscription to <b>Project X Projects</b> updates.</div>\n\t                <div style="margin-top:16px;"><div style="margin-top:14px;">\n  <a href="http://localhost:5173/subscribe/verify?token=sJm54ha63U_9eJuQpQlY7b759QfLbu9_KLiuv1XgF6E" style="display:inline-block;padding:12px 20px;border-radius:5px;background:#11878D;color:#fff;text-decoration:none;font-weight:700;font-size:14px;">\n    Confirm subscription\n  </a>\n</div>\n</div>\n\t                <div style="margin-top:14px;"><ul style="margin:12px 0 0 18px;padding:0;color:rgba(15,23,42,.82);font-size:14px;line-height:1.65;"><li>New project announcements and updates</li><li>Local event notifications</li><li>Occasional impact stories</li></ul></div>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#f8fbfb;border-top:1px solid rgba(15,23,42,.08);">\n\t                <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);text-allign: center;">\n  <div style="font-weight:900;margin-bottom:6px;">Project X Projects</div>\n  <div>Support: <a href="mailto:info@projectsxprojects.ca" style="color:#11878D;text-decoration:underline;">info@projectsxprojects.ca</a></div>\n  <div style="font-size: 10px; margin-top:8px;"><a href="http://localhost:5173/subscribe/unsubscribe?token=WqcbXreDKQlvII6GowtGlsvcGiN-EtAhLJkNVNVQ_q0" style="color:#11878D;text-decoration:underline;font-weight:700;">Unsubscribe</a></div>\n</div>\n\n\t              </td>\n\t            </tr>\n\t          </table>\n\n\t          <div style="max-width:640px;margin-top:10px;font-size:12px;color:rgba(15,23,42,.60);text-align:center;">\n\t            You’re receiving this because you signed up on http://localhost:5173.\n\t          </div>\n\t        </td>\n\t      </tr>\n\t    </table>\n\t  </body>\n\t</html>\n	http://localhost:5173/subscribe/unsubscribe?token=WqcbXreDKQlvII6GowtGlsvcGiN-EtAhLJkNVNVQ_q0
28	azizsyed2016@gmail.com	Project X Projects — New project underway: Foundations of Faith	Hello,\n\nA new project is underway:\nFoundations of Faith\n\nA masjid and water well built together to support both spiritual and physical well-being in Malawi.\n\n\n\nTags: Malawi, Mosque Project, Clean Water, Water Well\n\nView project:\nhttp://localhost:5173/projects/foundations-of-faith\n\nUnsubscribe:\nhttp://localhost:5173/subscribe/unsubscribe?token=fh1NzqxyP1PdOj6_Np20QPsEjCeDFvKKTrZ5Cv6b9sA\n\nProject X Projects • Ontario, Canada\nSupport: info@projectsxprojects.ca\n	SENT	0	\N	2026-02-14 00:02:14.046153+00	2026-02-14 00:02:14.046153+00	2026-02-14 00:02:28.919779+00	\t<!doctype html>\n\t<html>\n\t  <body style="margin:0;padding:0;background:#eef7f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">\n\t    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Updates from Project X Projects</span>\n\t    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef7f7;padding:28px 12px;">\n\t      <tr>\n\t        <td align="center">\n\t          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:5px;overflow:hidden;border:1px solid rgba(15,23,42,.10);">\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#e6fbfc;border-bottom:1px solid rgba(15,23,42,.08);">\n\t                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">\n\t                  <tr>\n\t                    <td style="vertical-align:middle;">\n\t                      <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/email/pxp-logo.png" alt="Project X Projects" height="34" style="display:block;border:0;"/>\n\t                    </td>\n\t                    <td align="right" style="font-size:12px;color:rgba(15,23,42,.70);">\n\t                      Ontario, Canada\n\t                    </td>\n\t                  </tr>\n\t                </table>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:22px 20px;color:#0f172a;">\n\t                <div style="font-weight:900;font-size:22px;letter-spacing:-.01em;">New project underway</div>\n\t                <div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">We’ve started a new project: <b>Foundations of Faith</b>.</div>\n\t                <div style="margin-top:16px;"><div style="margin-top:14px;">\n  <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/foundations-of-faith/card/25f839f4-3d14-4e7e-a98f-a99a412155a2.jpg" alt="" style="width:100%;max-height:260px;object-fit:cover;border-radius:10px;border:1px solid rgba(15,23,42,.08);" />\n</div>\n<div style="margin-top:10px;font-size:13px;color:rgba(15,23,42,.75);">\n  <span style="font-weight:800;">Tags:</span> Malawi, Mosque Project, Clean Water, Water Well\n</div>\n<div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">A masjid and water well built together to support both spiritual and physical well-being in Malawi.</div><div style="margin-top:14px;">\n  <a href="http://localhost:5173/projects/foundations-of-faith" style="display:inline-block;padding:12px 30px;border-radius:5px;background:#11878D;color:#fff;text-decoration:none;font-weight:700;font-size:14px;">\n    View project\n  </a>\n</div>\n</div>\n\t                \n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#f8fbfb;border-top:1px solid rgba(15,23,42,.08);">\n\t                <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);text-allign: center;">\n  <div style="font-weight:900;margin-bottom:6px;">Project X Projects</div>\n  <div>Support: <a href="mailto:info@projectsxprojects.ca" style="color:#11878D;text-decoration:underline;">info@projectsxprojects.ca</a></div>\n  <div style="font-size: 10px; margin-top:8px;"><a href="http://localhost:5173/subscribe/unsubscribe?token=fh1NzqxyP1PdOj6_Np20QPsEjCeDFvKKTrZ5Cv6b9sA" style="color:#11878D;text-decoration:underline;font-weight:700;">Unsubscribe</a></div>\n</div>\n\n\t              </td>\n\t            </tr>\n\t          </table>\n\n\t          <div style="max-width:640px;margin-top:10px;font-size:12px;color:rgba(15,23,42,.60);text-align:center;">\n\t            You’re receiving this because you signed up on http://localhost:5173.\n\t          </div>\n\t        </td>\n\t      </tr>\n\t    </table>\n\t  </body>\n\t</html>\n	http://localhost:5173/subscribe/unsubscribe?token=fh1NzqxyP1PdOj6_Np20QPsEjCeDFvKKTrZ5Cv6b9sA
29	azizsyed2022@gmail.com	Project X Projects — New project underway: Foundations of Faith	Hello,\n\nA new project is underway:\nFoundations of Faith\n\nA masjid and water well built together to support both spiritual and physical well-being in Malawi.\n\n\n\nTags: Malawi, Mosque Project, Clean Water, Water Well\n\nView project:\nhttp://localhost:5173/projects/foundations-of-faith\n\nUnsubscribe:\nhttp://localhost:5173/subscribe/unsubscribe?token=qHdTC_fPLE9k3hBUijGZvNM9n0-JRpLxU5bXKMAnw30\n\nProject X Projects • Ontario, Canada\nSupport: info@projectsxprojects.ca\n	SENT	0	\N	2026-02-14 00:02:14.057587+00	2026-02-14 00:02:14.057587+00	2026-02-14 00:02:29.661694+00	\t<!doctype html>\n\t<html>\n\t  <body style="margin:0;padding:0;background:#eef7f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">\n\t    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Updates from Project X Projects</span>\n\t    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef7f7;padding:28px 12px;">\n\t      <tr>\n\t        <td align="center">\n\t          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:5px;overflow:hidden;border:1px solid rgba(15,23,42,.10);">\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#e6fbfc;border-bottom:1px solid rgba(15,23,42,.08);">\n\t                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">\n\t                  <tr>\n\t                    <td style="vertical-align:middle;">\n\t                      <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/email/pxp-logo.png" alt="Project X Projects" height="34" style="display:block;border:0;"/>\n\t                    </td>\n\t                    <td align="right" style="font-size:12px;color:rgba(15,23,42,.70);">\n\t                      Ontario, Canada\n\t                    </td>\n\t                  </tr>\n\t                </table>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:22px 20px;color:#0f172a;">\n\t                <div style="font-weight:900;font-size:22px;letter-spacing:-.01em;">New project underway</div>\n\t                <div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">We’ve started a new project: <b>Foundations of Faith</b>.</div>\n\t                <div style="margin-top:16px;"><div style="margin-top:14px;">\n  <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/foundations-of-faith/card/25f839f4-3d14-4e7e-a98f-a99a412155a2.jpg" alt="" style="width:100%;max-height:260px;object-fit:cover;border-radius:10px;border:1px solid rgba(15,23,42,.08);" />\n</div>\n<div style="margin-top:10px;font-size:13px;color:rgba(15,23,42,.75);">\n  <span style="font-weight:800;">Tags:</span> Malawi, Mosque Project, Clean Water, Water Well\n</div>\n<div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">A masjid and water well built together to support both spiritual and physical well-being in Malawi.</div><div style="margin-top:14px;">\n  <a href="http://localhost:5173/projects/foundations-of-faith" style="display:inline-block;padding:12px 30px;border-radius:5px;background:#11878D;color:#fff;text-decoration:none;font-weight:700;font-size:14px;">\n    View project\n  </a>\n</div>\n</div>\n\t                \n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#f8fbfb;border-top:1px solid rgba(15,23,42,.08);">\n\t                <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);text-allign: center;">\n  <div style="font-weight:900;margin-bottom:6px;">Project X Projects</div>\n  <div>Support: <a href="mailto:info@projectsxprojects.ca" style="color:#11878D;text-decoration:underline;">info@projectsxprojects.ca</a></div>\n  <div style="font-size: 10px; margin-top:8px;"><a href="http://localhost:5173/subscribe/unsubscribe?token=qHdTC_fPLE9k3hBUijGZvNM9n0-JRpLxU5bXKMAnw30" style="color:#11878D;text-decoration:underline;font-weight:700;">Unsubscribe</a></div>\n</div>\n\n\t              </td>\n\t            </tr>\n\t          </table>\n\n\t          <div style="max-width:640px;margin-top:10px;font-size:12px;color:rgba(15,23,42,.60);text-align:center;">\n\t            You’re receiving this because you signed up on http://localhost:5173.\n\t          </div>\n\t        </td>\n\t      </tr>\n\t    </table>\n\t  </body>\n\t</html>\n	http://localhost:5173/subscribe/unsubscribe?token=qHdTC_fPLE9k3hBUijGZvNM9n0-JRpLxU5bXKMAnw30
30	aziz.school.23@gmail.com	Project X Projects — New project underway: Foundations of Faith	Hello,\n\nA new project is underway:\nFoundations of Faith\n\nA masjid and water well built together to support both spiritual and physical well-being in Malawi.\n\n\n\nTags: Malawi, Mosque Project, Clean Water, Water Well\n\nView project:\nhttp://localhost:5173/projects/foundations-of-faith\n\nUnsubscribe:\nhttp://localhost:5173/subscribe/unsubscribe?token=0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ\n\nProject X Projects • Ontario, Canada\nSupport: info@projectsxprojects.ca\n	SENT	0	\N	2026-02-14 00:02:14.064173+00	2026-02-14 00:02:14.064173+00	2026-02-14 00:02:30.377359+00	\t<!doctype html>\n\t<html>\n\t  <body style="margin:0;padding:0;background:#eef7f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">\n\t    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Updates from Project X Projects</span>\n\t    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef7f7;padding:28px 12px;">\n\t      <tr>\n\t        <td align="center">\n\t          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:5px;overflow:hidden;border:1px solid rgba(15,23,42,.10);">\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#e6fbfc;border-bottom:1px solid rgba(15,23,42,.08);">\n\t                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">\n\t                  <tr>\n\t                    <td style="vertical-align:middle;">\n\t                      <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/email/pxp-logo.png" alt="Project X Projects" height="34" style="display:block;border:0;"/>\n\t                    </td>\n\t                    <td align="right" style="font-size:12px;color:rgba(15,23,42,.70);">\n\t                      Ontario, Canada\n\t                    </td>\n\t                  </tr>\n\t                </table>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:22px 20px;color:#0f172a;">\n\t                <div style="font-weight:900;font-size:22px;letter-spacing:-.01em;">New project underway</div>\n\t                <div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">We’ve started a new project: <b>Foundations of Faith</b>.</div>\n\t                <div style="margin-top:16px;"><div style="margin-top:14px;">\n  <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/foundations-of-faith/card/25f839f4-3d14-4e7e-a98f-a99a412155a2.jpg" alt="" style="width:100%;max-height:260px;object-fit:cover;border-radius:10px;border:1px solid rgba(15,23,42,.08);" />\n</div>\n<div style="margin-top:10px;font-size:13px;color:rgba(15,23,42,.75);">\n  <span style="font-weight:800;">Tags:</span> Malawi, Mosque Project, Clean Water, Water Well\n</div>\n<div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">A masjid and water well built together to support both spiritual and physical well-being in Malawi.</div><div style="margin-top:14px;">\n  <a href="http://localhost:5173/projects/foundations-of-faith" style="display:inline-block;padding:12px 30px;border-radius:5px;background:#11878D;color:#fff;text-decoration:none;font-weight:700;font-size:14px;">\n    View project\n  </a>\n</div>\n</div>\n\t                \n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#f8fbfb;border-top:1px solid rgba(15,23,42,.08);">\n\t                <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);text-allign: center;">\n  <div style="font-weight:900;margin-bottom:6px;">Project X Projects</div>\n  <div>Support: <a href="mailto:info@projectsxprojects.ca" style="color:#11878D;text-decoration:underline;">info@projectsxprojects.ca</a></div>\n  <div style="font-size: 10px; margin-top:8px;"><a href="http://localhost:5173/subscribe/unsubscribe?token=0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ" style="color:#11878D;text-decoration:underline;font-weight:700;">Unsubscribe</a></div>\n</div>\n\n\t              </td>\n\t            </tr>\n\t          </table>\n\n\t          <div style="max-width:640px;margin-top:10px;font-size:12px;color:rgba(15,23,42,.60);text-align:center;">\n\t            You’re receiving this because you signed up on http://localhost:5173.\n\t          </div>\n\t        </td>\n\t      </tr>\n\t    </table>\n\t  </body>\n\t</html>\n	http://localhost:5173/subscribe/unsubscribe?token=0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ
31	azizsyed2016@gmail.com	Project X Projects — New project underway: Streams of Mercy	Hello,\n\nA new project is underway:\nStreams of Mercy\n\nStreams of mercy flowing where hope was once scarce.\n\nTwenty-two water pumps installed across villages in Pakistan, delivering sustainable access to clean water.\n\nPakistan, Water Pumps, Clean Water, Aid, Relief\n\nView project:\nhttp://localhost:5173/projects/streams-of-mercy\n\nUnsubscribe:\nhttp://localhost:5173/subscribe/unsubscribe?token=fh1NzqxyP1PdOj6_Np20QPsEjCeDFvKKTrZ5Cv6b9sA\n\nProject X Projects • Ontario, Canada\nSupport: info@projectsxprojects.ca\n	SENT	0	\N	2026-02-14 00:35:44.240944+00	2026-02-14 00:35:44.240944+00	2026-02-14 00:35:45.746413+00	\t<!doctype html>\n\t<html>\n\t  <body style="margin:0;padding:0;background:#eef7f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">\n\t    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Updates from Project X Projects</span>\n\t    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef7f7;padding:28px 12px;">\n\t      <tr>\n\t        <td align="center">\n\t          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:5px;overflow:hidden;border:1px solid rgba(15,23,42,.10);">\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#e6fbfc;border-bottom:1px solid rgba(15,23,42,.08);">\n\t                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">\n\t                  <tr>\n\t                    <td style="vertical-align:middle;">\n\t                      <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/email/pxp-logo.png" alt="Project X Projects" height="34" style="display:block;border:0;"/>\n\t                    </td>\n\t                    <td align="right" style="font-size:12px;color:rgba(15,23,42,.70);">\n\t                      Ontario, Canada\n\t                    </td>\n\t                  </tr>\n\t                </table>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:22px 20px;color:#0f172a;">\n\t                <div style="font-weight:900;font-size:22px;letter-spacing:-.01em;">New project underway</div>\n\t                <div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">We’ve started a new project: <b>Streams of Mercy</b>.</div>\n\t                <div style="margin-top:16px;"><div style="margin-top:14px;">\n  <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/streams-of-mercy/card/013aee4e-ea17-4478-bf23-8484242f1b90.jpg" alt="" style="width:100%;max-height:260px;object-fit:cover;border-radius:10px;border:1px solid rgba(15,23,42,.08);" />\n</div>\n<div style="margin-top:10px;font-size:13px;color:rgba(15,23,42,.75);">\n  <span style="font-weight:800;">Tags:</span> Pakistan, Water Pumps, Clean Water, Aid, Relief\n</div>\n<div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">Streams of mercy flowing where hope was once scarce.</div><div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">Twenty-two water pumps installed across villages in Pakistan, delivering sustainable access to clean water.</div><div style="margin-top:14px;">\n  <a href="http://localhost:5173/projects/streams-of-mercy" style="display:inline-block;padding:12px 30px;border-radius:5px;background:#11878D;color:#fff;text-decoration:none;font-weight:700;font-size:14px;">\n    View project\n  </a>\n</div>\n</div>\n\t                \n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#f8fbfb;border-top:1px solid rgba(15,23,42,.08);">\n\t                <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);text-allign: center;">\n  <div style="font-weight:900;margin-bottom:6px;">Project X Projects</div>\n  <div>Support: <a href="mailto:info@projectsxprojects.ca" style="color:#11878D;text-decoration:underline;">info@projectsxprojects.ca</a></div>\n  <div style="font-size: 10px; margin-top:8px;"><a href="http://localhost:5173/subscribe/unsubscribe?token=fh1NzqxyP1PdOj6_Np20QPsEjCeDFvKKTrZ5Cv6b9sA" style="color:#11878D;text-decoration:underline;font-weight:700;">Unsubscribe</a></div>\n</div>\n\n\t              </td>\n\t            </tr>\n\t          </table>\n\n\t          <div style="max-width:640px;margin-top:10px;font-size:12px;color:rgba(15,23,42,.60);text-align:center;">\n\t            You’re receiving this because you signed up on http://localhost:5173.\n\t          </div>\n\t        </td>\n\t      </tr>\n\t    </table>\n\t  </body>\n\t</html>\n	http://localhost:5173/subscribe/unsubscribe?token=fh1NzqxyP1PdOj6_Np20QPsEjCeDFvKKTrZ5Cv6b9sA
32	azizsyed2022@gmail.com	Project X Projects — New project underway: Streams of Mercy	Hello,\n\nA new project is underway:\nStreams of Mercy\n\nStreams of mercy flowing where hope was once scarce.\n\nTwenty-two water pumps installed across villages in Pakistan, delivering sustainable access to clean water.\n\nPakistan, Water Pumps, Clean Water, Aid, Relief\n\nView project:\nhttp://localhost:5173/projects/streams-of-mercy\n\nUnsubscribe:\nhttp://localhost:5173/subscribe/unsubscribe?token=qHdTC_fPLE9k3hBUijGZvNM9n0-JRpLxU5bXKMAnw30\n\nProject X Projects • Ontario, Canada\nSupport: info@projectsxprojects.ca\n	SENT	0	\N	2026-02-14 00:35:44.251023+00	2026-02-14 00:35:44.251023+00	2026-02-14 00:35:46.486674+00	\t<!doctype html>\n\t<html>\n\t  <body style="margin:0;padding:0;background:#eef7f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">\n\t    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Updates from Project X Projects</span>\n\t    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef7f7;padding:28px 12px;">\n\t      <tr>\n\t        <td align="center">\n\t          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:5px;overflow:hidden;border:1px solid rgba(15,23,42,.10);">\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#e6fbfc;border-bottom:1px solid rgba(15,23,42,.08);">\n\t                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">\n\t                  <tr>\n\t                    <td style="vertical-align:middle;">\n\t                      <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/email/pxp-logo.png" alt="Project X Projects" height="34" style="display:block;border:0;"/>\n\t                    </td>\n\t                    <td align="right" style="font-size:12px;color:rgba(15,23,42,.70);">\n\t                      Ontario, Canada\n\t                    </td>\n\t                  </tr>\n\t                </table>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:22px 20px;color:#0f172a;">\n\t                <div style="font-weight:900;font-size:22px;letter-spacing:-.01em;">New project underway</div>\n\t                <div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">We’ve started a new project: <b>Streams of Mercy</b>.</div>\n\t                <div style="margin-top:16px;"><div style="margin-top:14px;">\n  <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/streams-of-mercy/card/013aee4e-ea17-4478-bf23-8484242f1b90.jpg" alt="" style="width:100%;max-height:260px;object-fit:cover;border-radius:10px;border:1px solid rgba(15,23,42,.08);" />\n</div>\n<div style="margin-top:10px;font-size:13px;color:rgba(15,23,42,.75);">\n  <span style="font-weight:800;">Tags:</span> Pakistan, Water Pumps, Clean Water, Aid, Relief\n</div>\n<div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">Streams of mercy flowing where hope was once scarce.</div><div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">Twenty-two water pumps installed across villages in Pakistan, delivering sustainable access to clean water.</div><div style="margin-top:14px;">\n  <a href="http://localhost:5173/projects/streams-of-mercy" style="display:inline-block;padding:12px 30px;border-radius:5px;background:#11878D;color:#fff;text-decoration:none;font-weight:700;font-size:14px;">\n    View project\n  </a>\n</div>\n</div>\n\t                \n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#f8fbfb;border-top:1px solid rgba(15,23,42,.08);">\n\t                <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);text-allign: center;">\n  <div style="font-weight:900;margin-bottom:6px;">Project X Projects</div>\n  <div>Support: <a href="mailto:info@projectsxprojects.ca" style="color:#11878D;text-decoration:underline;">info@projectsxprojects.ca</a></div>\n  <div style="font-size: 10px; margin-top:8px;"><a href="http://localhost:5173/subscribe/unsubscribe?token=qHdTC_fPLE9k3hBUijGZvNM9n0-JRpLxU5bXKMAnw30" style="color:#11878D;text-decoration:underline;font-weight:700;">Unsubscribe</a></div>\n</div>\n\n\t              </td>\n\t            </tr>\n\t          </table>\n\n\t          <div style="max-width:640px;margin-top:10px;font-size:12px;color:rgba(15,23,42,.60);text-align:center;">\n\t            You’re receiving this because you signed up on http://localhost:5173.\n\t          </div>\n\t        </td>\n\t      </tr>\n\t    </table>\n\t  </body>\n\t</html>\n	http://localhost:5173/subscribe/unsubscribe?token=qHdTC_fPLE9k3hBUijGZvNM9n0-JRpLxU5bXKMAnw30
33	aziz.school.23@gmail.com	Project X Projects — New project underway: Streams of Mercy	Hello,\n\nA new project is underway:\nStreams of Mercy\n\nStreams of mercy flowing where hope was once scarce.\n\nTwenty-two water pumps installed across villages in Pakistan, delivering sustainable access to clean water.\n\nPakistan, Water Pumps, Clean Water, Aid, Relief\n\nView project:\nhttp://localhost:5173/projects/streams-of-mercy\n\nUnsubscribe:\nhttp://localhost:5173/subscribe/unsubscribe?token=0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ\n\nProject X Projects • Ontario, Canada\nSupport: info@projectsxprojects.ca\n	SENT	0	\N	2026-02-14 00:35:44.259059+00	2026-02-14 00:35:44.259059+00	2026-02-14 00:35:47.278786+00	\t<!doctype html>\n\t<html>\n\t  <body style="margin:0;padding:0;background:#eef7f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">\n\t    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Updates from Project X Projects</span>\n\t    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef7f7;padding:28px 12px;">\n\t      <tr>\n\t        <td align="center">\n\t          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:5px;overflow:hidden;border:1px solid rgba(15,23,42,.10);">\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#e6fbfc;border-bottom:1px solid rgba(15,23,42,.08);">\n\t                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">\n\t                  <tr>\n\t                    <td style="vertical-align:middle;">\n\t                      <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/email/pxp-logo.png" alt="Project X Projects" height="34" style="display:block;border:0;"/>\n\t                    </td>\n\t                    <td align="right" style="font-size:12px;color:rgba(15,23,42,.70);">\n\t                      Ontario, Canada\n\t                    </td>\n\t                  </tr>\n\t                </table>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:22px 20px;color:#0f172a;">\n\t                <div style="font-weight:900;font-size:22px;letter-spacing:-.01em;">New project underway</div>\n\t                <div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">We’ve started a new project: <b>Streams of Mercy</b>.</div>\n\t                <div style="margin-top:16px;"><div style="margin-top:14px;">\n  <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/streams-of-mercy/card/013aee4e-ea17-4478-bf23-8484242f1b90.jpg" alt="" style="width:100%;max-height:260px;object-fit:cover;border-radius:10px;border:1px solid rgba(15,23,42,.08);" />\n</div>\n<div style="margin-top:10px;font-size:13px;color:rgba(15,23,42,.75);">\n  <span style="font-weight:800;">Tags:</span> Pakistan, Water Pumps, Clean Water, Aid, Relief\n</div>\n<div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">Streams of mercy flowing where hope was once scarce.</div><div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">Twenty-two water pumps installed across villages in Pakistan, delivering sustainable access to clean water.</div><div style="margin-top:14px;">\n  <a href="http://localhost:5173/projects/streams-of-mercy" style="display:inline-block;padding:12px 30px;border-radius:5px;background:#11878D;color:#fff;text-decoration:none;font-weight:700;font-size:14px;">\n    View project\n  </a>\n</div>\n</div>\n\t                \n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#f8fbfb;border-top:1px solid rgba(15,23,42,.08);">\n\t                <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);text-allign: center;">\n  <div style="font-weight:900;margin-bottom:6px;">Project X Projects</div>\n  <div>Support: <a href="mailto:info@projectsxprojects.ca" style="color:#11878D;text-decoration:underline;">info@projectsxprojects.ca</a></div>\n  <div style="font-size: 10px; margin-top:8px;"><a href="http://localhost:5173/subscribe/unsubscribe?token=0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ" style="color:#11878D;text-decoration:underline;font-weight:700;">Unsubscribe</a></div>\n</div>\n\n\t              </td>\n\t            </tr>\n\t          </table>\n\n\t          <div style="max-width:640px;margin-top:10px;font-size:12px;color:rgba(15,23,42,.60);text-align:center;">\n\t            You’re receiving this because you signed up on http://localhost:5173.\n\t          </div>\n\t        </td>\n\t      </tr>\n\t    </table>\n\t  </body>\n\t</html>\n	http://localhost:5173/subscribe/unsubscribe?token=0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ
34	azizsyed2016@gmail.com	Project X Projects — New project underway: Pillars of Faith	Hello,\n\nA new project is underway:\nPillars of Faith\n\nWhere faith rises and water flows, pillars that sustain life.\n\nA masjid and water well completed in Malawi, providing worship and clean water for generations.\n\nMalawi, Masjid Project, Clean Water, Community, Support\n\nView project:\nhttp://localhost:5173/projects/pillars-of-faith\n\nUnsubscribe:\nhttp://localhost:5173/subscribe/unsubscribe?token=fh1NzqxyP1PdOj6_Np20QPsEjCeDFvKKTrZ5Cv6b9sA\n\nProject X Projects • Ontario, Canada\nSupport: info@projectsxprojects.ca\n	SENT	0	\N	2026-02-14 01:14:14.120319+00	2026-02-14 01:14:14.120319+00	2026-02-14 01:14:19.268864+00	\t<!doctype html>\n\t<html>\n\t  <body style="margin:0;padding:0;background:#eef7f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">\n\t    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Updates from Project X Projects</span>\n\t    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef7f7;padding:28px 12px;">\n\t      <tr>\n\t        <td align="center">\n\t          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:5px;overflow:hidden;border:1px solid rgba(15,23,42,.10);">\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#e6fbfc;border-bottom:1px solid rgba(15,23,42,.08);">\n\t                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">\n\t                  <tr>\n\t                    <td style="vertical-align:middle;">\n\t                      <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/email/pxp-logo.png" alt="Project X Projects" height="34" style="display:block;border:0;"/>\n\t                    </td>\n\t                    <td align="right" style="font-size:12px;color:rgba(15,23,42,.70);">\n\t                      Ontario, Canada\n\t                    </td>\n\t                  </tr>\n\t                </table>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:22px 20px;color:#0f172a;">\n\t                <div style="font-weight:900;font-size:22px;letter-spacing:-.01em;">New project underway</div>\n\t                <div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">We’ve started a new project: <b>Pillars of Faith</b>.</div>\n\t                <div style="margin-top:16px;"><div style="margin-top:14px;">\n  <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/pillars-of-faith/card/38b3d172-98c7-41a5-8359-3a4dd9cd2ddf.jpg" alt="" style="width:100%;max-height:260px;object-fit:cover;border-radius:10px;border:1px solid rgba(15,23,42,.08);" />\n</div>\n<div style="margin-top:10px;font-size:13px;color:rgba(15,23,42,.75);">\n  <span style="font-weight:800;">Tags:</span> Malawi, Masjid Project, Clean Water, Community, Support\n</div>\n<div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">Where faith rises and water flows, pillars that sustain life.</div><div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">A masjid and water well completed in Malawi, providing worship and clean water for generations.</div><div style="margin-top:14px;">\n  <a href="http://localhost:5173/projects/pillars-of-faith" style="display:inline-block;padding:12px 30px;border-radius:5px;background:#11878D;color:#fff;text-decoration:none;font-weight:700;font-size:14px;">\n    View project\n  </a>\n</div>\n</div>\n\t                \n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#f8fbfb;border-top:1px solid rgba(15,23,42,.08);">\n\t                <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);text-allign: center;">\n  <div style="font-weight:900;margin-bottom:6px;">Project X Projects</div>\n  <div>Support: <a href="mailto:info@projectsxprojects.ca" style="color:#11878D;text-decoration:underline;">info@projectsxprojects.ca</a></div>\n  <div style="font-size: 10px; margin-top:8px;"><a href="http://localhost:5173/subscribe/unsubscribe?token=fh1NzqxyP1PdOj6_Np20QPsEjCeDFvKKTrZ5Cv6b9sA" style="color:#11878D;text-decoration:underline;font-weight:700;">Unsubscribe</a></div>\n</div>\n\n\t              </td>\n\t            </tr>\n\t          </table>\n\n\t          <div style="max-width:640px;margin-top:10px;font-size:12px;color:rgba(15,23,42,.60);text-align:center;">\n\t            You’re receiving this because you signed up on http://localhost:5173.\n\t          </div>\n\t        </td>\n\t      </tr>\n\t    </table>\n\t  </body>\n\t</html>\n	http://localhost:5173/subscribe/unsubscribe?token=fh1NzqxyP1PdOj6_Np20QPsEjCeDFvKKTrZ5Cv6b9sA
35	azizsyed2022@gmail.com	Project X Projects — New project underway: Pillars of Faith	Hello,\n\nA new project is underway:\nPillars of Faith\n\nWhere faith rises and water flows, pillars that sustain life.\n\nA masjid and water well completed in Malawi, providing worship and clean water for generations.\n\nMalawi, Masjid Project, Clean Water, Community, Support\n\nView project:\nhttp://localhost:5173/projects/pillars-of-faith\n\nUnsubscribe:\nhttp://localhost:5173/subscribe/unsubscribe?token=qHdTC_fPLE9k3hBUijGZvNM9n0-JRpLxU5bXKMAnw30\n\nProject X Projects • Ontario, Canada\nSupport: info@projectsxprojects.ca\n	SENT	0	\N	2026-02-14 01:14:14.129359+00	2026-02-14 01:14:14.129359+00	2026-02-14 01:14:20.076024+00	\t<!doctype html>\n\t<html>\n\t  <body style="margin:0;padding:0;background:#eef7f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">\n\t    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Updates from Project X Projects</span>\n\t    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef7f7;padding:28px 12px;">\n\t      <tr>\n\t        <td align="center">\n\t          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:5px;overflow:hidden;border:1px solid rgba(15,23,42,.10);">\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#e6fbfc;border-bottom:1px solid rgba(15,23,42,.08);">\n\t                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">\n\t                  <tr>\n\t                    <td style="vertical-align:middle;">\n\t                      <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/email/pxp-logo.png" alt="Project X Projects" height="34" style="display:block;border:0;"/>\n\t                    </td>\n\t                    <td align="right" style="font-size:12px;color:rgba(15,23,42,.70);">\n\t                      Ontario, Canada\n\t                    </td>\n\t                  </tr>\n\t                </table>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:22px 20px;color:#0f172a;">\n\t                <div style="font-weight:900;font-size:22px;letter-spacing:-.01em;">New project underway</div>\n\t                <div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">We’ve started a new project: <b>Pillars of Faith</b>.</div>\n\t                <div style="margin-top:16px;"><div style="margin-top:14px;">\n  <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/pillars-of-faith/card/38b3d172-98c7-41a5-8359-3a4dd9cd2ddf.jpg" alt="" style="width:100%;max-height:260px;object-fit:cover;border-radius:10px;border:1px solid rgba(15,23,42,.08);" />\n</div>\n<div style="margin-top:10px;font-size:13px;color:rgba(15,23,42,.75);">\n  <span style="font-weight:800;">Tags:</span> Malawi, Masjid Project, Clean Water, Community, Support\n</div>\n<div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">Where faith rises and water flows, pillars that sustain life.</div><div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">A masjid and water well completed in Malawi, providing worship and clean water for generations.</div><div style="margin-top:14px;">\n  <a href="http://localhost:5173/projects/pillars-of-faith" style="display:inline-block;padding:12px 30px;border-radius:5px;background:#11878D;color:#fff;text-decoration:none;font-weight:700;font-size:14px;">\n    View project\n  </a>\n</div>\n</div>\n\t                \n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#f8fbfb;border-top:1px solid rgba(15,23,42,.08);">\n\t                <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);text-allign: center;">\n  <div style="font-weight:900;margin-bottom:6px;">Project X Projects</div>\n  <div>Support: <a href="mailto:info@projectsxprojects.ca" style="color:#11878D;text-decoration:underline;">info@projectsxprojects.ca</a></div>\n  <div style="font-size: 10px; margin-top:8px;"><a href="http://localhost:5173/subscribe/unsubscribe?token=qHdTC_fPLE9k3hBUijGZvNM9n0-JRpLxU5bXKMAnw30" style="color:#11878D;text-decoration:underline;font-weight:700;">Unsubscribe</a></div>\n</div>\n\n\t              </td>\n\t            </tr>\n\t          </table>\n\n\t          <div style="max-width:640px;margin-top:10px;font-size:12px;color:rgba(15,23,42,.60);text-align:center;">\n\t            You’re receiving this because you signed up on http://localhost:5173.\n\t          </div>\n\t        </td>\n\t      </tr>\n\t    </table>\n\t  </body>\n\t</html>\n	http://localhost:5173/subscribe/unsubscribe?token=qHdTC_fPLE9k3hBUijGZvNM9n0-JRpLxU5bXKMAnw30
36	aziz.school.23@gmail.com	Project X Projects — New project underway: Pillars of Faith	Hello,\n\nA new project is underway:\nPillars of Faith\n\nWhere faith rises and water flows, pillars that sustain life.\n\nA masjid and water well completed in Malawi, providing worship and clean water for generations.\n\nMalawi, Masjid Project, Clean Water, Community, Support\n\nView project:\nhttp://localhost:5173/projects/pillars-of-faith\n\nUnsubscribe:\nhttp://localhost:5173/subscribe/unsubscribe?token=0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ\n\nProject X Projects • Ontario, Canada\nSupport: info@projectsxprojects.ca\n	SENT	0	\N	2026-02-14 01:14:14.134613+00	2026-02-14 01:14:14.134613+00	2026-02-14 01:14:20.851675+00	\t<!doctype html>\n\t<html>\n\t  <body style="margin:0;padding:0;background:#eef7f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">\n\t    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Updates from Project X Projects</span>\n\t    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef7f7;padding:28px 12px;">\n\t      <tr>\n\t        <td align="center">\n\t          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:5px;overflow:hidden;border:1px solid rgba(15,23,42,.10);">\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#e6fbfc;border-bottom:1px solid rgba(15,23,42,.08);">\n\t                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">\n\t                  <tr>\n\t                    <td style="vertical-align:middle;">\n\t                      <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/email/pxp-logo.png" alt="Project X Projects" height="34" style="display:block;border:0;"/>\n\t                    </td>\n\t                    <td align="right" style="font-size:12px;color:rgba(15,23,42,.70);">\n\t                      Ontario, Canada\n\t                    </td>\n\t                  </tr>\n\t                </table>\n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:22px 20px;color:#0f172a;">\n\t                <div style="font-weight:900;font-size:22px;letter-spacing:-.01em;">New project underway</div>\n\t                <div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">We’ve started a new project: <b>Pillars of Faith</b>.</div>\n\t                <div style="margin-top:16px;"><div style="margin-top:14px;">\n  <img src="https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/pillars-of-faith/card/38b3d172-98c7-41a5-8359-3a4dd9cd2ddf.jpg" alt="" style="width:100%;max-height:260px;object-fit:cover;border-radius:10px;border:1px solid rgba(15,23,42,.08);" />\n</div>\n<div style="margin-top:10px;font-size:13px;color:rgba(15,23,42,.75);">\n  <span style="font-weight:800;">Tags:</span> Malawi, Masjid Project, Clean Water, Community, Support\n</div>\n<div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">Where faith rises and water flows, pillars that sustain life.</div><div style="margin-top:10px;font-size:14px;line-height:1.65;color:rgba(15,23,42,.82);">A masjid and water well completed in Malawi, providing worship and clean water for generations.</div><div style="margin-top:14px;">\n  <a href="http://localhost:5173/projects/pillars-of-faith" style="display:inline-block;padding:12px 30px;border-radius:5px;background:#11878D;color:#fff;text-decoration:none;font-weight:700;font-size:14px;">\n    View project\n  </a>\n</div>\n</div>\n\t                \n\t              </td>\n\t            </tr>\n\n\t            <tr>\n\t              <td style="padding:18px 20px;background:#f8fbfb;border-top:1px solid rgba(15,23,42,.08);">\n\t                <div style="font-size:12px;line-height:1.6;color:rgba(15,23,42,.70);text-allign: center;">\n  <div style="font-weight:900;margin-bottom:6px;">Project X Projects</div>\n  <div>Support: <a href="mailto:info@projectsxprojects.ca" style="color:#11878D;text-decoration:underline;">info@projectsxprojects.ca</a></div>\n  <div style="font-size: 10px; margin-top:8px;"><a href="http://localhost:5173/subscribe/unsubscribe?token=0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ" style="color:#11878D;text-decoration:underline;font-weight:700;">Unsubscribe</a></div>\n</div>\n\n\t              </td>\n\t            </tr>\n\t          </table>\n\n\t          <div style="max-width:640px;margin-top:10px;font-size:12px;color:rgba(15,23,42,.60);text-align:center;">\n\t            You’re receiving this because you signed up on http://localhost:5173.\n\t          </div>\n\t        </td>\n\t      </tr>\n\t    </table>\n\t  </body>\n\t</html>\n	http://localhost:5173/subscribe/unsubscribe?token=0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, title, short_desc, location, event_date, image_url, tags, status, created_at) FROM stdin;
2	ANNUAL MNE BBQ (2024)	This isn’t just a BBQ, it’s a movement. Pull up, vibe with the community, and walk away with more than just a plate.	214 Markham Road, Scarborough, ON	2024-07-06	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/event-annual-mne-bbq-2024/event/e1f2c577-8e8b-4f40-8cfd-4bdb00c3f19b.jpg	BBQ, Community, Youth, Food	PASSED	2026-02-10 23:11:29.666875+00
1	Annual MNE BBQ (2025)	This isn’t just a BBQ, it’s a movement.\nPull up, vibe with the community, and walk away with more than just a plate.	214 Markham Road, Scarborough, ON	2025-07-06	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/event-annual-mne-bbq/event/9aade99d-8c74-4fbf-992d-caae3e963b5f.jpg	BBQ, Raffle, Guest Speaker, Youth	PASSED	2026-02-10 21:15:53.815017+00
\.


--
-- Data for Name: flyway_schema_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
1	1	init	SQL	V1__init.sql	-241774426	postgres	2026-02-05 17:57:01.810648	51	t
2	2	seed	SQL	V2__seed.sql	-243825303	postgres	2026-02-05 17:57:01.907473	15	t
3	3	admin users	SQL	V3__admin_users.sql	-952494115	postgres	2026-02-05 19:37:42.150255	47	t
4	4	subscribers	SQL	V4__subscribers.sql	-53440935	postgres	2026-02-07 17:39:01.524293	124	t
5	5	email outbox	SQL	V5__email_outbox.sql	1877396386	postgres	2026-02-07 17:39:01.70645	31	t
6	6	events	SQL	V6__events.sql	2004364114	postgres	2026-02-09 17:51:23.781497	139	t
7	7	email outbox html	SQL	V7__email_outbox_html.sql	-969585605	postgres	2026-02-12 18:10:30.45775	30	t
\.


--
-- Data for Name: project_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_images (id, project_id, url, alt, kind, sort_order, created_at) FROM stdin;
19	5	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/for-the-ummah/gallery/b35bfd00-7f7b-49fa-9f95-6ff760103655.jpg	FTU-6	GALLERY	5	2026-02-08 00:50:20.609296+00
10	4	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/water-changes-everything/gallery/2af6fc5f-431f-4492-9b08-22855020a936.jpg	wce4	GALLERY	3	2026-02-06 23:40:31.797315+00
39	9	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/streams-of-mercy/gallery/c95940c5-8b50-4555-918e-8a6c2e2eeacb.jpg	SOM-6	GALLERY	5	2026-02-14 00:36:02.410296+00
18	5	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/for-the-ummah/gallery/f86db36d-f22e-48ee-8e7e-ec27dbaeedf5.jpg	FTU-5	GALLERY	4	2026-02-08 00:50:16.212818+00
14	5	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/for-the-ummah/gallery/1e64faf9-9b51-41f8-ad70-5662c976e02e.jpg	FTU-1	GALLERY	2	2026-02-08 00:50:02.554017+00
15	5	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/for-the-ummah/gallery/a4a03158-4f75-43d1-a6e6-a61f5c407b91.jpg	FTU-2	GALLERY	0	2026-02-08 00:50:05.447728+00
13	4	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/water-changes-everything/gallery/996a890a-54b3-4683-8863-5a7ec486a61d.jpg	wce5	GALLERY	4	2026-02-06 23:40:50.160211+00
7	4	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/water-changes-everything/gallery/b2fef019-ac99-4aaa-b9c3-6b729dc4c3d5.jpg	wce1	GALLERY	0	2026-02-06 23:40:23.116444+00
8	4	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/water-changes-everything/gallery/60874cd1-7d57-41ff-8a90-1547625c5be9.jpg	wce2	GALLERY	1	2026-02-06 23:40:25.635734+00
16	5	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/for-the-ummah/gallery/d4772114-9477-4d55-ba1f-abfa53157e69.jpg	FTU-3	GALLERY	1	2026-02-08 00:50:09.142406+00
23	6	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/wells-of-access-2/gallery/c6a0c4e8-f97c-47c5-9427-7835c83ab1db.jpg	WOA-4	GALLERY	3	2026-02-13 23:52:34.458969+00
9	4	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/water-changes-everything/gallery/7cab3f76-137e-4c36-8056-ffd935de23c5.jpg	wce3	GALLERY	2	2026-02-06 23:40:28.9431+00
33	8	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/water-pumps-of-relief/gallery/f7e2f3b9-ac15-48ce-b3f5-8deb9fd7efe5.jpg	WPOR-3	GALLERY	2	2026-02-14 00:28:14.690569+00
25	6	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/wells-of-access-2/gallery/e3fbef1b-d42a-424b-8385-8a0972fd0fb7.jpg	WOA-5	GALLERY	4	2026-02-13 23:52:44.281995+00
17	5	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/for-the-ummah/gallery/44c09ea9-f385-4efa-97a7-98d202565a19.jpg	FTU-4	GALLERY	3	2026-02-08 00:50:12.112812+00
29	7	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/foundations-of-faith/gallery/1b439f30-15fa-4d0f-b88d-26ad9a4b4533.jpg	FOF-4	GALLERY	3	2026-02-14 00:02:27.317864+00
20	6	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/wells-of-access-2/gallery/d0844119-5797-41b3-a93e-f98ad9f1f03d.jpg	WOA-1	GALLERY	0	2026-02-13 23:52:25.220229+00
30	7	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/foundations-of-faith/gallery/af1602e4-4c66-4117-826f-f9803569a033.jpg	FOF-5	GALLERY	4	2026-02-14 00:02:29.901665+00
21	6	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/wells-of-access-2/gallery/1361438c-ac2b-4531-8095-3db089af2fc2.jpg	WOA-2	GALLERY	1	2026-02-13 23:52:27.658139+00
22	6	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/wells-of-access-2/gallery/233b16bb-7ceb-4e92-8426-dd70539b00d7.jpg	WOA-3	GALLERY	2	2026-02-13 23:52:30.428049+00
32	8	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/water-pumps-of-relief/gallery/57ced980-3016-48c1-b4b6-473a66c68237.jpg	WPOR-2	GALLERY	1	2026-02-14 00:28:09.638684+00
31	8	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/water-pumps-of-relief/gallery/a99e500b-428f-4def-9278-6606597e5c10.jpg	WPOR-1	GALLERY	0	2026-02-14 00:28:06.99728+00
34	9	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/streams-of-mercy/gallery/9757f440-c629-4f55-a185-a6ca92f401ad.jpg	SOM-1	GALLERY	0	2026-02-14 00:35:47.770536+00
26	7	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/foundations-of-faith/gallery/76c0572a-7804-413d-926b-55870dd1b897.jpg	FOF-1	GALLERY	0	2026-02-14 00:02:17.888878+00
27	7	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/foundations-of-faith/gallery/937da833-6bf6-4ac6-994d-0012f77e2891.jpg	FOF-2	GALLERY	1	2026-02-14 00:02:20.787428+00
28	7	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/foundations-of-faith/gallery/51d7dde2-5f42-45bc-8c83-8a6f3660da4c.jpg	FOF-3	GALLERY	2	2026-02-14 00:02:23.675192+00
35	9	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/streams-of-mercy/gallery/68e0b31a-1d45-43c4-98f9-8ae2c96cfac8.jpg	SOM-2	GALLERY	1	2026-02-14 00:35:50.405255+00
36	9	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/streams-of-mercy/gallery/546a8ff0-a1ec-4c4a-9428-2109c40919c3.jpg	SOM-3	GALLERY	2	2026-02-14 00:35:52.785535+00
37	9	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/streams-of-mercy/gallery/d04721e9-aa6a-40f8-a8d8-320de6b72b8b.jpg	SOM-4	GALLERY	3	2026-02-14 00:35:56.554248+00
38	9	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/streams-of-mercy/gallery/6b15d1ab-e3bd-4636-aa47-133e62f02987.jpg	SOM-5	GALLERY	4	2026-02-14 00:35:59.801848+00
42	10	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/the-wells-of-purity/gallery/86c348e6-b093-459d-b705-7ad53f8c4d51.jpg	TWOP-3	GALLERY	2	2026-02-14 01:05:56.226527+00
40	10	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/the-wells-of-purity/gallery/5fba1105-2d61-4ccd-9df7-d5b240842800.jpg	TWOP-1	GALLERY	0	2026-02-14 01:05:51.649838+00
43	10	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/the-wells-of-purity/gallery/14d01844-4c9f-4c38-b0b6-21f4d60f1914.jpg	TWOP-4	GALLERY	3	2026-02-14 01:06:04.385697+00
44	10	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/the-wells-of-purity/gallery/d30ee840-f3f2-4aea-a8eb-360cdc78ec14.jpg	TWOP-5	GALLERY	4	2026-02-14 01:06:15.022769+00
45	10	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/the-wells-of-purity/gallery/07fccb3f-b3aa-4a88-970d-cec0862a580b.jpg	TWOP-6	GALLERY	5	2026-02-14 01:06:17.110148+00
41	10	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/the-wells-of-purity/gallery/bdf0f51f-a2d0-46f0-811d-5ab686048ef3.jpg	TWOP-2	GALLERY	1	2026-02-14 01:05:53.865733+00
48	11	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/pillars-of-faith/gallery/e6a65883-24d7-4a48-8518-4ae12b1d2417.jpg	POF-3	GALLERY	2	2026-02-14 01:14:23.194148+00
47	11	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/pillars-of-faith/gallery/dc809321-559b-497e-be65-05decbfa4b56.jpg	POF-2	GALLERY	1	2026-02-14 01:14:20.533836+00
49	11	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/pillars-of-faith/gallery/34a98295-1c2b-4335-b6f3-6cd2ad8e3f39.jpg	POF-4	GALLERY	3	2026-02-14 01:14:26.278067+00
50	11	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/pillars-of-faith/gallery/4cb9c9c8-d237-4bc6-b5dd-c5d84b5e1639.jpg	POF-5	GALLERY	4	2026-02-14 01:14:33.384728+00
46	11	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/pillars-of-faith/gallery/66d508de-67de-4e16-bce6-8afae4c2a980.jpg	POF-1	GALLERY	0	2026-02-14 01:14:18.1244+00
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, slug, title, hero_blurb, short_desc, long_desc, status, project_tags, card_image_url, main_image_url, display_order, created_at, updated_at, completed_at) FROM stdin;
5	for-the-ummah	For the Ummah	A well built for the Ummah. Uniting hearts through clean water.	A sustainable water well in Uganda serving families, schools, and the wider community through trusted partnerships.	Completed in 2021, the For the Ummah water well in Matuga, Wakiso, Uganda was established to ensure families and students have reliable access to clean and safe drinking water. In a region where water scarcity affects education, health, and daily life, this well provides long-term relief and stability.\n\nThrough the generous support of the Deham Foundation and Smile Project, this initiative became a reality, demonstrating the power of collaboration in humanitarian work. The well continues to serve as a vital resource for the entire community, supporting both immediate needs and future generations.\n\nMay this well remain a source of relief, unity, and ongoing blessings for years to come.	ACTIVE	Uganda, Clean Water, Water Well, Humanitarian Projects	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/for-the-ummah/card/07eefd12-2c29-448f-9a44-b5b4b6d0065c.jpg	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/for-the-ummah/main/70b1da0a-6d27-4946-98a0-d939a0183ae1.jpg	0	2026-02-08 00:49:57.193738+00	2026-02-09 22:55:29.668738+00	\N
9	streams-of-mercy	Streams of Mercy	Streams of mercy flowing where hope was once scarce.	Twenty-two water pumps installed across villages in Pakistan, delivering sustainable access to clean water.	In 2023, we expanded our water relief efforts by installing 22 water pumps across multiple villages in Pakistan. Supported by community donations and partner organizations, this initiative reached families who had long struggled without consistent access to clean drinking water.\n\nEach pump now serves as a lifeline, supporting health, sanitation, and daily survival. Beyond meeting immediate needs, these installations create sustainable water solutions that will benefit communities for years to come.\n\nEvery drop symbolizes mercy. Every pump reflects hope.	ACTIVE	Pakistan, Water Pumps, Clean Water, Aid, Relief	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/streams-of-mercy/card/013aee4e-ea17-4478-bf23-8484242f1b90.jpg	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/streams-of-mercy/main/7a2ba86c-8206-41b8-a07a-05605d30b77b.jpg	0	2026-02-14 00:35:44.216723+00	2026-02-14 00:35:44.216723+00	\N
4	water-changes-everything	Water Changes Everything 	Water changes everything: health, dignity, and the future of an entire community.	A community well built in Zanzibar, providing clean water to over 1,000 residents and honoring the memory of Brother Daarshaan.	In 2020, we completed a life-changing water project in Donge-Mchangani, Zanzibar, delivering clean and safe drinking water to more than 1,000 residents. For a community that once struggled daily for access to water, this well became a source of relief, dignity, and renewed hope.\n\nDedicated in the memory of Brother Daarshaan, this project stands as a reminder that even through hardship, lasting good can be created. Improved access to clean water has transformed daily life-supporting better health, hygiene, and overall well-being for families across the community.\n\nFrom our struggle to yours, this project reflects our mission of transforming pain into smiles. One well, one community, one life at a time.	COMPLETED	Clean Water, Zanaibar, Water Well, Humanitarian aid, Global relief	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/water-changes-everything/card/40615fab-68ce-4995-a4f0-39a019beb2e3.jpg	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/water-changes-everything/main/d768331f-6593-4c70-b035-532b34693749.jpg	1	2026-02-06 23:40:14.53721+00	2026-02-09 22:57:57.240355+00	2026-02-06 23:40:14.532593+00
6	wells-of-access-2	Wells of Access	Restoring dignity through access to life’s most essential resource.	A water well in Niger providing clean drinking water to 8 families who previously faced severe scarcity.	In 2021, we partnered with Muslim Hands Canada to install a water well in TP Birni, Boboye, located in Niger’s Dosso Region, an area deeply affected by water scarcity. This project now serves eight families, benefiting over 50 individuals who once struggled daily to secure clean water.\n\nBy restoring access to safe drinking water, this well has significantly improved health, sanitation, and daily living conditions. No longer burdened by long walks or unsafe sources, families can focus on education, livelihoods, and community growth.\n\nWater is life, and through collective effort, this project stands as proof that meaningful change begins with access.	COMPLETED	Clean Water, Niger, Humanitarian Relief, Community	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/wells-of-access/card/775b0f0a-0cbe-4a52-bc82-8d6ea2ed6df2.jpg	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/wells-of-access/main/27ecf8a3-80f7-482d-8eed-b8e0542899db.jpg	0	2026-02-13 23:52:21.128379+00	2026-02-13 23:54:08.863422+00	2026-02-13 23:52:21.101991+00
7	foundations-of-faith	Foundations of Faith	A masjid and water well built together to support both spiritual and physical well-being in Malawi.	A masjid and water well built together to support both spiritual and physical well-being in Malawi.	In 2021, we completed the construction of Masjid Uthman alongside a clean water well in Malawi, addressing both spiritual and physical needs of the local community. This project created a dedicated space for worship while ensuring reliable access to clean water for daily use.\n\nThe masjid serves as a center for prayer, learning, and unity, while the water well supports health, hygiene, and daily living. Together, they form a foundation that strengthens the community from within.\n\nThis project reflects our belief that true development nurtures both the soul and the body—faith in action, made tangible.	ACTIVE	Malawi, Mosque Project, Clean Water, Water Well	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/foundations-of-faith/card/25f839f4-3d14-4e7e-a98f-a99a412155a2.jpg	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/foundations-of-faith/main/09c9529a-b81d-4c5b-8706-a6a09e13ffce.jpg	0	2026-02-14 00:02:14.022795+00	2026-02-14 00:04:21.591654+00	\N
8	water-pumps-of-relief	Water Pumps of Relief	Every pump installed brings relief. Every drop restores hope.	Four deep water hand pumps installed in Pakistan to provide reliable clean water to families in need.	In 2022, we installed four deep water hand pumps across communities in Pakistan, reaching depths of up to 1,200 feet to access safe and sustainable water sources. These pumps now provide families with reliable clean water in regions where shortages are a daily reality.\n\nPartnering with MTJ Foundation Canada, this project addressed urgent needs while creating long-term solutions. Access to clean water reduces health risks, saves time, and restores dignity to everyday life.\n\nEach pump represents more than infrastructure, it represents ease, relief, and a step toward stability.	COMPLETED	Pakistan, Water Pumps, Clean Water, Water Crisis	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/water-pumps-of-relief/card/49a645dc-3164-49c1-94de-a2752d5dd82b.jpg	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/water-pumps-of-relief/main/aa7c9e38-42ab-4804-883e-b6bfbc7890a2.jpg	0	2026-02-14 00:28:02.75985+00	2026-02-14 00:28:02.75985+00	2026-02-14 00:28:02.748583+00
10	the-wells-of-purity	The Wells of Purity	Purity in water. Blessings that endure for generations.	Four hand pumps and a Wudu facility built in India as a lasting Sadaqah Jariyah initiative.	In 2023, we installed four hand pumps and a dedicated Wudu facility in Bihar, India, ensuring clean water access for both daily needs and religious purification. This project was established as Sadaqah Jariyah, allowing its benefits to continue long after completion.\n\nBy supporting hygiene, worship, and community well-being, the Wells of Purity serve as a lasting source of ease and spiritual reward. Every drop used carries ongoing blessings for those who gave and those who benefit.\n\nMay every prayer made with this water be accepted.	COMPLETED	India, Sadaqah Jariyah, Clean Water, Wells, Wudu Facility	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/the-wells-of-purity/card/07cbedbb-38d0-4c76-95fb-0aa40a55d16e.jpg	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/the-wells-of-purity/main/2220d924-cbf7-4d60-8976-7423bedcfde5.jpg	0	2026-02-14 01:05:48.443175+00	2026-02-14 01:05:48.443175+00	2026-02-14 01:05:48.43584+00
11	pillars-of-faith	Pillars of Faith	Where faith rises and water flows, pillars that sustain life.	A masjid and water well completed in Malawi, providing worship and clean water for generations.	Launched during Ramadan 2024 and completed in 2025, Pillars of Faith brought together two essentials of life, faith and water, in Malawi. This project delivered a masjid for prayer and a clean water well to serve the surrounding community.\n\nThrough the generosity of our supporters, this initiative now provides a sacred space for worship alongside a reliable source of clean water, meeting both spiritual and physical needs.\n\nDesigned to serve generations, this project stands as a lasting legacy of compassion, unity, and sustainable impact.	ACTIVE	Malawi, Mosque Project, Clean Water, Community, Support	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/pillars-of-faith/card/38b3d172-98c7-41a5-8359-3a4dd9cd2ddf.jpg	https://pub-e6f6ce1a35864db081dcde5afca3219f.r2.dev/projects/pillars-of-faith/main/175c3cb0-5dc2-4ed4-9b3e-492b5c15cda9.jpg	0	2026-02-14 01:14:14.109232+00	2026-02-14 01:21:20.042711+00	\N
\.


--
-- Data for Name: subscribers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscribers (id, email, status, verify_token, unsubscribe_token, created_at, verified_at, unsubscribed_at) FROM stdin;
3	azizsyed2016@gmail.com	ACTIVE	\N	fh1NzqxyP1PdOj6_Np20QPsEjCeDFvKKTrZ5Cv6b9sA	2026-02-08 00:41:06.820486+00	2026-02-08 00:41:34.566975+00	\N
4	azizsyed2022@gmail.com	ACTIVE	\N	qHdTC_fPLE9k3hBUijGZvNM9n0-JRpLxU5bXKMAnw30	2026-02-10 21:10:30.870779+00	2026-02-12 22:43:47.727085+00	\N
9	aziz.school.23@gmail.com	ACTIVE	\N	0uf65gUu1vTM-bfTTMiNdkCr9ZMc3glq9t2k0ZYnErQ	2026-02-12 23:15:44.428743+00	2026-02-12 23:27:34.5662+00	\N
11	samiullah-syed@hotmail.com	PENDING	edU2h4WAxWDZNGdAKlrV1TV0Tu3pm1lmZSa6qpwLv94	Tjtn5S1ryZ6GwnOJINg0E_FvCXMhc-aOuWEdGDJMNpY	2026-02-12 23:28:47.539401+00	\N	\N
12	shafiyasyed@hotmail.com	PENDING	sJm54ha63U_9eJuQpQlY7b759QfLbu9_KLiuv1XgF6E	WqcbXreDKQlvII6GowtGlsvcGiN-EtAhLJkNVNVQ_q0	2026-02-12 23:42:58.160206+00	\N	\N
\.


--
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 1, true);


--
-- Name: email_outbox_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.email_outbox_id_seq', 36, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 2, true);


--
-- Name: project_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_images_id_seq', 50, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 11, true);


--
-- Name: subscribers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subscribers_id_seq', 12, true);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_username_key UNIQUE (username);


--
-- Name: email_outbox email_outbox_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_outbox
    ADD CONSTRAINT email_outbox_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- Name: project_images project_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_images
    ADD CONSTRAINT project_images_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects projects_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_slug_key UNIQUE (slug);


--
-- Name: subscribers subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT subscribers_email_key UNIQUE (email);


--
-- Name: subscribers subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT subscribers_pkey PRIMARY KEY (id);


--
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);


--
-- Name: idx_admin_users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_users_username ON public.admin_users USING btree (username);


--
-- Name: idx_email_outbox_status_next; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email_outbox_status_next ON public.email_outbox USING btree (status, next_attempt_at);


--
-- Name: idx_events_event_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_event_date ON public.events USING btree (event_date);


--
-- Name: idx_events_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_status ON public.events USING btree (status);


--
-- Name: idx_project_images_project; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_project_images_project ON public.project_images USING btree (project_id);


--
-- Name: idx_projects_status_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_status_order ON public.projects USING btree (status, display_order, created_at);


--
-- Name: idx_subscribers_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscribers_status ON public.subscribers USING btree (status);


--
-- Name: idx_subscribers_unsub_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscribers_unsub_token ON public.subscribers USING btree (unsubscribe_token);


--
-- Name: idx_subscribers_verify_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscribers_verify_token ON public.subscribers USING btree (verify_token);


--
-- Name: project_images project_images_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_images
    ADD CONSTRAINT project_images_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict eKKPOkMACr99IXf2wUv4lGa45zXamwSn9QaV4l1EzjRGVXzPFuAiZ2gBFX9EYZQ

