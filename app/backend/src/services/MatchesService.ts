import MatchModel from '../database/models/MatchModel';
import Match from '../interfaces/match.interface';

export default class MatchesService {
  private _model;

  constructor() {
    this._model = MatchModel;
  }

  async getAll() {
    const matches = await this._model.findAll({
      include: { all: true, attributes: { exclude: ['id'] } },
    });
    return matches;
  }

  async getByProgress(progress: boolean) {
    const matches = await this._model.findAll({
      where: { inProgress: progress },
      include: { all: true, attributes: { exclude: ['id'] } },
    });
    return matches;
  }

  async create(match: Match) {
    const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = match;

    const createdMatch = await this._model.create({
      homeTeam, homeTeamGoals, awayTeam, awayTeamGoals, inProgress: 1,
    });
    return createdMatch;
  }

  async updateProgress(id: string) {
    await this._model.update({ inProgress: 0 }, { where: { id } });
  }
}
//
