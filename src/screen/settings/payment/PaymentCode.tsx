import { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { FormikHelpers } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { pipe } from "ramda";

import Form, { NumericField } from "src/components/form";
import Panel from "src/components/Panel";
import ScreenTemplate from "src/components/Screen";
import { Submit } from "src/components/button";
import { t } from "src/locale/i18n";
import { AppDispatch } from "src/core/store";
import {
	editParameterization,
	fetchParameterization,
} from "src/core/store/modules/parameterization/thunks";
import { useActionParameterization } from "src/hooks/parameterization";
import {
	getParameterizationItems,
	getLoadingParameterization,
	getSavingParameterization,
} from "src/core/store/modules/parameterization/selectors";
import { actions } from "src/core/store";

type TPaymentCode = {
	paymentCodeInssGps: string;
	paymentCodeDarf: string;
	gpsIdentifier: string;
	darfCpfCnpj: string;
	collectionFGTS: string;
	collectionINSS: string;
	codigoRecolhimentoPeritoDarf: string;
};

const PaymentCode = () => {
	useActionParameterization("/configuracoes");
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(
			fetchParameterization([
				"paymentCodeInssGps",
				"paymentCodeDarf",
				"gpsIdentifier",
				"darfCpfCnpj",
				"collectionFGTS",
				"collectionINSS",
				"codigoRecolhimentoPeritoDarf"
			])
		);
		return () => {
			dispatch(actions.parameterization.clear());
		};
	}, [dispatch]);

	const { paymentCodeInssGps, paymentCodeDarf, gpsIdentifier, darfCpfCnpj, collectionFGTS, collectionINSS, codigoRecolhimentoPeritoDarf } = useSelector(getParameterizationItems);
	const loading = useSelector(getLoadingParameterization);
	const saving = useSelector(getSavingParameterization);

	const initialValues = {
		paymentCodeInssGps: paymentCodeInssGps?.toString() ?? "",
		paymentCodeDarf: paymentCodeDarf?.toString() ?? "",
		gpsIdentifier: gpsIdentifier?.toString() ?? "",
		darfCpfCnpj: darfCpfCnpj?.toString() ?? "",
		collectionFGTS: collectionFGTS?.toString() ?? "",
		collectionINSS: collectionINSS?.toString() ?? "",
		codigoRecolhimentoPeritoDarf: codigoRecolhimentoPeritoDarf?.toString() ?? ""
	};

	const onSubmit = (
		values: TPaymentCode,
		{ setSubmitting }: FormikHelpers<TPaymentCode>
	) => {
		const params = [
			{
				name: "paymentCodeInssGps",
				value: values.paymentCodeInssGps,
			},
			{
				name: "paymentCodeDarf",
				value: values.paymentCodeDarf,
			},
			{
				name: "gpsIdentifier",
				value: values.gpsIdentifier,
			},
			{
				name: "darfCpfCnpj",
				value: values.darfCpfCnpj,
			},
			{
				name: "collectionFGTS",
				value: values.collectionFGTS
			},
			{
				name: "collectionINSS",
				value: values.collectionINSS
			},
			{
				name: "codigoRecolhimentoPeritoDarf",
				value: values.codigoRecolhimentoPeritoDarf
			}
		];

		params.forEach(pipe(editParameterization, dispatch));
		setSubmitting(false);
	};

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t("Pagamentos:paymentCode.title")}
							loading={loading}
							slotBottomRight={<Submit disabled={!dirty} submitting={saving} />}
							slotBottonRightPermission="edit"
							withPadding
							cancelAndGoBack
						>
							<Grid container spacing={2}>
								<Grid item sm={12} md={3}>
									<NumericField
										required
										name="paymentCodeInssGps"
										label={t("Pagamentos:paymentCode.labelInssGps")}
									/>
								</Grid>
								<Grid item sm={12} md={3}>
									<NumericField
										required
										name="paymentCodeDarf"
										label={t("Pagamentos:paymentCode.labelDarf")}
									/>
								</Grid>
								<Grid item sm={12} md={3}>
									<NumericField
										required
										name="gpsIdentifier"
										label={t("Pagamentos:paymentCode.labelGpsIdentifier")}
									/>
								</Grid>
								<Grid item sm={12} md={3}>
									<NumericField
										required
										name="darfCpfCnpj"
										label={t("Pagamentos:paymentCode.labelDarfCpfCnpj")}
									/>
								</Grid>
								<Grid item sm={12} md={3}>
									<NumericField
										required
										name="collectionFGTS"
										label={t("Pagamentos:paymentCode.labelCollectionCodeFGTS")}
									/>
								</Grid>
								<Grid item sm={12} md={3}>
									<NumericField
										required
										name="collectionINSS"
										label={t("Pagamentos:paymentCode.labelCollectionCodeINSS")}
									/>
								</Grid>
								<Grid item sm={12} md={3}>
									<NumericField
										required
										name="codigoRecolhimentoPeritoDarf"
										label={t("Pagamentos:paymentCode.codigoRecolhimentoPeritoDarf")}
									/>
								</Grid>
							</Grid>
						</Panel>
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default PaymentCode;
