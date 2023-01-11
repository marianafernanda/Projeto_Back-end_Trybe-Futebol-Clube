import * as express from 'express';
import validateLogin from '../auth/validateLogin';
import LoginController from '../controllers/Login.controller';
import TeamsController from '../controllers/Teams.controller';
import MatchesController from '../controllers/Match.controller';
import TeamsService from '../services/TeamsService';
import MatchesService from '../services/MatchesService';
import validateToken from '../auth/validateToken';

const app = express();

app.use(express.json());

const teamsService = new TeamsService();
const teamsController = new TeamsController(teamsService);
const matchesService = new MatchesService();
const matchesController = new MatchesController(matchesService);

app.post('/login', validateLogin, LoginController.login);
app.get('/login/validate', validateToken, LoginController.loginValidate);
app.get('/teams', (req, res) => teamsController.getAll(req, res));
app.get('/teams/:id', (req, res) => teamsController.getById(req, res));
app.get('/matches', (req, res) => matchesController.getAll(req, res));
app.post('/matches', validateToken, (req, res) => matchesController.create(req, res));
app.patch('/matches/:id/finish', (req, res) => matchesController.updateProgress(req, res));

export default app;
