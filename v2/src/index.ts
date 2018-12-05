import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as expresJwt from 'express-jwt';
import TYPES from './types';
import container from './inversify.config';
import { logger } from './utils/Logger';
import { IRegistrableController } from './controllers/IRegistrableController';
import { join } from 'path';
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';

import * as fs from 'fs';

class Server {
  private app: express.Application;
  private controllers: IRegistrableController[];
  private swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath();

  constructor() {
    this.app = express();
    const indexContent = fs.readFileSync(`${this.swaggerUiAssetPath}/index.html`)
      .toString()
      .replace("https://petstore.swagger.io/v2/swagger.json", "https://api.klymbr.com/swagger.json");
    this.app.get("/", (req, res) => res.send(indexContent));
    this.app.get("/index.html", (req, res) => res.send(indexContent));
    this.use();

    this.app.all(
      '*',
      async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        logger.info(`${req.method}: ${req.url}`);
        next();
      }
    );
    this.app.get(
      '/swagger.json',
      async (req: express.Request, res: express.Response) => {
        res.sendFile(join(__dirname, 'swagger.json'));
      }
    );

    this.controllers = container.getAll<IRegistrableController>(
      TYPES.Controller
    );
    this.controllers.forEach(controller => controller.register(this.app));

    this.app.use(
      (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        if (err.stack) {
          logger.error(err.stack);
        }
        next(err);
      }
    );
    this.app.use(
      (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        if (err.name === 'UnauthorizedError')
          res.status(500).json({
            error: 'server_error',
            error_description: 'Invalid Token'
          });
        else
          res.status(500).json({
            error: 'server_error',
            error_description: 'Oops! Something went wrong...'
          });
      }
    );
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      logger.info(`Klymbr API listening on port ${port}!`);
    });
  }

  private use() {
    /*this.app.use(function (req, res, next) {

      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', 1);

      // Pass to next layer of middleware
      next();
    });*/
    this.app.use(compression());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: '20mb' }));
    this.app.use(cookieParser());
    this.app.use(cors());
    this.app.use(
      expresJwt({ secret: 'klymbrToken' }).unless({
        path: [
          // public routes that don't require authentication
          '/users/authenticate',
          '/users',
          '/swagger.json',
          '/swagger-ui.css',
          '/swagger-ui-bundle.js',
          '/swagger-ui-standalone-preset.js',
          '/favicon-16x16.png',
          '/favicon-32x32.png',
          '/favicon.ico',
          '/'
        ]
      })
    );
    this.app.use(express.static(this.swaggerUiAssetPath));
    // this.app.use(express.static(join(__dirname, '')));
  }
}

const server = new Server();
if (process.env['NODE_ENV'] === 'production') {
  server.listen(80);
} else {
  server.listen(8080);
}
