import { Request, Response } from 'express';
import TeamsService from '../services/TeamsService';

export default class TeamsController {
  private _service: TeamsService;

  constructor(service: TeamsService) {
    this._service = service;
  }

  async getAll(_req: Request, res: Response) {
    const teams = await this._service.getAll();

    return res.status(200).json(teams);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    const team = await this._service.getById(id);

    return res.status(200).json(team);
  }
}
