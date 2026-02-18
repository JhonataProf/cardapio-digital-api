import sequelize from "@/core/database";
import { DataTypes, Model } from "sequelize";
import User from "./user-model";

class Gerente extends Model {
  id!: number;
  nome!: string;
  email!: string;
  telefone!: string;
  userId!: number;
  user!: User; // Associação com o modelo User
}

Gerente.init(
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
    telefone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Nome do modelo alvo
        key: "id", // Chave no modelo alvo que estamos referenciando
      },
    },
  },
  {
    sequelize,
    modelName: "Gerentes",
  }
);
Gerente.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE", onUpdate: "CASCADE" });
export default Gerente;