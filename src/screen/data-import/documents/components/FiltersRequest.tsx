import { Grid } from "@material-ui/core";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	DateField,
	SelectField,
	TextField,
	UserField,
} from "src/components/form";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";
import { getRequestParametersAsOptions } from "src/core/store/modules/request-parameters/selectors";
import { fetchRequestParameters } from "src/core/store/modules/request-parameters/thunks";
import { useGroupedAreas, useUsersActives } from "src/hooks/fetchLists";
import { useTranslation } from "src/locale/i18n";
import { statusTextAsOptions } from "src/screen/requisitions/constants";

const FiltersRequest = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const { usersActivesAsOptionsById } = useUsersActives();
	const { groupedAreasAsOptions } = useGroupedAreas();
	const requisitionTypesOptions = useSelector(getRequestParametersAsOptions);

	const nameSelectOptions = useMemo(
		() => usersActivesAsOptionsById.map((x) => ({ ...x, value: x.label })),
		[usersActivesAsOptionsById]
	);

	useEffect(() => {
		dispatch(fetchRequestParameters({ notPaginate: true }));
	}, [dispatch]);

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={3}>
				<DateField
					name="request.requestDateStart"
					label={t("dataImport:documents.form.solicitationDateStart")}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<DateField
					name="request.requestDateEnd"
					label={t("dataImport:documents.form.solicitationDateEnd")}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<SelectField
					name="request.requestUserName"
					label={t("dataImport:documents.form.requester")}
					options={nameSelectOptions}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<GroupedSelectFiledMultiple
					name="request.areaId"
					label={t("dataImport:documents.form.areasId")}
					options={groupedAreasAsOptions}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<SelectField
					name="request.requestParameterId"
					label={t("dataImport:documents.form.requisitionType")}
					options={requisitionTypesOptions}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<TextField
					name="request.folderNumber"
					label={t("dataImport:documents.form.foldersNumber")}
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<UserField
					name="request.responsibleUserId"
					label={t("dataImport:documents.form.serviceResponsible")}
					hasServiceTeam
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<DateField
					name="request.expectedServiceDate"
					label={t("dataImport:documents.form.expectedServiceDate")}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<DateField
					name="request.conclusionDate"
					label={t("dataImport:documents.form.conclusionDate")}
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<SelectField
					name="request.status"
					label={t("status")}
					options={statusTextAsOptions}
				/>
			</Grid>
		</Grid>
	);
};

export default FiltersRequest;
