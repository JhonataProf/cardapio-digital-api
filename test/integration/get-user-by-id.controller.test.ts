import { api } from "../helpers/api";
import { seedUserAndLogin } from "../helpers/auth";
import { syncDb, resetDb, closeDb } from "../helpers/db";

describe("Get User By ID Controller", () => {
  let token: string;

  beforeAll(async () => {
    await syncDb();
  });

  beforeEach(async () => {
    await resetDb();
    const auth = await seedUserAndLogin(); // cria um usuário (provavelmente Gerente) e faz login
    token = auth.accessToken;
  });

  afterAll(async () => {
    await closeDb();
  });

  it("deve buscar um usuário por id", async () => {
    const create = await api()
      .post("/api/usuarios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Fulano",
        email: "fulano@example.com",
        senha: "senha123",
        role: "Funcionario",
      });

    const id = create.body.data?.id ?? create.body.id; // ajusta conforme seu response

    const res = await api()
      .get(`/api/usuarios/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.type).toMatch(/json/);
    expect(res.body.data?.email ?? res.body.email).toBe("fulano@example.com");
  });
});
