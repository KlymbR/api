import * as express from 'express';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { UserService } from '../services/UserService';
import { IUser } from '../models/User';
import { IRegistrableController } from './IRegistrableController';

@injectable()
export class UserController implements IRegistrableController {
    private userService: UserService;

    constructor(@inject(TYPES.UserService) userService: UserService) {
        this.userService = userService;
    }

    public register(app: express.Application): void {
        app.route('/v2/users/')
        .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const users = await this.userService.getUsers().catch(err => next(err));
            if (users) { res.json(users); }
        })
        .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const createdUser = await this.userService.createUser(req.body).catch(err => next(err));
            if (createdUser) { res.json(createdUser); }
        })
        app.route('/v2/users/:id')
        .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const users = await this.userService.getUser(<string> req.params.id).catch(err => next(err));
            if (users) { res.json(users); }
        })
        .patch(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const updatedUser = await this.userService.updateUser(req.body).catch(err => next(err));
            if (updatedUser) { res.json(updatedUser); }
        })
    }
}