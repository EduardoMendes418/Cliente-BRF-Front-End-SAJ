
export { default as Home } from "./Home";

export { default as AgreementAuthorization } from "./payment/agreement-authorization";
export { default as AgreementAuthorizationForm } from "./payment/agreement-authorization/Form";
export { default as PaymentRequestForm } from "./payment/request/Form";
export { default as PaymentRequest } from "./payment/request/List";
export { default as PaymentDIRF } from "./payment/DIRF";

export { default as RequestPensions } from "./pensions/request/List";
export { default as RequestPensionsForm } from "./pensions/request/Form";
export { default as PensionsRequestManagement } from "./pensions/request-management/List";
export { default as PensionsRequestManagementFrom } from "./pensions/request-management/Form";
export { default as PensionInterestUpdate } from "./pensions/interest-update";
export { default as Requisitions } from "./requisitions/request/List";
export { default as RequisitionsForm } from "./requisitions/request/Form";
export { default as RequisitionsBatchForm } from "./requisitions/batch-request/Form";
export { default as RequisitionsServiceList } from "./requisitions/service/List";
export { default as RequisitionsServiceForm } from "./requisitions/service/Form";

// Provisões
export { default as ProvisionRequestForm } from "./provisions/request";
export { default as UpdateValuesForm } from "./provisions/update-values";
export { default as ProvisionRequestReport } from "./provisions/request-report";
export { default as StatisticalOrderCalculation } from "./calculations/statistical-order";

// Confronter
export { default as Confronter } from "./confronter";


// Documentos Legais
export { default as LegalDocumentList } from "./legal-document/request/List";
export { default as LegalDocumentForm } from "./legal-document/request/Form";
export { default as LegalDocumentSmartSwap } from "./legal-document/smartswap"

export { default as Configs } from "./settings";

//Configurações -> General
// export {default as IRTable} from './settings/general/IRTable';
export { default as IncomeTaxRates } from "./settings/general/income-tax-rates/List";
export { default as IncomeTaxRatesForm } from "./settings/general/income-tax-rates/Form";
export { default as ApproversRegistration } from "./settings/general/approvers-registration";
export { default as ApproversRegistrationForm } from "./settings/general/approvers-registration/Form";
export { default as Calendar } from "./settings/general/calendar/List";
export { default as CalendarForm } from "./settings/general/calendar/Form";
export { default as RequestParameters } from "./settings/general/request-parameters/List";
export { default as RequestParametersForm } from "./settings/general/request-parameters/Form";
export { default as EconomicIndices } from "./settings/general/economic-indices/List";
export { default as EconomicIndicesForm } from "./settings/general/economic-indices/Form";
export { default as DefaultOrderValue } from "./settings/general/default-order-value/List";
export { default as DefaultOrderValueForm } from "./settings/general/default-order-value/Form";
export { default as DefaultHelp } from "./settings/general/help/List";
export { default as DefaultHelpForm } from "./settings/general/help/Form";
export { default as FormulaCorrectionRule } from "./settings/general/formula-correction-rule/List";
export { default as FormulaCorrectionRuleForm } from "./settings/general/formula-correction-rule/Form";
export { default as EqualizationParameters } from "./settings/general/equalization-parameters/List";
export { default as EqualizationParametersForm } from "./settings/general/equalization-parameters/Form";
export { default as TaxRatesINSS } from "./settings/general/tax-rates-inss/List";
export { default as WatsonSettings } from "./settings/general/watson/List";
export { default as WatsonSettingsFrom } from "./settings/general/watson/From";
export { default as TaxRatesINSSForm } from "./settings/general/tax-rates-inss/Form";
export { default as EvaluationReason } from "./settings/general/evaluation-reason/List";
export { default as EvaluationReasonForm } from "./settings/general/evaluation-reason/Form";
export { default as RequestLogsConfiguration } from "./settings/general/log-configuration/Form";
export { default as RequestLogs } from "./settings/general/log-configuration/List";
export { default as ReportOrders } from "./settings/general/report-orders";
export { default as CircularizationList } from "./settings/circularization/circularization/List";
export { default as CircularizationForm } from "./settings/circularization/circularization/Form";
export { default as CircularizationBaseGenerationList } from "./circularization/circularizationBaseGeneration/List";
export { default as CircularizationBaseGenerationForm } from "./circularization/circularizationBaseGeneration/Form";
export { default as CircularizationOfficeLaunchList } from "./circularization/circularizationOfficeLaunch/List";
export { default as CircularizationOfficeLaunchForm } from "./circularization/circularizationOfficeLaunch/Form";
export { default as CircularizationLegalLaunchList } from "./circularization/circularizationLegalLaunch/List";
export { default as CircularizationLegalLaunchForm } from "./circularization/circularizationLegalLaunch/Form";
export { default as CircularizationReport } from "./circularization/circularizationReport";
export { default as CircularizationOfficeResponsibleList } from "./settings/circularization/circularization-office-responsible/list";
export { default as CircularizationOfficeResponsibleForm } from "./settings/circularization/circularization-office-responsible/Form";
export { default as LockSystemList } from "./settings/general/lock-system/List"
export { default as LockSystemForm } from "./settings/general/lock-system/Form"

