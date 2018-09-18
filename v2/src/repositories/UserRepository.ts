import { injectable } from 'inversify';
import { Database, IUser, UserSchema } from '../models/User';
import { logger } from '../utils/Logger';
import * as bcrypt from 'bcrypt';

export interface IUserRepository {
    findAll(): Promise<Array<IUser>>;
    create(user: IUser): Promise<IUser>;
    update(user: IUser): Promise<IUser>;
    find(id: string): Promise<IUser>;
    remove(id: string): Promise<number>;
}

@injectable()
export class UserRepository implements IUserRepository {
    public async findAll(): Promise<Array<IUser>> {
        const users = await Database.connect().then(() => Database.Users.find());
        return users.toArray();
    }

    public async create(user: IUser): Promise<IUser> {
        user.created = new Date;
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
        return await Database.connect().then(() => Database.Users.create(user));
    }

    public async update(user: IUser): Promise<IUser> {
        const stored: UserSchema | null = await Database.connect().then(() => {
            return Database.Users.findOne({ _id: user._id });
        });
        if (stored === null) { throw 404; }
        // undefined isn't handled by mongo, so set to null
        if (user.email) { stored.email = user.email }
        if (user.phone) { stored.phone = user.phone }
        if (user.firstname) { stored.firstname = user.firstname }
        if (user.lastname) { stored.lastname = user.lastname }
        if (user.address) {
            if (user.address.number) { stored.address.number = user.address.number }
            if (user.address.street) { stored.address.street = user.address.street }
            if (user.address.postalcode) { stored.address.postalcode = user.address.postalcode }
            if (user.address.city) { stored.address.city = user.address.city }
        }
        if (user.licenses) { stored.licenses = user.licenses }
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
        if (user === null) { throw 404; }
        return user;
    }

    public async findByEmail(email: string): Promise<IUser> {
        const user: IUser | null = await Database.connect().then(() => Database.Users.findOne({email: email}));
        if (user === null) { throw 404; }
        return user;
    }

    public async remove(id: string): Promise<number> {
        const length = await Database.connect().then(() => Database.Users.remove({ _id: id }));
        if (length === 0) { throw 404; }
        return length;
    }
}