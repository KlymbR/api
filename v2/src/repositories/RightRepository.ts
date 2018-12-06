import { injectable } from 'inversify';
import { Database, IRights, RightSchema } from '../models/Rights';
import { logger } from '../utils/Logger';
import * as bcrypt from 'bcrypt';

export interface IRightRepository {
    create(rights: IRights): Promise<IRights>;
    update(rights: IRights): Promise<IRights>;
    find(email: string): Promise<IRights>;
    remove(id: string): Promise<number>;
}

@injectable()
export class RightRepository implements IRightRepository {
    public async create(rights: IRights): Promise<IRights> {
        return await Database.connect().then(() => Database.Rights.create(rights));
    }

    public async update(rights: IRights): Promise<IRights> {
        const stored: RightSchema | null = await Database.connect().then(() => { return Database.Rights.findOne({ email: rights.email }) })
        if (stored === null) { throw 404; }
        if (rights.room) { stored.room = rights.room }
        if (rights.path) { stored.path = rights.path }
        if (rights.administration) { stored.administration = rights.administration }
        const saved = await stored.save((err: Error, r: IRights | undefined) => {
            if (err) {
                logger.error(`Error updating rights: ${err}`);
                return err;
            }
            return r;
        });
        return saved;
    }

    public async find(email: string): Promise<IRights> {
        console.log(email);
        const rights: IRights | null = await Database.connect().then(() => Database.Rights.findOne({ email: email }));
        console.log(rights);
        if (rights === null) { throw 404; }
        return rights;
    }

    public async remove(id: string): Promise<number> {
        const length = await Database.connect().then(() => Database.Rights.remove({ _id: id }));
        if (length === 0) { throw 404; }
        return length;
    }
}