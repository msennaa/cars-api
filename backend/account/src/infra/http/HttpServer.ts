import express from 'express';
import Hapi from '@hapi/hapi';
import HyperExpress from 'hyper-express';
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export default interface HttpServer {
    register(method: string, url: string, callback: Function): void;
    listen(port: number): void;
}

export class ExpressAdapter implements HttpServer {
    app: any

    constructor() {
        this.app = express();
        this.app.use(express.json());
    }

    register(method: string, url: string, callback: Function): void {
        this.app[method](url.replace(/\{|\}/g, ''), async (req: any, res: any) => {
            try {
                const output = await callback(req.params, req.body);
                res.json(output);
            } catch (error: any) {
                res.status(422).json({
                    message: error.message
                })
            }
        });
    }

    listen(port: number): void {
        this.app.listen(port);
    }
}

export class HapiAdapter implements HttpServer {
    server: Hapi.Server;

    constructor() {
        this.server = Hapi.server({})
    }

    register(method: string, url: string, callback: Function): void {
        this.server.route({
            method,
            path: url.replace(/\:/g, ''),
            handler: async (request: any, reply: any) => {
                try {
                    const output = await callback(request.params, request.payload);
                    return output;
                } catch (error: any) {
                    return reply.response({ message: error.message }).code(422)
                }
            }
        })
    }

    listen(port: number): void {
        this.server.settings.port = port;
        this.server.start();
    }
}

export class HyperExpressAdapter implements HttpServer {
    app: HyperExpress.Server;

    constructor() {
        this.app = new HyperExpress.Server();
    }

    register(method: string, url: string, callback: Function): void {
        (this.app as any)[method](url.replace(/\{|\}/g, ''), async (req: any, res: any) => {
            try {
                const params = req.params;
                const body = await req.json();
                const output = await callback(params, body);
                res.json(output);
            } catch (error: any) {
                res.status(422).json({
                    message: error.message
                });
            }
        });
    }

    listen(port: number): void {
        this.app.listen(port).then(() => {
            console.log(`Server is running on http://localhost:${port}`);
        }).catch((error) => {
            console.error(`Failed to start server: ${error.message}`);
        });
    }
}

export class FastifyAdapter implements HttpServer {
    app: FastifyInstance;

    constructor() {
        this.app = Fastify();
    }

    register(method: string, url: string, callback: Function): void {
        (this.app as any)[method](url.replace(/\{|\}/g, ''), async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const { params, body } = request;
                const output = await callback(params, body);
                reply.send(output);
            } catch (error: any) {
                reply.status(422).send({
                    message: error.message,
                });
            }
        });
    }

    listen(port: number): void {
        this.app.listen({ port });

    }
}

