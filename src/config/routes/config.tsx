import { ReactNode } from "react";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import AttachMoney from "@material-ui/icons/AttachMoney";
import CreditCardOutlinedIcon from "@material-ui/icons/CreditCardOutlined";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import SettingsIcon from "@material-ui/icons/Settings";
import DnsIcon from "@material-ui/icons/Dns";
import StarOutlineIcon from "@material-ui/icons/StarOutline";
import GavelOutlinedIcon from "@material-ui/icons/GavelOutlined";
import SmsOutlinedIcon from "@material-ui/icons/SmsOutlined";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import NewReleasesOutlinedIcon from "@material-ui/icons/NewReleasesOutlined";
import OfflinePinOutlinedIcon from "@material-ui/icons/OfflinePinOutlined";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import RotateRightIcon from "@material-ui/icons/RotateRight";

import { t } from "src/locale/i18n";
import {
	Home,
	AgreementAuthorization,
	AgreementAuthorizationForm,
	PaymentRequest,
	PaymentRequestForm,
	RequestPensions,
	RequestPensionsForm,
	PensionInterestUpdate,
	ProvisionRequestForm,
	PaymentInspectionRequestForm,
	PaymentInspectionRequest,
	PaymentMethodForm,
	UpdateValuesForm,
	ProvisionRequestReport,
	StatisticalOrderCalculation,
	Requisitions,
	RequisitionsForm,
	RequisitionsBatchForm,
	RequisitionsServiceList,
	RequisitionsServiceForm,
	Configs,
	ApproversRegistration,
	ApproversRegistrationForm,
	IncomeTaxRates,
	IncomeTaxRatesForm,
	Calendar,
	CalendarForm,
	RequestParameters,
	RequestParametersForm,
	Users,
	UsersForm,
	Profiles,
	ProfilesForm,
	PaymentMethodList,
	PaymentTypeForm,
	PaymentAccountTypeForm,
	PaymentAccountTypeList,
	PaymentTypeList,
	PaymentTypeMethodList,
	PaymentTypeMethodForm,
	FinancialTerms,
	FGTSIndex,
	PaymentCode,
	INSSIndex,
	FormOfPensionPaymentForm,
	FormOfPensionPayment,
	PaymentDIRF,
	PaymentPensionTypeForm,
	PaymentPensionType,
	FormOfPensionCorrectionForm,
	FormOfPensionCorrection,
	GuaranteeMethod,
	GuaranteeMethodForm,
	GuaranteeModality,
	GuaranteeModalityForm,
	RequestGoodsAndGuaranteesForm,
	GoodsAndGuaranteesList,
	GoodsAndGuaranteesFlowForm,
	GoodsAndGuaranteesManagementList,
	GoodsAndGuaranteesManagementView,
	GuaranteeAccountability,
	GuaranteeAccountabilityForm,
	AccountingReport,
	JudicialBlocksAndTransfersList,
	JudicialBlocksAndTransfersForm,
	EconomicIndices,
	EconomicIndicesForm,
	DefaultOrderValue,
	DefaultOrderValueForm,
	FormulaCorrectionRule,
	FormulaCorrectionRuleForm,
	EqualizationParameters,
	EqualizationParametersForm,
	TaxRatesINSS,
	TaxRatesINSSForm,
	CreditReceiptList,
	CreditReceiptForm,
	ReportsList,
	ReportsForm,
	DataImportContatcs,
	ExecutionMonitor,
	RequestListForm,
	DataImportGoodAndGuarantees,
	DataImportPayment,
	DataImportDocuments,
	DataImportCreditReceipt,
	DataImportProcessSheet,
	DataImportRequisitions,
	DataImportProcessProgressSheet,
	RunEqualization,
	RunEqualizationForm,
	EvaluationReason,
	EvaluationReasonForm,
	ClosingRoutine,
	ProvisionReport,
	SmartSwap,
	Watson,
	WatsonSettings,
	WatsonSettingsFrom,
	RequestCTGFolder,
	WatsonExport,
	GuaranteeType,
	GuaranteeTypeForm,
	ReleaseType,
	ReleaseTypeForm,
	ExplanatoryNoteList,
	ExplanatoryNoteForm,
	AccountTypeList,
	AccountTypeForm,
	QueryFolder,
	LicenseType,
	LicenseTypeForm,
	DepositUpdate,
	DepositUpdateForm,
	BusinessCombination,
	OrderDescription,
	OrderDescriptionForm,
	OrderRatingDescription,
	OrderRatingDescriptionForm,
	OrderProbability,
	OrderProbabilityForm,
	OrderExpectation,
	OrderExpectationForm,
	OrderStatus,
	OrderStatusForm,
	/* InspectionPaymentMethodForm, */
	/* InspectionPaymentMethodList, */
	InspectionPaymentTypeForm,
	InspectionPaymentTypeList,
	Confronter,
	ClosedProcessReport,
	OfficeManagementStatusForm,
	OfficeManagementStatusList,
	OfficeManagementDocumentTypeForm,
	OfficeManagementDocumentTypeList,
	OfficeManagementResponsibleForm,
	OfficeManagementControlForm,
	OfficeManagementResponsibleList,
	OfficeManagementControlList,
	OfficeManagementInvoiceForm,
	OfficeManagementInvoiceList,
	OfficeManagementRequestRefundList,
	OfficeManagementRequestRefundForm,
	LegalDocsCoverageForm,
	LegalDocsCoverageList,
	LegalDocsStatusForm,
	LegalDocsStatusList,
	LegalDocsPowerTypesForm,
	LegalDocsPowerTypesList,
	LegalDocsServiceOpinionsForm,
	LegalDocsServiceOpinionsList,
	LegalDocsDraftTypesForm,
	LegalDocsDraftTypesList,
	LegalDocsRequestTypeForm,
	LegalDocsRequestTypeList,
	OrderConfrontingParameters,
	OrderConfrontingParametersForm,
	OfficeManagementList,
	OfficeManagementForm,
	PensionsRequestManagement,
	PensionsRequestManagementFrom,
	OfficeManagementReport,
	LegalDocumentForm,
	LegalDocumentList,
	LegalDocumentSmartSwap,
	IntegrationsRequest,
	ApprovationFlowManagement,
	IntegrateRecordsAndContacts,
	ContribuitorDataIntegration,
	OfficeManagerDataImport,
	DataImportAccountability,
	RequestLogsConfiguration,
	RequestLogs,
	ReportOrders,
	ESocialTablesList,
	ESocialTablesForm,
	ReportRequisitions,
	LogsReport,
	ESocialWorkerCategoryList,
	ESocialWorkerCategoryForm,
	ESocialNewEmployerList,
	ESocialNewEmployerForm,
	ESocialGroupList,
	ESocialGroupForm,
	ESocialReasonsForDismissalList,
	ESocialReasonsForDismissalForm,
	ESocialRegistrationTableForm,
	ESocialRegistrationTableList,
	ESocialEventList,
	ESocialEventForm,
	eSocialForm,
	eSocialList,
	BlocksAndTransfersAccountability,
	CircularizationList,
	CircularizationForm,
	CircularizationBaseGenerationList,
	CircularizationBaseGenerationForm,
	CircularizationOfficeLaunchList,
	CircularizationOfficeLaunchForm,
	CircularizationOfficeResponsibleList,
	CircularizationOfficeResponsibleForm,
	DefinitiveLow,
	ReportsGenerated,
	CircularizationLegalLaunchList,
	CircularizationLegalLaunchForm,
	CircularizationReport,
	DefaultHelpForm,
	DefaultHelp,
	LockSystemForm,
	LockSystemList,
	SmartSwapExecution,
	ESocialDejurZoneList,
	ESocialDejurZoneForm,
	EsocialReport,
	ReportsContactForm,
	ReportsContactList,
} from "src/screen";

