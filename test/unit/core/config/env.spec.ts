describe("core/config/env", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  function mockDotenvNoop() {
    // env.ts faz: import dotenv from "dotenv"; dotenv.config(...)
    // então precisamos mockar o default export com { config: fn }
    jest.doMock("dotenv", () => ({
      __esModule: true,
      default: { config: jest.fn() },
    }));
  }

  it("deve chamar process.exit(1) quando ENV estiver inválido (sem quebrar o jest)", async () => {
    mockDotenvNoop();

    // env inválido: sem os JWT_* obrigatórios
    process.env = { NODE_ENV: "test" };

    const exitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation((() => undefined) as never);
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await import("@/core/config/env");

    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
    errSpy.mockRestore();
  });

  it("não deve chamar process.exit(1) quando ENV estiver válido", async () => {
    mockDotenvNoop();

    process.env = {
      NODE_ENV: "test",
      // obrigatórios min 16 chars
      JWT_SECRET: "1234567890abcdef",
      JWT_ACCESS_SECRET: "1234567890abcdef",
      JWT_REFRESH_SECRET: "1234567890abcdef",
      // opcionais com default, mas podemos setar PORT por clareza
      PORT: "3000",
    };

    const exitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation((() => undefined) as never);

    const { ENV } = await import("@/core/config/env");

    expect(exitSpy).not.toHaveBeenCalled();
    expect(ENV.NODE_ENV).toBe("test");
    expect(ENV.PORT).toBe(3000);

    exitSpy.mockRestore();
  });
});
