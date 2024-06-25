import { Table, Model, Column, DataType, HasMany, HasOne } from 'sequelize-typescript';
import Friend from './friend.model';
import CodeVerification from './codeverification.model';

enum sourceEnum {
  Whatsapp = 'whatsapp',
  Email = 'email'
}

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
    type: DataType.ENUM(sourceEnum.Email, sourceEnum.Whatsapp),
    allowNull: true,
  })
    source!: sourceEnum;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false
  })
    active!: boolean;

  @HasMany(() => Friend)
    friends!: Friend[];

  @HasOne(() => CodeVerification)
    codeVerification!: CodeVerification;
}
