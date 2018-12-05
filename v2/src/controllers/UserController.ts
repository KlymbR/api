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

    private notFound(req: express.Request, res: express.Response) {
        const id = <string>req.params.id;
        res.status(404).json({
            error: 'not_found',
            error_description: `The user with the id '${id}' doesn't exist`
        });
    }

    public register(app: express.Application): void {
        app.route('/users/')
            .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const users = await this.userService.getUsers().catch(err => next(err));
                if (users) { res.status(200).json(users); }
            })
            .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const createdUser = await this.userService.createUser(<IUser>req.body).catch(err => next(err));
                if (createdUser) { res.status(201).json(createdUser); }
            })
        app.route('/users/:id')
            .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const user = await this.userService.getUser(<string>req.params.id).catch((err) => {
                    if (err === 404) { this.notFound(req, res); } else { next(err); }
                });
                if (user) { res.status(200).json(user); }
            })
            .patch(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                req.body._id = <string>req.params.id;
                const updatedUser = await this.userService.updateUser(<IUser>req.body).catch((err) => {
                    if (err === 404) { this.notFound(req, res); } else { next(err); }
                });
                if (updatedUser) { res.status(200).json(updatedUser); }
            })
            .delete(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const removedUser = await this.userService.removeUser(<string>req.params.id).catch((err) => {
                    if (err === 404) { this.notFound(req, res); } else { next(err); }
                });
                if (removedUser) { res.status(200).end(); }
            })
        app.route('/users/authenticate')
            .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const user = await this.userService.authenticateUser(<string>req.body.email, <string>req.body.password).catch((err) => {
                    if (err === 404) { this.notFound(req, res); } else { next(err); }
                })
                if (user) {
                    res.cookie('authToken', user.token);
                    res.status(200).json(user);
                }
            });
    }
}