import { Table, Model, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import User from './user.model';

@Table({
  timestamps: true,
  tableName: 'code_verifications',
  underscored: true,
})

export default class CodeVerification extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
    id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    transaction!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  @Column
    userId!: number;

  @BelongsTo(() => User)
    user!: User;
}
