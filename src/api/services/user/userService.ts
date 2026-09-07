import apiClient from "@/api/apiClient";
import { executeUserCandidates } from "./userParams";
import { UserApi, type SignInReq, type LoginRes } from "./userTypes";

export * from "./userTypes";

export const login = async (data: SignInReq) => {
	return apiClient.post<LoginRes>(UserApi.Login, data);
};

export const signup = async (data: any) => {
	return apiClient.post<LoginRes>(UserApi.SignUp, data);
};

export const logout = async () => {
	return apiClient.get(UserApi.Logout);
};

export const getUsers = async (
	page = 1,
	limit = 10,
	search = "",
	site_id = "",
	sort_by = "createdAt",
	sort_order: "asc" | "desc" = "desc",
) => {
	let url = `${UserApi.Users}?page=${page}&limit=${limit}&sortBy=${sort_by}&sort=${sort_order}`;

	if (search) {
		url += `&search=${encodeURIComponent(search)}`;
	}

	if (site_id && site_id !== "all") {
		url += `&site=${encodeURIComponent(site_id)}`;
	} else if (site_id === "all") {
		url += "&scope=all";
	}

	return apiClient.get<any>(url);
};

export const findById = async (id: string | number) => {
	const candidates: Array<{ method: "GET"; url: string }> = [
		{ method: "GET", url: `/users/${id}` },
		{ method: "GET", url: `/user/${id}` },
	];
	return executeUserCandidates(candidates);
};

export const updateUserById = async (id: string, data: Record<string, unknown>) => {
	const candidates: Array<{ method: "PATCH" | "PUT"; url: string }> = [
		{ method: "PATCH", url: `/users/${id}` },
		{ method: "PUT", url: `/users/${id}` },
		{ method: "PATCH", url: `/user/${id}` },
		{ method: "PUT", url: `/user/${id}` },
		{ method: "PATCH", url: `/users/update/${id}` },
		{ method: "PUT", url: `/users/update/${id}` },
	];
	return executeUserCandidates(candidates, data);
};

export const createUser = async (data: Record<string, unknown>) => {
	return apiClient.post(UserApi.Users, data);
};

export const deleteUser = async (id: string) => {
	return apiClient.delete(`${UserApi.Users}/${id}`);
};

export default {
	login,
	signup,
	logout,
	getUsers,
	createUser,
	findById,
	updateUserById,
	deleteUser,
};

