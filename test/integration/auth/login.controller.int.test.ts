import { api } from "../../helpers/api";
import { seedUserAndLogin } from "../../helpers/auth";
import { syncDb, resetDb, closeDb } from "../../helpers/db";

describe("Auth - Login (integration)", () => {
  let adminToken: string;

  beforeAll(async () => {
    await syncDb();
  });

  beforeEach(async () => {
    await resetDb();
    const auth = await seedUserAndLogin(); // cria um Gerente e faz login
    adminToken = auth.accessToken; // ajuste o nome se for accessToken
  });

  afterAll(async () => {
    await closeDb();
  });

  it("deve realizar login com sucesso e retornar tokens + user", async () => {
    // 1) cria um usuário comum via API
    const email = "cliente@example.com";
    const senha = "senha123";

    const createRes = await api()
      .post("/api/usuarios")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        nome: "Cliente Teste",
        email,
        senha,
        role: "Cliente",
      });

    expect([200, 201]).toContain(createRes.status);

    // 2) faz login com esse usuário
    const res = await api().post("/api/login").send({
      email,
      senha,
    });

    // expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.type).toMatch(/json/);

    // Aqui assumo que você já está usando Resource/HATEOAS.
    // Se ainda não, ajuste para o shape atual.
    const body = res.body;

    // flexível o suficiente pra servir de guarda
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("accessToken");
    expect(body.data).toHaveProperty("refreshToken");
    expect(body.data).toHaveProperty("user");
    expect(body.data.user).toMatchObject({
      email,
      role: "Cliente",
    });

    expect(body).toHaveProperty("links");
    expect(body.links).toHaveProperty("self");
    expect(body.links).toHaveProperty("refreshToken");
  });

  it("deve falhar login com credenciais inválidas", async () => {
    const res = await api().post("/api/login").send({
      email: "nao-existe@example.com",
      senha: "qualquer",
    });

    expect(res.status).toBe(404);
    expect(res.type).toMatch(/json/);
    expect(res.body.data).toHaveProperty("error");
    expect(res.body.data.error).toHaveProperty("code");
    // se seus codes estiverem assim, ajuste se for diferente
    // expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });
});
