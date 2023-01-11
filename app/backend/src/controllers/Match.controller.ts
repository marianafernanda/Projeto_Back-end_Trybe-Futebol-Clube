import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  private _service: MatchesService;

  constructor(service: MatchesService) {
    this._service = service;
  }

  async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;

    if (inProgress) {
      const progress = inProgress === 'true';
      const matches = await this._service.getByProgress(progress);
      return res.status(200).json(matches);
    }
    const matches = await this._service.getAll();
    return res.status(200).json(matches);
  }
}