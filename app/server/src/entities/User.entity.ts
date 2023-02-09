import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: 'users' })
export class User {

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true, length: 100 })
	login: string;

	@Column({ length: 100 })
	password: string;

	@Column({ default: new Date() })
	createdAt: Date;

	@Column({ nullable: true })
	authStrategie: string;

}
