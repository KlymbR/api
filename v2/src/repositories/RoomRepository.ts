import { injectable } from 'inversify';
import { Database, IRoom, RoomSchema, IPath } from '../models/Room';
import { logger } from '../utils/Logger';

var mongoObjectId = function () {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};

export interface IRoomRepository {
    findAllRoomPaths(idroom: string): Promise<Array<IPath>>;
    findAll(): Promise<Array<IRoom>>;
    create(room: IRoom): Promise<IRoom>;
    createPath(idroom: string, path: IPath): Promise<IPath>;
    update(room: IRoom): Promise<IRoom>;
    updatePath(idroom: string, idpath: string, path: IPath);
    find(id: string): Promise<IRoom>;
    findPath(idroom: string, idpath: string): Promise<IPath>;
    remove(id: string): Promise<number>;
}

@injectable()
export class RoomRepository implements IRoomRepository {
    public async findAllRoomPaths(idroom: string): Promise<Array<IPath>> {
        const room: IRoom | null = await Database.connect().then(() => Database.Rooms.findOne(idroom));
        if (room === null) { throw 404; }
        return room.paths;
    }

    public async findAll(): Promise<Array<IRoom>> {
        const rooms = await Database.connect().then(() => Database.Rooms.find());
        return rooms.toArray();
    }

    public async createPath(idroom: string, path: IPath): Promise<IPath> {
        let room: RoomSchema | null = await Database.connect().then(() => Database.Rooms.findOne(idroom));
        if (room === null) { throw 404; }
        if (!path.hasOwnProperty('_id')) { path._id = mongoObjectId(); }
        if (!path.hasOwnProperty('average')) { path.average = 0; }
        if (!path.hasOwnProperty('best')) {
            path.best.firstname = 'None';
            path.best.id = 'None';
            path.best.lastname = 'None';
            path.best.time = 1000000;
        }
        if (!path.hasOwnProperty('name')) {path.name = 'New path'};
        room.paths.push(path);
        room.save();
        return path;
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
        if (room.paths) { stored.paths = room.paths }
        const saved = await stored.save((err: Error, u: IRoom | undefined) => {
            if (err) {
                logger.error(`Error updating room: ${err}`);
                throw err;
            }
            return u;
        });
        return saved;
    }

    public async updatePath(idroom: string, idpath: string, path: IPath): Promise<IPath> {
        const room: RoomSchema | null = await Database.connect().then(() => Database.Rooms.findOne(idroom));
        if (room === null) { throw 404; }
        let stored = null;
        for (let i in room.paths) { if (String(room.paths[i]._id) === idpath) {stored = room.paths[i]} }
        if (stored === null) { throw 404; }
        // undefined isn't handled by mongo, so set to null
	if (path.name) { stored.name = path.name }
	if ('free' in path) { stored.free = path.free }
        if (path.difficulty) { stored.difficulty = path.difficulty }
        if (path.grips) { stored.grips = path.grips }
        if (path.average) { stored.average = path.average }
        if (path.color) { stored.color = path.color }
        if (path.best) {
            if (path.best.time) { stored.best.time = path.best.time }
            if (path.best.firstname) { stored.best.firstname = path.best.firstname }
            if (path.best.lastname) { stored.best.lastname = path.best.lastname }
            if (path.best.id) { stored.best.id = path.best.id }
        }
        for (let i in room.paths) { if (String(room.paths[i]._id) === idpath) {room.paths[i] = stored} }
        this.update(room)
        return stored;
    }

    public async find(id: string): Promise<IRoom> {
        const room: IRoom | null = await Database.connect().then(() => Database.Rooms.findOne(id));
        if (room === null) { throw 404; }
        return room;
    }

    public async findPath(idroom: string, idpath: string): Promise<IPath> {
        const room: IRoom | null = await Database.connect().then(() => Database.Rooms.findOne(idroom));
        if (room === null) { throw 404; }
        let path = null;
        for (let i in room.paths) { if (String(room.paths[i]._id) === idpath) {path = room.paths[i]} }
        console.log(path)
        if (path === null) { throw 404; }
        return path;
    }

    public async remove(id: string): Promise<number> {
        const length = await Database.connect().then(() => Database.Rooms.remove({ _id: id }));
        if (length === 0) { throw 404; }
        return length;
    }

    public async removePath(idroom: string, idpath: string): Promise<number> {
        const room: RoomSchema | null = await Database.connect().then(() => Database.Rooms.findOne(idroom));
        if (room === null) { throw 404; }
        let path = null;
        for (let i in room.paths) { if (String(room.paths[i]._id) === idpath) {path = room.paths[i]} }
        if (path === null) { throw 404; }
        Database.Rooms.update(
            {'_id': idroom},
            { $pull: { paths : { _id: idpath } } });
        return 200;
    }
}
