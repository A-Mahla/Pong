export class CreateUserParams {
	login: string;
	password: string;
	avatar?: string;
	intraLogin?: string;
}

export class UpdateUserParams {
	login: string;
	password: string;
	avatar: string;
	intraLogin: string;
}