export type TRoutes = {
	path: string;
	title: string;
	icon?: ReactNode;
	component?: ReactNode;
	subroutes?: TRoutes[];
};

const routes: TRoutes[] = [
	{
		title: t("dashboard"),
		icon: <AssessmentOutlinedIcon />,
		path: "",
		component: Home,
	},
	{
		//calculos
		title: t("calculos"),
		icon: <LocalAtmIcon />,
		path: "calculos",
		component: [StatisticalOrderCalculation, StatisticalOrderCalculation],
	},
	{
		//provisoes
		title: t("provisions"),
		icon: <AssignmentOutlinedIcon />,
		path: "provisoes",
		subroutes: [
			{
				path: "pedidos",
				component: ProvisionRequestForm,
				title: t("provisions:request.title"),
			},
			{
				path: "atualizacao-de-valores",
				component: UpdateValuesForm,
				title: t("provisions:updateValues.title"),
			},
			{
				path: "consulta-pasta",
				component: QueryFolder,
				title: t("provision:provisionLog.title"),
			},
		],
	},
	{
		//confrontador
		title: t("confronter:title"),
		icon: <OfflinePinOutlinedIcon />,
		path: "confrontador",
		component: Confronter,
	},
	{
		//pagamentos
		title: t("pagamentos"),
		icon: <CreditCardOutlinedIcon />,
		path: "pagamentos",
		subroutes: [
			{
				path: "autorizar-acordo",
				component: [AgreementAuthorizationForm, AgreementAuthorization],
				title: t("agreementAuthorization"),
			},
			{
				path: "solicitacao",
				component: [PaymentRequestForm, PaymentRequest],
				title: t("requestPayment"),
			},
			{
				path: "solicitacao-imposto",
				component: [PaymentRequestForm, PaymentRequest],
				title: t("requestTaxtPayment"),
			},
			{
				path: "aprovacao-controle-juridico",
				component: [PaymentRequestForm, PaymentRequest],
				title: t("approvalLegalControlPayment"),
			},
			{
				path: "aprovacao-advogado-interno",
				component: [PaymentRequestForm, PaymentRequest],
				title: t("approvalInternalLawyerPayment"),
			},
			{
				path: "DIRF",
				component: PaymentDIRF,
				title: t("Pagamentos:DIRF.title"),
			},
		],
	},
	{
		//Recebimento-credito
		title: t("receivingCredit"),
		icon: <AttachMoney />,
		path: "recebimento-credito",
		subroutes: [
			{
				path: "solicitacao",
				component: [CreditReceiptForm, CreditReceiptList],
				title: "Incluir",
			},
			{
				path: "avaliacao",
				component: [CreditReceiptForm, CreditReceiptList],
				title: "Avaliar",
			},
		],
	},
	{
		//bens-e-garantias
		title: t("goodsAndGuarantees"),
		icon: <StarOutlineIcon />,
		path: "bens-e-garantias",
		subroutes: [
			{
				path: "solicitacao",
				component: [RequestGoodsAndGuaranteesForm, GoodsAndGuaranteesList],
				title: t("requestGoodsAndGuarantees"),
			},
			{
				path: "avaliacao-controle-juridico",
				component: [RequestGoodsAndGuaranteesForm, GoodsAndGuaranteesList],
				title: t("validationLegalControl"),
			},
			{
				path: "avaliacao-advogado-interno",
				component: [RequestGoodsAndGuaranteesForm, GoodsAndGuaranteesList],
				title: t("evaluationInternalLawyer"),
			},
			{
				path: "fluxo",
				component: [GoodsAndGuaranteesFlowForm, GoodsAndGuaranteesList],
				title: t("goodsAndGuaranteesFlow"),
			},
			{
				path: "gestao",
				component: [
					GoodsAndGuaranteesManagementView,
					GoodsAndGuaranteesManagementList,
				],
				title: t("goodsAndGuaranteesManagement"),
			},
			{
				path: "prestacao-de-contas-solicitacao",
				component: [GuaranteeAccountabilityForm, GuaranteeAccountability],
				title: t("requestGuaranteeAccountability"),
			},
			{
				path: "prestacao-de-contas-avaliacao",
				component: [GuaranteeAccountabilityForm, GuaranteeAccountability],
				title: t("evaluatorGuaranteeAccountability"),
			},
		],
	},
	{
		//bloqueios-e-transferencias
		title: t("judicialBlocksAndTransfers"),
		icon: <GavelOutlinedIcon />,
		path: "bloqueios-e-transferencias",
		subroutes: [
			{
				path: "solicitacao",
				component: [
					JudicialBlocksAndTransfersForm,
					JudicialBlocksAndTransfersList,
				],
				title: "Incluir",
			},
			{
				path: "avaliacao",
				component: [
					JudicialBlocksAndTransfersForm,
					JudicialBlocksAndTransfersList,
				],
				title: "Avaliar",
			},
		],
	},
	{
		//pensoes
		title: t("pensoes"),
		icon: <DescriptionOutlinedIcon />,
		path: "pensoes",
		subroutes: [
			{
				path: "solicitar-pensao",
				component: [RequestPensionsForm, RequestPensions],
				title: t("pension:request.menuTitle"),
			},
			{
				path: "validacao-controle-juridico",
				component: [RequestPensionsForm, RequestPensions],
				title: t("pension:judicialControl.title"),
			},
			{
				path: "aprovacao-advogado-interno",
				component: [RequestPensionsForm, RequestPensions],
				title: t("pension:internalLawyer.title"),
			},
			{
				path: "gestao-da-solicitacao-pensao",
				component: [PensionsRequestManagementFrom, PensionsRequestManagement],
				title: t("pension:pensionsRequestManagement.title"),
			},

			{
				path: "atualizacao-de-juros",
				component: PensionInterestUpdate,
				title: t("pension:interestUpdate.title"),
			},
		],
	},
	{
		//requisicoes
		title: t("requisitions:title"),
		icon: <SmsOutlinedIcon />,
		path: "requisicoes",
		subroutes: [
			{
				path: "requisicoes",
				component: [RequisitionsForm, Requisitions],
				title: t("requisitions:title"),
			},
			{
				path: "atendimento",
				component: [RequisitionsServiceForm, RequisitionsServiceList],
				title: t("requisitions:service.title"),
			},
			{
				path: "lote-de-requisicoes",
				component: RequisitionsBatchForm,
				title: t("requisitions:batch.title"),
			},
		],
	},
	{
		//fechamento
		title: t("closure"),
		icon: <LockOutlinedIcon />,
		path: "fechamento",
		subroutes: [
			{
				path: "executar-equalizacao",
				component: [RunEqualizationForm, RunEqualization],
				title: t("runEqualization"),
			},
			{
				path: "busines-combination",
				component: BusinessCombination,
				title: t("closure:businesCombination.title"),
			},
			{
				path: "competencia-de-fechamento",
				component: ClosingRoutine,
				title: t("closure:closingRoutine.title"),
			},
			{
				path: "relatorio-de-provisao",
				component: ProvisionReport,
				title: t("closure:provisionReport.title"),
			},
			{
				path: "honorario-de-exito",
				component: ClosedProcessReport,
				title: t("closure:closedProcess.title"),
			},
			{
				path: "atualizacao-de-deposito",
				component: AccountingReport,
				title: t("accountingReport"),
			},
			{
				path: "baixa-definitiva",
				component: DefinitiveLow,
				title: t("closure:definitiveLow.title"),
			},
		],
	},
	{
		//documentos-legais
		path: "documentos-legais",
		title: t("legalDocs:title"),
		icon: <AssignmentOutlinedIcon />,
		subroutes: [
			{
				path: "solicitar-documentos-legais",
				component: [LegalDocumentForm, LegalDocumentList],
				title: t("legalDocs:request.title"),
			},
			{
				path: "abrangencia",
				component: [LegalDocsCoverageForm, LegalDocsCoverageList],
				title: t("legalDocs:coverage.title"),
			},
			{
				path: "status",
				component: [LegalDocsStatusForm, LegalDocsStatusList],
				title: t("legalDocs:status.title"),
			},
			{
				path: "troca-inteligente",
				component: LegalDocumentSmartSwap,
				title: t("legalDocs:smartSwap.title"),
			},
		],
	},
	{
		//gestao-escritorio
		title: t("officeManagement:page"),
		icon: <DnsIcon />,
		path: "gestao-escritorio",
		subroutes: [
			{
				path: "solicitar-pagamento",
				component: [OfficeManagementForm, OfficeManagementList],
				title: t("officeManagement:requestPayment.title"),
			},
			{
				path: "avaliacao-advogado",
				component: [OfficeManagementForm, OfficeManagementList],
				title: t("officeManagement:lawyerReview.title"),
			},
			{
				path: "lacamento-fatura",
				component: [OfficeManagementForm, OfficeManagementList],
				title: t("officeManagement:invoicePosting.title"),
			},
			{
				path: "avaliacao-area-juridica",
				component: [OfficeManagementForm, OfficeManagementList],
				title: t("officeManagement:evaluationJuridical.title"),
			},
			{
				path: "avaliacao-controle-juridico",
				component: [OfficeManagementForm, OfficeManagementList],
				title: t("officeManagement:evaluationControl.title"),
			},
			{
				path: "solicitar-reembolso",
				component: [
					OfficeManagementRequestRefundForm,
					OfficeManagementRequestRefundList,
				],
				title: t("settings:officeManagement.RequestRefund"),
			},
			{
				path: "advogado-interno-reembolso",
				component: [
					OfficeManagementRequestRefundForm,
					OfficeManagementRequestRefundList,
				],
				title: t("settings:officeManagement.attorneyApprovalRefund"),
			},
			{
				path: "aprovacao-juridico-reembolso",
				component: [
					OfficeManagementRequestRefundForm,
					OfficeManagementRequestRefundList,
				],
				title: t("settings:officeManagement.evaluationRefund"),
			},
			{
				path: "relatorio",
				component: OfficeManagementReport,
				title: t("officeManagement:report.page"),
			},
		],
	},
	{
		//fiscalizacao
		title: t("inspection"),
		icon: <NewReleasesOutlinedIcon />,
		path: "fiscalizacao",
		subroutes: [
			{
				path: "solicitacao",
				component: [PaymentInspectionRequestForm, PaymentInspectionRequest],
				title: t("requestPayment"),
			},
			{
				path: "aprovacao-controle-juridico",
				component: [PaymentInspectionRequestForm, PaymentInspectionRequest],
				title: t("approvalLegalControlInspection"),
			},
			{
				path: "aprovacao-advogado-interno",
				component: [PaymentInspectionRequestForm, PaymentInspectionRequest],
				title: t("approvalInternalLawyerPayment"),
			},
		],
	},
	{
		//confrontador
		title: "e-Social",
		icon: <OfflinePinOutlinedIcon />,
		path: "e-social",
		component: [eSocialForm, eSocialList],
	},
	{
		//integracoes
		path: "integracoes",
		title: t("integrations:categoryName"),
		icon: <HowToRegIcon />,
		subroutes: [
			{
				path: "request",
				title: t("integrations:pageRouterName"),
				component: IntegrationsRequest,
			},
			{
				path: "enfileiramento",
				title: t("integrations:approvationFlowManagement"),
				component: ApprovationFlowManagement,
			},
			{
				path: "integrar-fichas-e-contatos",
				title: t("integrations:integrateRecordsAndContacts"),
				component: IntegrateRecordsAndContacts,
			},
			{
				path: "integrar-dados-de-colaborador",
				title: t("integrations:contribuitorDataIntegration"),
				component: ContribuitorDataIntegration,
			},
		],
	},
	{
		//relatorios
		title: t("reports:title"),
		icon: <AssessmentOutlinedIcon />,
		path: "relatorios",
		subroutes: [
			{
				path: "gerados",
				component: ReportsGenerated,
				title: t("reports:generatedReports"),
			},
			{
				path: "contatos",
				component: [ReportsContactForm, ReportsContactList],
				title: "Contatos",
			},
			{
				path: "pedidos",
				component: ProvisionRequestReport,
				title: t("provisions:report.title"),
			},
			{
				path: "pagamentos",
				component: [ReportsForm, ReportsList],
				title: t("pagamentos"),
			},
			{
				path: "pensoes",
				component: [ReportsForm, ReportsList],
				title: t("pensoes"),
			},
			{
				path: "bens-e-garantias",
				component: [ReportsForm, ReportsList],
				title: t("goodsAndGuarantees"),
			},
			{
				path: "accountability",
				component: [ReportsForm, ReportsList],
				title: "Prestação de contas",
			},
			{
				path: "bloqueios-e-transferencias",
				component: [ReportsForm, ReportsList],
				title: t("judicialBlocksAndTransfers"),
			},
			{
				path: "pedido-estatistico",
				component: [ReportsForm, ReportsList],
				title: t("statisticalOrder"),
			},
			{
				path: "pagamento-de-fiscalizacao",
				component: [ReportsForm, ReportsList],
				title: t("noticeInspectionPayment"),
			},
			{
				path: "recebimento-de-credito",
				component: [ReportsForm, ReportsList],
				title: t("receivingCredit"),
			},
			{
				path: "legal-document",
				component: [ReportsForm, ReportsList],
				title: t("legalDoc"),
			},
			{
				path: "requisicoes",
				component: ReportRequisitions,
				title: t("dataImport:requisitions.title"),
			},
			{
				path: "circularizacao",
				component: CircularizationReport,
				title: "Circularização",
			},
			{
				path: "e-social",
				component: EsocialReport,
				title: "eSocial",
			},
			{
				path: "logs",
				component: LogsReport,
				title: "Logs",
			},
		],
	},
	{
		//carga-de-dados
		title: t("dataImport:title"),
		icon: <DnsIcon />,
		path: "carga-de-dados",
		subroutes: [
			{
				path: "monitor-de-execucao",
				component: [RequestListForm, ExecutionMonitor],
				title: t("dataImport:executionMonitor.title"),
			},
			{
				path: "contatos",
				component: DataImportContatcs,
				title: t("dataImport:contacts.title"),
			},
			{
				path: "ficha-do-processo",
				component: DataImportProcessSheet,
				title: t("dataImport:processSheet.title"),
			},
			{
				path: "ficha-processo-andamentos",
				component: DataImportProcessProgressSheet,
				title: t("dataImport:processProgressSheet.title"),
			},
			{
				path: "troca-inteligente",
				component: [SmartSwapExecution, SmartSwap],
				title: t("dataImport:smartswap.title"),
			},
			{
				path: "requisicoes",
				component: DataImportRequisitions,
				title: t("dataImport:requisitions.title"),
			},
			{
				path: "carga-watson",
				component: [Watson, WatsonExport],
				title: t("dataImport:watson.title"),
			},
			{
				path: "pedidos-pasta-ctg",
				component: RequestCTGFolder,
				title: t("dataImport:requestCtgFolder.title"),
			},
			{
				path: "pagamentos",
				component: DataImportPayment,
				title: t("dataImport:payment.title"),
			},
			{
				path: "bens-e-garantias",
				component: DataImportGoodAndGuarantees,
				title: t("dataImport:goodsAndGuarantees.title"),
			},
			{
				path: "recebimento-de-credito",
				component: DataImportCreditReceipt,
				title: t("dataImport:creditReceipt.title"),
			},
			{
				path: "documentos",
				component: DataImportDocuments,
				title: t("dataImport:documents.title"),
			},
			{
				path: "gestao-escritorio",
				component: OfficeManagerDataImport,
				title: t("dataImport:officeManager.pageName"),
			},
			{
				path: "prestacao-de-conta",
				component: DataImportAccountability,
				title: t("dataImport:accountability.pageName"),
			},
			{
				path: "bloqueio-e-transferencia",
				component: BlocksAndTransfersAccountability,
				title: "Bloqueio e Transferência",
			},
		],
	},
	{
		//Circularização
		title: "Circularização",
		icon: <RotateRightIcon />,
		path: "circularizacao",
		subroutes: [
			{
				path: "geracao-base-circularizacao",
				title: "Geração base circularização",
				component: [
					CircularizationBaseGenerationForm,
					CircularizationBaseGenerationList,
				],
			},
			{
				path: "lancamento-escritorio",
				title: "Escritório: Avaliação da Base",
				component: [
					CircularizationOfficeLaunchForm,
					CircularizationOfficeLaunchList,
				],
			},
			{
				path: "lancamento-juridico",
				title: "Jurídico: Conciliação de Dados",
				component: [
					CircularizationLegalLaunchForm,
					CircularizationLegalLaunchList,
				],
			},
		],
	},
	{
		//configuracoes
		title: t("configuracoes"),
		icon: <SettingsIcon />,
		path: "configuracoes",
		component: Configs,
		subroutes: [
			{
				path: "geral",
				title: "Geral",
				subroutes: [
					{
						path: "cadastro-aprovadores",
						component: [ApproversRegistrationForm, ApproversRegistration],
						title: t("approversRegistration:title"),
					},
					{
						path: "parametros-ir",
						component: [IncomeTaxRatesForm, IncomeTaxRates],
						title: t("Pagamentos:IRTable.label"),
					},
					{
						path: "parametros-inss",
						component: [TaxRatesINSSForm, TaxRatesINSS],
						title: t("settings:titles.taxRatesINSS"),
					},
					{
						path: "calendario",
						component: [CalendarForm, Calendar],
						title: t("config.calendaryTitle"),
					},
					{
						path: "parametros-requisicao",
						component: [RequestParametersForm, RequestParameters],
						title: t("settings:titles.requestParameters"),
					},
					{
						path: "indices-economicos",
						component: [EconomicIndicesForm, EconomicIndices],
						title: t("settings:titles.economicIndices"),
					},
					{
						path: "valor-predefinido-pedido",
						component: [DefaultOrderValueForm, DefaultOrderValue],
						title: t("settings:titles.defaultOrderValue"),
					},
					{
						path: "formula-regra-correcao",
						component: [FormulaCorrectionRuleForm, FormulaCorrectionRule],
						title: t("settings:titles.formulaCorrectionRule"),
					},
					{
						path: "parametros-equalizacao",
						component: [EqualizationParametersForm, EqualizationParameters],
						title: t("settings:titles.equalizationParameters"),
					},
					{
						path: "watson",
						component: [WatsonSettingsFrom, WatsonSettings],
						title: t("settings:titles.watson"),
					},
					{
						path: "motivo-avaliacao",
						component: [EvaluationReasonForm, EvaluationReason],
						title: t("settings:titles.evaluationReason"),
					},
					{
						path: "log-configuration",
						component: [RequestLogsConfiguration, RequestLogs],
						title: "Consulta LOGs configuração",
					},
					{
						path: "report-orders",
						component: ReportOrders,
						title: "Ordem Dinâmica dos Relatórios ",
					},

					{
						path: "ajuda",
						title: "Gestão de conhecimento",
						component: [DefaultHelpForm, DefaultHelp],
					},
					{
						path: "bloqueio-sistema",
						title: "Bloqueio de sistema",
						component: [LockSystemForm, LockSystemList],
					},
				],
			},
			{
				path: "pagamentos",
				title: t("pagamentos"),
				subroutes: [
					{
						path: "forma-pagamento",
						component: [PaymentMethodForm, PaymentMethodList],
						title: t("Pagamentos:formaPagamento_plural"),
					},
					{
						path: "tipo-pagamento",
						component: [PaymentTypeForm, PaymentTypeList],
						title: t("Pagamentos:tipoPagamento_plural"),
					},
					{
						path: "relacao-tipo-forma",
						component: [PaymentTypeMethodForm, PaymentTypeMethodList],
						title: t("Pagamentos:tipoXFormaPagamento.titulo"),
					},
					{
						path: "prazo-dias",
						component: FinancialTerms,
						title: t("Pagamentos:prazoDiasFinanceiro.title"),
					},
					{
						path: "indice-fgts",
						component: FGTSIndex,
						title: t("Pagamentos:indiceFgts.title"),
					},
					{
						path: "codigo-pagamento",
						component: PaymentCode,
						title: t("Pagamentos:paymentCode.title"),
					},
					{
						path: "indice-inss-gps",
						component: INSSIndex,
						title: t("Pagamentos:indiceInssGps.title"),
					},
					{
						path: "tipo-de-conta",
						component: [PaymentAccountTypeForm, PaymentAccountTypeList],
						title: t("Pagamentos:tipoDeConta"),
					},
				],
			},
			{
				path: "pensoes",
				title: t("pensoes"),
				subroutes: [
					{
						path: "forma-pagamento",
						component: [FormOfPensionPaymentForm, FormOfPensionPayment],
						title: t("Pagamentos:formaPagamento_plural"),
					},
					{
						path: "tipo-pagamento",
						component: [PaymentPensionTypeForm, PaymentPensionType],
						title: t("Pagamentos:tipoPagamento_plural"),
					},
					{
						path: "forma-correcao",
						component: [FormOfPensionCorrectionForm, FormOfPensionCorrection],
						title: t("pension:request.configurations.formsOfCorrection"),
					},
				],
			},
			{
				path: "bens-e-garantias",
				title: t("goodsAndGuarantees"),
				subroutes: [
					{
						path: "formas-garantia",
						component: [GuaranteeMethodForm, GuaranteeMethod],
						title: t("goodsAndGuarantees:guaranteeMethod"),
					},
					{
						path: "modalidade-garantia",
						title: t("goodsAndGuarantees:guaranteeModality"),
						component: [GuaranteeModalityForm, GuaranteeModality],
					},
					{
						path: "tipo-de-garantia",
						title: t("goodsAndGuarantees:guaranteeType.title"),
						component: [GuaranteeTypeForm, GuaranteeType],
					},
					{
						path: "nota-explicativa",
						title: t("goodsAndGuarantees:explanatoryNote.title"),
						component: [ExplanatoryNoteForm, ExplanatoryNoteList],
					},
					{
						path: "tipo-de-conta",
						title: t("goodsAndGuarantees:accountType.title"),
						component: [AccountTypeForm, AccountTypeList],
					},
					{
						path: "tipo-de-liberacao",
						title: t("goodsAndGuarantees:releaseType.title"),
						component: [ReleaseTypeForm, ReleaseType],
					},
					{
						path: "tipo-de-alvara",
						title: t("goodsAndGuarantees:licenseType.title"),
						component: [LicenseTypeForm, LicenseType],
					},
					{
						path: "atualizacao-de-depositos",
						title: t("goodsAndGuarantees:depositUpdate.title"),
						component: [DepositUpdateForm, DepositUpdate],
					},
				],
			},
			{
				path: "provisao",
				title: t("provision"),
				subroutes: [
					{
						path: "ordem-descricao",
						component: [OrderDescriptionForm, OrderDescription],
						title: t("provisions:orderDescription.title"),
					},
					{
						path: "abertura-descricao",
						component: [OrderRatingDescriptionForm, OrderRatingDescription],
						title: t("provisions:orderRatingDescription.title"),
					},
					{
						path: "probabilidade",
						component: [OrderProbabilityForm, OrderProbability],
						title: t("provisions:orderProbability.title"),
					},
					{
						path: "expectativa-provisao",
						component: [OrderExpectationForm, OrderExpectation],
						title: t("provisions:orderExpectation.title"),
					},
					{
						path: "status-provisao",
						component: [OrderStatusForm, OrderStatus],
						title: t("provisions:orderStatus.title"),
					},

					{
						path: "confrontador",
						component: [
							OrderConfrontingParametersForm,
							OrderConfrontingParameters,
						],
						title: t("provision:orderConfrontingParameters.title"),
					},
				],
			},
			{
				path: "fiscalizacao",
				title: t("inspection:page"),
				subroutes: [
					/* {
						path: "forma-pagamento",
						component: [
							InspectionPaymentMethodForm,
							InspectionPaymentMethodList,
						],
						title: "Formas de Pagamento",
					}, */
					{
						path: "tipo-pagamento",
						component: [InspectionPaymentTypeForm, InspectionPaymentTypeList],
						title: "Tipos de Pagamento",
					},
				],
			},
			{
				path: "acessos",
				title: t("access"),
				subroutes: [
					{
						path: "usuarios",
						component: [UsersForm, Users],
						title: t("settings:titles.users"),
					},
					{
						path: "perfis",
						component: [ProfilesForm, Profiles],
						title: t("settings:titles.profiles"),
					},
				],
			},
			{
				path: "gestao-escritorio",
				title: t("settings:officeManagement.officeManagement"),
				subroutes: [
					{
						path: "status",
						component: [OfficeManagementStatusForm, OfficeManagementStatusList],
						title: t("settings:officeManagement.status"),
					},
					{
						path: "documento",
						component: [
							OfficeManagementDocumentTypeForm,
							OfficeManagementDocumentTypeList,
						],
						title: t("settings:officeManagement.documentType"),
					},

					{
						path: "responsavel",
						component: [
							OfficeManagementResponsibleForm,
							OfficeManagementResponsibleList,
						],
						title: t("settings:officeManagement.responsibleLegalArea"),
					},
					{
						path: "nota-fiscal",
						component: [
							OfficeManagementInvoiceForm,
							OfficeManagementInvoiceList,
						],
						title: t("settings:officeManagement.NatureInvoice"),
					},

					{
						path: "controle",
						component: [
							OfficeManagementControlForm,
							OfficeManagementControlList,
						],
						title: t("settings:officeManagement.ResponsibleLegalControlArea"),
					},
				],
			},
			{
				path: "documentos-legais",
				title: t("legalDocs:title"),
				subroutes: [
					{
						path: "abrangencia",
						component: [LegalDocsCoverageForm, LegalDocsCoverageList],
						title: t("legalDocs:coverage.title"),
					},
					{
						path: "status",
						component: [LegalDocsStatusForm, LegalDocsStatusList],
						title: t("legalDocs:status.title"),
					},
					{
						path: "tipo-de-poderes",
						component: [LegalDocsPowerTypesForm, LegalDocsPowerTypesList],
						title: t("legalDocs:powerTypes.title"),
					},
					{
						path: "parecer-do-atendimento",
						component: [
							LegalDocsServiceOpinionsForm,
							LegalDocsServiceOpinionsList,
						],
						title: t("legalDocs:serviceOpinion.title"),
					},
					{
						path: "tipo-de-minuta",
						component: [LegalDocsDraftTypesForm, LegalDocsDraftTypesList],
						title: t("legalDocs:draftTypes.title"),
					},
					{
						path: "tipo-de-solicitacao",
						component: [LegalDocsRequestTypeForm, LegalDocsRequestTypeList],
						title: t("legalDocs:requestTypes.title"),
					},
				],
			},
			{
				path: "e-social",
				title: t("eSocial:title"),
				subroutes: [
					{
						path: "tabelas-do-e-social",
						title: t("eSocial:eSocialTables.title"),
						component: [ESocialTablesForm, ESocialTablesList],
					},
					{
						path: "categoria-do-trabalhador",
						title: t("eSocial:workerCategory.title"),
						component: [ESocialWorkerCategoryForm, ESocialWorkerCategoryList],
					},
					{
						path: "empregadores",
						title: "Empregadores",
						component: [ESocialNewEmployerForm, ESocialNewEmployerList],
					},
					{
						path: "grupo-do-e-social",
						title: t("eSocial:eSocialGroup.title"),
						component: [ESocialGroupForm, ESocialGroupList],
					},
					{
						path: "motivos-de-desligamento",
						title: t("eSocial:reasonsForDismissal.title"),
						component: [
							ESocialReasonsForDismissalForm,
							ESocialReasonsForDismissalList,
						],
					},
					{
						path: "cadastrar-tabelas-do-e-social",
						title: t("eSocial:eSocialTablesRegistration.title"),
						component: [
							ESocialRegistrationTableForm,
							ESocialRegistrationTableList,
						],
					},
					{
						path: "evento-do-e-social",
						title: t("eSocial:eSocialEvent.title"),
						component: [ESocialEventForm, ESocialEventList],
					},
					{
						path: "area-dejur-do-e-social",
						title: t("eSocial:dejurZone.title"),
						component: [ESocialDejurZoneForm, ESocialDejurZoneList],
					},
				],
			},
			{
				path: "circularizacao",
				title: "Circularização",
				subroutes: [
					{
						path: "percentual-de-tolerancia",
						title: "Percentual de tolerância",
						component: [CircularizationForm, CircularizationList],
					},
					{
						path: "responsaveis-escritorios",
						title: "Responsáveis Escritórios",
						component: [
							CircularizationOfficeResponsibleForm,
							CircularizationOfficeResponsibleList,
						],
					},
				],
			},
		],
	},
];

export default routes;
