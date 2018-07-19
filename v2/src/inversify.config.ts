import 'reflect-metadata';

import { Container } from 'inversify';
import TYPES from './types';
import { IRegistrableController } from './controllers/IRegistrableController';

import { UserController } from './controllers/UserController';
import { UserService } from './services/UserService';
import { UserRepository } from './repositories/UserRepository';

import { RoomController } from './controllers/RoomController';
import { RoomService } from './services/RoomService';
import { RoomRepository } from './repositories/RoomRepository';

import { PathController } from './controllers/PathController';
import { PathService } from './services/PathService';
import { PathRepository } from './repositories/PathRepository';

const container = new Container();

container.bind<IRegistrableController>(TYPES.Controller).to(UserController);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);

export default container;