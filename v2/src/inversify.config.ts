import 'reflect-metadata';

import { Container } from 'inversify';
import TYPES from './types';
import { IRegistrableController } from './controllers/IRegistrableController';

const container = new Container();

export default container;