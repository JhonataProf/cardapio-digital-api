import path from "path";
import YAML from "yamljs";
import merge from "deepmerge";

const swaggerPath = (...segments: string[]) =>
  path.resolve(__dirname, "..", "..", "docs", "swagger", ...segments);

export function loadSwaggerDocument() {
  // carrega os fragmentos
  const base = YAML.load(swaggerPath("base.yaml"));
  const auth = YAML.load(swaggerPath("auth.yaml"));
  const users = YAML.load(swaggerPath("users.yaml"));
  // futuramente:
  // const pratos = YAML.load(swaggerPath("pratos.yaml"));
  // const pedidos = YAML.load(swaggerPath("pedidos.yaml"));

  // merge profundo, respeitando paths e components
  const doc = merge.all([
    base,
    auth,
    users,
    // pratos,
    // pedidos,
  ]);

  return doc;
}
