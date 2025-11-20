import { Grid } from "@material-ui/core";
import { Formik, FormikHelpers } from "formik";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Submit } from "src/components/button";
import { RadioGroup } from "src/components/form";
import { actions, AppDispatch } from "src/core/store";
import { getLastModalOpen } from "src/core/store/modules/modals/selectors";
import { useTranslation } from "src/locale/i18n";

interface EnvironmentUpdate {
	updateQas: boolean;
	updatePrd: boolean;
}

export interface ModalProps {
	onSave: (data: EnvironmentUpdate) => void;
}

const Modal = (props: ModalProps) => {
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation();

	const modalId = useSelector(getLastModalOpen);

	const backHandler = useCallback(() => {
		dispatch(actions.modal.close({ modalId }));
	}, [dispatch, modalId]);

	const initialValues: EnvironmentUpdate = {
		updatePrd: false,
		updateQas: false,
	};

	const onSubmit = (
		data: EnvironmentUpdate,
		{ setSubmitting, resetForm }: FormikHelpers<EnvironmentUpdate>
	) => {
		props.onSave(data);

		setSubmitting(false);
		resetForm();
		backHandler();
	};

	return (
		<Formik initialValues={initialValues} onSubmit={onSubmit}>
			{({ handleSubmit }) => (
				<form onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						<Grid item md={6}>
							<RadioGroup
								label={t("settings:report.modal.updateQas")}
								name="updateQas"
							/>
						</Grid>
						<Grid item md={6}>
							<RadioGroup
								label={t("settings:report.modal.updatePrd")}
								name="updatePrd"
							/>
						</Grid>
						<Grid item md={12}>
							<Grid container justifyContent="flex-end" spacing={2}>
								<Grid item>
									<Button
										color="default"
										onClick={backHandler}
										text={t("cancel")}
									/>
								</Grid>
								<Grid item>
									<Submit />
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</form>
			)}
		</Formik>
	);
};

export default Modal;
