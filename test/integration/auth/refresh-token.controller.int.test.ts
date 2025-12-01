import { api } from "../../helpers/api";
import { seedUserAndLogin } from "../../helpers/auth";
import { syncDb, resetDb, closeDb } from "../../helpers/db";

describe("Auth - Refresh Token (integration)", () => {
  let refreshToken: string;

  beforeAll(async () => {
    await syncDb();
  });

  beforeEach(async () => {
    await resetDb();
    const auth = await seedUserAndLogin();
    // aqui assumo que seedUserAndLogin retorna tbm o refreshToken.
    // Se não retornar ainda, você pode ajustar a helper pra já extrair.
    refreshToken = auth.refreshToken ?? auth.accessToken; // ajuste conforme seu fluxo
  });

  afterAll(async () => {
    await closeDb();
  });

  it("deve gerar um novo access token a partir de um refresh token válido", async () => {
    const res = await api().post("/api/refresh-token").send({
      refreshToken,
    });

    expect(res.status).toBe(200);
    expect(res.type).toMatch(/json/);

    const body = res.body;

    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("accessToken");
    expect(typeof body.data.accessToken).toBe("string");

    expect(body).toHaveProperty("links");
    expect(body.links[0]).toHaveProperty("rel");
    expect(body.links[1]).toHaveProperty("rel");
  });

  it("deve falhar com refresh token inválido", async () => {
    const res = await api().post("/api/refresh-token").send({
      refreshToken: "token-qualquer-invalido",
    });

    expect([400, 401]).toContain(res.status);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toHaveProperty("code");
    // se quiser ser estrito:
    // expect(res.body.error.code).toBe("INVALID_REFRESH_TOKEN");
  });
});
