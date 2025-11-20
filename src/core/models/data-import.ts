import { ParamsGet, TLogs } from '.';
import { BEARISH_REASONS } from "src/screen/goods-and-guarantees/constants";
import { STATUS_FLOW } from "src/screen/judicial-blocks-and-transfers/constants";
import { ACCOUNTABILITY_SITUATION } from "src/screen/goods-and-guarantees/accountability/constants";
import { FOLDER_STATUS } from 'src/screen/settings/constants';
import { STATUS } from 'src/screen/requisitions/constants';
import { TRequestParameters } from './request-parameters';
import { TProcess } from './process';

export type TDataImportFeedbackLineError = {
 rowIndex: number; 
 message: string; 
 success?: boolean; 
};

export type TDataImportGoodsAndGuaranteesFilters = ParamsGet & {
	guaranteeModeId?: number | '';
	originAreaId?: number[];
	legalDepartmentAreaId?: number[];
	folderNumbers?: string | '';
	status?: number[];
	guaranteesStatus?: number | '';
	startGuaranteeDate?: string | null;
	endGuaranteeDate?: string | null;
	startValueGuarantee?: number | '';
	endValueGuarantee?: number | '';
	bankId?: number[] | '';
	judicialAccountNumber?: string | '';
	insuranceCompanyName?: string | '';
	policyNumber?: number | '';
	endorsementNumber?: number | '';
	endorsementStartDate?: string | null;
	endorsementEndDate?: string | null;
	invoiceNumber?: number | '';
	fixedAssetRegistryNumber?: number | '';
	suretyLetterNumber?: number | '';
	registrationNumber?: number | '';
	paymentTypeId?: number[] | '';
	guaranteeTypeId?: number | '';
	ids?: any;
};

export type TDataImportGoodsAndGuarantees = {
	id?: number;
	originArea: string;
	legalDepartmentArea: string;
	folderNumber: string;
	statusId: number;
	status?: string;
	guaranteeModeId: number;
	guaranteeMode?: string;
	guaranteeDate: string;
	goodsGuaranteesRequestStatus: number;
	goodsGuaranteesRequest?: string;
	company: string;
	processNumber: string;
	oppositeParty: string;
	goodLocation: string;
	costCenter: string;
	division: string;
	oldNumber: string;
	processId: number;
	valueGuarantee: number;
	accountingBalance: number;
	legalBalance: number;
	amountWrittenOff?: number;
	guaranteesModalitiesDescription?: string
	guaranteeTypeId?: number
}

export const renameGoodsAndGuaranteesProps = {
	parteContraria: 'oppositeParty'
}

export type TDataImport = {
	 formFile?: FileList | null | any;
	 formFileRequest?: FileList | null | any;
	 formFileAnexos?: FileList | null | any;
	 formFileAttend?: FileList | null | any;
}

export enum MULTIPLE_FILES_TYPE {
	PAYMENT,
	CREDIT_RECEIPT,
	REQUISITIONS,
	DOCUMENTS,
	PROCESS_PROGRESS_SHEET,
	ACCOUNTABILITY,
	JUDICIAL_BLOCKS_AND_TRANSFERS
}

export enum SINGLE_FILE_TYPE {
	CONTACTS,
	PROCESS_PROGRESS_SHEET,
	PROCESS_SHEET,
	PROCESS_SHEET_INVOLVED,
	REQUEST_CTG_FOLDER,
	OFFICE_MANAGER,
	REQUESTS
}

export enum FOLDER_OPTIONS {
	MAIN = 1,
	ALL = 0,
	LINKED = 2
}



export type TDataImportMultipleFilesForm = ParamsGet & {
  RequestId?:number | null;
	RequestDateBegin: string | null;
	RequestDateEnd: string | null;
	ConclusionDateBegin?: string | null;
	ConclusionDateEnd?: string | null;
	ExpectedServiceDate?: string | null;
	folderNumbers: string[];
	RequestStatusIds?: number[];
	RequestParameterIds?: number[];
	Contingencies: string[];
	LegalDepartmentAreaIds: number[];
	RequesterIds?: number[]
	AdministrativeControlResponsiblesIds: number[];
	serviceUserIds?: number[];
	StatusIds: string[];
	LegalOfficerIds: number[] | "";
	ResponsibleTypes?: number[];
	InternalLawyerIds: number[] | '';
	AgentIds: number[] | "";
	ProcessNumber: string | null;
	responsibleAreaIds: number[]
	responsibleOfficeIds: number[]
	OtherPartyIds: number[] | "";
    notPaginate?: boolean;
	ids?: any;
	page?:number;
	pageSize?:number;
}