//Configurações -> Acessos
export { default as Users } from "./settings/access/users/List";
export { default as UsersForm } from "./settings/access/users/Form";
export { default as Profiles } from "./settings/access/profiles/List";
export { default as ProfilesForm } from "./settings/access/profiles/Form";

//Configurações -> Pagamentos
export { default as PaymentMethodForm } from "./settings/payment/payment-method/Form";
export { default as PaymentMethodList } from "./settings/payment/payment-method/List";
export { default as PaymentAccountTypeForm } from "./settings/payment/account-type/Form";
export { default as PaymentAccountTypeList } from "./settings/payment/account-type/List";
export { default as PaymentTypeForm } from "./settings/payment/payment-type/Form";
export { default as PaymentTypeList } from "./settings/payment/payment-type/List";
export { default as PaymentTypeMethodList } from "./settings/payment/payment-type-method/List";
export { default as PaymentTypeMethodForm } from "./settings/payment/payment-type-method/Form";
export { default as FinancialTerms } from "./settings/payment/prazo-dias-financeiro";
export { default as FGTSIndex } from "./settings/payment/indice-fgts";
export { default as PaymentCode } from "./settings/payment/PaymentCode";
export { default as INSSIndex } from "./settings/payment/indice-inss-gps";

//Configurações -> Pensões
export { default as FormOfPensionPayment } from "./settings/pensions/payment-method/List";
export { default as FormOfPensionPaymentForm } from "./settings/pensions/payment-method/Form";
export { default as PaymentPensionType } from "./settings/pensions/payment-type/List";
export { default as PaymentPensionTypeForm } from "./settings/pensions/payment-type/Form";
export { default as FormOfPensionCorrection } from "./settings/pensions/form-of-correction/List";
export { default as FormOfPensionCorrectionForm } from "./settings/pensions/form-of-correction/Form";

//Configurações -> Bens e Garantias
export { default as GuaranteeMethod } from "./settings/goods-guarantee/guarantee-method/List";
export { default as GuaranteeMethodForm } from "./settings/goods-guarantee/guarantee-method/Form";
export { default as GuaranteeModality } from "./settings/goods-guarantee/guarantee-modality/List";
export { default as GuaranteeModalityForm } from "./settings/goods-guarantee/guarantee-modality/Form";
export { default as ReleaseType } from "./settings/goods-guarantee/release-type/List";
export { default as ReleaseTypeForm } from "./settings/goods-guarantee/release-type/Form";
export { default as GuaranteeType } from "./settings/goods-guarantee/guarantee-type/List";
export { default as GuaranteeTypeForm } from "./settings/goods-guarantee/guarantee-type/Form";
export { default as ExplanatoryNoteList } from "./settings/goods-guarantee/explanatory-note/List";
export { default as ExplanatoryNoteForm } from "./settings/goods-guarantee/explanatory-note/Form";
export { default as AccountTypeList } from "./settings/goods-guarantee/account-type/List";
export { default as AccountTypeForm } from "./settings/goods-guarantee/account-type/Form";
export { default as LicenseType } from "./settings/goods-guarantee/license-type/List";
export { default as LicenseTypeForm } from "./settings/goods-guarantee/license-type/Form";
export { default as DepositUpdate } from "./settings/goods-guarantee/deposit-update/List";
export { default as DepositUpdateForm } from "./settings/goods-guarantee/deposit-update/Form";

export { default as CreditReceiptList } from "./credit-receipt/List";
export { default as CreditReceiptForm } from "./credit-receipt/Form";

export { default as eSocialList } from "./eSocial/List";
export { default as eSocialForm } from "./eSocial/Form";

