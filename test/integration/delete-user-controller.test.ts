import { api } from "../helpers/api";
import { seedUserAndLogin } from "../helpers/auth";
import { syncDb, resetDb, closeDb } from "../helpers/db";

describe("Delete User Controller", () => {
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
  it("deve deletar um usuário existente", async () => {
    const created = await api()
      .post("/api/usuarios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "User Deletado",
        email: "delete@example.com",
        senha: "senha123",
        role: "Funcionario",
      });

    const id = created.body.data?.id ?? created.body.id;

    const del = await api()
      .delete(`/api/usuarios/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect([200, 204]).toContain(del.status);

    const res = await api()
      .get(`/api/usuarios/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