export type TDataImportProcessSheetFilters = ParamsGet & {
	folderNumber: string | string[];
	originAreaId: number[];
	legalDepartmentAreaId: number[];
	mainCompanyId: number | '';
	distributionDateStart: string | null;
	distributionDateEnd: string | null;
	creationDateStart: string | null;
	creationDateEnd: string | null;
	registrationComplementDateStart: string | null;
	registrationComplementDateEnd: string | null;
	terminationDateStart: string | null;
	terminationDateEnd: string | null;
	closingDateStart: string | null;
	closingDateEnd: string | null;
	contingency: string;
	statusId: number[] | '';
	type: string;
	agentId: number | '';
	InternalLawyerId: number | '';
	legalResponsibleId: number | '';
	responsibleAreaId: number | '';
	responsibleOfficeId: number | '';
	actionClassId: number | '';
	sphere: string;
	provisionClassId: string[]| '';
	closureId: number | '';
	natureId: string;
	result: any[];
	locationId: string;
	litigationRelationship: FOLDER_OPTIONS | '';
}

export enum TYPE_DOCUMENTS {
	PAYMENT,
	PENSION,
	ACCOUNTABILITY,
	OTHER_LEGAL_ONE_DOCUMENTS,
	REQUEST = 4
}

export enum RADIO_OPTIONS {
	YES,
	NO,
	BOTH
}

export type TDataImportDocuments = {
	type: TYPE_DOCUMENTS | null;
	paymentStartDate?: string | null;
	paymentEndDate?: string | null;
	paymentReceipt?: RADIO_OPTIONS | boolean | null;
	pensionStartDate?: string | null;
	pensionEndDate?: string | null;
	pensionReceipt?: RADIO_OPTIONS | boolean | null;
	accountabilityAccountabilityStartDate?: string | null;
	accountabilityAccountabilityEndDate?: string | null;
	accountabilityBearishReasons?: BEARISH_REASONS | '';
	accountabilityApprovalStartDate?: string | null;
	accountabilityApprovalEndDate?: string | null;
	accountabilityStatusFlowId?: STATUS_FLOW | '';
	accountabilitySituation?: ACCOUNTABILITY_SITUATION | '';
	accountabilityBankId?: number | '';
	foldersNumber?: string[] | string | '';
	folderOptions?: FOLDER_OPTIONS | '';
	file?: FileList | null;
	areasId?: number[] | "";
	folderStatus?: FOLDER_STATUS[] | "";
	
}

export const renamePropsDocuments: { [key: string]: string | any[] } = {
	'Payment.StartDate': "paymentStartDate",
	'Payment.EndDate': "paymentEndDate",
	'Payment.Receipt': "paymentReceipt",
	'Pension.StartDate': "pensionStartDate",
	'Pension.EndDate': "pensionEndDate",
	'Pension.Receipt': "pensionReceipt",
	'Accountability.AccountabilityStartDate': "accountabilityAccountabilityStartDate",
	'Accountability.AccountabilityEndDate': "accountabilityAccountabilityEndDate",
	'Accountability.BearishReasons': "accountabilityBearishReasons",
	'Accountability.ApprovalStartDate': "accountabilityApprovalStartDate",
	'Accountability.ApprovalEndDate': "accountabilityApprovalEndDate",
	'Accountability.StatusFlowId': "accountabilityStatusFlowId",
	'Accountability.Situation': "accountabilitySituation",
	'Accountability.BankId': "accountabilityBankId",
	'FoldersNumber': "foldersNumber",
	'OpcaoPasta': "folderOptions"
}
type OnlySettedValues<T> = {
	[P in keyof T]+?: Exclude<T[P], '' | null>
}

