import Panel from "src/components/Panel";
import ScreenTemplate from "src/components/Screen";
import { Submit } from "src/components/button";
import Form, { DateHourField, SelectField, TOptionsSelect, TextField } from "src/components/form";
import { LockSystem } from "src/core/models/lock-system";
import { AppDispatch, actions } from "src/core/store";
import {
	getErrorLockSystem,
	getItemLockSystem,
	getStatusLockSystem,
} from "src/core/store/modules/lock-system/selectors";
import { addLockSystem, editLockSystem, fetchByIdLockSystem } from "src/core/store/modules/lock-system/thunks";
import { getListProfiles } from "src/core/store/modules/profiles/selectors";
import { fetchProfiles } from "src/core/store/modules/profiles/thunks";
import { useRegisterDefault } from "src/hooks";
import { useTranslation } from "src/locale/i18n";
import { Grid } from "@material-ui/core";
import { FormikHelpers } from "formik";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const LockSystemForm = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { id } = useParams<{ id: string }>();
	const isNew = id === "novo";
	const lockSystem = useSelector(getItemLockSystem);
	const userProfiles = useSelector(getListProfiles);
	const { t } = useTranslation();

	useRegisterDefault({
		action: "lockSystem",
		getStatus: getStatusLockSystem,
		getErrorMessage: getErrorLockSystem,
	});

	useEffect(() => {
		if (!isNew) {
			dispatch(fetchByIdLockSystem(Number(id)));
		}

		return () => {
			dispatch(actions.lockSystem.clearItem());
		};
	}, [id]);

	useEffect(() => {
		dispatch(
			fetchProfiles({
				notPaginate: true,
			})
		);
	}, []);

	const userProfileOptions = useMemo<TOptionsSelect[]>(() => userProfiles.map(x => ({
		label: x.description,
		value: x.id ?? 0
	})), [userProfiles])

	const initialValues = useMemo<LockSystem>(
		() =>
			lockSystem ?? {
				id: 0,
				endDate: "",
				isActive: true,
				isDeleted: false,
				message: "",
				startDate: "",
				userProfileIds: [],
			},
		[lockSystem]
	);

	const onSubmit = async (values: LockSystem, { setSubmitting }: FormikHelpers<LockSystem>) => {
		setSubmitting(true)

		if (isNew) {
			await dispatch(addLockSystem(values))
		} else {
			await dispatch(editLockSystem(values))
		}

		setSubmitting(false)
	}

	return (
		<ScreenTemplate>
			{userProfileOptions && (
				<Form
					enableReinitialize
					initialValues={initialValues}
					onSubmit={onSubmit}
				>
					{({ handleSubmit, isSubmitting, dirty }) => (
						<form onSubmit={handleSubmit}>
							<Panel
								title={t("settings:lockSystem.formTitle")}
								withPadding
								slotBottonRightPermission="add"
								slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
							>
								<Grid container spacing={3}>
									<Grid item md={4} xs={12}>
										<SelectField
											label={t("settings:lockSystem.userProfiles")}
											name="userProfileIds"
											options={userProfileOptions}
											multiple
										/>
									</Grid>
									<Grid item md={4} xs={12}>
										<DateHourField
											label={t("settings:lockSystem.startDate")}
											name="startDate"
										/>
									</Grid>
									<Grid item md={4} xs={12}>
										<DateHourField
											label={t("settings:lockSystem.endDate")}
											name="endDate"
										/>
									</Grid>
									<Grid item md={12} xs={12}>
										<TextField
											label={t("settings:lockSystem.message")}
											name="message"
											multiline
											minRows={3}
											maxLength={65000}
										/>
									</Grid>
								</Grid>
							</Panel>
						</form>
					)}
				</Form>
			)}
		</ScreenTemplate>
	);
};

export default LockSystemForm;
