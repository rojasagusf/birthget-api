import { Table, Model, Column, DataType } from 'sequelize-typescript';

enum RolesEnum {
  Admin = 'admin',
  Branch = 'branch'
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
		allowNull: false
	})
		password!: string;

		@Column({
			type: DataType.ENUM(...Object.values(RolesEnum)),
			defaultValue: RolesEnum.Branch,
			allowNull: false,
		})
		role!: RolesEnum;

  @Column({
    type: DataType.BOOLEAN,
		defaultValue: false,
    allowNull: false
  })
    disabled!: boolean;
}
