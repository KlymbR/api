import * as express from 'express';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { PathService } from '../services/PathService';
import { IPath } from '../models/Path';
import { IRegistrableController } from './IRegistrableController';

@injectable()
export class PathController implements IRegistrableController {
    private pathService: PathService;

    constructor(@inject(TYPES.PathService) pathService: PathService) {
        this.pathService = pathService;
    }

    private notFound(req: express.Request, res: express.Response) {
        const id = <string>req.params.id;
        res.status(404).json({
            error: 'not_found',
            error_description: `The path with the id '${id}' doesn't exist`
        });
    }

    public register(app: express.Application): void {
        app.route('/v2/paths/')
            .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const paths = await this.pathService.getPaths().catch(err => next(err));
                if (paths) { res.status(200).json(paths); }
            })
            .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const createdPath = await this.pathService.createPath(<IPath>req.body).catch(err => next(err));
                if (createdPath) { res.status(201).json(createdPath); }
            })
        app.route('/v2/paths/:id')
            .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const path = await this.pathService.getPath(<string>req.params.id).catch((err) => {
                    if (err === 404) { this.notFound(req, res); } else { next(err); }
                });
                if (path) { res.status(200).json(path); }
            })
            .patch(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                req.body._id = <string>req.params.id;
                const updatedPath = await this.pathService.updatePath(<IPath>req.body).catch((err) => {
                    if (err === 404) { this.notFound(req, res); } else { next(err); }
                });
                if (updatedPath) { res.status(200).json(updatedPath); }
            })
            .delete(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const removedPath = await this.pathService.removePath(<string>req.params.id).catch((err) => {
                    if (err === 404) { this.notFound(req, res); } else { next(err); }
                });
                if (removedPath) { res.status(200).end(); }
            });
    }
}