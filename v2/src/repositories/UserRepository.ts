import { injectable } from 'inversify';
import { Database, IUser, UserSchema } from '../models/User';
import { logger } from '../utils/Logger';

export interface IUserRepository {
    findAll(): Promise<Array<IUser>>;
    create(user: IUser): Promise<IUser>;
    update(user: IUser): Promise<IUser>;
    find(id: string): Promise<IUser>;
}

@injectable()
export class UserRepository implements IUserRepository {
    public async findAll(): Promise<Array<IUser>> {
        const users = await Database.connect().then(() => Database.Users.find());
        return users.toArray();
    }

    public async create(user: IUser): Promise<IUser> {
        return await Database.connect().then(() => Database.Users.create(user));
    }

    public async update(user: IUser): Promise<IUser> {
        const stored: UserSchema | null = await Database.connect().then(() => {
            return Database.Users.findOne({ _id: user._id });
        });
        if (stored === null) { throw 'update: user not found.'; }
        // undefined isn't handled by mongo, so set to null
        if (user.email) { stored.email = user.email }
        if (user.password) { stored.password = user.password }
        const saved = await stored.save((err: Error, u: IUser | undefined) => {
            if (err) {
                logger.error(`Error updating user: ${err}`);
                throw err;
            }
            return u;
        });
        return saved;
    }

    public async find(id: string): Promise<IUser> {
        const user: IUser | null = await Database.connect().then(() => Database.Users.findOne(id));
        if (user === null) { throw 'find: user not found.'; }
        return user;
    }
}