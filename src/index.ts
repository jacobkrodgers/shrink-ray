import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import { notImplemented } from './controllers/NotImplementedController';

const app: Express = express();
app.use(express.json());
const { PORT } = process.env;

app.get('/api/users/:targetUserId/links', notImplemented);
app.post('/api/links', notImplemented);
app.delete('/api/users/:targetUserId/links/:targetLinkId', notImplemented);
app.get('/:targetLinkId', notImplemented)
app.post('/api/users', notImplemented);
app.post('/api/login', notImplemented);

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});