export { default as GoodsAndGuaranteesList } from "./goods-and-guarantees/List";
export { default as RequestGoodsAndGuaranteesForm } from "./goods-and-guarantees/request";
export { default as GoodsAndGuaranteesFlowForm } from "./goods-and-guarantees/flow";
export { default as GoodsAndGuaranteesManagementList } from "./goods-and-guarantees/management/List";
export { default as GoodsAndGuaranteesManagementView } from "./goods-and-guarantees/management/View";
export { default as GuaranteeAccountability } from "./goods-and-guarantees/accountability/List";
export { default as GuaranteeAccountabilityForm } from "./goods-and-guarantees/accountability/Form";
export { default as AccountingReport } from "./goods-and-guarantees/accounting-report";

export { default as JudicialBlocksAndTransfersList } from "./judicial-blocks-and-transfers/List";
export { default as JudicialBlocksAndTransfersForm } from "./judicial-blocks-and-transfers/Form";
export { default as BlocksAndTransfersAccountability } from "./judicial-blocks-and-transfers/accountability";

//Configurações -> Relatórios
export { default as ReportsList } from "./reports/List";
export { default as ReportsForm } from "./reports/Form";
export { default as ReportsGenerated } from "./reports/generated";

export { default as DataImportContatcs } from "./data-import/contacts";
export { default as DataImportAccountability } from "./data-import/accountability"
export { default as DataImportGoodAndGuarantees } from "./data-import/goods-and-guarantees";
export { default as DataImportDocuments } from "./data-import/documents";
export { default as DataImportCreditReceipt } from "./data-import/credit-receipt";
export { default as DataImportPayment } from "./data-import/payment";
export { default as DataImportProcessSheet } from "./data-import/process-sheet/List";
export { default as DataImportRequisitions } from "./data-import/requisitions";
export { default as DataImportProcessProgressSheet } from "./data-import/process-progress-sheet";
export { default as OfficeManagerDataImport } from './data-import/office-manager';
export { default as Watson } from "./data-import/watson/Form";
export { default as WatsonExport } from "./data-import/watson/List";
export { default as SmartSwap } from "./data-import/smartswap";
export { default as SmartSwapExecution } from "./data-import/smartswap/execution";
export { default as RequestCTGFolder } from "./data-import/request-ctg-folder";
export { default as BusinessCombination } from "./closure/business-combination";
export {default as DefinitiveLow } from "./closure/definitive-low";
export { default as RunEqualization } from "./closure/run-equalization/List";
export { default as RunEqualizationForm } from "./closure/run-equalization/Form";
export { default as ClosingRoutine } from "./closure/closing-routine";
export { default as ProvisionReport } from "./closure/provision-report";
export { default as ClosedProcessReport } from "./closure/closed-process";
export { default as ExecutionMonitor } from "./data-import/execution-monitor"
export { default as RequestListForm } from "./data-import/execution-monitor/Form"

//Configurações -> Provisão
export { default as QueryFolder } from "./provisions/query-folder";
export { default as OrderDescription } from "./settings/provision/order-description/List";
export { default as OrderRatingDescription } from "./settings/provision/order-rating-description/List";
export { default as OrderProbability } from "./settings/provision/order-probability/List";
export { default as OrderExpectation } from "./settings/provision/order-expectation/List";
export { default as OrderStatus } from "./settings/provision/order-status/List";
export { default as OrderConfrontingParameters } from "./settings/provision/order-confronting/List";
export { default as OrderDescriptionForm } from "./settings/provision/order-description/Form";
export { default as OrderRatingDescriptionForm } from "./settings/provision/order-rating-description/Form";
export { default as OrderProbabilityForm } from "./settings/provision/order-probability/Form";
export { default as OrderExpectationForm } from "./settings/provision/order-expectation/Form";
export { default as OrderStatusForm } from "./settings/provision/order-status/Form";
export { default as OrderConfrontingParametersForm } from "./settings/provision/order-confronting/Form";

//Configurações -> Fiscalização
/* export { default as InspectionPaymentMethodList } from "./settings/inspection/payment-method/List";
export { default as InspectionPaymentMethodForm } from "./settings/inspection/payment-method/Form"; */
export { default as InspectionPaymentTypeList } from "./settings/inspection/payment-type/List";
export { default as InspectionPaymentTypeForm } from "./settings/inspection/payment-type/Form";

export { default as PaymentInspectionRequestForm } from "./inspection/request/Form";
export { default as PaymentInspectionRequest } from "./inspection/request/List";

