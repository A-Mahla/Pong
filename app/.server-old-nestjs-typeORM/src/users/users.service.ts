import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/User.entity'
import { CreateUserParams, UpdateUserParams } from './User.types'

@Injectable()
export class UsersService {

	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
	) {

	}

	findUsers() {
		return this.userRepository.find()
	}

	findOneUser(login: string) {
		return this.userRepository.findOneBy({ login: login });
	}

	updateUser(login: string, updateUserDetails: UpdateUserParams) {
		return this.userRepository.update({ login }, { ...updateUserDetails })
	}

	deleteUser(login: string) {
		return this.userRepository.delete({ login })
	}

	createUser(userDetails: CreateUserParams) {
		const newUser = this.userRepository.create({
			...userDetails,
			createdAt: new Date()
		});
		return this.userRepository.save(newUser);
	}
}
