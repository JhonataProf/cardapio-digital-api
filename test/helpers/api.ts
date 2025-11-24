import request, { Test } from "supertest";
import app from "@/config/app";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export function api(token?: string) {
  const base = request(app);

  // configura um Test para sempre enviar/receber JSON
  const withJson = (t: Test) =>
    t.set("Accept", "application/json").set("Content-Type", "application/json");

  // adiciona o header Authorization (se houver token)
  const withAuth = (t: Test) =>
    token ? t.set("Authorization", `Bearer ${token}`) : t;

  // cria um executor para qualquer verbo http
  const exec = (method: HttpMethod) => {
    return (path: string) => {
      let t = base[method](path);
      t = withJson(t);
      t = withAuth(t);
      return t;
    };
  };

  return {
    /** Métodos HTTP */
    get: exec("get"),
    post: exec("post"),
    put: exec("put"),
    patch: exec("patch"),
    delete: exec("delete"),

    /** Versão autenticada com novo token */
    auth(newToken: string) {
      return api(newToken);
    },

    /** Versão NÃO autenticada */
    noAuth() {
      return api(undefined);
    },

    /** Usado para customizar headers */
    headers(headers: Record<string, string>) {
      const client = api(token);
      return {
        get: (p: string) => base.get(p).set(headers),
        post: (p: string) => base.post(p).set(headers),
        put: (p: string) => base.put(p).set(headers),
        patch: (p: string) => base.patch(p).set(headers),
        delete: (p: string) => base.delete(p).set(headers),
      };
    },
  };
}
