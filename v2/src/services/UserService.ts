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
  updatePassword(user: IUser): Promise<IUser>;
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
    if (user.licenses) user.licenses.forEach(l => (l.end = new Date(l.end)));
    return user;
  }

  public async getUsers(): Promise<Array<IUser>> {
    const users = await this.userRepository.findAll();
    return users.map(u => {
      u.password = undefined;
      u.tshirt.sort((a, b) => a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0);
      return u;
    });
  }

  public async createUser(user: IUser): Promise<IUser> {
    const u = await this.userRepository.create(this.rebuildDate(user));
    u.password = undefined;
    u.tshirt.sort((a, b) => a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0);
    return u;
  }

  public async updateUser(user: IUser): Promise<IUser> {
    const u = await this.userRepository.update(this.rebuildDate(user));
    u.password = undefined;
    u.tshirt.sort((a, b) => a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0);
    return u;
  }

  public async updatePassword(user: IUser): Promise<IUser> {
    const u = await this.userRepository.updatePass(user);
    u.password = undefined;
    u.tshirt.sort((a, b) => a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0);
    return u;
  }


  public async getUser(id: string): Promise<IUser> {
    const user = await this.userRepository.find(id);
    user.password = undefined;
    user.tshirt.sort((a, b) => a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0);
    return user;
  }

  public async removeUser(id: string): Promise<number> {
    return await this.userRepository.remove(id);
  }

  public async getUserByEmail(email: string): Promise<IUser> {
    const user = await this.userRepository.findByEmail(email);
    user.password = undefined;
    user.tshirt.sort((a, b) => a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0);
    return user;
  }

  public async authenticateUser(email: string, pwd: string): Promise<IUserRet> {
    const user = await this.userRepository.findByEmail(email);
    const res = await bcrypt.compare(pwd, user.password);
    user.password = undefined;
    user.tshirt.sort((a, b) => a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0);
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