//Configurações ->  Gestão de escritório
export { default as OfficeManagementInvoiceForm } from "./settings/office-management/invoice/Form";
export { default as OfficeManagementInvoiceList } from "./settings/office-management/invoice/List";
export { default as OfficeManagementStatusForm } from "./settings/office-management/status/Form";
export { default as OfficeManagementStatusList } from "./settings/office-management/status/List";
export { default as OfficeManagementDocumentTypeForm } from "./settings/office-management/documentType/Form";
export { default as OfficeManagementDocumentTypeList } from "./settings/office-management/documentType/List";
export { default as OfficeManagementResponsibleForm } from "./settings/office-management/responsible/Form";
export { default as OfficeManagementResponsibleList } from "./settings/office-management/responsible/List";
export { default as OfficeManagementControlForm } from "./settings/office-management/control/Form";
export { default as OfficeManagementControlList } from "./settings/office-management/control/List";

//Configurações -> Documentos Legais
export { default as LegalDocsCoverageForm } from "./settings/legal-documents/coverage/Form";
export { default as LegalDocsCoverageList } from "./settings/legal-documents/coverage/List";
export { default as LegalDocsStatusForm } from "./settings/legal-documents/status/Form";
export { default as LegalDocsStatusList } from "./settings/legal-documents/status/List";
export { default as LegalDocsPowerTypesForm } from "./settings/legal-documents/power-types/Form";
export { default as LegalDocsPowerTypesList } from "./settings/legal-documents/power-types/List";
export { default as LegalDocsServiceOpinionsForm } from "./settings/legal-documents/service-opinions/Form";
export { default as LegalDocsServiceOpinionsList } from "./settings/legal-documents/service-opinions/List";
export { default as LegalDocsDraftTypesForm } from "./settings/legal-documents/draft-types/Form";
export { default as LegalDocsDraftTypesList } from "./settings/legal-documents/draft-types/List";
export { default as LegalDocsRequestTypeForm } from "./settings/legal-documents/request-type/Form";
export { default as LegalDocsRequestTypeList } from "./settings/legal-documents/request-type/List";

//Configurações -> eSocial
export { default as ESocialDejurZoneList } from "./settings/e-social/dejurZone/List";
export { default as ESocialDejurZoneForm } from "./settings/e-social/dejurZone/Form";
export { default as ESocialTablesList } from "./settings/e-social/tables/List";
export { default as ESocialTablesForm } from "./settings/e-social/tables/Form";
export { default as ESocialWorkerCategoryList } from "./settings/e-social/worker-category/List";
export { default as ESocialWorkerCategoryForm } from "./settings/e-social/worker-category/Form";
export { default as ESocialGroupList } from "./settings/e-social/group/List";
export { default as ESocialGroupForm } from "./settings/e-social/group/Form";
export { default as ESocialReasonsForDismissalList } from "./settings/e-social/reasons-for-dismissal/List";
export { default as ESocialReasonsForDismissalForm } from "./settings/e-social/reasons-for-dismissal/Form";
export { default as ESocialRegistrationTableForm } from "./settings/e-social/tables-registration/Form";
export { default as ESocialRegistrationTableList } from "./settings/e-social/tables-registration/List";
export { default as ESocialNewEmployerList } from "./settings/e-social/new-employers/List";
export { default as ESocialNewEmployerForm } from "./settings/e-social/new-employers/Form";

export { default as ESocialEventList } from "./settings/e-social/event/List";
export { default as ESocialEventForm } from "./settings/e-social/event/Form";

export { default as EsocialReport } from "./eSocial/eSocialReport";
export { default as ReportsContactList } from "./contactReport/List";
export { default as ReportsContactForm } from "./contactReport/Form";

// Gestão de escritório
export { default as OfficeManagementList } from "./office-management/List";
export { default as OfficeManagementForm } from "./office-management/Form";
export { default as OfficeManagementReport } from "./office-management/Form/report";
export { default as OfficeManagementRequestRefundList } from "./office-management/request-refund/List";
export { default as OfficeManagementRequestRefundForm } from "./office-management/request-refund/Form";

// Integração
export { default as IntegrationsRequest } from './Integrations/request'
export { default as ApprovationFlowManagement } from "./Integrations/approvationFlowManagement/list"
export { default as IntegrateRecordsAndContacts } from "./Integrations/integrateRecordsAndContacts"
export { default as ContribuitorDataIntegration } from "./Integrations/contribuitorDataIntegration"

// Reports
export { default as ReportRequisitions } from "./reports/Form/types/requests"
export { default as LogsReport } from "./reports/Form/types/Logs"