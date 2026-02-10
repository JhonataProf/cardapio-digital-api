import { DataTypes, Model } from "sequelize";
import sequelize from "../core/database";

export class User extends Model {
  id!: number;
  email!: string;
  senha!: string;
  nome!: string;
  role!: "Gerente" | "Funcionario" | "Cliente";
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Gerente", "Funcionario", "Cliente"),
      allowNull: false,
      defaultValue: "Funcionario",
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

export default User;
