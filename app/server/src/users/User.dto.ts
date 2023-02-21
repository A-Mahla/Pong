export class CreateUserDto {
	login: string;
	password: string;
	intraLogin?:string;
}

export class UpdateUserDto {
	login: string;
	password: string;
	avatar: string;
	intraLogin: string;
	refreshToken: string
}

