import * as express from 'express';
import validateLogin from '../auth/validateLogin';
import LoginController from '../controllers/Login.controller';
import TeamsController from '../controllers/Teams.controller';
import TeamsService from '../services/TeamsService';
import validateToken from '../auth/validateToken';

const app = express();

app.use(express.json());

const teamsService = new TeamsService();
const teamsController = new TeamsController(teamsService);

app.post('/login', validateLogin, LoginController.login);
app.get('/login/validate', validateToken, LoginController.loginValidate);
app.get('/teams', (req, res) => teamsController.getAll(req, res));
app.get('/teams/:id', (req, res) => teamsController.getById(req, res));

export default app;
