"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path = require("path");
exports.ROUTES_META_KEY = 'routes';
exports.CONTROLLER_META_KEY = 'controller';
function createDecorator(method, url) {
    return function (target, propertyName, propertyDesciptor) {
        const routes = Reflect.getOwnMetadata(exports.ROUTES_META_KEY, target) || [];
        routes.push({ method, url, propertyName });
        Reflect.defineMetadata(exports.ROUTES_META_KEY, routes, target);
        return propertyDesciptor;
    };
}
function Controller(options = {}) {
    return function (target) {
        const controllerMeta = Reflect.getOwnMetadata(exports.CONTROLLER_META_KEY, target.prototype) || {};
        const { baseUrl } = options;
        Reflect.defineMetadata(exports.CONTROLLER_META_KEY, Object.assign(Object.assign({}, controllerMeta), { baseUrl: baseUrl || '/' }), target.prototype);
    };
}
exports.Controller = Controller;
function Get(url = '') {
    return createDecorator('GET', url);
}
exports.Get = Get;
function Post(url = '') {
    return createDecorator('POST', url);
}
exports.Post = Post;
function Put(url = '') {
    return createDecorator('PUT', url);
}
exports.Put = Put;
function Patch(url = '') {
    return createDecorator('PUT', url);
}
exports.Patch = Patch;
function Del(url = '') {
    return createDecorator('DELETE', url);
}
exports.Del = Del;
function registerController(controller, bindRoute) {
    const cOpt = Reflect.getOwnMetadata(exports.CONTROLLER_META_KEY, Object.getPrototypeOf(controller)) || {};
    console.log(cOpt);
    const routes = Reflect.getOwnMetadata(exports.ROUTES_META_KEY, Object.getPrototypeOf(controller)) || [];
    routes.forEach((r) => {
        const route = {
            method: r.method,
            url: path.posix.join(cOpt.baseUrl, r.url),
            handler: (...args) => controller[r.propertyName](...args)
        };
        bindRoute(route);
        console.log('Registered route', route);
    });
}
exports.registerController = registerController;
