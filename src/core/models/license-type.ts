import { ParamsGet } from 'src/core/models';

export type TLicenseType = {
	id: number;
	description: string;
	status: boolean;
}

export type TLicenseDescription = {
	description: string;
}

export type TLicenseFilter = ParamsGet & Partial<TLicenseDescription>
