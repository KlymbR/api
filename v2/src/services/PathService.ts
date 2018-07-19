import { injectable, inject } from 'inversify';
import { IPath } from '../models/Path';
import { PathRepository } from '../repositories/PathRepository';
import TYPES from '../types';

export interface IPathService {
    getPaths(): Promise<Array<IPath>>;
    createPath(path: IPath): Promise<IPath>;
    updatePath(path: IPath): Promise<IPath>;
    getPath(id: string): Promise<IPath>;
    removePath(id: string): Promise<number>;
}

@injectable()
export class PathService implements IPathService {
    @inject(TYPES.PathRepository)
    private pathRepository: PathRepository;

    public async getPaths(): Promise<Array<IPath>> {
        const paths = await this.pathRepository.findAll();
        return paths.map((u) => {
            return u;
        });
    }

    public async createPath(path: IPath): Promise<IPath> {
        const u = await this.pathRepository.create(path);
        return u;
    }

    public async updatePath(path: IPath): Promise<IPath> {
        const u = await this.pathRepository.update(path);
        return u;
    }

    public async getPath(id: string): Promise<IPath> {
        const path = await this.pathRepository.find(id);
        return path;
    }

    public async removePath(id: string): Promise<number> {
        return await this.pathRepository.remove(id);
    }
}