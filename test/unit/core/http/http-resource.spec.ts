import {
    collection,
    created,
    noContent,
    ok,
    resource,
} from "@/core/http/http-resource";

describe("core/http/http-resource", () => {
  it("resource() deve montar um Resource com data, links e meta (quando informado)", () => {
    const data = { id: 1, nome: "John" };
    const links = {
      self: { href: "/users/1", method: "GET" as const },
      update: { href: "/users/1", method: "PUT" as const },
    };
    const meta = { version: "1.0.0" };

    const result = resource(data, links, meta);

    expect(result).toEqual({
      data,
      links,
      meta,
    });
  });

  it("resource() deve permitir meta undefined", () => {
    const data = { ok: true };
    const links = { self: { href: "/x", method: "GET" as const } };

    const result = resource(data, links);

    expect(result).toEqual({
      data,
      links,
      meta: undefined,
    });
  });

  it("collection() deve montar um CollectionResource com data[] e links", () => {
    const data = [
      { id: 1, nome: "A" },
      { id: 2, nome: "B" },
    ];
    const links = {
      self: { href: "/users", method: "GET" as const },
      create: { href: "/users", method: "POST" as const },
    };

    const result = collection(data, links);

    expect(result).toEqual({
      data,
      links,
      meta: undefined,
    });
  });

  it("ok() deve retornar statusCode 200 e body intacto", () => {
    const body = resource(
      { id: 1 },
      { self: { href: "/users/1", method: "GET" as const } }
    );

    const res = ok(body);

    expect(res).toEqual({
      statusCode: 200,
      body,
    });
  });

  it("created() deve retornar statusCode 201 e body intacto", () => {
    const body = resource(
      { id: 1 },
      { self: { href: "/users/1", method: "GET" as const } }
    );

    const res = created(body);

    expect(res).toEqual({
      statusCode: 201,
      body,
    });
  });

  it("noContent() deve retornar statusCode 204 e body null", () => {
    const res = noContent();

    expect(res).toEqual({
      statusCode: 204,
      body: null,
    });
  });
});
