import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';

export default class MatchesService {
  private _model;
  private _teamModel;

  constructor() {
    this._model = MatchModel;
    this._teamModel = TeamModel;
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
}
