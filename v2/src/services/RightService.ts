import { injectable, inject } from 'inversify';
import { IRights } from '../models/Rights';
import { RightRepository } from '../repositories/RightRepository';
import TYPES from '../types';

export interface IRightService {
    createRights(rights: IRights): Promise<IRights>;
    updateRights(rights: IRights): Promise<IRights>;
    getRights(email: string): Promise<IRights>;
    removeRights(id: string): Promise<number>;
}

@injectable()
export class RightService implements IRightService {
    @inject(TYPES.RightRepository)
    private rightRepository: RightRepository;

    public async createRights(rights: IRights): Promise<IRights> {
        return await this.rightRepository.create(rights);
    }

    public async updateRights(rights: IRights): Promise<IRights> {
        return await this.rightRepository.update(rights);
    }

    public async getRights(email: string): Promise<IRights> {
        return await this.rightRepository.find(email);
    }

    public async removeRights(id: string): Promise<number> {
        return await this.rightRepository.remove(id);
    }
}