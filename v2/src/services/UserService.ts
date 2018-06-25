import { injectable, inject } from 'inversify';
import { IUser } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import TYPES from '../types';

export interface IUserService {
    getUsers(): Promise<Array<IUser>>;
    createUser(user: IUser): Promise<IUser>;
    updateUser(user: IUser): Promise<IUser>;
    getUser(id: string): Promise<IUser>;
}

@injectable()
export class UserService implements IUserService {
    @inject(TYPES.UserRepository)
    private userRepository: UserRepository;

    public async getUsers(): Promise<Array<IUser>> {
        return await this.userRepository.findAll();
    }

    public async createUser(user: IUser): Promise<IUser> {
        return await this.userRepository.create(user);
    }

    public async updateUser(user: IUser): Promise<IUser> {
        return await this.userRepository.update(user);
    }

    public async getUser(id: string): Promise<IUser> {
        return await this.userRepository.find(id);
    }
}