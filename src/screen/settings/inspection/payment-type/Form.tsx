import { CircularProgress, Grid } from "@material-ui/core";
import { FormikHelpers } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Submit } from "src/components/button";
import Form, {
	AutocompleteField,
	RadioGroup,
	SelectField,
} from "src/components/form";
import Panel from "src/components/Panel";
import ScreenTemplate from "src/components/Screen";
import { Modulos } from "src/core/models/modules";
import { TPaymentType } from "src/core/models/payment-type";
import { AppDispatch } from "src/core/store";
import { fetchPaymentMethod } from "src/core/store/modules/payment-method/thunks";
import { getLoadingPaymentType } from "src/core/store/modules/payment-type/selectors";
import {
	addPaymentType,
	editPaymentType,
} from "src/core/store/modules/payment-type/thunks";
import {
	useFinanceChartOfAccountsCategories,
	usePaymentMethod,
} from "src/hooks/fetchLists";
import { useActionTipoPagamento, useTipoPagamentoInitialValues } from "src/hooks/paymentType";
import { useTranslation } from "src/locale/i18n";
import { approvalProcessTypeOption } from "src/core/utils/constants"

const TipoDePagamentoForm = () => {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const isNew = id === "novo";
	const dispatch = useDispatch<AppDispatch>();
	const isFetching = useSelector(getLoadingPaymentType);
	const initialValues = useTipoPagamentoInitialValues(Modulos.Inspection);
	useActionTipoPagamento(Modulos.Inspection, "/configuracoes/fiscalizacao/tipo-pagamento");
	
	const { paymentMethodAsOptions } = usePaymentMethod(Modulos.Inspection);
	const { financeChartOfAccountsCategoriesAsOptions, isFinanceChartOfAccountsCategoriesLoading, } = useFinanceChartOfAccountsCategories(
		Modulos.Inspection,
		initialValues.financeChartOfAccountsCategory
	);
	
	useEffect(() => {
		dispatch(fetchPaymentMethod({ moduloId: Modulos.Inspection }))
	}, [dispatch])

	const handleSubmit = (
		form: TPaymentType,
		{ setSubmitting }: FormikHelpers<TPaymentType>
	) => {
		if (isNew) {
			dispatch(addPaymentType({ ...form, moduloId: Modulos.Inspection, folderNumberRequired: null }));
		} else {
			const values = {
				...form,
				id: Number(id),
				folderNumberRequired: null,
				moduloId: Modulos.Inspection,
			};
			dispatch(editPaymentType({ id: Number(id), values }));
		}
		setSubmitting(false);
	};

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				onSubmit={handleSubmit}
				initialValues={initialValues}
			>
				{({ handleSubmit, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={
								isNew
									? t("inspection:tipoPagamento_registration")
									: t("inspection:tipoPagamento_edit")
							}
							slotBottomRight={
								<Submit isNew={isNew} disabled={!dirty} />
							}
							slotBottonRightPermission={isNew ? "add" : "edit"}
							withPadding
						>
							{isFetching ? (
								<CircularProgress className="margin-top-16 align-center" />
							) : (
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<AutocompleteField
											label={t("inspection:form.type")}
											name="financeChartOfAccountsCategoryId"
											options={financeChartOfAccountsCategoriesAsOptions}
											loading={isFinanceChartOfAccountsCategoriesLoading}
											required
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											label={t("inspection:form.method")}
											name="formasPagamentoIds"
											options={paymentMethodAsOptions}
											required
											multiple
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											label={t("inspection:form.approval")}
											name="processType"
											required
											options={approvalProcessTypeOption}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<RadioGroup
											label={t("inspection:form.paymentSAP")}
											name="contabilizarPagamentoSap"
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<RadioGroup
											label={t("inspection:form.pastaCtgObrigatoria")}
											name="folderNumberRequired"
										/>
									</Grid>
								</Grid>
							)}
						</Panel>
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default TipoDePagamentoForm;
