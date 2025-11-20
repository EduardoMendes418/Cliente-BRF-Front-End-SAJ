import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import areas from "./modules/areas";
import paymentMethod from "./modules/payment-method";
import paymentAccountType from "./modules/payment-account-type";
import paymentType from "./modules/payment-type";
import modal from "./modules/modals";
import process from "./modules/process";
import provisionOrder from "./modules/provision-order";
import calculations from "./modules/calculations";
import stateCity from "./modules/state-city";
import banks from "./modules/banks";
import hierarchy from "./modules/hierarchy";
import sapHierarchy from "./modules/hierarchy-sap";

import confrontingOrders from "./modules/confronting-orders";
import paymentTypeMethod from "./modules/payment-type-method";
import paymentRequest from "./modules/payment";
import inspection from "./modules/inspection";
import agreementAuthorization from "./modules/agreement-authorization";
import logProvison from "./modules/log-provision";
import formOfCorrection from "./modules/pensions/form-of-correction";
import requestPensions from "./modules/pensions/request-pensions";
import parameterization from "./modules/parameterization";
import goodsGuaranteesRequest from "./modules/goods-guarantee";
import goodsGuaranteesEstimates from "./modules/goods-guarantee-estimates";
import guaranteeMethod from "./modules/guarantee-method";
import guaranteeType from "./modules/guarantee-type";
import licenseType from "./modules/license-type";
import businessCombinationAccounting from "./modules/business-combination-accounting";
import interestUpdate from "./modules/interest-update";
import guaranteeModality from "./modules/guarantee-modality";
import eSocialRegistrationTable from "./modules/e-social-registration-table";
import eSocialWorkerCategory from "./modules/e-social-worker-category";
import eSocialAreas from "./modules/e-social-areas";
import eSocialClosure from "./modules/e-social-new-employers";
import eSocialGroup from "./modules/e-social-group";
import eSocialReasonsForDismissal from "./modules/e-social-reasons-for-dismissal";
import eSocialTables from "./modules/e-social-tables";
import eSocialEvent from "./modules/e-social-event";
import guaranteeAccountability from "./modules/guarantee-accountability";
import contacts from "./modules/contacts";
import incomeTaxRates from "./modules/income-tax-rates";
import nonWorkingDays from "./modules/non-working-days";
import requestParameters from "./modules/request-parameters";
import requestLog from "./modules/request-log";
import users from "./modules/users";
import profiles from "./modules/profiles";
import judicialBlocksAndTransfers from "./modules/judicial-blocks-and-transfers";
import requisitions from "./modules/requisitions";
import economicIndices from "./modules/economic-indices";
import civilMass from "./modules/civil-mass";
import formulaCorrectionRule from "./modules/formula-correction-rule";
import correctionRule from "./modules/correction-rule";
import equalizationParameters from "./modules/equalization-parameters";
import taxRatesINSS from "./modules/tax-rates-inss";
import creditReceipt from "./modules/credit-receipt";
import financeChartOfAccountsCategories from "./modules/finance-chart-of-accounts-categories";
import reportConfiguration from "./modules/report-configuration";
import reportDictionary from "./modules/report-dictionary";
import costCenter from "./modules/cost-center";
import reportOptions from "./modules/report-options";
import report from "./modules/report";
import litigationActionAppealProceduralIssueType from "./modules/litigation-action-appeal-procedural-issue-type";
import litigationNatures from "./modules/litigation-natures";
import litigationPhases from "./modules/litigation-phases";
import litigationJurisdictions from "./modules/litigation-jurisdictions";
import dataImport from "./modules/data-import";
import provisionAccounting from "./modules/provision-accounting";
import equalization from "./modules/equalization";
import equalizationResult from "./modules/equalization-result";
import rejectionAndReturnReason from "./modules/rejection-and-return-reason";
import helpFiles from "./modules/HelpFiles";
import closures from "./modules/closures";
import smartSwap from "./modules/smart-swap";
import watson from "./modules/watson";
import watsonExport from "./modules/watson-export";
import watsonSettings from "./modules/watson-settings";
import pagination from "./modules/pagination";
import currentUser from "./modules/currentUser";
import explanatoryNote from "./modules/explanatory-note";
import accountType from "./modules/account-type";
import releaseType from "./modules/release-type";
import orderDescription from "./modules/order-description";
import orderExpectation from "./modules/order-expectation";
import orderProbability from "./modules/order-probability";
import orderRatingDescription from "./modules/order-rating-description";
import orderStatus from "./modules/order-status";
import orderConfrontingParameters from "./modules/order-confronting-parameters";
import inspectionMethod from "./modules/inspection-method";
import inspectionType from "./modules/inspection-type";
import officeManagementStatus from "./modules/office-management-status";
import officeManagementDocumentType from "./modules/office-management-document-type";
import officeManagementResponsible from "./modules/office-management-responsible";
import officeManagementControl from "./modules/office-management-control";
import officeManagementInvoice from "./modules/office-management-invoice";
import officeManagementRequestRefund from "./modules/office-management-request-refund";
import legalDocRequest from "./modules/legal-document-request";
import legalDocCoverage from "./modules/legal-document-coverages";
import legalDocReqStatus from "./modules/legal-document-request-status";
import legalDocPowerTypes from "./modules/legal-document-power-types";
import legalDocServiceOpinions from "./modules/legal-document-service-opinions";
import legalDocDraftTypes from "./modules/legal-document-draft-types";
import legalDocReqTypes from "./modules/legal-document-request-types";
import legalDocTables from "./modules/legal-document-tables";
import officeManagementPayment from "./modules/office-management-payment";
import paymentUpdateSupplier from "./modules/payment-update-supplier";
import legalDocGrants from "./modules/legal-cocument-grants";
import legalOne from "./modules/legal-one";
import legalDocSwap from "./modules/legal-document-swap";
import integrations from "./modules/integrations";
import accountability from "./modules/accountability";
import reportItemsCount from "./modules/report-items-count";
import modulo from "./modules/modulo";
import litigationJustice from "./modules/litigation-justice";
import litigationParticipantPositions from "./modules/litigation-participant-positions";
import CircularizationConfiguration from "./modules/circularizationConfiguration";
import CircularizationBaseGenerationHeader from "./modules/circularizationBaseGenerationHeader";
import CircularizationBaseGeneration from "./modules/circularizationBaseGeneration";
import CircularizationOfficeLaunch from "./modules/circularizationOfficeLaunch";
import CircularizationLegalLaunch from "./modules/circularizationLegalLaunch";
import eSocialEventLauch from "./modules/e-social-event-launch";
import lockSystem from "./modules/lock-system";
import smartSwapExecution from "./modules/smart-swap-execution";
import CircularizationOfficeResponsibleConfiguration from "./modules/circularizationOfficeResponsibleConfiguration";
import logInterest from "./modules/log-interest";
import ApprovationFlowManagement from "./modules/approvation-flow-management";
import Lawsuit from "./modules/lawsuit";
import integrationsSap from "./modules/integrations-sap";
import contact from "./modules/contact";
import processRecordRegistrationTable from "./modules/process-record-registration-table";

