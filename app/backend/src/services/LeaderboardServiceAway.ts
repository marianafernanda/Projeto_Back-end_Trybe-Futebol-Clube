import TeamModel from '../database/models/TeamModel';
import MatchModel from '../database/models/MatchModel';
import Leaderboard from '../interfaces/leaderboard.interface';
import Match from '../interfaces/match.interface';

export default class LeaderboardServiceAway {
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

  async calculateBoardForAway(match: Match, indexAwayTeam: number) {
    const awayTeam = this.board[indexAwayTeam];

    if (match.awayTeamGoals > match.homeTeamGoals) {
      awayTeam.totalPoints += 3;
      awayTeam.totalVictories += 1;
    } else if (match.awayTeamGoals === match.homeTeamGoals) {
      awayTeam.totalDraws += 1;
      awayTeam.totalPoints += 1;
    } else {
      awayTeam.totalLosses += 1;
    }

    awayTeam.totalGames += 1;
    awayTeam.goalsFavor += match.awayTeamGoals;
    awayTeam.goalsOwn += match.homeTeamGoals;
    awayTeam.goalsBalance = awayTeam.goalsFavor - awayTeam.goalsOwn;
    const efficiency = ((awayTeam.totalPoints / (awayTeam.totalGames * 3)) * 100);
    awayTeam.efficiency = efficiency.toFixed(2);
  }

  async findMatchForAway() {
    this.match.forEach((match) => {
      const indexAwayTeam = this.board.findIndex((team) => team.name === match.teamAway?.teamName);

      if (indexAwayTeam >= 0) {
        this.calculateBoardForAway(match, indexAwayTeam);
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
    await this.findMatchForAway();
    this.sortBoard();
    return this.board;
  }
}
