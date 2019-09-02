import "reflect-metadata";
import { ArgType, HTTPMethod } from "./consts";
declare type constructor<T> = {
    new (...args: any[]): T;
};
export declare type ArgumentDescription = {
    type: ArgType;
    name?: string;
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
export declare function Request(target: any, propertyKey: string, parameterIndex: number): void;
export declare function Body(target: any, propertyKey: string, parameterIndex: number): void;
export declare function Response(target: any, propertyKey: string, parameterIndex: number): void;
export declare function PathParam(name: string): (target: any, propertyKey: string, parameterIndex: number) => void;
export declare function Query(target: any, propertyKey: string, parameterIndex: number): void;
export declare function Params(target: any, propertyKey: string, parameterIndex: number): void;
export declare function QueryParam(name: string): (target: any, propertyKey: string, parameterIndex: number) => void;
export declare function registerController(controller: any, bindRoute: (route: Route) => void): void;
export {};
