import * as express from 'express';
import validateLogin from '../auth/validateLogin';
import LoginController from '../controllers/Login.controller';
import TeamsController from '../controllers/Teams.controller';
import MatchesController from '../controllers/Match.controller';
import LeaderboardController from '../controllers/Leaderboard.controller';
import TeamsService from '../services/TeamsService';
import MatchesService from '../services/MatchesService';
import LeaderboardService from '../services/LeaderboardService';
import validateToken from '../auth/validateToken';

const app = express();

app.use(express.json());

const teamsService = new TeamsService();
const teamsController = new TeamsController(teamsService);
const matchesService = new MatchesService();
const matchesController = new MatchesController(matchesService);
const leaderboardService = new LeaderboardService();
const leaderboardController = new LeaderboardController(leaderboardService);

app.post('/login', validateLogin, LoginController.login);
app.get('/login/validate', validateToken, LoginController.loginValidate);
app.get('/teams', (req, res) => teamsController.getAll(req, res));
app.get('/teams/:id', (req, res) => teamsController.getById(req, res));
app.get('/matches', (req, res) => matchesController.getAll(req, res));
app.get('/leaderboard/home', (req, res) => leaderboardController.createBoard(req, res));
app.get('/leaderboard/away', (req, res) => leaderboardController.createBoard(req, res));
app.get('/leaderboard', (req, res) => leaderboardController.createBoard(req, res));
app.post('/matches', validateToken, (req, res) => matchesController.create(req, res));
app.patch('/matches/:id/finish', (req, res) => matchesController.updateProgress(req, res));
app.patch('/matches/:id', (req, res) => matchesController.update(req, res));

export default app;
