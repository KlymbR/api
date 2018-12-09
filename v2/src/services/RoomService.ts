import { injectable, inject } from 'inversify';
import { IPath, IRoom } from '../models/Room';
import { RoomRepository } from '../repositories/RoomRepository';
import TYPES from '../types';

export interface IRoomService {
    getRooms(): Promise<Array<IRoom>>;
    createRoom(room: IRoom): Promise<IRoom>;
    createRoomPath(idroom: string, path: IPath): Promise<IPath>;
    updateRoom(room: IRoom): Promise<IRoom>;
    updateRoomPath(idroom: string, idpath: string, path: IPath): Promise<IPath>;
    getRoom(id: string): Promise<IRoom>;
    getRoomPath(idroom: string, idpath: string): Promise<IPath>;
    getRoomPaths(idroom: string);
    removeRoom(id: string): Promise<number>;
    removeRoomPath(idroom: string, idpath: string): Promise<number>;
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

    public async createRoomPath(idroom: string, path: IPath): Promise<IPath> {
        const u = await this.roomRepository.createPath(idroom, path);
        return u;
    }

    public async updateRoom(room: IRoom): Promise<IRoom> {
        const u = await this.roomRepository.update(room);
        return u;
    }

    public async updateRoomPath(idroom: string, idpath: string, path: IPath): Promise<IPath> {
        const u = await this.roomRepository.updatePath(idroom, idpath, path);
        return u;
    }

    public async getRoom(id: string): Promise<IRoom> {
        const room = await this.roomRepository.find(id);
        return room;
    }

    public async getRoomPath(idroom: string, idpath: string): Promise<IPath> {
        const path = await this.roomRepository.findPath(idroom, idpath);
        return path;
    }

    public async getRoomPaths(idroom: string): Promise<Array<IPath>> {
        const paths = await this.roomRepository.findAllRoomPaths(idroom);
        return paths.map((u) => {
            return u;
        });
    }

    public async removeRoom(id: string): Promise<number> {
        return await this.roomRepository.remove(id);
    }

    public async removeRoomPath(idroom: string, idpath: string): Promise<number> {
        return await this.roomRepository.removePath(idroom, idpath);
    }
}