"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var path = require("path");
var consts_1 = require("./consts");
function createDecorator(method, url) {
    return function (target, propertyName, propertyDesciptor) {
        var routes = Reflect.getOwnMetadata(consts_1.ROUTES_META_KEY, target) || [];
        routes.push({ method: method, url: url, propertyName: propertyName });
        Reflect.defineMetadata(consts_1.ROUTES_META_KEY, routes, target);
        return propertyDesciptor;
    };
}
function Controller(options) {
    if (options === void 0) { options = {}; }
    return function (target) {
        var controllerMeta = Reflect.getOwnMetadata(consts_1.CONTROLLER_META_KEY, target.prototype) || {};
        var baseUrl = options.baseUrl;
        Reflect.defineMetadata(consts_1.CONTROLLER_META_KEY, __assign(__assign({}, controllerMeta), { baseUrl: baseUrl || '/' }), target.prototype);
    };
}
exports.Controller = Controller;
function Get(url) {
    if (url === void 0) { url = ''; }
    return createDecorator('GET', url);
}
exports.Get = Get;
function Post(url) {
    if (url === void 0) { url = ''; }
    return createDecorator('POST', url);
}
exports.Post = Post;
function Put(url) {
    if (url === void 0) { url = ''; }
    return createDecorator('PUT', url);
}
exports.Put = Put;
function Patch(url) {
    if (url === void 0) { url = ''; }
    return createDecorator('PUT', url);
}
exports.Patch = Patch;
function Del(url) {
    if (url === void 0) { url = ''; }
    return createDecorator('DELETE', url);
}
exports.Del = Del;
function createArgDecorator(arg, target, propertyKey, parameterIndex) {
    var argsParams = (Reflect.getOwnMetadata(consts_1.ARGS_META_KEY, target.constructor, propertyKey)
        ||
            []);
    argsParams[parameterIndex] = arg;
    Reflect.defineMetadata(consts_1.ARGS_META_KEY, argsParams, target.constructor, propertyKey);
}
function Request(target, propertyKey, parameterIndex) {
    return createArgDecorator({ type: consts_1.ArgType.Request }, target, propertyKey, parameterIndex);
}
exports.Request = Request;
function Body(target, propertyKey, parameterIndex) {
    return createArgDecorator({ type: consts_1.ArgType.Body }, target, propertyKey, parameterIndex);
}
exports.Body = Body;
function Response(target, propertyKey, parameterIndex) {
    return createArgDecorator({ type: consts_1.ArgType.Response }, target, propertyKey, parameterIndex);
}
exports.Response = Response;
function PathParam(name) {
    //todo validate name
    return function (target, propertyKey, parameterIndex) {
        return createArgDecorator({ type: consts_1.ArgType.PathParam, name: name }, target, propertyKey, parameterIndex);
    };
}
exports.PathParam = PathParam;
function Query(target, propertyKey, parameterIndex) {
    return createArgDecorator({ type: consts_1.ArgType.Query }, target, propertyKey, parameterIndex);
}
exports.Query = Query;
function Params(target, propertyKey, parameterIndex) {
    return createArgDecorator({ type: consts_1.ArgType.Params }, target, propertyKey, parameterIndex);
}
exports.Params = Params;
function QueryParam(name) {
    //todo validate name
    return function (target, propertyKey, parameterIndex) {
        return createArgDecorator({ type: consts_1.ArgType.QueryParam, name: name }, target, propertyKey, parameterIndex);
    };
}
exports.QueryParam = QueryParam;
function extractArg(desc, request, response) {
    switch (desc.type) { //todo delegate args extractors
        case consts_1.ArgType.Request:
            return request;
        case consts_1.ArgType.Response:
            return response;
        case consts_1.ArgType.Query:
            return request.query;
        case consts_1.ArgType.Params:
            return request.params;
        case consts_1.ArgType.Body:
            return request.body;
        case consts_1.ArgType.PathParam:
            return request.params[desc.name];
        case consts_1.ArgType.QueryParam:
            return request.query[desc.name];
    }
}
function registerController(controller, bindRoute) {
    var proto = Object.getPrototypeOf(controller);
    var cOpt = Reflect.getOwnMetadata(consts_1.CONTROLLER_META_KEY, proto) || {};
    var routes = Reflect.getOwnMetadata(consts_1.ROUTES_META_KEY, proto) || [];
    routes.forEach(function (r) {
        var route = {
            method: r.method,
            url: path.posix.join(cOpt.baseUrl, r.url),
            handler: function (request, response) {
                var argDescriptions = Reflect.getOwnMetadata(consts_1.ARGS_META_KEY, proto.constructor, r.propertyName) || [];
                var args = argDescriptions.map(function (desc) { return extractArg(desc, request, response); });
                return controller[r.propertyName].apply(controller, __spreadArrays(args, [request, response]));
            }
        };
        bindRoute(route);
    });
}
exports.registerController = registerController;
