export interface SignInReq {
	email: string;
	password: string;
}

export interface AuthUser {
	email: string;
	role: "user" | "admin" | "super_admin" | string;
	is_super_admin: boolean;
	site_id?: string;
	accessible_sites?: string[];
}

export interface LoginRes {
	success?: boolean;
	message?: string;
	user?: AuthUser;
	access_token?: string;
	jwt?: string;
	refreshToken?: string;
	redirect?: string;
	path?: string;
}

export enum UserApi {
	Login = "/auth/login",
	SignUp = "/auth/signup",
	Logout = "/auth/logout",
	User = "/users",
	Users = "/users",
}
