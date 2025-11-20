
export type TPermissions = {
	name: string;
	add: boolean;
	edit: boolean;
	del: boolean;
	view: boolean;
	check: boolean;
}

export type TProfiles = {
	id?: number;
	status: boolean;
	description: string;
	permissionNames?: string[];
	permissions: TPermissions[];
}

export type TProfilesFilters = { description?: string }

export type TPermissionType = 'add' | 'edit' | 'del' | 'view' | 'check'

export type TActors = { isRequester: boolean; isApprover: boolean }
