import { ParamsGet } from '.';

export type TWatson = {
	nameFilter?: string;
	WatsonSearchFilterId?: number
	id?: number | '';
	userId?: number | '';
	statusFilter?: boolean;
	areaDejur?: number | '' | null;
	createdDate?: string,

	folderNumber?: string[] | string;
	legalDepartamentArea?: number[];
	litigationRelationship?: number | string,


	filterBaseGeralContingencyEnum?: number[];
	filterBaseGeralStatusEnum?: number[];
	filterBaseGeralSphere?: string[];
	filterBaseGeralCreationDateStart?: string | null;
	filterBaseGeralCreationDateEnd?: string | null;
	filterBaseGeralProvisionClass?: string[];

	filterBaseGeralDeadContingencyEnum?: number[];
	filterBaseGeralDeadStatusEnum?: number[];
	filterBaseGeralDeadSphere?: string[];
	filterBaseGeralDeadTerminationDateStart?: string | null;
	filterBaseGeralDeadTerminationDateEnd?: string | null;
	filterBaseGeralDeadProvisionClass?: string[];

	filterGoodsGuarantesGuaranteeModeId?: number[];
	filterGoodsGuarantesPaymentType?: number[];
	filterGoodsGuarantesStatusEnum?: number[];
	filterGoodsGuarantesBearishReasons?: number[];

	filterConvertedDepositBearishReasons?: number[];
	filterConvertedDepositGuaranteeModeId?: number[];
	filterConvertedDepositPaymentType?: number[];
	filterConvertedDepositSituationAccountability?: number[];
	filterConvertedStatus?: number[];
	filterConvertedDepositApprovalDateStart?: string | null;
	filterConvertedDepositApprovalDateEnd?: string | null;

	filterPaymentStatusApprovalId?: number[];
	filterPaymentPaymentType?: number[];
	filterPaymentSapEntryDateStart?: string | null;
	filterPaymentSapEntryDateEnd?: string | null;

	indexSelic?: number | '';
	indexLegalInterest?: number | '';

	baseRevision?: boolean;
	simulation?: boolean;
}

export const renameProps: { [key: string]: string | any[] } = {
	FolderNumber: 'folderNumber',
	LegalDepartamentArea: 'LegalDepartamentArea',
    litigationRelationship: 'litigationRelationship',

	'FilterBaseGeral.ContingencyEnum': 'filterBaseGeralContingencyEnum',
	'FilterBaseGeral.StatusEnum': 'filterBaseGeralStatusEnum',
	'FilterBaseGeral.Sphere': 'filterBaseGeralSphere',
	'FilterBaseGeral.CreationDateStart': 'filterBaseGeralCreationDateStart',
	'FilterBaseGeral.CreationDateEnd': 'filterBaseGeralCreationDateEnd',
	'FilterBaseGeral.ProvisionClass': 'filterBaseGeralProvisionClass',

	'FilterBaseGeralDead.ContingencyEnum': 'filterBaseGeralDeadContingencyEnum',
	'FilterBaseGeralDead.StatusEnum': 'filterBaseGeralDeadStatusEnum',
	'FilterBaseGeralDead.Sphere': 'filterBaseGeralDeadSphere',
	'FilterBaseGeralDead.TerminationDateStart': 'filterBaseGeralDeadTerminationDateStart',
	'FilterBaseGeralDead.TerminationDateEnd': 'filterBaseGeralDeadTerminationDateEnd',
	'FilterBaseGeralDead.ProvisionClass': 'filterBaseGeralDeadProvisionClass',

	'FilterGoodsGuarantes.GuaranteeModeId': 'filterGoodsGuarantesGuaranteeModeId',
	'FilterGoodsGuarantes.PaymentType': 'filterGoodsGuarantesPaymentType',
	'FilterGoodsGuarantes.StatusEnum': 'filterGoodsGuarantesStatusEnum',
	'FilterGoodsGuarantes.BearishReasons': 'filterGoodsGuarantesBearishReasons',

	'FilterConvertedDeposit.BearishReasons': 'filterConvertedDepositBearishReasons',
	'FilterConvertedDeposit.GuaranteeModeId': 'filterConvertedDepositGuaranteeModeId',
	'FilterConvertedDeposit.PaymentType': 'filterConvertedDepositPaymentType',
	'FilterConvertedDeposit.SituationAccountability': 'filterConvertedDepositSituationAccountability',
	'FilterConvertedDeposit.ApprovalDateStart': 'filterConvertedDepositApprovalDateStart',
	'FilterConvertedDeposit.ApprovalDateEnd': 'filterConvertedDepositApprovalDateEnd',

	'FilterPayment.StatusApprovalId': 'filterPaymentStatusApprovalId',
	'FilterPayment.PaymentType': 'filterPaymentPaymentType',
	'FilterPayment.SapEntryDateStart': 'filterPaymentSapEntryDateStart',
	'FilterPayment.SapEntryDateEnd': 'filterPaymentSapEntryDateEnd',

	'EconomicIndices.FormulaCorrectionRuleId': 'economicIndicesFormulaCorrectionRuleId',
}

export type TWatsonParameters = {
	id?: number | '';
	generateWatsonLoad?: boolean | '';
	isActive?: boolean | '';
	updateLegalOne?: boolean | '';
	areaDejurId?: number | '';
	orderDescriptionId?: number | '';
	formulaCorrectionRuleId?: number | '';
}

export type TWatsonFilter = ParamsGet & {
	id?: number | '';
}
export type TFilterBaseGeral = {
	creationDateEnd: string | null
	creationDateStart: string | null
	terminationDateStart: string | null
	terminationDateEnd: string | null
}
export type TWatsonList = ParamsGet & {
	id?: number | '';
	idWatsonLoad?: string | '';
	userId?: number | null;
	executionDate?: string | null;
	status?: number;
	areas?: any;
	triggerWatsonWithError?: boolean | null;
	filterBaseGeral?: TFilterBaseGeral[]
}

export type TParamsXlsx = {
	idWatson: string;
	nameFiles: any;
}
