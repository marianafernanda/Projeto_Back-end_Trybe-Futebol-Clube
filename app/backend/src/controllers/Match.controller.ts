import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';
import TeamsService from '../services/TeamsService';

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

  static async findTeamsIds() {
    const teamsService = new TeamsService();
    const teams = await teamsService.getAll();
    const teamsIds = teams.map((team) => team.id);
    return teamsIds;
  }

  async create(req: Request, res: Response) {
    const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = req.body;

    if (homeTeam === awayTeam) {
      return res.status(422).json({
        message: 'It is not possible to create a match with two equal teams' });
    }

    const teamsIds = await MatchesController.findTeamsIds();

    if (!teamsIds.includes(homeTeam) || !teamsIds.includes(awayTeam)) {
      return res.status(404).json({ message: 'There is no team with such id!' });
    }

    const createdMatch = await this._service.create({
      homeTeam, homeTeamGoals, awayTeam, awayTeamGoals,
    });

    return res.status(201).json(createdMatch);
  }

  async updateProgress(req: Request, res: Response) {
    const { id } = req.params;

    await this._service.updateProgress(id);

    return res.status(200).json({ message: 'Finished' });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;

    await this._service.update(id, homeTeamGoals, awayTeamGoals);

    return res.status(200).json({ message: 'GOOOOOOOOOOL' });
  }
}