export const reducer = combineReducers({
	areas: areas.reducer,
	eSocialEventLauch: eSocialEventLauch.reducer,
	banks: banks.reducer,
	calculations: calculations.reducer,
	paymentMethod: paymentMethod.reducer,
	paymentAccountType: paymentAccountType.reducer,
	modal: modal.reducer,
	paymentRequest: paymentRequest.reducer,
	paymentTypeMethod: paymentTypeMethod.reducer,
	parameterization: parameterization.reducer,
	smartSwapExecution: smartSwapExecution.reducer,

	inspection: inspection.reducer,
	closures: closures.reducer,
	pensions: combineReducers({
		formOfCorrection: formOfCorrection.reducer,
		requestPensions: requestPensions.reducer,
	}),
	logProvison: logProvison.reducer,
	process: process.reducer,
	provisionOrder: provisionOrder.reducer,
	stateCity: stateCity.reducer,
	hierarchy: hierarchy.reducer,
	sapHierarchy: sapHierarchy.reducer,
	paymentType: paymentType.reducer,
	agreementAuthorization: agreementAuthorization.reducer,
	goodsGuaranteesRequest: goodsGuaranteesRequest.reducer,
	goodsGuaranteesEstimates: goodsGuaranteesEstimates.reducer,
	guaranteeMethod: guaranteeMethod.reducer,
	guaranteeType: guaranteeType.reducer,
	licenseType: licenseType.reducer,
	businessCombinationAccounting: businessCombinationAccounting.reducer,
	interestUpdate: interestUpdate.reducer,
	guaranteeModality: guaranteeModality.reducer,
	eSocialTables: eSocialTables.reducer,
	eSocialRegistrationTable: eSocialRegistrationTable.reducer,
	eSocialWorkerCategory: eSocialWorkerCategory.reducer,
	eSocialAreas: eSocialAreas.reducer,
	eSocialClosure: eSocialClosure.reducer,
	eSocialGroup: eSocialGroup.reducer,
	eSocialReasonsForDismissal: eSocialReasonsForDismissal.reducer,
	eSocialEvent: eSocialEvent.reducer,
	guaranteeAccountability: guaranteeAccountability.reducer,
	contacts: contacts.reducer,
	incomeTaxRates: incomeTaxRates.reducer,
	nonWorkingDays: nonWorkingDays.reducer,
	requestParameters: requestParameters.reducer,
	requestLog: requestLog.reducer,
	users: users.reducer,
	profiles: profiles.reducer,
	judicialBlocksAndTransfers: judicialBlocksAndTransfers.reducer,
	requisitions: requisitions.reducer,
	economicIndices: economicIndices.reducer,
	pagination: pagination.reducer,
	currentUser: currentUser.reducer,
	civilMass: civilMass.reducer,
	formulaCorrectionRule: formulaCorrectionRule.reducer,
	correctionRule: correctionRule.reducer,
	equalizationParameters: equalizationParameters.reducer,
	taxRatesINSS: taxRatesINSS.reducer,
	creditReceipt: creditReceipt.reducer,
	reportConfiguration: reportConfiguration.reducer,
	reportDictionary: reportDictionary.reducer,
	costCenter: costCenter.reducer,
	reportOptions: reportOptions.reducer,
	report: report.reducer,
	dataImport: dataImport.reducer,
	provisionAccounting: provisionAccounting.reducer,
	financeChartOfAccountsCategories: financeChartOfAccountsCategories.reducer,
	litigationActionAppealProceduralIssueType:
		litigationActionAppealProceduralIssueType.reducer,
	litigationNatures: litigationNatures.reducer,
	litigationPhases: litigationPhases.reducer,
	litigationJurisdictions: litigationJurisdictions.reducer,
	equalization: equalization.reducer,
	equalizationResult: equalizationResult.reducer,
	rejectionAndReturnReason: rejectionAndReturnReason.reducer,
	helpFiles: helpFiles.reducer,
	smartSwap: smartSwap.reducer,
	explanatoryNote: explanatoryNote.reducer,
	accountType: accountType.reducer,
	releaseType: releaseType.reducer,
	watson: watson.reducer,
	watsonExport: watsonExport.reducer,
	watsonSettings: watsonSettings.reducer,
	orderDescription: orderDescription.reducer,
	orderExpectation: orderExpectation.reducer,
	orderProbability: orderProbability.reducer,
	orderRatingDescription: orderRatingDescription.reducer,
	orderStatus: orderStatus.reducer,
	inspectionMethod: inspectionMethod.reducer,
	inspectionType: inspectionType.reducer,
	confrontingOrders: confrontingOrders.reducer,
	officeManagementStatus: officeManagementStatus.reducer,
	officeManagementDocumentType: officeManagementDocumentType.reducer,
	officeManagementResponsible: officeManagementResponsible.reducer,
	officeManagementControl: officeManagementControl.reducer,
	officeManagementInvoice: officeManagementInvoice.reducer,
	officeManagementRequestRefund: officeManagementRequestRefund.reducer,
	legalDocRequest: legalDocRequest.reducer,
	legalDocCoverage: legalDocCoverage.reducer,
	legalDocReqStatus: legalDocReqStatus.reducer,
	legalDocPowerTypes: legalDocPowerTypes.reducer,
	legalDocServiceOpinions: legalDocServiceOpinions.reducer,
	legalDocDraftTypes: legalDocDraftTypes.reducer,
	legalDocReqTypes: legalDocReqTypes.reducer,
	legalDocTables: legalDocTables.reducer,
	orderConfrontingParameters: orderConfrontingParameters.reducer,
	officeManagementPayment: officeManagementPayment.reducer,
	paymentSupplierUpdate: paymentUpdateSupplier.reducer,
	legalDocGrants: legalDocGrants.reducer,
	legalOne: legalOne.reducer,
	legalDocSwap: legalDocSwap.reducer,
	integrations: integrations.reducer,
	accountability: accountability.reducer,
	reportItemsCount: reportItemsCount.reducer,
	modulo: modulo.reducer,
	litigationJustice: litigationJustice.reducer,
	litigationParticipantPositions: litigationParticipantPositions.reducer,
	CircularizationConfiguration: CircularizationConfiguration.reducer,
	circularizationBaseGenerationHeader:
		CircularizationBaseGenerationHeader.reducer,
	circularizationBaseGeneration: CircularizationBaseGeneration.reducer,
	CircularizationOfficeLaunch: CircularizationOfficeLaunch.reducer,
	CircularizationLegalLaunch: CircularizationLegalLaunch.reducer,
	logInterest: logInterest.reducer,
	lockSystem: lockSystem.reducer,
	CircularizationOfficeResponsibleConfiguration:
		CircularizationOfficeResponsibleConfiguration.reducer,
	ApprovationFlowManagement: ApprovationFlowManagement.reducer,
	Lawsuit: Lawsuit.reducer,
	integrationsSap: integrationsSap.reducer,
	contact: contact.reducer,
	processRecordRegistrationTable: processRecordRegistrationTable.reducer,
});

