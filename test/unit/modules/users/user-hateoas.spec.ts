import { userLinks } from "@/modules/users/presentation/http/user-hateoas";

describe("user-hateoas", () => {
  it("deve gerar links básicos para um userId", () => {
    const links = userLinks(10);

    expect(links).toEqual({
      self: { href: "/api/usuarios/10", method: "GET" },
      update: { href: "/api/usuarios/10", method: "PUT" },
      delete: { href: "/api/usuarios/10", method: "DELETE" },
      list: { href: "/api/usuarios", method: "GET" },
    });

    // asserts “de segurança” (opcional)
    expect(Object.keys(links)).toEqual(
      expect.arrayContaining(["self", "update", "delete", "list"])
    );
  });
});
