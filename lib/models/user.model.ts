import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import Friend from './friend.model';

@Table({
  timestamps: true,
  tableName: 'users',
  underscored: true,
})

export default class User extends Model {
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
    type: DataType.STRING,
    allowNull: false,
  })
    email!: string;

	@Column({
	  type: DataType.STRING,
	  allowNull: false
	})
	  password!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull:true
  })
    cellphone!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false
  })
    disabled!: boolean;

  @HasMany(() => Friend)
    friends!: Friend[];
}
