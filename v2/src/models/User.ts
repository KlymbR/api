import {
    Core,
    Model,
    Instance,
    Collection,
    Index,
    Property,
    ObjectID
} from 'iridium';

interface IClub {
    id: number;
    name: string;
}

interface ILicense {
    id: number;
    number: number;
    end: Date;
    status: number;
    club: IClub;
}

interface IAddress {
    number: number;
    street: string;
    postalcode: number;
    city: string;
}

export interface IUser {
    _id?: string;
    firstname: string;
    lastname: string;
    phone: string;
    gender: number;
    birthdate: Date;
    email: string;
    password: string;
    licenses: Array<ILicense>;
    address: IAddress;
    created?: Date;
}

@Index({ name: 1 })
@Collection('users')
export class UserSchema extends Instance<IUser, UserSchema> implements IUser {
    @ObjectID public _id: string;
    @Property(String, true) public firstname: string;
    @Property(String, true) public lastname: string;
    @Property(String, true) public phone: string;
    @Property(Number, true) public gender: number;
    @Property(Date, true) public birthdate: Date;
    @Property(String, true) public email: string;
    @Property(String, true) public password: string;
    @Property([{
        id: Number,
        number: Number,
        end: Date,
        status: Number,
        club: { id: Number, name: String }
    }], true) public licenses: Array<ILicense>;
    @Property({
        number: Number,
        street: String,
        postalcode: Number,
        city: String
    }, true) public address: IAddress;
    @Property(Date, true) public created: Date;
}

class UserDatabase extends Core {
    public Users = new Model<IUser, UserSchema>(this, UserSchema);
}

export const Database = new UserDatabase({ database: 'test_db' });