export const actions: { [key: string]: any } = {
	calculations: calculations.actions,
	eSocialEventLauch: eSocialEventLauch.actions,
	paymentMethod: paymentMethod.actions,
	paymentAccountType: paymentAccountType.actions,
	modal: modal.actions,
	paymentRequest: paymentRequest.actions,
	paymentTypeMethod: paymentTypeMethod.actions,
	parameterization: parameterization.actions,
	closures: closures.actions,
	pensions: {
		formOfCorrection: formOfCorrection.actions,
		requestPensions: requestPensions.actions,
	},
	process: process.actions,
	provisionOrder: provisionOrder.actions,
	stateCity: stateCity.actions,
	hierarchy: hierarchy.actions,
	sapHierarchy: sapHierarchy.actions,
	paymentType: paymentType.actions,
	agreementAuthorization: agreementAuthorization.actions,
	goodsGuaranteesRequest: goodsGuaranteesRequest.actions,
	goodsGuaranteesEstimates: goodsGuaranteesEstimates.actions,
	smartSwapExecution: smartSwapExecution.actions,

	guaranteeMethod: guaranteeMethod.actions,
	guaranteeType: guaranteeType.actions,
	licenseType: licenseType.actions,
	logProvison: logProvison.actions,
	businessCombinationAccounting: businessCombinationAccounting.actions,
	interestUpdate: interestUpdate.actions,
	guaranteeModality: guaranteeModality.actions,
	eSocialTables: eSocialTables.actions,
	eSocialRegistrationTable: eSocialRegistrationTable.actions,
	eSocialWorkerCategory: eSocialWorkerCategory.actions,
	eSocialClosure: eSocialClosure.actions,
	eSocialGroup: eSocialGroup.actions,
	eSocialReasonsForDismissal: eSocialReasonsForDismissal.actions,
	eSocialEvent: eSocialEvent.actions,
	guaranteeAccountability: guaranteeAccountability.actions,
	contacts: contacts.actions,
	incomeTaxRates: incomeTaxRates.actions,
	nonWorkingDays: nonWorkingDays.actions,
	requestParameters: requestParameters.actions,
	requestLog: requestLog.actions,
	users: users.actions,
	profiles: profiles.actions,
	judicialBlocksAndTransfers: judicialBlocksAndTransfers.actions,
	pagination: pagination.actions,
	inspection: inspection.actions,
	requisitions: requisitions.actions,
	economicIndices: economicIndices.actions,
	currentUser: currentUser.actions,
	civilMass: civilMass.actions,
	formulaCorrectionRule: formulaCorrectionRule.actions,
	correctionRule: correctionRule.actions,
	equalizationParameters: equalizationParameters.actions,
	taxRatesINSS: taxRatesINSS.actions,
	creditReceipt: creditReceipt.actions,
	reportConfiguration: reportConfiguration.actions,
	reportDictionary: reportDictionary.actions,
	costCenter: costCenter.actions,
	reportOptions: reportOptions.actions,
	report: report.actions,
	dataImport: dataImport.actions,
	provisionAccounting: provisionAccounting.actions,
	financeChartOfAccountsCategories: financeChartOfAccountsCategories.actions,
	litigationActionAppealProceduralIssueType:
		litigationActionAppealProceduralIssueType.actions,
	litigationNatures: litigationNatures.actions,
	litigationPhases: litigationPhases.actions,
	litigationJurisdictions: litigationJurisdictions.actions,
	equalization: equalization.actions,
	equalizationResult: equalizationResult.actions,
	rejectionAndReturnReason: rejectionAndReturnReason.actions,
	helpFiles: helpFiles.actions,
	smartSwap: smartSwap.actions,
	explanatoryNote: explanatoryNote.actions,
	accountType: accountType.actions,
	releaseType: releaseType.actions,
	watson: watson.actions,
	watsonExport: watsonExport.actions,
	watsonSettings: watsonSettings.actions,
	orderRatingDescription: orderRatingDescription.actions,
	orderDescription: orderDescription.actions,
	orderProbability: orderProbability.actions,
	orderExpectation: orderExpectation.actions,
	orderStatus: orderStatus.actions,
	inspectionMethod: inspectionMethod.actions,
	inspectionType: inspectionType.actions,
	confrontingOrders: confrontingOrders.actions,
	officeManagementDocumentType: officeManagementDocumentType.actions,
	officeManagementStatus: officeManagementStatus.actions,
	officeManagementResponsible: officeManagementResponsible.actions,
	officeManagementControl: officeManagementControl.actions,
	officeManagementInvoice: officeManagementInvoice.actions,
	officeManagementRequestRefund: officeManagementRequestRefund.actions,
	legalDocRequest: legalDocRequest.actions,
	legalDocCoverage: legalDocCoverage.actions,
	legalDocReqStatus: legalDocReqStatus.actions,
	legalDocPowerTypes: legalDocPowerTypes.actions,
	legalDocServiceOpinions: legalDocServiceOpinions.actions,
	legalDocDraftTypes: legalDocDraftTypes.actions,
	legalDocReqTypes: legalDocReqTypes.actions,
	legalDocTables: legalDocTables.actions,
	orderConfrontingParameters: orderConfrontingParameters.actions,
	officeManagementPayment: officeManagementPayment.actions,
	paymentSupplierUpdate: paymentUpdateSupplier.actions,
	legalDocGrants: legalDocGrants.actions,
	legalOne: legalOne.actions,
	legalDocSwap: legalDocSwap.actions,
	integrations: integrations.actions,
	accountability: accountability.actions,
	reportItemsCount: reportItemsCount.actions,
	modulo: modulo.actions,
	litigationJustice: litigationJustice.actions,
	litigationParticipantPositions: litigationParticipantPositions.actions,
	CircularizationConfiguration: CircularizationConfiguration.actions,
	CircularizationBaseGenerationHeader:
		CircularizationBaseGenerationHeader.actions,
	CircularizationBaseGeneration: CircularizationBaseGeneration.actions,
	CircularizationOfficeLaunch: CircularizationOfficeLaunch.actions,
	CircularizationLegalLaunch: CircularizationLegalLaunch.actions,
	lockSystem: lockSystem.actions,
	logInterest: logInterest.actions,
	CircularizationOfficeResponsibleConfiguration:
		CircularizationOfficeResponsibleConfiguration.actions,
	ApprovationFlowManagement: ApprovationFlowManagement.actions,
	lawsuit: Lawsuit.actions,
	integrationsSap: integrationsSap.actions,
	contact: contact.actions,
	processRecordRegistrationTable: processRecordRegistrationTable.actions,
};
// const rowActionTypes = [] as string[];
// const requestIds = {}

