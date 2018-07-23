import {
    Core,
    Model,
    Instance,
    Collection,
    Index,
    Property,
    ObjectID
} from 'iridium';

export interface IRoom {
    _id?: string;
    title: string;
    latitude: number;
    longitude: number;
}

@Index({ name: 2 })
@Collection('rooms')
export class RoomSchema extends Instance<IRoom, RoomSchema> implements IRoom {
    @ObjectID public _id: string;
    @Property(String, true) public title: string;
    @Property(Number, true) public latitude: number;
    @Property(Number, true) public longitude: number;
}

class RoomDatabase extends Core {
    public Rooms = new Model<IRoom, RoomSchema>(this, RoomSchema);
}

export const Database = new RoomDatabase({ database: 'test_db' });