import { useMemo } from 'react';
import { Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'src/locale/i18n';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { MaskField, RadioGroup, SelectField, TextField } from 'src/components/form';
import { Clean, Submit } from 'src/components/button';

import { getListFiltersUsers, getLoadingUsers } from 'src/core/store/modules/users/selectors';
import { actions } from 'src/core/store';
import { TUserFilters } from 'src/core/models/users';
import { useGroupedAreas, useGroupedAreasById, useProfiles } from 'src/hooks/fetchLists';
import { rejectNoValues } from 'src/core/utils/func';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const statusOptions = [
	{ label: 'Ativos', value: 'true' },
	{ label: 'Inativos', value: 'false' },
];

const isInternalOptions = [
	{ label: 'Interno', value: true },
	{ label: 'Externo', value: false },
]

const isAdminOptions = [
	{ label: 'Sim', value: true },
	{ label: 'Não', value: false },
]

const Search = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const loading = useSelector(getLoadingUsers);
	const savedFilters = useSelector(getListFiltersUsers);

	const { groupedAreasAsOptions } = useGroupedAreas();
	const { groupedAreasByIdAsOptions } = useGroupedAreasById();
	const { profiles } = useProfiles();

	const profilesAsOptions = useMemo(() => {
		const sortedProfiles = profiles.slice().sort((a, b) => {
			if (a.status !== b.status)
				return a.status ? -1 : 1
			return a.description.localeCompare(b.description)
		})
		const options = sortedProfiles.map(profile => ({
			label: `${!profile.status ? '(Inativo) ' : ''}${profile.description}`,
			value: profile.id!
		}))
		return options
	}, [profiles])

	const onSubmit = (
		values: TUserFilters,
		{ setSubmitting }: FormikHelpers<TUserFilters>
	) => {
		const filters = rejectNoValues(values)
		dispatch(actions.users.setFilters(filters));
		setSubmitting(false)
	}

	const initialValues: TUserFilters = {
		name: '',
		email: '',
		profileId: '',
		cpf: '',
		rg: '',
		oab: '',
		areaDejur: [],
		responsibleAreaId: [],
		isActive: '',
		contributorId: '',
		isAdmin: '',
		isInternal: '',
		...(savedFilters ?? {})
	}

	return (
		<Panel title={t("settings:users.titleSearch")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={6} xs={12}>
								<TextField label={t("settings:users.name")} name="name" />
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField label={t("settings:users.email")} name="email" />
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("settings:users.profile")}
									name="profileId"
									options={profilesAsOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<MaskField
									label={t("settings:users.form.cpf")}
									name="cpf"
									mask={"999.999.999-99"}
									maskChar={null}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									label={t("settings:users.form.rg")}
									name="rg"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField label={t("settings:users.form.oab")} name="oab" />
							</Grid>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									multiple
									label={t("settings:users.form.dejurArea")}
									name="areaDejur"
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									multiple
									label={t("settings:users.office")}
									name="responsibleAreaId"
									options={groupedAreasByIdAsOptions}
									
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("settings:users.status")}
									name="isActive"
									options={statusOptions}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									label={t("settings:users.form.contributorId")}
									name="contributorId"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
									<RadioGroup
										label={t('settings:users.form.isInternal')}
										name='isInternal'
										options={isInternalOptions}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<RadioGroup
										label={t('settings:users.form.isAdmin')}
										name='isAdmin'
										options={isAdminOptions}
									/>
								</Grid>
						</Grid>
						<Grid
							container
							item
							justifyContent="space-between"
							alignItems="center"
						>
							<Clean action="users" />
							<Submit
								type="search"
								submitting={loading || isSubmitting}
								disabled={!dirty}
							/>
						</Grid>
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
