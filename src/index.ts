import "reflect-metadata";
import * as path from "path";
import {ARGS_META_KEY, ArgType, CONTROLLER_META_KEY, HTTPMethod, ROUTES_META_KEY} from "./consts";

type constructor<T> = {
    new(...args: any[]): T;
};

export type ArgumentDescription = { type: ArgType, name?: string };

export type Route = { method: HTTPMethod, url: string, handler: (...args: any[]) => any };
type RouteMeta = { method: HTTPMethod, url: string, propertyName: string };

function createDecorator(method: HTTPMethod, url: string) {
    return function (
        target: any,
        propertyName: string,
        propertyDesciptor: PropertyDescriptor
    ) {
        const routes = Reflect.getOwnMetadata(ROUTES_META_KEY, target) || [];
        routes.push({method, url, propertyName});
        Reflect.defineMetadata(ROUTES_META_KEY, routes, target);
        return propertyDesciptor;
    };
}

export function Controller<T>(options: { baseUrl?: string } = {}): (target: constructor<T>) => void {
    return function (target: constructor<T>): void {
        const controllerMeta = Reflect.getOwnMetadata(CONTROLLER_META_KEY, target.prototype) || {};
        const {baseUrl} = options;
        Reflect.defineMetadata(CONTROLLER_META_KEY, {...controllerMeta, baseUrl: baseUrl || '/'}, target.prototype);
    }
}

export function Get(url: string = '') {
    return createDecorator('GET', url)
}

export function Post(url: string = '') {
    return createDecorator('POST', url)
}

export function Put(url: string = '') {
    return createDecorator('PUT', url)
}

export function Patch(url: string = '') {
    return createDecorator('PUT', url)
}

export function Del(url: string = '') {
    return createDecorator('DELETE', url)
}

function createArgDecorator(arg: ArgumentDescription, target: any, propertyKey: string, parameterIndex: number) {
    const argsParams = (
        Reflect.getOwnMetadata(
            ARGS_META_KEY,
            target.constructor,
            propertyKey,
        )
        ||
        []
    );
    argsParams[parameterIndex] = arg;
    Reflect.defineMetadata(
        ARGS_META_KEY,
        argsParams,
        target.constructor,
        propertyKey,
    );
}

export function Request(target: any, propertyKey: string, parameterIndex: number) {
    return createArgDecorator({type: ArgType.Request}, target, propertyKey, parameterIndex);
}

export function Body(target: any, propertyKey: string, parameterIndex: number) {
    return createArgDecorator({type: ArgType.Body}, target, propertyKey, parameterIndex);
}

export function Response(target: any, propertyKey: string, parameterIndex: number) {
    return createArgDecorator({type: ArgType.Response}, target, propertyKey, parameterIndex);
}

export function PathParam(name: string) {
    //todo validate name
    return (target: any, propertyKey: string, parameterIndex: number) => {
        return createArgDecorator({type: ArgType.PathParam, name}, target, propertyKey, parameterIndex);
    }
}

export function Query(target: any, propertyKey: string, parameterIndex: number) {
    return createArgDecorator({type: ArgType.Query}, target, propertyKey, parameterIndex);
}

export function Params(target: any, propertyKey: string, parameterIndex: number) {
    return createArgDecorator({type: ArgType.Params}, target, propertyKey, parameterIndex);
}

export function QueryParam(name: string) {
    //todo validate name
    return (target: any, propertyKey: string, parameterIndex: number) => {
        return createArgDecorator({type: ArgType.QueryParam, name}, target, propertyKey, parameterIndex);
    }
}

function extractArg(desc: ArgumentDescription, request: any, response: any) {
    switch (desc.type) { //todo delegate args extractors
        case ArgType.Request:
            return request;
        case ArgType.Response:
            return response;
        case ArgType.Query:
            return request.query;
        case ArgType.Params:
            return request.params;
        case ArgType.Body:
            return request.body;
        case ArgType.PathParam:
            return request.params[desc.name!];
        case ArgType.QueryParam:
            return request.query[desc.name!];
    }
}

export function registerController(controller: any, bindRoute: (route: Route) => void) {
    const proto = Object.getPrototypeOf(controller);
    const cOpt = Reflect.getOwnMetadata(CONTROLLER_META_KEY, proto) || {};
    const routes = Reflect.getOwnMetadata(ROUTES_META_KEY, proto) || [];
    routes.forEach((r: RouteMeta) => {
        const route = {
            method: r.method,
            url: path.posix.join(cOpt.baseUrl, r.url),
            handler: (request: any, response: any) => {
                const argDescriptions = Reflect.getOwnMetadata(ARGS_META_KEY, proto.constructor, r.propertyName) || [];
                const args = argDescriptions.map((desc: { type: any; name: any; }) => extractArg(desc, request, response));
                return controller[r.propertyName](...[...args, request, response])
            }
        };
        bindRoute(route);
    })
}
