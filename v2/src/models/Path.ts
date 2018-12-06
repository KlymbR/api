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
    id: number;
    data: number;
    on: boolean;
}

interface IBest {
    time: number;
    firstname: string;
    lastname: string;
    id: string;
}

export interface IPath {
    _id?: string;
    free: boolean;
    difficulty: string;
    color: string;
    grips: Array<IGrip>;
    average: Number;
    best: IBest;
}

@Index({ name: 1 })
@Collection('paths')
export class PathSchema extends Instance<IPath, PathSchema> implements IPath {
    @ObjectID public _id: string;
    @Property(Boolean, true) public free: boolean;
    @Property(String, true) public difficulty: string;
    @Property(String, true) public color: string;
    @Property([{
        id: Number,
        data: Number,
        on: Boolean
    }], true) public grips: Array<IGrip>;
    @Property(Number, true) public average: Number;
    @Property({
        time: Number,
        firstname: String,
        lastname: String,
        id: String
    }, true) public best: IBest;
}

class PathDatabase extends Core {
    public Paths = new Model<IPath, PathSchema>(this, PathSchema);
}

export const Database = new PathDatabase({ database: 'klymbr' });