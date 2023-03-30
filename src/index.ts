import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { notImplemented } from './controllers/NotImplementedController';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;
const SQLiteStore = connectSqlite3(session);

app.use(
    session({
        store: new SQLiteStore({ db: 'sessions.sqlite', }),
        secret: COOKIE_SECRET,
        cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours 
        name: 'session',
        resave: false,
        saveUninitialized: false,
    })
);

app.use(express.json());


app.get('/api/users/:targetUserId/links', notImplemented);
app.post('/api/links', notImplemented);
app.delete('/api/users/:targetUserId/links/:targetLinkId', notImplemented);
app.get('/:targetLinkId', notImplemented)
app.post('/api/users', notImplemented);
app.post('/api/login', notImplemented);

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});
