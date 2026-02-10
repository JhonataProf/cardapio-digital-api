import { ENV } from "@/core/config/env";
import { initializeDatabaseAndServer } from "@/core/config/initializeDatabaseAndServer";
import sequelize from "./core/database";
// deve ser a primeira coisa a rodar em prod
if (process.env.NODE_ENV === "production") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("module-alias/register");
}
async function start() {
  try {
    const app = (await import("@/core/config/app")).default;

    await initializeDatabaseAndServer(sequelize);

    const server = app.listen(ENV.PORT, () => {
      console.log(`Servidor rodando na porta ${ENV.PORT}`);
      if (ENV.SWAGGER_ENABLED) {
        console.log(`Docs: http://localhost:${ENV.PORT}/api-docs`);
      }
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`Recebido ${signal}. Encerrando...`);
      server.close(async () => {
        try {
          await sequelize.close();
          console.log("Conexão com DB fechada.");
          process.exit(0);
        } catch (e) {
          console.error("Erro ao fechar DB:", e);
          process.exit(1);
        }
      });
      // garante encerramento mesmo se algo travar
      setTimeout(() => process.exit(1), 10_000).unref();
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    // Boas práticas de runtime
    process.on("unhandledRejection", (reason) => {
      console.error("unhandledRejection:", reason);
    });
    process.on("uncaughtException", (err) => {
      console.error("uncaughtException:", err);
      process.exit(1);
    });
  } catch (err) {
    console.error("Falha ao iniciar servidor:", err);
    process.exit(1);
  }
}

start();
