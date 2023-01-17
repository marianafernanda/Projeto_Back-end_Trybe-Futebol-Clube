import TeamModel from '../database/models/TeamModel';
import MatchModel from '../database/models/MatchModel';
import Leaderboard from '../interfaces/leaderboard.interface';
import Match from '../interfaces/match.interface';

export default class LeaderboardServiceHome {
  private _teamModel;
  private _matchModel;
  public board: Leaderboard[];
  public match: Match[];

  constructor() {
    this._teamModel = TeamModel;
    this._matchModel = MatchModel;
    this.board = [];
    this.match = [];
  }

  async getTeamsNames() {
    const teams = await this._teamModel.findAll();

    this.board = teams.map((team) => ({
      name: team.teamName,
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: '',
    }));
  }

  async getFinishedMatches() {
    const matches = await this._matchModel.findAll({
      where: { inProgress: false },
      include: { all: true, attributes: { exclude: ['id'] } },
    });
    this.match = matches;
  }

  async calculateBoardForHome(match: Match, indexHomeTeam: number) {
    const homeTeam = this.board[indexHomeTeam];

    if (match.homeTeamGoals > match.awayTeamGoals) {
      homeTeam.totalPoints += 3;
      homeTeam.totalVictories += 1;
    } else if (match.homeTeamGoals === match.awayTeamGoals) {
      homeTeam.totalDraws += 1;
      homeTeam.totalPoints += 1;
    } else {
      homeTeam.totalLosses += 1;
    }

    homeTeam.totalGames += 1;
    homeTeam.goalsFavor += match.homeTeamGoals;
    homeTeam.goalsOwn += match.awayTeamGoals;
    homeTeam.goalsBalance = homeTeam.goalsFavor - homeTeam.goalsOwn;
    const efficiency = ((homeTeam.totalPoints / (homeTeam.totalGames * 3)) * 100);
    homeTeam.efficiency = efficiency.toFixed(2);
  }

  async findMatchForHome() {
    this.match.forEach((match) => {
      const indexHomeTeam = this.board.findIndex((team) => team.name === match.teamHome?.teamName);

      if (indexHomeTeam >= 0) {
        this.calculateBoardForHome(match, indexHomeTeam);
      }
    });
  }

  sortBoard() {
    const GoalsOwn = this.board.sort((a, b) => b.goalsOwn - a.goalsOwn);
    const GoalsFavor = GoalsOwn.sort((a, b) => b.goalsFavor - a.goalsFavor);
    const GoalsBalance = GoalsFavor.sort((a, b) => b.goalsBalance - a.goalsBalance);
    const totalVictories = GoalsBalance.sort((a, b) => b.totalVictories - a.totalVictories);
    const totalPoints = totalVictories.sort((a, b) => b.totalPoints - a.totalPoints);
    this.board = totalPoints;
  }

  async createBoard() {
    await this.getTeamsNames();
    await this.getFinishedMatches();
    await this.findMatchForHome();
    this.sortBoard();
    return this.board;
  }
}