export type TRequestCTGFolderFilterForm = {
	folders: string[] | string;
	originAreaIds: number[];
	legalDepartmentAreaIds: number[];
	mainCompany: number | '';
	distributionDateStart: string | null;
	distributionDateEnd: string | null;
	creationDateStart: string | null;
	creationDateEnd: string | null;
	complementaryRegistrationStart: string | null;
	complementaryRegistrationEnd: string | null;
	terminationDateStart: string | null;
	terminationDateEnd: string | null;
	closingDateStart: string | null;
	closingDateEnd: string | null;
	contingency: number | '';
	statusIds: number[];
	type: string;
	agent: number | '';
	internalLawyer: number | '';
	legalOfficer: number | '';
	responsibleAreaIds: number[];
	responsibleOfficer: number | '';
	actionTypeIds: number | '';
	spheres: number[];
	forecastClasses: number[];
	closures: number | '';
	natureId: number | '';
	litigationRelationship: FOLDER_OPTIONS | '';
	costCenter?: string;
	orderDescriptionId: number[];
	orderExpectationId: number[];
	orderProbabilityId?: number[];
	orderStatusId: number[];
	orderRatingDescription: number[];
	correctionIndex: number[];
	createdDateStart: string | null;
	createdDateEnd: string | null;
	riskValueStart?: number | '';
	riskValueEnd?: number | '';
	orderRatingsValueStart?: number | '';
	orderRatingsValueEnd?: number | '';
	baseDateStart: string | null;
	baseDateEnd: string | null;
	sumProvisionTable: boolean | '';
	active: boolean | '';
	hasAttachment: boolean | '';
	probableValueStart?: number | '';
	probableValueEnd?: number | '';
	possibleValueStart?: number | '';
	possibleValueEnd?: number | '';
	remoteValueStart?: number | '';
	remoteValueEnd?: number | '';
	skipAccounting: boolean
}

export type TRequestCTGFolderFilter = OnlySettedValues<TRequestCTGFolderFilterForm>;

export type TDataImportMultipleFilesFilter = OnlySettedValues<TDataImportMultipleFilesForm>;

export type TGetContacts = {
	EntityType?: number;
	NameOrCorporateName?: string;
	FantasyName?: string;
	CpfOrCnpj?: string;
	Clifor?: string;
	RgOrOab?: string;
	CreatedAtStart?: string;
	CreatedAtEnd?: string;
	Paginate?: boolean;
	Page?: number;
	PageSize?: number;
}

export type TDataImportRequestFilter = {
	id: number | null | "";
	requestDateBegin: string | null;
	requestDateEnd: string | null;
	expectedServiceDate: string | null;
	conclusionDateBegin: string | null;
	conclusionDateEnd: string | null;
	requestParameterIds: number[] | null;
	requestStatusIds: number[] | null;
	requesterIds: number[] | null;
	administrativeControlResponsiblesIds: number[] | null;
	serviceUserIds: number[] | null;
	legalDepartmentAreaIds: number[] | null;
	folderNumbers: string;
	litigationRelationship: string;
	statusIds: number[] | null;
	contingencies: number[] | null;
	otherPartyIds: number[] | null | "";
	internalLawyerIds: number[] | null | "";
	agentIds: number[] | null | "";
	legalOfficerIds: number[] | null | "";
	responsibleAreaIds: number[] | null;
	responsibleOfficeIds: number[] | null | "";
	page?: number;
	pageSize?: number;
	notPaginate?: boolean
}

export type TDataImportRequisition = {
	requesterEmail: string;
	id?: number;
	status: STATUS;
	requestDate: string;
	expectedServiceDate: string;
	forwardAttachmentEmail: boolean;
	emailsWithExternallCopies: string;
	emailsWithInternalCopies: string;
	folderNumber?: string;
	files?: FileList;
	requestParameter: TRequestParameters;
	resultReport: number;
	responsibleName: string;
	responsibleUserId: number;
	dejurAreaId: number;
	administrativeControlResponsiblesIds?: number[];
	logs?: TLogs[];
	createdBy: string;
	serviceUser?: { name: string, email: string }
	process?: TProcess
	responsiblesInService?: string[]
	administrativeControlResponsiblesNames?: string[]
}