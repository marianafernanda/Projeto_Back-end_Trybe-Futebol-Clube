import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  private _service: LeaderboardService;

  constructor(service: LeaderboardService) {
    this._service = service;
  }

  async createBoard(req: Request, res: Response) {
    const filter = req.originalUrl.replace('/leaderboard/', '');
    const board = await this._service.createBoard(filter);
    return res.status(200).json(board);
  }
}
