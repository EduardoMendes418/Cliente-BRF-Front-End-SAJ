import { useEffect, useMemo } from "react";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import Panel from "src/components/Panel";
import ScreenTemplate from "src/components/Screen";
import { Submit } from "src/components/button";
import Form, { SelectField, TextField } from "src/components/form";
import { useTranslation } from "src/locale/i18n";

import { fillIfValue } from "src/core/utils/func";
import { actions, AppDispatch } from "src/core/store";
import {
	getItemRejectionAndReturnReason,
	getLoadingRejectionAndReturnReason,
	getStatusRejectionAndReturnReason as getStatus,
} from "src/core/store/modules/rejection-and-return-reason/selectors";
import { TRejectionAndReturnReason } from "src/core/models/rejection-and-return-reason";
import {
	addRejectionAndReturnReason,
	editRejectionAndReturnReason,
	fetchRejectionAndReturnReasonById,
} from "src/core/store/modules/rejection-and-return-reason/thunks";

import { reasonTypeOptions } from "./constants";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { useModulos } from "src/hooks/modulo";

const EvaluationReasonForm = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const history = useHistory();

	const item = useSelector(getItemRejectionAndReturnReason);
	const isLoading = useSelector(getLoadingRejectionAndReturnReason);
	const statusSubmit = useSelector(getStatus);
	const { modulosAsOptions } = useModulos();

	const isNew = id === "novo";

	const initialValues: TRejectionAndReturnReason = useMemo(() => {
		const initialValues: TRejectionAndReturnReason = {
			reasonType: "",
			description: "",
			status: true,
			moduloId: "",
		};
		return fillIfValue<TRejectionAndReturnReason>(item, initialValues);
	}, [item]);

	const onSubmit = async (values: TRejectionAndReturnReason) => {
		if (isNew) {
			const { type, payload } = await dispatch(
				addRejectionAndReturnReason(values)
			);
			if (type === "rejectionAndReturnReason/add/rejected") {
				enqueueSnackbar(payload?.detail || t("anErrorHasOcurred"), {
					variant: "error",
				});
			} else {
				history.goBack();
			}
		} else {
			const { type, payload } = await dispatch(
				editRejectionAndReturnReason({ ...values, id: Number(id) })
			);
			if (type === "rejectionAndReturnReason/edit/rejected") {
				enqueueSnackbar(payload?.detail || t("anErrorHasOcurred"), {
					variant: "error",
				});
			} else {
				history.goBack();
			}
		}
	};

	useEffect(() => {
		if (id && !isNew) dispatch(fetchRejectionAndReturnReasonById(Number(id)));
		return () => {
			dispatch(actions.rejectionAndReturnReason.clear());
		};
	}, [dispatch, id, isNew]);

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, setSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t("settings:evaluationReason.titleForm")}
							slotBottomRight={
								<Submit
									isNew={isNew}
									submitting={isSubmitting || isLoading}
									disabled={!dirty}
								/>
							}
							slotBottonRightPermission={isNew ? "add" : "edit"}
							withPadding
						>
							<Grid container spacing={2}>
								<Grid item md={3} xs={12}>
									<SelectField
										label={t("settings:evaluationReason.form.modulo")}
										name="moduloId"
										options={modulosAsOptions}
										required
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										label={t("settings:evaluationReason.form.reasonType")}
										name="reasonType"
										options={reasonTypeOptions}
										required
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										label={t("settings:evaluationReason.form.description")}
										name="description"
										required
									/>
								</Grid>
							</Grid>
						</Panel>
						{statusSubmit === "failure" && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default EvaluationReasonForm;
