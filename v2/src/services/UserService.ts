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
        const users = await this.userRepository.findAll();
        return users.map((u) => {
            u.password = undefined;
            return u;
        });
    }

    public async createUser(user: IUser): Promise<IUser> {
        const u = await this.userRepository.create(user);
        u.password = undefined;
        return u;
    }

    public async updateUser(user: IUser): Promise<IUser> {
        const u = await this.userRepository.update(user);
        u.password = undefined;
        return u;
    }

    public async getUser(id: string): Promise<IUser> {
        const user = await this.userRepository.find(id);
        user.password = undefined;
        return user;
    }
}