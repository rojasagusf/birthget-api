import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './user.model';

@Table({
  timestamps: true,
  tableName: 'friends',
  underscored: true,
})

export default class Friend extends Model {
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
    name!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
    birthdate!: Date;

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
