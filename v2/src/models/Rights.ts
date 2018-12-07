import {
    Core,
    Model,
    Instance,
    Collection,
    Index,
    Property,
    ObjectID
} from 'iridium';
import { Timestamp } from 'bson';

export interface IRights {
    _id?: string;
    room: string;
    path: string;
    administration: string;
    email: string;
}

@Index({ name: 4 })
@Collection('rights')
export class RightSchema extends Instance<IRights, RightSchema> implements IRights {
    @ObjectID public _id: string;
    @Property(String, true) public room: string;
    @Property(String, true) public path: string;
    @Property(String, true) public administration: string;
    @Property(String, true) public email: string;
}

class RightDatabase extends Core {
    public Rights = new Model<IRights, RightSchema>(this, RightSchema);
}

export const Database = new RightDatabase({ database: 'klymbr' });