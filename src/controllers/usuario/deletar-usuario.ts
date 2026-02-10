import { BcryptAdapter } from "@/core/adapters/bcrypt-adapter";
import { ENV } from "@/core/config/env";
import { noContent, notFound, serverError } from "@/core/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { UsuarioService } from "../../service/usuario-service";
class DeletarUsuarioController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { id } = httpRequest.params;
    try {
      const encrypter = new BcryptAdapter(ENV.SALT);
      const usuarioService = new UsuarioService(encrypter);
      const result = await usuarioService.deletarUsuario(Number(id));
      if (!result) {
        return notFound({ error: "Usuário não encontrado" });
      }
      return noContent();
    } catch (error: any) {
      return serverError();
    }
  }
}

export default DeletarUsuarioController;
