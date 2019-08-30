# ts-api-controller-decorators

Example:
1. Decorate controller:
```ts
@Controller({baseUrl: '/api/foo'})
export class FooController {

  constructor(private readonly service: FooService) {
  }

  @Get()
  async getFoos(): Promise<Foo[]> {
    return await this.service.getAll();
  }

  @Get(":id")
  async getFoo(req): Promise<Foo> {
    return await this.service.get(req.params.id);
  }
  
  ...
}
```
2. Register controller:
Fastify example:
```ts
    const server = Fastify({logger: true});
    registerController(controller, route => server.route(route));
```
