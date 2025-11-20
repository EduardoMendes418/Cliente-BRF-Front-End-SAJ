import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Grid } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import { FormikHelpers } from "formik";

import ScreenTemplate from "src/components/Screen";
import Form, { SelectField, TOptionsSelect, TextField } from "src/components/form";
import { Submit } from "src/components/button";
import Panel from "src/components/Panel";
import { useTranslation } from "src/locale/i18n";
import {
	getGuaranteeType,
	editGuaranteeType,
	addGuaranteeType,
} from "src/core/store/modules/guarantee-type/thunks";
import {
	getItemGuaranteeType,
	getLoadingGuaranteeType,
} from "src/core/store/modules/guarantee-type/selectors";
import { TGuaranteeType } from "src/core/models/guarantee-type";
import { actions, AppDispatch } from "src/core/store";
import { useSnackbar } from "notistack";
import { getListPaymentType, getLoadingPaymentType } from "src/core/store/modules/payment-type/selectors";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";
import { Modulos } from "src/core/models/modules";

const defaultValues = {
	description: "",
};

const GuaranteeTypeForm = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const { id } = useParams<{ id: string }>();
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();

	const isNew = id === "novo";

	const guaranteeTypeItem = useSelector(getItemGuaranteeType);
	const isLoadingGuarantee = useSelector(getLoadingGuaranteeType);
	const isLoadingPayments = useSelector(getLoadingPaymentType)

	const isLoading = isLoadingGuarantee || isLoadingPayments

	const paymentTypes = useSelector(getListPaymentType);

	const paymentTypeOptions = useMemo<TOptionsSelect[]>(
		() => paymentTypes.filter((x) => x.gerarBensGarantias && x.status).map(x => ({
			value: x.id ?? 0,
			label: x.financeChartOfAccountsCategory?.name ?? ""
		})),
		[paymentTypes]
	);

	useEffect(() => {
		dispatch(fetchPaymentType({ modulo: Modulos.Pagamento }));
	}, [dispatch]);

	useEffect(() => {
		const idNumber = parseInt(id);
		if (!guaranteeTypeItem && !isNaN(idNumber)) {
			dispatch(getGuaranteeType(idNumber));
		}
	}, [dispatch, guaranteeTypeItem, id]);

	useEffect(
		() => () => dispatch(actions.guaranteeType.setItem(undefined)),
		[dispatch]
	);

	const onSubmit = useCallback(
		async (
			guaranteeType: TGuaranteeType,
			{ setSubmitting }: FormikHelpers<TGuaranteeType>
		) => {
			const { description, paymentTypeId } = guaranteeType;
			if (guaranteeTypeItem) {
				const { type, payload } = await dispatch(
					editGuaranteeType({ ...guaranteeTypeItem, description, paymentTypeId })
				);
				if (type === "guaranteeType/add/rejected") {
					enqueueSnackbar(payload?.error.detail || t("anErrorHasOcurred"), {
						variant: "error",
					});
				} else {
					history.goBack();
				}
				setSubmitting(false);
				return;
			}

			const { type, payload } = await dispatch(addGuaranteeType({ description, paymentTypeId, id: 0, status: true }));
			if (type === "guaranteeType/add/rejected") {
				setSubmitting(false);
				enqueueSnackbar(payload?.error.detail || t("anErrorHasOcurred"), {
					variant: "error",
				});
				return;
			}
			history.goBack();
			setSubmitting(false);
		},
		[dispatch, enqueueSnackbar, guaranteeTypeItem, history, t]
	);

	const initialValues = guaranteeTypeItem
		? guaranteeTypeItem
		: (defaultValues as TGuaranteeType);
	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, isValid }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t("goodsAndGuarantees:guaranteeType.formtitle")}
							slotBottomRight={
								<Submit
									isNew={isNew}
									submitting={isSubmitting}
									disabled={!dirty}
								/>
							}
							slotBottonRightPermission={isNew ? "add" : "edit"}
							withPadding
						>
							{isLoading && (
								<CircularProgress className="margin-top-16 align-center" />
							)}
							{!isLoading && (
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<TextField
											label={t("goodsAndGuarantees:guaranteeType.title")}
											name="description"
											required
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											label={t("goodsAndGuarantees:guaranteeType.paymentTypeId")}
											name="paymentTypeId"
											options={paymentTypeOptions}
											required
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

export default GuaranteeTypeForm;
