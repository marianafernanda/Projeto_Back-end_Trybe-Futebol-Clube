import * as express from 'express';
import validateLogin from '../auth/validateLogin';
import LoginController from '../controllers/Login.controller';

const app = express();

app.use(express.json());

app.post('/login', validateLogin, LoginController.login);

export default app;
