import "reflect-metadata";
import * as path from "path";

export const ROUTES_META_KEY = 'routes';
export const CONTROLLER_META_KEY = 'controller';

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type constructor<T> = {
    new(...args: any[]): T;
};

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

export function registerController(controller: any, bindRoute: (route: Route) => void) {
    const cOpt = Reflect.getOwnMetadata(CONTROLLER_META_KEY, Object.getPrototypeOf(controller)) || {};
    console.log(cOpt);
    const routes = Reflect.getOwnMetadata(ROUTES_META_KEY, Object.getPrototypeOf(controller)) || [];
    routes.forEach((r: RouteMeta) => {
        const route = {
            method: r.method,
            url: path.posix.join(cOpt.baseUrl, r.url),
            handler: (...args: any[]) => controller[r.propertyName](...args)
        };
        bindRoute(route);
        console.log('Registered route', route);
    })
}
