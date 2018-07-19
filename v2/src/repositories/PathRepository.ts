import { injectable } from 'inversify';
import { Database, IPath, PathSchema } from '../models/Path';
import { logger } from '../utils/Logger';
import * as bcrypt from 'bcrypt';

export interface IPathRepository {
    findAll(): Promise<Array<IPath>>;
    create(path: IPath): Promise<IPath>;
    update(path: IPath): Promise<IPath>;
    find(id: string): Promise<IPath>;
    remove(id: string): Promise<number>;
}

@injectable()
export class PathRepository implements IPathRepository {
    public async findAll(): Promise<Array<IPath>> {
        const paths = await Database.connect().then(() => Database.Paths.find());
        return paths.toArray();
    }

    public async create(path: IPath): Promise<IPath> {
        return await Database.connect().then(() => Database.Paths.create(path));
    }

    public async update(path: IPath): Promise<IPath> {
        const stored: PathSchema | null = await Database.connect().then(() => {
            return Database.Paths.findOne({ _id: path._id });
        });
        if (stored === null) { throw 404; }
        // undefined isn't handled by mongo, so set to null
        if (path.free) { stored.email = path.free }
        if (path.difficulty) { stored.phone = path.difficulty }
        if (path.average) { stored.firstname = path.average }
        if (path.grips) { stored.grips = path.grips }
        if (path.average) { stored.firstname = path.average }
        if (path.best) {
            if (path.best.time) { stored.best.time = path.best.time }
            if (path.best.firstname) { stored.best.firstname = path.best.firstname }
            if (path.best.lastname) { stored.best.lastname = path.best.lastname }
        }
        const saved = await stored.save((err: Error, u: IPath | undefined) => {
            if (err) {
                logger.error(`Error updating path: ${err}`);
                throw err;
            }
            return u;
        });
        return saved;
    }

    public async find(id: string): Promise<IPath> {
        const path: IPath | null = await Database.connect().then(() => Database.Paths.findOne(id));
        if (path === null) { throw 404; }
        return path;
    }

    public async remove(id: string): Promise<number> {
        const length = await Database.connect().then(() => Database.Paths.remove({ _id: id }));
        if (length === 0) { throw 404; }
        return length;
    }
}