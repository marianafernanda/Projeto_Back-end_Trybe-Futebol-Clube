import TeamModel from '../database/models/TeamModel';

export default class TeamsService {
  private _model;

  constructor() {
    this._model = TeamModel;
  }

  async getAll() {
    const teams = await this._model.findAll();
    return teams;
  }

  async getById(id: string) {
    const team = await this._model.findOne({ where: { id } });
    return team;
  }
}
