import { TReportFilterField } from "./report-configuration";

export type TTypeForm =
	| "payment"
	| "pensions"
	| "guarantees"
	| "blocksAndTransfers";

export enum TReportComponent {
	PAYMENTS = 1,
	ACCOUNTABILITY = 4,
	GOODS_GUARANTEES = 69,
	ACCOUNTABILITYR = 2,
	JUDICIAL_BLOCKS_AND_TRANSFERS = 11,
	CREDIT_RECEIPT = 19,
	PENSIONS = 21,
	STATISTICAL_ORDER = 23,
	NOTICE_INSPECTION_PAYMENT = 44,
	LEGAL_DOCUMENT = 51,
	CIRCULARIZATION_BASE_GENERATION = 70,
	CIRCULARIZATION_REPORT = 75,
	ACCOUNTING_REPORT = 77,
	EQUALIZATION = 28,
	S2500 = 122,
	S2501 = 123,
	LOGS = 124,
	S204 = 204
}

export enum TFilterType {
	SEARCH = 0,
	RESULT = 1,
}

export type TMainFilterReportParams = {
	folderNumberOption?: string;
	originAreaId?: string;
	legalDepartmentAreaId?: string;
	empresa?: string;
	oppositePart?: string;
	identifierNumber?: string;
	oldNumber?: string;
	otherNumber?: string;
	opposingLawyer?: string;
	folderNumber?: string;
	contingency?: string;
	sphere?: string;
	statusId?: string;
	result?: string;
	distributionDateInitial?: string;
	distributionDateFinal?: string;
	creationDateInitial?: string;
	creationDateFinal?: string;
	dataComplementoCadastroInitial?: string;
	dataComplementoCadastroFinal?: string;
	terminationDateInitial?: string;
	terminationDateFinal?: string;
	closingDateInitial?: string;
	closingDateFinal?: string;
	comarca?: string;
	city?: string;
	internalLawyer?: string;
	agent?: string;
	mainResponsible?: string;
	responsibleAreaId?: string;
	officeResponsible?: string;
	actionType?: string;
	provisionClass?: string;
	originCostCenter?: string;
	costCenter?: string;
	closure?: string;
	businessArea?: string;
	categoria?: string;
	listObjects?: string;
	listInvolved?: string;
	provisionOrderList?: string;
	companies?: any[];
};

export type TPaymentReportParams = TMainFilterReportParams & {
	filterId: number;
	dataSolicitacaoInitial?: string;
	dataSolicitacaoFinal?: string;
	dataVencimentoInitial?: string;
	dataVencimentoFinal?: string;
	receiptDateInitial?: string;
	receiptDateFinal?: string;
	sapEntryDateInitial?: string;
	sapEntryDateFinal?: string;
	periodoApuracaoInitial?: string;
	periodoApuracaoFinal?: string;
	tipoPagamentoId?: string;
	formaPagamentoId?: string;
	bankId?: string;
	valorPagamentoJudicialInitial?: string;
	valorPagamentoJudicialFinal?: string;
};

export type TPensionReportParams = TMainFilterReportParams & {
	dataSolicitacaoInitial?: string;
	dataSolicitacaoFinal?: string;
	dataPagamentoInitial?: string;
	dataPagamentoFinal?: string;
	dataBaseCorrecaoInitial?: string;
	dataBaseCorrecaoFinal?: string;
	tipoPagamentoId?: string;
	formaPagamentoId?: string;
	favorecido?: string;
	bankId?: string;
	pensionCategoryId?: string;
	statusPensionId?: string;
	receiptDateInitial?: string;
	receiptDateFinal?: string;
	sapEntryDateInitial?: string;
	sapEntryDateFinal?: string;
};

export type TJudicialBlocksAndTransfersReportParams =
	TMainFilterReportParams & {
		bankId?: string;
		blockOrTransfDateInitial?: string;
		completionDateInitial?: string;
		completionDateFinal?: string;
		blockOrTransfDateFinal?: string;
		occurrenceType?: string;
		occurrenceReason?: string;
		judicialBlockStatus?: string;
		judicialTransferStatus?: string;
	};

export type TGoodsGuaranteesReportParams = TMainFilterReportParams & {
	guaranteeModeId?: string;
	requestTypeId?: string;
	statusBem?: number | '';
	paymentTypeId?: string;
	bankId?: string;
	insuranceCompanyName?: string;
	guaranteeDateInitial?: string;
	guaranteeDateFinal?: string;
	emissionDateInitial?: string;
	emissionDateFinal?: string;
	effectiveDateInitial?: string;
	effectiveDateFinal?: string;
	writeOffDateInitial?: string;
	writeOffDateFinal?: string;
	paymentDateInitial?: string;
	paymentDateFinal?: string;
	accountabilityDateInitial?: string;
	accountabilityDateFinal?: string;
	accountabilityWriteOffDateInitial?: string;
	accountabilityWriteOffDateFinal?: string;
	submissionDateInitial?: string;
	submissionDateFinal?: string;
	accountabilityBankId?: string;
	pendingTime?: string;
	status?: string;
	accountabilityStatusFlowId?: string;
	bearishReasons?: string;
	valuationDateInitial?: string;
	valuationDateFinal?: string;
	note?: string;
	rejectionReasonsId?: string;
	returnReasonsId?: string;

};

