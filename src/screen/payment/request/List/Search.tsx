import { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { Formik } from "formik";

import Panel from "src/components/Panel";
import {
	CurrencyField,
	DateField,
	NumericField,
	SelectField,
	TextField,
} from "src/components/form";
import { Clean, Submit } from "src/components/button";
import ContactField from "src/components/ContactField";
import { useCurrentUser } from "src/config/permissions";

import { useTranslation } from "src/locale/i18n";
import { usePagination } from "src/hooks/pagination";
import { rejectNoValues, valuesToNumber } from "src/core/utils/func";
import { actions } from "src/core/store";
import { getFiltersPayment } from "src/core/store/modules/payment/selectors";
import {
	useGroupedAreas,
	usePaymentMethod,
	usePaymentType,
} from "src/hooks/fetchLists";
import { Modulos } from "src/core/models/modules";
import { TPaymentRequestFilters } from "src/core/models/payment";
import { getLoadingPayment } from "src/core/store/modules/payment/selectors";
import { CONTACT_SEARCH, CONTACT_TYPE, TYPE_LINK_WITH_PROCESS } from "src/core/utils/constants";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

export const statusTextFilter = [
	{ label: "Solicitado", value: 3 },
	{ label: "Devolvido", value: 2 },
	{ label: "Validado Controles Jurídicos", value: 4 }, // statusApprovalId: -1 && statusFlowId: 4
	{ label: "Aprovado Advogado Interno", value: 1 }, // statusApprovalId: -1 && statusFlowId: 1
	{ label: "Cancelado", value: 5 },
	{ label: "Erro na contabilização", value: 8 },
	{ label: "Comprovante Disponibilizado", value: 22 },
	{ label: "Estornado", value: 11}
];

const Search = ({ pathname }: { pathname: string }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { idBrf } = useCurrentUser("")
	const { pageSize } = usePagination();

	const eSocialRestriction = pathname.includes("/pagamentos/solicitacao-imposto") || undefined;
	const isLawyer = pathname.includes("aprovacao-advogado-interno");
	const isRequest = pathname.includes("solicitacao");
	const isLegal = pathname.includes("aprovacao-controle-juridico");
	const { groupedAreasAsOptions} = useGroupedAreas();

	const { paymentTypeAsOptions } = usePaymentType(Modulos.Pagamento, eSocialRestriction);
	const { allPaymentMethodAsOptions } = usePaymentMethod(Modulos.Pagamento);

	const savedFilters = useSelector(getFiltersPayment);
	const loading = useSelector(getLoadingPayment);

	const onSubmit = (
		values: TPaymentRequestFilters
	) => {
		const filters = valuesToNumber<TPaymentRequestFilters>(
			["judicialPaymentValue"],
			values
		);

		if (filters.judicialPaymentValue === 0) filters.judicialPaymentValue = "";

		const result = rejectNoValues({
			...filters,
			paymentId: Number(filters?.paymentId) === 0 ? "": Number(filters?.paymentId),
			page: 1,
			pageSize,
		});

		dispatch(
			actions.paymentRequest.setFilters({
				filters: result,
				internalLawyer: values.internalLawyer ?? "",
				page: pathname,
			})
		);
	};

	const initialValues = useMemo(() => ({
		id: "",
		paymentId: "",
		folderNumber: "",
		paymentDate: null,
		statusFlowId: isRequest || isLegal ? "" : isLawyer ? 4 : 3,
		legalDepartmentAreaId: "",
		processNumber: "",
		processPartiesOtherId: "",
		paymentTypeId: "",
		paymentMethodId: "",
		paymentDateEnd: null,
		paymentDateStart: null,
		judicialPaymentValue: "",
		internalLawyerId: isLawyer ? idBrf : "",
		legalDepartmentArea: "",
		statusApprovalId: "",
		...(savedFilters[pathname] ?? {}),
	}), [isRequest, isLawyer, pathname, savedFilters, idBrf]) as any;

	return (
		<Panel title={t("solicitacaoPagamento:filter")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<NumericField
									name="paymentId"
									label={t("solicitacaoPagamento:numeroSolicitacao")}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<NumericField
									name="folderNumber"
									label={t("solicitacaoPagamento:pastaCTG")}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<DateField
									name="paymentDate"
									label={t("solicitacaoPagamento:dataSolicitacao")}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
							<GroupedSelectFiledMultiple
									name="legalDepartmentAreaId"
									label={t("solicitacaoPagamento:processFormData.DEJURArea")}
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									name="processNumber"
									label={t("solicitacaoPagamento:processFormData.processNumber")}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<ContactField
									name="processPartiesOtherId"
									label={t("solicitacaoPagamento:processFormData.oppositeParty")}
									setInvalidValueWhenTyping
									getOptionsTypeLinkWithTheProcess={true}
									typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.OTHER_PART}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									name="paymentTypeId"
									label={t("Pagamentos:tipoPagamento")}
									options={paymentTypeAsOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									name="paymentMethodId"
									label={t("Pagamentos:formaPagamento")}
									options={allPaymentMethodAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={"Data do pagamento"}
											name="paymentDateStart"
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											label={"Até"}
											name="paymentDateEnd"
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item md={3} xs={12}>
								<CurrencyField
									name="judicialPaymentValue"
									label={t("solicitacaoPagamento:dadosPagamento.valorPagamentoJudicial")}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<ContactField
									name="internalLawyerId"
									label={t("solicitacaoPagamento:dadosPagamento.advogadoInterno")}
									contactType={CONTACT_TYPE.PERSON}
									setInvalidValueWhenTyping
									contactSearch={CONTACT_SEARCH.InternalLawyer}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									name="statusFlowId"
									label={"Status da solicitação"}
									options={statusTextFilter}
									disabled={isLawyer}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									name="statusApprovalId"
									label={"Status da contabilização"}
									options={[
										{ label: "Aprovado", value: 1 },
										{ label: "Reprovado", value: 0 },
										{ label: "Pendente", value: -1 },
									]}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2} alignItems="center">
							<Grid item md={6} xs={6}>
								<Clean
									action="paymentRequest"
									page={pathname}
									onClick={() => {
										dispatch(
											actions.paymentRequest.setFilters({
												filters: { internalLawyerId: isLawyer ? idBrf : '' },
												page: pathname,
											})
										);
									}}
								/>
							</Grid>
							<Grid item md={6} xs={6} style={{ textAlign: "right" }}>
								<Submit type="search" submitting={loading as boolean}/>
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
