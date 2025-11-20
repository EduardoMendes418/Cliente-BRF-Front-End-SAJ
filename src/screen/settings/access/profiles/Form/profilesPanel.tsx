import { FieldArray } from "formik";
import { useFormikContext } from "formik";
import { useParams } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import { Grid, IconButton } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

import {
	TextField,
	SelectField,
	TOptionsSelect,
	FormikContext
} from "src/components/form";

import {
	getLoadingProfiles,
	getStatusProfiles as getStatus,
	getErrorMessageProfiles as getErrorMessage,
} from "src/core/store/modules/profiles/selectors";

import Panel from "src/components/Panel";
import { actions } from "src/core/store";
import routes from "src/config/routes/config";
import { useRegisterDefault } from "src/hooks";
import { Submit } from "src/components/button";
import { useTranslation, t } from "src/locale/i18n";
import { getProfiles } from "src/core/store/modules/profiles/thunks";
import PermissionsTable from './permissionsTable';

const PERMISSIONS_DEFAULT = { add: false, edit: false, del: false, view: true };

const ProfilesForm = () => { 
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [error, setError] = useState(false);
	const [screenTitles, setScreenTitles] = useState({});

	const loading = useSelector(getLoadingProfiles);
	const statusSubmit = useSelector(getStatus);

	const isNew = id === "novo";

	const screensOptions = useMemo(
		() =>
			routes.slice(1).reduce((acc, item) => {
				if (item.title) {
					const value = item.path ?? "";
					acc.push({ value, label: "", group: item.title });
					setScreenTitles((prev) => ({
						...prev,
						[value]: item.title,
					}));
				}
				if (item.path === "configuracoes" && item.subroutes) {
					item.subroutes.forEach((subitem) => {
						if (subitem.subroutes) {
							subitem.subroutes.forEach((itemConfig) => {
								if (
									subitem.path &&
									itemConfig.path &&
									itemConfig.title
								) {
									const value = [
										item.path,
										subitem.path,
										itemConfig.path,
									].join("/");
									acc.push({
										value,
										label: [
											subitem.title,
											itemConfig.title,
										].join(" > "),
									});
									setScreenTitles((prev) => ({
										...prev,
										[value]: [
											item.title,
											subitem.title,
											itemConfig.title,
										].join(" > "),
									}));
								}
							});
						} else if (subitem.path && subitem.title) {
							const value = [item.path, subitem.path].join("/");
							acc.push({
								value,
								label: subitem.title,
							});
							setScreenTitles((prev) => ({
								...prev,
								[value]: [item.title, subitem.title].join(
									" > "
								),
							}));
						}
					});
				} else if (item.subroutes)
					item.subroutes.forEach((subitem) => {
						if (subitem.path && subitem.title) {
							const value = [item.path, subitem.path].join("/");
							acc.push({ value, label: subitem.title });
							setScreenTitles((prev) => ({
								...prev,
								[value]: [item.title, subitem.title].join(
									" > "
								),
							}));
						}
					});
				else if (item.path && item.title) {
					const value = item.path;
					acc.push({ value, label: item.title });
					setScreenTitles((prev) => ({
						...prev,
						[value]: item.title,
					}));
				}

				return acc;
			}, [] as TOptionsSelect[]),
		[]
	);

	useEffect(() => {
		if (id && !isNew) dispatch(getProfiles(id));
		return () => {
			dispatch(actions.profiles.clear());
		};
	}, [dispatch, id, isNew]);

	useRegisterDefault({
		action: "profiles",
		getStatus,
		getErrorMessage,
	});

	const onChangePermissionNames = ({
		target: { value },
	}: ChangeEvent<HTMLInputElement>) => value && error && setError(false);

	const { handleSubmit, isSubmitting, dirty, values, setSubmitting, setFieldValue } = useFormikContext<FormikContext>();

	const permissionNames = values.permissionNames?.filter((v: string) => v) ?? [];
					
	const addScreen = (push: any) => {
		if (!values.permissionNames) {
			setError(true);
		} else {
			permissionNames.forEach((name: string) =>
				push({ name, ...PERMISSIONS_DEFAULT })
			);
			setFieldValue("permissionNames", []);
		}
	};
	
	return (
		<form noValidate onSubmit={handleSubmit}>
			<Panel
				title={t("settings:profiles.profile")}
				withPadding
			>
				<Grid container spacing={3}>
					<Grid item md={3} xs={12}>
						<TextField
							label={t(
								"settings:profiles.description"
							)}
							name="description"
							required
						/>
					</Grid>
				</Grid>
			</Panel>
			<Panel
				title={t("settings:profiles.permissions")}
				slotBottomRight={
					<Submit
						isNew={isNew}
						submitting={isSubmitting || loading}
						disabled={!dirty}
					/>
				}
				slotBottonRightPermission={
					isNew ? "add" : "edit"
				}
				withPadding
			>
				<FieldArray name="permissions">
					{({ push, remove }) => (
						<>
							{status !== "readOnly" && (
								<>
									<Grid container spacing={3}>
										<Grid
											item
											md={3}
											xs={12}
										>
											<SelectField
												label={t(
													"settings:profiles.permissions"
												)}
												name="permissionNames"
												options={screensOptions
													.filter(({ value }) => !values.permissions
																.some(({ name }: { name: string }) => name === value ))
																.filter(({ group }, idx, array ) => {
																		return !(
																			group &&
																			(array[
																				idx +
																				1
																			]
																				?.group ||
																				!array[
																				idx +
																				1
																				])
																		);
																	}
																)}
												onChange={
													onChangePermissionNames
												}
												error={error}
												helperText={
													error
														? "Selecione a tela"
														: undefined
												}
												multiple
											/>
										</Grid>
										<Grid
											item
											md={2}
											xs={12}
										>
											<IconButton
												color="primary"
												onClick={() =>
													addScreen(
														push
													)
												}
												type="button"
												disabled={
													!permissionNames?.length
												}
											>
												<AddIcon />
											</IconButton>
										</Grid>
									</Grid>
									<br />
								</>
							)}
							<PermissionsTable
								permissions={values.permissions}
								remove={
									status !== "readOnly" &&
									remove
								}
								screenTitles={screenTitles}
							/>
						</>
					)}
				</FieldArray>
			</Panel>
			{statusSubmit === "failure" &&
				isSubmitting &&
				setSubmitting(false)}
		</form>
	);
};

export default ProfilesForm;
