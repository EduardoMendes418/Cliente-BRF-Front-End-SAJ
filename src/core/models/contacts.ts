import { CONTACT_TYPE, ENVOLVED_TYPE, TYPE_LINK_WITH_PROCESS } from "src/core/utils/constants";

export type TContact = {
	id: number;
	cpfCnpj: string;
	birthDate: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	addressNumber: string;
	neighborhood: string;
	areaCode: string;
	cityId: number;
	stateId: number;
	personStateIdentificationNumber: string;
	barAssociationRegistration: string;
	supplierCode: number;
	contributorId?: string;
	sapCodeCliFor?: string;
	identificationNumber?: string;
};

export type TContactOption = {
	id: number;
	name: string;
};

export type TContactParams = {
	cpfCnpj?: string;
	supplierCode?: string;
	internalLawyer?: string;
	page?: number;
	pageSize?: number;
};

export type TContactWithLikeParams = {
	partName: string;
	page?: number;
	pageSize?: number;
	type?: number;
};

export type TContactWithLikeWithoutIncludes = {
	id?: number;
	partName?: string;
	responsibleAreaIds?: number[];
	contactType?: CONTACT_TYPE;
	page?: number;
	pageSize?: number;
	notPaginate?: boolean;
};

export type TContactLikePartName = Omit<TContactWithLikeWithoutIncludes, 'id' | 'contactType' | 'page' | 'pageSize' | 'notPaginate'>;

export type TDataImportContact = {
	NameOrCorporateName?: string,
	FantasyName?: string,
	CpfOrCnpj?: string,
	Clifor?: string,
	RgOrOab?: string,
	CreatedAtStart?: string | null,
	CreatedAtEnd?: string | null,
	EntityType?: number | "",
	email?: string,
	phoneNumber?: string,
	situationFilterType?: number | "",
	positionIds?: number | "" | number[]
	ContactIds?: any
}

export type TContactWithLikeAndCpfWithoutIncludes = {
	fragment?: string;
	id?: number;
	contactType?: CONTACT_TYPE;
	envolvedType?: ENVOLVED_TYPE;
	typeOfLinkWithTheProcess?: TYPE_LINK_WITH_PROCESS;
	notPaginate?: boolean;
	page?: number;
	pageSize?: number;
};

export type TContactWithoutIncludes = {
	sapCodeCliFor: any;
	id: number;
	identificationNumber?: string;
	name: string;
	birthDate?: string;
};

export enum EnvolvedTypeEnum {
	Main = 1,
	Others = 2,
	Both = 3,
}

export const envolvedTypeEnumOptions = [
	{ label: "Principal", value: EnvolvedTypeEnum.Main },
	{ label: "Outros", value: EnvolvedTypeEnum.Others },
	{ label: "Ambos", value: EnvolvedTypeEnum.Both }
];