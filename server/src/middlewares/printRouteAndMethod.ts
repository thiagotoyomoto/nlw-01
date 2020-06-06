import { Request, Response, NextFunction } from 'express';

export default function printRouteAndMethod(request: Request, response: Response, next: NextFunction) {
    console.log(`[${(new Date()).toUTCString()}]`, request.method, request.url);

    next();
}