export type CreatePratoDTO = {
  nome: string;
  cozinha: string;
  descricao_resumida: string;
  descricao_detalhada: string;
  imagem?: string | null;
  valor: number;
};
