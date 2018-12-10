import {
    Core,
    Model,
    Instance,
    Collection,
    Index,
    Property,
    ObjectID
} from 'iridium';

interface IGrip {
    id?: number;
    data: number;
    on: boolean;
}

interface IBest {
    time?: number;
    firstname?: string;
    lastname?: string;
    id?: string;
}

export interface IPath {
    _id?: string;
    name: string;
    free: boolean;
    difficulty: string;
    color: string;
    grips: Array<IGrip>;
    average: Number;
    best: IBest;
}

// @Index({ name: 1 })
// @Collection('paths')
// export class PathSchema extends Instance<IPath, PathSchema> implements IPath {
//     @ObjectID public _id?: string;
//     @Property(Boolean, true) public free: boolean;
//     @Property(String, true) public name: string;
//     @Property(String, true) public difficulty: string;
//     @Property(String, true) public color: string;
//     @Property([{
//         id: Number,
//         data: Number,
//         on: Boolean
//     }], true) public grips: Array<IGrip>;
//     @Property(Number, true) public average: Number;
//     @Property({
//         time: Number,
//         firstname: String,
//         lastname: String,
//         id: String
//     }, true) public best: IBest;
// }

export interface IRoom {
    _id?: string;
    title: string;
    latitude: number;
    longitude: number;
    paths: Array<IPath>;
}

@Index({ name: 2 })
@Collection('rooms')
export class RoomSchema extends Instance<IRoom, RoomSchema> implements IRoom {
    @ObjectID public _id: string;
    @Property(String, true) public title: string;
    @Property(Number, true) public latitude: number;
    @Property(Number, true) public longitude: number;
    @Property(Array, true) public paths: Array<IPath>;
}

class RoomDatabase extends Core {
    public Rooms = new Model<IRoom, RoomSchema>(this, RoomSchema);
}

export const Database = new RoomDatabase({ database: 'klymbr' });