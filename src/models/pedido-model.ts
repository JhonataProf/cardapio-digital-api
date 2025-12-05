import { DataTypes, Model } from "sequelize";
import sequelize from "../database";
import { User } from "./user-model";

export class Pedido extends Model {
  id!: number;
  codigo!: string;
  userId!: number;
  cliente_nome!: string;
  cliente_endereco!: string;
  cliente_telefone!: string;
  prato_id!: number;
  quantidade!: number;
  status!: "CRIADO" | "PAGO" | "ATUALIZADO" | "CANCELADO";
}

Pedido.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Nome do modelo alvo
        key: "id", // Chave no modelo alvo que estamos referenciando
      },
    },
    cliente_nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cliente_endereco: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cliente_telefone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prato_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Pratos", // Name of the target model
        key: "id", // Key in the target model that we're referencing
      },
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("CRIADO", "PAGO", "ATUALIZADO", "CANCELADO"),
      defaultValue: "CRIADO",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Pedido",
  }
);
Pedido.belongsTo(User, { foreignKey: "userId", as: "user" });
export default Pedido;
