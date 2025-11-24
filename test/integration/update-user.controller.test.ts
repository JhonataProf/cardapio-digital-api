import { api } from "../helpers/api";
import { seedUserAndLogin } from "../helpers/auth";
import { syncDb, resetDb, closeDb } from "../helpers/db";

describe("Update User Controller", () => {
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

  it("deve atualizar um usuário existente", async () => {
    const created = await api()
      .post("/api/usuarios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "User Antigo",
        email: "old@example.com",
        senha: "senha123",
        role: "Funcionario",
      });

    const id = created.body.data?.id ?? created.body.id;

    const res = await api()
      .put(`/api/usuarios/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "User Atualizado",
        email: "novo@example.com",
      });

    expect(res.status).toBe(200);
    expect(res.type).toMatch(/json/);
    const body = res.body.data ?? res.body;
    expect(body.nome).toBe("User Atualizado");
    expect(body.email).toBe("novo@example.com");
  });
});
