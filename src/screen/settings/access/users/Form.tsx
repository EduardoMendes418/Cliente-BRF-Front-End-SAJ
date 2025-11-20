import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import Form, {
	TextField,
	SelectField,
	NumericField,
	CPFOrCNPJField,
	PhoneField,
	EmailField,
	CheckboxesAutocompleteField,
	RadioGroup,
} from "src/components/form";
import ScreenTemplate from "src/components/Screen";
import Panel from "src/components/Panel";
import { Submit } from "src/components/button";

import { t, useTranslation } from "src/locale/i18n";
import {
	getUsers,
	addUsers,
	editUsers,
} from "src/core/store/modules/users/thunks";
import {
	getItemUsers,
	getLoadingUsers,
	getStatusUsers as getStatus,
	getErrorMessageUsers as getErrorMessage,
} from "src/core/store/modules/users/selectors";
import { TUser, userRoleOptions } from "src/core/models/users";
import { useRegisterDefault } from "src/hooks";
import { actions, AppDispatch } from "src/core/store";
import { fillIfValue } from "src/core/utils/func";
import {
	useAreasResponsiblePath,
	useAreasResponsible,
	useAreasWitchGroups,
	useGroupedAreas,
	useProfiles,
	useGroupedAreasUserConfig,
} from "src/hooks/fetchLists";
import { TContact } from "src/core/models/contacts";
import ContactWithIncludesField from "src/components/ContactWithIncludesField";
import ContactField from "src/components/ContactField";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple"; 

const isInternalOptions = [
	{ label: "Interno", value: true },
	{ label: "Externo", value: false },
];

const isAdminOptions = [
	{ label: "Sim", value: true },
	{ label: "Não", value: false },
];

const validate = ({ name, searchName }: TUser & { searchName?: string }) => {
	if (!name) return { searchName: t("required") };
	else if (searchName && searchName.length < 3)
		return { searchName: t("validations.invalidField") };
	return {};
};

const UsersForm = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();

	const loading = useSelector(getLoadingUsers);
	const statusSubmit = useSelector(getStatus);
	const item = useSelector(getItemUsers);

	const isNew = id === "novo";

	const { profilesAsOptions } = useProfiles();

	useEffect(() => {
		if (id && !isNew) dispatch(getUsers(id));
		return () => {
			dispatch(actions.users.clear());
		};
	}, [dispatch, id, isNew]);

	useRegisterDefault({
		action: "users",
		getStatus,
		getErrorMessage,
	});

	const { areasAsOptions: areasResponsibleOptions } = useAreasResponsiblePath();

	const { groupedAreasAsOptions } = useGroupedAreasUserConfig();
	const { areasDEJUROptions } = useAreasWitchGroups();

	const onSubmit = (values: TUser) => {
		if (isNew) dispatch(addUsers(values));
		else dispatch(editUsers({ ...values, id: Number(id) }));
	};

	const initialValues: TUser = useMemo(() => {
		const initialValues = {
			isActive: true,
			searchName: "",
			name: "",
			idBrf: 0,
			email: "",
			rg: "",
			cpf: "",
			oab: "",
			office: "",
			departament: "",
			location: "",
			phone: "",
			officeName: "",
			dejurArea: [],
			responsibleArea: [],
			profileId: "",
			isInternal: false,
			isAdmin: false,
			contributorId: "",
			rawRole: [],
			degreeOfConfidentiality: 0,
			internalLawyerId: "",
			officeResponsibleId: "",
			legalResponsibleId: "",
		} as TUser;

		return fillIfValue<TUser>(item, initialValues);
	}, [item]);

	const onSelectContact = (setFieldValue: any) => (contact: TContact) => {
		setFieldValue("idBrf", contact.id || 0);
		setFieldValue("rg", contact.personStateIdentificationNumber || "");
		setFieldValue("oab", contact.barAssociationRegistration || "");
		setFieldValue("name", contact.name || "");
		setFieldValue("email", contact.email || "");
		setFieldValue("phone", contact.phone || "");
		setFieldValue("cpf", contact.cpfCnpj || "");
		setFieldValue("location", contact.address || "");
		setFieldValue("contributorId", contact.contributorId || "");
	};

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
				validate={validate}
			>
				{({
					handleSubmit,
					isSubmitting,
					dirty,
					setSubmitting,
					setFieldValue,
					status
				}) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t("settings:users.titleForm")}
							slotBottomRight={
								<Submit
									isNew={isNew}
									submitting={isSubmitting || loading}
									disabled={!dirty}
								/>
							}
							slotBottonRightPermission={isNew ? "add" : "edit"}
							withPadding
						>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<ContactWithIncludesField
										name="name"
										label={t("settings:users.name")}
										onSelectContact={onSelectContact(setFieldValue)}
										labelValueTarget={true}
										initialValue={{
											label: initialValues.name,
											value: initialValues.idBrf,
										}}
										required
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<EmailField
										label={t("settings:users.email")}
										name="email"
										required
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<NumericField label={t("settings:users.form.rg")} name="rg" />
								</Grid>
								<Grid item md={3} xs={12}>
									<CPFOrCNPJField
										label={t("settings:users.form.cpf")}
										type="cpf"
										name="cpf"
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<NumericField
										label={t("settings:users.form.oab")}
										name="oab"
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<TextField
										label={t("settings:users.form.office")}
										name="office"
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<TextField
										label={t("settings:users.form.departament")}
										name="departament"
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<TextField
										label={t("settings:users.form.location")}
										name="location"
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<PhoneField
										label={t("settings:users.form.phone")}
										name="phone"
									/>
								</Grid>
								<Grid item md={3} xs={12}>
								{
										status === 'readOnly' ? <SelectField
										label={t("settings:users.form.dejurArea")}
										name="dejurArea"
										options={areasDEJUROptions}
										multiple
									/>  : <GroupedSelectFiledMultiple
									label={t("settings:users.form.dejurArea")}
									name="dejurArea"
									options={groupedAreasAsOptions}
									multiple
								/>
									}
								</Grid>
								<Grid item md={3} xs={12}>
									<TextField
										label={t("settings:users.form.contributorId")}
										name="contributorId"
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										label={t("settings:users.form.role")}
										name="rawRole"
										options={userRoleOptions}
										multiple
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<ContactField
										label={t("settings:users.form.internalLawyerId")}
										name="internalLawyerId"
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<ContactField
										label={t("settings:users.form.officeResponsibleId")}
										name="officeResponsibleId"
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<ContactField
										label={t("settings:users.form.legalResponsibleId")}
										name="legalResponsibleId"
									/>
								</Grid>
								<Grid item md={12} xs={12}>
									<CheckboxesAutocompleteField
										options={areasResponsibleOptions}
										hasSelectAllOption
										label={t("settings:users.office")}
										name="responsibleArea"
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										label={t("settings:users.profile")}
										name="profileId"
										options={profilesAsOptions}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<RadioGroup
										label={t("settings:users.form.isInternal")}
										name="isInternal"
										options={isInternalOptions}
										required
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<RadioGroup
										label={t("settings:users.form.isAdmin")}
										name="isAdmin"
										options={isAdminOptions}
										required
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<NumericField
										label={t("settings:users.form.degreeOfConfidentiality")}
										name="degreeOfConfidentiality"
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

export default UsersForm;
