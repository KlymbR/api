import { injectable } from 'inversify';
import { Database, IRoom, RoomSchema } from '../models/Room';
import { logger } from '../utils/Logger';
import * as bcrypt from 'bcrypt';

export interface IRoomRepository {
    findAll(): Promise<Array<IRoom>>;
    create(room: IRoom): Promise<IRoom>;
    update(room: IRoom): Promise<IRoom>;
    find(id: string): Promise<IRoom>;
    remove(id: string): Promise<number>;
}

@injectable()
export class RoomRepository implements IRoomRepository {
    public async findAll(): Promise<Array<IRoom>> {
        const rooms = await Database.connect().then(() => Database.Rooms.find());
        return rooms.toArray();
    }

    public async create(room: IRoom): Promise<IRoom> {
        return await Database.connect().then(() => Database.Rooms.create(room));
    }

    public async update(room: IRoom): Promise<IRoom> {
        const stored: RoomSchema | null = await Database.connect().then(() => {
            return Database.Rooms.findOne({ _id: room._id });
        });
        if (stored === null) { throw 404; }
        // undefined isn't handled by mongo, so set to null
        if (room.title) { stored.title = room.title }
        if (room.latitude) { stored.latitude = room.latitude }
        if (room.longitude) { stored.longitude = room.longitude }
        const saved = await stored.save((err: Error, u: IRoom | undefined) => {
            if (err) {
                logger.error(`Error updating room: ${err}`);
                throw err;
            }
            return u;
        });
        return saved;
    }

    public async find(id: string): Promise<IRoom> {
        const room: IRoom | null = await Database.connect().then(() => Database.Rooms.findOne(id));
        if (room === null) { throw 404; }
        return room;
    }

    public async remove(id: string): Promise<number> {
        const length = await Database.connect().then(() => Database.Rooms.remove({ _id: id }));
        if (length === 0) { throw 404; }
        return length;
    }
}