import express, { Application } from 'express';
import participantRoute from './routes/Participant.route';
import votesRoute from './routes/Votes.route';
import passport from 'passport';
import cookieSession from 'cookie-session';
import expressSession from 'express-session';
import './passport';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoute from './routes/Auth.route';
import verivyAuth from './middlewares/Auth.middleware';
dotenv.config();

const app: Application = express();

app.use(express.json());

app.use(
  cookieSession({
    name: 'session',
    keys: [String(process.env.SESSION_KEY)],
    maxAge: 24 * 60 * 60 * 100,
    sameSite: `${process.env.NODE_ENV === 'production' ? 'none' : 'lax'}`,
    secure: process.env.NODE_ENV === 'production',
  })
);

// app.use(
//   expressSession({
//     name: 'session',
//     secret: String(process.env.SESSION_KEY),
//     saveUninitialized: false,
//     resave: false,
//     cookie: {
//       maxAge: 24 * 60 * 60 * 100,
//       // secure: false // development mode
//       secure: process.env.NODE_ENV === 'production', // production mode
//     },
//   })
// );

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoute);
app.use('/api/votes', verivyAuth, votesRoute);
app.use('/api/participant', verivyAuth, participantRoute);

app.listen(3000, () => {
  console.log('Server up and running');
});
