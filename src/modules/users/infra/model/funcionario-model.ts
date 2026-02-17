import sequelize from "@/core/database";
import { DataTypes, Model } from "sequelize";
import User from "./user-model";

class Funcionario extends Model {
  id!: number;
  nome!: string;
  email!: string;
  cargo!: string;
  telefone!: string;
  userId!: number;
  user!: User;
}

Funcionario.init(
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
    cargo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Name of the target model
        key: "id", // Key in the target model that we're referencing
      },
    },
  },
  {
    sequelize,
    modelName: "Funcionarios",
  }
);
Funcionario.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE", onUpdate: "CASCADE" });
export default Funcionario;