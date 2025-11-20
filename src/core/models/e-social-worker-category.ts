import { TESocialReasonsForDismissal, TESocialRegistrationTables, TESocialWorkerCategories } from "./e-social-tables";

export type TESocialWorkerCategoryGridList = {
	id?: number,
	tableId?: number,
	description?: string,
	status?: boolean,
	groupId: number,
	code?: number,
	eSocialRegistrationTables?: TESocialRegistrationTables[],
	eSocialReasonsForDismissal?: TESocialReasonsForDismissal[],
	eSocialWorkerCategories?: TESocialWorkerCategories[],
	pageSize?: number,
	page?: number
}
