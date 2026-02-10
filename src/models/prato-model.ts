import { DataTypes, Model } from "sequelize";
import sequelize from "../core/database";

export class Prato extends Model {
  id!: number;
  nome!: string;
  cozinha!: string;
  descricao_resumida!: string;
  descricao_detalhada!: string;
  imagem!: string;
  valor!: number;
}

Prato.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cozinha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao_resumida: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao_detalhada: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imagem: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
    },
    valor: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Prato",
  }
);

export default Prato;
