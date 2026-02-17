import { BcryptAdapter } from "@/core/adapters/bcrypt-adapter";
import { ENV } from "@/core/config/env";
import { InvalidParamError } from "@/core/errors";
import { badRequest, created, serverError } from "@/core/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { UsuarioService } from "@/service/usuario-service";
class CriarUsuarioController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { nome, email, senha, role } = httpRequest.body;
      const encrypter = new BcryptAdapter(ENV.SALT);
      const usuarioService = new UsuarioService(encrypter);
      const user = await usuarioService.buscarPorEmail(email);
      if (user) {
        return badRequest(new InvalidParamError("email"));
      }
      const usuario = await usuarioService.criarUsuario({
        nome,
        email,
        senha,
        role,
      });
      return created(usuario);
    } catch (error: Error|unknown) {
      return serverError(error);
    }
  }
}
export default CriarUsuarioController;