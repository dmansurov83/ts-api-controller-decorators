export const ROUTES_META_KEY = Symbol('routes');
export const ARGS_META_KEY = Symbol('arguments');
export const CONTROLLER_META_KEY = Symbol('controller');

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export enum ArgType {
    Request,
    Response,
    Query,
    Params,
    PathParam,
    QueryParam,
    Body
}
