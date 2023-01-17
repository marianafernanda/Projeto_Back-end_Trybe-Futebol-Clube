import { Request, Response } from 'express';
import LeaderboardServiceAway from '../services/LeaderboardServiceAway';

export default class LeaderboardControllerAway {
  private _service: LeaderboardServiceAway;

  constructor(service: LeaderboardServiceAway) {
    this._service = service;
  }

  async createBoard(_req: Request, res: Response) {
    const board = await this._service.createBoard();
    return res.status(200).json(board);
  }
}
