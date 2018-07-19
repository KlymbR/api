import { injectable, inject } from 'inversify';
import { IRoom } from '../models/Room';
import { RoomRepository } from '../repositories/RoomRepository';
import TYPES from '../types';

export interface IRoomService {
    getRooms(): Promise<Array<IRoom>>;
    createRoom(room: IRoom): Promise<IRoom>;
    updateRoom(room: IRoom): Promise<IRoom>;
    getRoom(id: string): Promise<IRoom>;
    removeRoom(id: string): Promise<number>;
}

@injectable()
export class RoomService implements IRoomService {
    @inject(TYPES.RoomRepository)
    private roomRepository: RoomRepository;

    public async getRooms(): Promise<Array<IRoom>> {
        const rooms = await this.roomRepository.findAll();
        return rooms.map((u) => {
            return u;
        });
    }

    public async createRoom(room: IRoom): Promise<IRoom> {
        const u = await this.roomRepository.create(room);
        return u;
    }

    public async updateRoom(room: IRoom): Promise<IRoom> {
        const u = await this.roomRepository.update(room);
        return u;
    }

    public async getRoom(id: string): Promise<IRoom> {
        const room = await this.roomRepository.find(id);
        return room;
    }

    public async removeRoom(id: string): Promise<number> {
        return await this.roomRepository.remove(id);
    }
}