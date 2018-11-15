import { injectable, inject } from 'inversify';
import { IUser } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import TYPES from '../types';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export interface IUserService {
  getUsers(): Promise<Array<IUser>>;
  createUser(user: IUser): Promise<IUser>;
  updateUser(user: IUser): Promise<IUser>;
  getUser(id: string): Promise<IUser>;
  removeUser(id: string): Promise<number>;
  authenticateUser(email: string, pwd: string): Promise<IUserRet>;
}

interface IUserRet {
  user: IUser;
  token: string;
}

@injectable()
export class UserService implements IUserService {
  @inject(TYPES.UserRepository)
  private userRepository: UserRepository;

  private rebuildDate(user: IUser): IUser {
    user.birthdate = new Date(user.birthdate);
    user.licenses.forEach(l => (l.end = new Date(l.end)));
    return user;
  }

  public async getUsers(): Promise<Array<IUser>> {
    const users = await this.userRepository.findAll();
    return users.map(u => {
      u.password = undefined;
      return u;
    });
  }

  public async createUser(user: IUser): Promise<IUser> {
    const u = await this.userRepository.create(this.rebuildDate(user));
    u.password = undefined;
    return u;
  }

  public async updateUser(user: IUser): Promise<IUser> {
    const u = await this.userRepository.update(this.rebuildDate(user));
    u.password = undefined;
    return u;
  }

  public async getUser(id: string): Promise<IUser> {
    const user = await this.userRepository.find(id);
    user.password = undefined;
    return user;
  }

  public async removeUser(id: string): Promise<number> {
    return await this.userRepository.remove(id);
  }

  public async authenticateUser(email: string, pwd: string): Promise<IUserRet> {
    const user = await this.userRepository.findByEmail(email);
    console.log(user);
    const res = await bcrypt.compare(pwd, user.password);
    user.password = undefined;
    if (res) {
      const token = await jwt.sign(
        { firstname: user.firstname, id: user._id },
        'klymbrToken'
      );
      return {
        user,
        token
      };
    }
  }
}
