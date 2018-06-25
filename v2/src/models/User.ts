import {
    Core,
    Model,
    Instance,
    Collection,
    Index,
    Property,
    ObjectID
} from 'iridium';

export interface IUser {
    _id?: string;
    email: string;
    password: string;
}

@Index({ name: 1 })
@Collection('users')
export class UserSchema extends Instance<IUser, UserSchema> implements IUser {
    @ObjectID public _id: string;
    @Property(String, true) public email: string;
    @Property(String, true) public password: string;
}

class UserDatabase extends Core {
    public Users = new Model<IUser, UserSchema>(this, UserSchema);
}

export const Database = new UserDatabase({ database: 'test_db' });