const store = configureStore({
	reducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					"report/fetchReportExcelFile/fulfilled",
					"report/fetchEqualizationReportExcelFile/fulfilled",
					"smartSwap/export-excel/fulfilled",
					"provision/generateProvisionReport/fulfilled",
					"provision/generateProvisionReportRequest/fulfilled",
				],
			},
		}),
	// .concat(api => next => action => {
	// 	const {
	// 		type,
	// 		meta
	// 	} = action
	// 	if (!type.includes("/fetch") || meta === undefined || meta.requestId === undefined) return next(action)
	// 	const arrayType = type.split("/")
	// 	arrayType.pop()
	// 	const finalType = arrayType.join("/")
	// 	if (type.includes("pending")) {
	// 		rowActionTypes.push(finalType)
	// 		requestIds[finalType] = meta.requestId
	// 		return next(action)
	// 	}

	// 	const findIndex = rowActionTypes.findIndex(type => type === finalType)
	// 	rowActionTypes.splice(findIndex, 1)
	// 	const findIndexfinal = rowActionTypes.findIndex(type => type === finalType)

	// 	if (requestIds[finalType] !== meta.requestId) {
	// 		rowActionTypes.splice(findIndexfinal, 1)
	// 		return next({type: 'dummy'})
	// 	}

	// 	return next(action)
	// }),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
