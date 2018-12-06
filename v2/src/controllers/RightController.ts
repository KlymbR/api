import * as express from 'express';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { RightService } from '../services/RightService';
import { IRights } from '../models/Rights';
import { IRegistrableController } from './IRegistrableController';

@injectable()
export class RightController implements IRegistrableController {
    private rightService: RightService;

    constructor(@inject(TYPES.RightService) rightService: RightService) {
        this.rightService = rightService;
    }

    private notFound(req: express.Request, res: express.Response) {
        res.status(404).json({
            error: 'not_found',
            error_description: `Right not found`
        });
    }

    public register(app: express.Application): void {
        app.route('/rights/')
            .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                console.log("try to create");
                const createRights = await this.rightService.createRights(<IRights>req.body).catch(err => next(err));
                if (createRights) { res.status(201).json(createRights); }
            })
        app.route('/rights/:id')
            .delete(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const removeRights = await this.rightService.removeRights(<string>req.params.id).catch(err => {
                    if (err === 404) { this.notFound(req, res); } else { next(err); }
                });
                if (removeRights) { res.status(200).end(); }
            })
        app.route('/rights/:email')
            .patch(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                req.body.email = req.params.email;
                const updateRights = await this.rightService.updateRights(<IRights>req.body).catch(err => {
                    if (err === 404) { this.notFound(req, res); } else { next(err); }
                });
                if (updateRights) { res.status(200).json(updateRights); }
            })
            .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const rights = await this.rightService.getRights(req.body.email).catch(err => {
                    if (err === 404) { this.notFound(req, res); } else { next(err) }
                });
                if (rights) { res.status(200).json(rights); }
            })
    }
}