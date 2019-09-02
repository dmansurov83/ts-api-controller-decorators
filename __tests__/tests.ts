import {Controller, Get, PathParam, Query, QueryParam, registerController, Route} from "../src";

@Controller({baseUrl: "api"})
class TestController {
    @Get()
    getAllSync() {
        return [1, 2, 3];
    }

    @Get("async")
    async getAllAsync() {
        return [1, 2, 3];
    }

    @Get(":id")
    getById(@PathParam("id") id: string) {
        return id;
    }

    @Get(":id/tests/:key")
    getByIdAndKey(@PathParam("id") id: string, @PathParam("key") key: string) {
        return {id, key};
    }

    @Get("queryTest1")
    getWithQuery1(@QueryParam("q1") q1: string, @QueryParam("q2") q2: string) {
        return {q1, q2};
    }

    @Get("queryTest2")
    getWithQuery2(@Query q: string) {
        return q;
    }
}

function initRoutes(): Route[] {
    const controller = new TestController();
    const routes: Route[] = [];
    registerController(controller, (route: Route) => {
        routes.push(route);
    });
    return routes;
}

it('Sync route', async () => {
    const routes = initRoutes();
    const routeGetAll = routes.find(r => r.method == "GET" && r.url == "api")!;
    expect(routeGetAll.handler()).toEqual([1, 2, 3]);
});

it('Async route', async () => {
    const routes = initRoutes();

    const routeGetAllAsync = routes.find(r => r.method == "GET" && r.url == "api/async")!;
    expect(await routeGetAllAsync.handler()).toEqual([1, 2, 3]);
});

it('Route with path param', async () => {
    const routes = initRoutes();
    const routeGetById = routes.find(r => r.method == "GET" && r.url == "api/:id")!;
    expect(await routeGetById.handler({params: {id: 123}})).toEqual(123);
});

it('Route with multiple path param', async () => {
    const routes = initRoutes();
    const routeGetById = routes.find(r => r.method == "GET" && r.url == "api/:id/tests/:key")!;
    expect(await routeGetById.handler({params: {id: 123, key: 321}})).toEqual({id: 123, key: 321});
});

it('Route with named query params', async () => {
    const routes = initRoutes();
    const route = routes.find(r => r.method == "GET" && r.url == "api/queryTest1")!;
    expect(await route.handler({query: {q1: 123, q2: 321}})).toEqual({q1: 123, q2: 321});
});

it('Route with named query params as object', async () => {
    const routes = initRoutes();
    const route = routes.find(r => r.method == "GET" && r.url == "api/queryTest2")!;
    expect(await route.handler({query: {q1: 123, q2: 321}})).toEqual({q1: 123, q2: 321});
});
