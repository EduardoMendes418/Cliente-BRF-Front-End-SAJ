import { useCallback, useState } from "react";
import FieldColumn from "src/components/FieldColumn";
import { AutocompleteField, CheckboxesAutocompleteField, FormikContext, SelectField, TextField } from "src/components/form";
import { RESPONSIBLE_TYPE, resposibleAsOptionsRequest } from "src/screen/settings/general/request-parameters/constants";
import { handleAdministrativeControl } from "../../utils";
import { t } from "src/locale/i18n";
import { AutocompleteInputChangeReason } from "@material-ui/lab";
import { useFormikContext } from "formik";
import debounce from "lodash/debounce";
import apiUser from "src/core/api/users"

type Props = {
	responsibleType: RESPONSIBLE_TYPE| "";
	id: string;
	item: any;
	usersActivesAsOptionsById: any;
	showActiveMsg?: boolean;
	isResponsibleFieldBlocked: boolean;
	showServiceRequestForm: boolean;
	whenResponsibleIsInactive: any;
	allowEdit: boolean;
};

type UserType = {
	id: number;
	idBrf: number;
	isActive: boolean;
	name: string;
	email: string;
	profileId: number;
	isInternal: boolean;
	isAdmin: boolean;
	lastAccess: string;
	createdDate: string;
	createdBy: string | null;
	updatedDate: string;
	updatedBy: string;
	deactivationDate: string | null;
	activationDate: string | null;
	usersAdditionalInformation: any | null;
};


const ResponsibleBlock: React.FC<Props> = ({
	responsibleType,
	id,
	item,
	usersActivesAsOptionsById,
	showActiveMsg,
	isResponsibleFieldBlocked,
	showServiceRequestForm,
	whenResponsibleIsInactive,
	allowEdit
}) => {
	const isNew = id === "novo";
	const isNoneType = responsibleType === RESPONSIBLE_TYPE.NONE;
	const isAdminType = responsibleType === RESPONSIBLE_TYPE.ADMINISTRATIVE_CONTROL;
	const hasAdministrativeControlResponsiblesNames =
		item.administrativeControlResponsiblesNames &&
		item.administrativeControlResponsiblesNames.length > 0;
	const [users, setUsers] = useState<UserType[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { setFieldValue, initialValues } = useFormikContext<FormikContext>();
	const delayedFetch = debounce(async (value: string) => {
		setIsLoading(true)
		try {
			const { data } = await apiUser.getWithName({ fragment: value, typeOfLinkWithTheProcess: resposibleAsOptionsRequest[responsibleType].value, notPaginate: false })
			setUsers(data.items)
		} catch (error) {
			console.error(error)
		}
		setIsLoading(false)
	}, 500);

	const search = useCallback(
		(value: string, reason: AutocompleteInputChangeReason) => {
			if (reason === "clear") {
				setFieldValue("responsibleUserId", "");
			} else if (reason === "input" && value && value.length >= 3)
				delayedFetch(value);

		},

		[setFieldValue]
	);

	if (isNoneType || isAdminType) {

		if (isNoneType && allowEdit) {
			return (
				<SelectField
					label={t("settings:requestParameters.form.responsibleName")}
					name="administrativeControlResponsiblesIds"
					options={usersActivesAsOptionsById}
					required
				/>
			);
		}

		if (isNoneType && isNew === true) {
			return (
				<SelectField
					label={t("settings:requestParameters.form.responsibleName")}
					name="administrativeControlResponsiblesIds"
					options={usersActivesAsOptionsById}
					required
				/>
			);
		}

		if (!isNew) {
			if (hasAdministrativeControlResponsiblesNames) {
				return (
					<FieldColumn
						label={t("settings:requestParameters.form.administrativeControl")}
						value={handleAdministrativeControl(
							item.status,
							item.administrativeControlResponsiblesIds,
							item.responsiblesInService,
							usersActivesAsOptionsById,
							"|"
						)}
					/>
				);
			}
			return (
				<TextField
					label={t("settings:requestParameters.form.responsibleName")}
					name="responsibleName"
					readOnly
				/>
			);
		}
		return (
			<CheckboxesAutocompleteField
				options={usersActivesAsOptionsById}
				label={
					isAdminType
						? t("settings:requestParameters.form.administrativeControl")
						: t("settings:requestParameters.form.responsibleName")
				}
				name="administrativeControlResponsiblesIds"
				readOnly={!isNew}
				
			/>
		);
	}

	if (isNew && showActiveMsg !== false) {
		return (
			<TextField
				label={t("settings:requestParameters.form.responsibleName")}
				name="responsibleName"
				readOnly
			/>
		);
	}
	if (whenResponsibleIsInactive === null)
		return (
			<SelectField
				label={t("settings:requestParameters.form.responsibleName")}
				name="responsibleUserId"
				readOnly={
					isResponsibleFieldBlocked || showServiceRequestForm || !isNew || showActiveMsg
				}
				options={
					whenResponsibleIsInactive === null
						? usersActivesAsOptionsById
						: whenResponsibleIsInactive
				}
				required
			/>
		);

	return (<>
		<AutocompleteField
			label={t("settings:requestParameters.form.responsibleName")}
			name="responsibleUserId"
			readOnly={
				isResponsibleFieldBlocked || showServiceRequestForm || !isNew || showActiveMsg
			}
			options={users.map(({ name, id }) => ({ label: name, value: id }))}
			required
			onValueChange={search}
			onDemand
			loading={isLoading}
		/>
	</>)
};

export default ResponsibleBlock;
