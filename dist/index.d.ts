import "reflect-metadata";
export declare const ROUTES_META_KEY = "routes";
export declare const CONTROLLER_META_KEY = "controller";
export declare type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
declare type constructor<T> = {
    new (...args: any[]): T;
};
export declare type Route = {
    method: HTTPMethod;
    url: string;
    handler: (...args: any[]) => any;
};
export declare function Controller<T>(options?: {
    baseUrl?: string;
}): (target: constructor<T>) => void;
export declare function Get(url?: string): (target: any, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor;
export declare function Post(url?: string): (target: any, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor;
export declare function Put(url?: string): (target: any, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor;
export declare function Patch(url?: string): (target: any, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor;
export declare function Del(url?: string): (target: any, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor;
export declare function registerController(controller: any, bindRoute: (route: Route) => void): void;
export {};
