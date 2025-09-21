import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  Default,
} from "sequelize-typescript";
import { UserRole } from "../enums/UserRole";
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

@Table({
  tableName: "work_shifts",
  timestamps: true,
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @Column(DataType.STRING)
  declare name: string;

  @Unique
  @Column(DataType.STRING)
  declare email: string;

  @Column(DataType.STRING)
  declare password: string;

  @Default(UserRole.EMPLOYEE)
  @Column(DataType.ENUM(...Object.values(UserRole)))
  declare role: UserRole;
}
