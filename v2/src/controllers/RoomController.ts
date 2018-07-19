import * as express from 'express';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { RoomService } from '../services/RoomService';
import { IRoom } from '../models/Room';
import { IRegistrableController } from './IRegistrableController';

@injectable()
export class RoomController implements IRegistrableController {
    private roomService: RoomService;

    constructor(@inject(TYPES.RoomService) roomService: RoomService) {
        this.roomService = roomService;
    }

    private notFound(req: express.Request, res: express.Response) {
        const id = <string>req.params.id;
        res.status(404).json({
            error: 'not_found',
            error_description: `The room with the id '${id}' doesn't exist`
        });
    }

    public register(app: express.Application): void {
        app.route('/v2/rooms/')
            .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const rooms = await this.roomService.getRooms().catch(err => next(err));
                if (rooms) { res.status(200).json(rooms); }
            })
            .post(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const createdRoom = await this.roomService.createRoom(<IRoom>req.body).catch(err => next(err));
                if (createdRoom) { res.status(201).json(createdRoom); }
            })
        app.route('/v2/rooms/:id')
            .get(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const room = await this.roomService.getRoom(<string>req.params.id).catch((err) => {
                    if (err === 404) { this.notFound(req, res); } else { next(err); }
                });
                if (room) { res.status(200).json(room); }
            })
            .patch(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                req.body._id = <string>req.params.id;
                const updatedRoom = await this.roomService.updateRoom(<IRoom>req.body).catch((err) => {
                    if (err === 404) { this.notFound(req, res); } else { next(err); }
                });
                if (updatedRoom) { res.status(200).json(updatedRoom); }
            })
            .delete(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const removedRoom = await this.roomService.removeRoom(<string>req.params.id).catch((err) => {
                    if (err === 404) { this.notFound(req, res); } else { next(err); }
                });
                if (removedRoom) { res.status(200).end(); }
            });
    }
}