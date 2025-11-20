export type TModulo = {
	id: number;
	descricao: string;
	isRejectionAndReturnReason: boolean;
	createdDate: Date;
	createdBy?: string;
	updatedDate: Date;
	updatedBy?: string;
	isDeleted: boolean;
};

export type TModuloFilter = {
	isRejectionAndReturnReason?: boolean;
}