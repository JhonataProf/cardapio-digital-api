import { api } from "../helpers/api";
import { seedUserAndLogin } from "../helpers/auth";
import { closeDb, resetDb, syncDb } from "../helpers/db";

describe("Users API (integration)", () => {
  let token: string;

  beforeAll(async () => {
    await syncDb();
  });

  beforeEach(async () => {
    await resetDb();
    const auth = await seedUserAndLogin(); // cria um usuário (provavelmente Gerente) e faz login
    token = auth.token;
  });

  afterAll(async () => {
    await closeDb();
  });

  it("deve criar um usuário com sucesso", async () => {
    const res = await api()
      .post("/api/usuarios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Fulano da Silva",
        email: "fulano@example.com",
        senha: "senha123",
        role: "Funcionario",
      });

    // ajuste se hoje seu controller retorna 200 em vez de 201
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("links");
    expect(res.type).toMatch(/json/);

    // aqui assumo que pelo menos um id/email venha no body
    expect(res.body.data).toMatchObject({
      nome: "Fulano da Silva",
      email: "fulano@example.com",
      role: "Funcionario",
    });

    expect(res.body.links.self).toMatchObject({
      href: expect.stringMatching(/\/api\/usuarios\/\d+/),
      method: "GET",
    });
  });

  it("deve recusar criar usuário com email já existente", async () => {
    // 1) cria usuário
    const first = await api()
      .post("/api/usuarios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Usuário 1",
        email: "duplicado@example.com",
        senha: "senha123",
        role: "Funcionario",
      });

    expect([200, 201]).toContain(first.status);

    // 2) tenta criar com o mesmo email
    const dup = await api()
      .post("/api/usuarios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Usuário 2",
        email: "duplicado@example.com",
        senha: "senha123",
        role: "Funcionario",
      });

    // pelo teste antigo, hoje você retorna 400 com InvalidParamError
    // se depois migrar para 409/Resource, é só ajustar aqui
    expect(dup.status).toBe(409);
    expect(dup.type).toMatch(/json/);
    expect(dup.body.data.error).toHaveProperty("code");
    expect(dup.body.data.error).toHaveProperty("message");
  });

  it("deve validar corpo da requisição (Zod) ao criar usuário", async () => {
    const res = await api()
      .post("/api/usuarios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        // email inválido e sem senha
        nome: "",
        email: "nao-e-email",
        role: "Funcionario",
      });

    expect(res.status).toBe(400);
    expect(res.type).toMatch(/json/);

    // aqui depende muito de como seu validateBody monta o erro.
    // Ajuste conforme sua estrutura de erro hoje.
    expect(res.body).toHaveProperty("errors");
  });

  it("não deve permitir criar usuário sem token JWT", async () => {
    const res = await api().post("/api/usuarios").send({
      nome: "Sem Token",
      email: "sem-token@example.com",
      senha: "senha123",
      role: "Funcionario",
    });

    expect(res.status).toBe(401);
    expect(res.type).toMatch(/json/);
    // sua mensagem vem do auth-middleware
    expect(res.body.error).toHaveProperty("message");
  });

  it("deve listar usuários", async () => {
    // cria dois usuários
    await api()
      .post("/api/usuarios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "User A",
        email: "usera@example.com",
        senha: "senha123",
        role: "Funcionario",
      });

    await api()
      .post("/api/usuarios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "User B",
        email: "userb@example.com",
        senha: "senha123",
        role: "Gerente",
      });

    const res = await api()
      .get("/api/usuarios")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.type).toMatch(/json/);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);

    const emails = res.body.data.map((u: any) => u.email);
    expect(emails).toEqual(
      expect.arrayContaining(["usera@example.com", "userb@example.com"])
    );

    const [first] = res.body.data;

    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("email");
    expect(first).toHaveProperty("links.self");

    expect(res.body.links.self).toMatchObject({
      href: "/api/usuarios",
      method: "GET",
    });
  });
});
