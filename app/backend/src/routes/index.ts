import * as express from 'express';
import validateLogin from '../auth/validateLogin';
import LoginController from '../controllers/Login.controller';
import validateToken from '../auth/validateToken';

const app = express();

app.use(express.json());

app.post('/login', validateLogin, LoginController.login);
app.get('/login/validate', validateToken, LoginController.loginValidate);

export default app;