export type TStatisticalOrderReportParams = TMainFilterReportParams & {
	objectName?: string;
	requestInclusionDate?: string;
};

export type TNoticeInspectionPaymentReportParams = TMainFilterReportParams & {
	tipoPagamentoId?: string;
	formaPagamentoId?: string;
	receiptStatus?: string;
	receiptDateInitial?: string;
	receiptDateFinal?: string;
	valorPagamentoJudicialInitial?: string;
	valorPagamentoJudicialFinal?: string;
	bankId?: string;
	closingDateInitial?: string;
	closingDateFinal?: string;
	internalLawyer?: string;
	favorecidoId?: string;
	dataPagamentoInitial: string;
	dataPagamentoFinal: string;
};

export type TGenerateReportParams = {
	isNew: boolean;
	reportType: TReportComponent;
	reportParams:
		| TPaymentReportParams
		| TPensionReportParams
		| TJudicialBlocksAndTransfersReportParams
		| TGoodsGuaranteesReportParams
		| TStatisticalOrderReportParams;
	customFields: TReportFilterField[];
	filterId: number | null;
};

export type TCreditReceiptReportParams = TMainFilterReportParams & {
	paymentTypes: number[];
	requestDateInitial: string;
	requestDateFinal: string;
	statuses: number[];
	evaluatorObservation: string;
	evaluatorDateInitial: string;
	evaluatorDateFinal: string;
	evaluatorWriteOffDateInitial: string;
	evaluatorWriteOffDateFinal: string;
	evaluatorSendBankDateInitial: string;
	evaluatorSendBankDateFinal: string;
};

export type TLegalDocReportParams = TMainFilterReportParams & {
	requestDateStart: Date | "";
	requestDateEnd: Date | "";
	status: number[];
	legalDocumentRequestTypeId: number | "";
	legalDocumentCoverageIds: number[];
	requestUserIds: number[];
	registryIdentificationCompanyPrepositionLetter: string;
	partyNameCompanyPrepositionLetter: string;
	identificationNumberNominess: string;
	partyNameNominess: string;
	registryIdentificationCompanyReplacement: string;
	partyNameCompanyReplacement: string;
	identificationNumberReplacement: string;
	partyNameReplacement: string;
	officeNameReplacement: string;
	officeOABReplacement: string;
	powersReplacement: string;
	identificationNumberCorrespondent: string;
	partyNameCorrespondent: string;
	officeNameCorrespondent: string;
	officeOABCorrespondent: string;
	grantorIdentificationNumberEletronicProcurationLegal: string;
	grantorNameEletronicProcurationLegal: string;
	publicAgencyGrantedEletronicProcurationLegal: string;
	companyNameGrantedEletronicProcurationLegal: string;
	partnerOfficeNameEletronicProcurationLegal: string;
	validityStartEletronicProcurationLegal: Date | "";
	validityEndEletronicProcurationLegal: Date | "";
	powersEletronicProcurationLegal: string;
	grantorIdentificationNumberEletronicProcurationOtherArea: string;
	grantorNameEletronicProcurationOtherArea: string;
	publicAgencyEletronicProcurationOtherArea: string;
	companyNameGrantedEletronicProcurationOtherArea: string;
	partnerOfficeNameEletronicProcurationOtherArea: string;
	validityStartEletronicProcurationOtherArea: Date | "";
	validityEndEletronicProcurationOtherArea: Date | "";
	powersEletronicProcurationOtherArea: string;
	dejurAreaIds: number[];
	folderNumbers: string[];
	processStatus: number[];
	processNumbers: number[];
	otherPartyContactId: number[];
	legalCourt: string;
	district: string;
	serviceUserIds: number[];
	expectedServiceDate: Date | "";
	conclusionDateStart: Date | "";
	conclusionDateEnd: Date | "";
};

export type TReportDictionary = {
	id?: number;
	orderColumn: number;
	reportComponent: number;
	displayName: string;
	fieldName: string;
	fixedField: boolean;
};

export type TReportDictionaryFilter = {
	reportComponent: number;
	environment: number
};

export type TReportConfigurationUpdate = {
	updatePrd: boolean;
	updateQas: boolean;
	reportComponent: number;
	configurations: TReportDictionary[]
};

export type TSendReportByEmail = {
	executionId: string;
	emailsTo: string[];
	emailsCC: string[];
	subject: string;
	body: string;
}