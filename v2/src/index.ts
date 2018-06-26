import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import TYPES from './types';
import container from './inversify.config';
import { logger } from './utils/Logger';
import { IRegistrableController } from './controllers/IRegistrableController';
import { join } from 'path';
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';

class Server {
    private app: express.Application;
    private controllers: IRegistrableController[];

    constructor() {
        this.app = express();
        this.use();

        this.app.all('*', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            logger.info(`${req.method}: ${req.url}`);
            next();
        });
        this.app.get('/swagger.json', async (req: express.Request, res: express.Response) => {
            res.sendFile(join(__dirname, 'swagger.json'));
        });

        this.controllers = container.getAll<IRegistrableController>(TYPES.Controller);
        this.controllers.forEach(controller => controller.register(this.app));

        this.app.use((err: Error, req: express.Request,
            res: express.Response, next: express.NextFunction) => {
            if (err.stack) { logger.error(err.stack); }
            next(err);
        });
        this.app.use((err: Error, req: express.Request,
            res: express.Response, next: express.NextFunction) => {
            res.status(500).json({
                error: 'server_error',
                error_description: 'Oops! Something went wrong...'
            });
        });
    }

    public listen(port: number) {
        this.app.listen(port, () => {
            logger.info(`Klymbr API listening on port ${port}!`);
        })
    }

    private use() {
        this.app.use(compression());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json({ limit: '20mb' }));
        this.app.use(cookieParser());
        this.app.use(cors());

        const swaggerUiAssetPath = require("swagger-ui-dist").getAbsoluteFSPath();
        this.app.use(express.static(swaggerUiAssetPath));
        // this.app.use(express.static(join(__dirname, '')));
    }
}

const server = new Server;
if (process.env['NODE_ENV'] === 'production') { server.listen(80); } else { server.listen(8080); }