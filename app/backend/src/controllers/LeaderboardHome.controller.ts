import { Request, Response } from 'express';
import LeaderboardServiceHome from '../services/LeaderboardServiceHome';

export default class LeaderboardControllerHome {
  private _service: LeaderboardServiceHome;

  constructor(service: LeaderboardServiceHome) {
    this._service = service;
  }

  async createBoard(_req: Request, res: Response) {
    const board = await this._service.createBoard();
    return res.status(200).json(board);
  }
}
