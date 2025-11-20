import { Formik } from 'formik';
import { Grid } from '@material-ui/core';

import Panel from 'src/components/Panel';
import { Clean, Submit } from 'src/components/button';

import { useTranslation } from 'src/locale/i18n';
import { rejectNoValues } from 'src/core/utils/func';
import { TDejurAreaFilter } from 'src/core/models';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import GroupedSelectFiledMultiple from '../GroupedSelectMultiple';

type TProps = {
	title: string;
	isLoading: boolean;
	handleSubmit: (filter: TDejurAreaFilter) => void;
	savedFilters?: TDejurAreaFilter;
	pathname?: string;
	action: string;
}

const DejurAreaFilter = ({ title, isLoading, handleSubmit, savedFilters = {}, pathname, action }: TProps) => {
	const { t } = useTranslation();

	const { groupedAreasAsOptions} = useGroupedAreas();


	const onSubmit = (values: TDejurAreaFilter) => {
		const filter = rejectNoValues(values) as TDejurAreaFilter;
		handleSubmit(filter);
	};

	return (
		<Panel title={title} withPadding>
			<Formik initialValues={{ dejurArea: '', ...savedFilters }} onSubmit={onSubmit}>
				{({ handleSubmit, isSubmitting, setSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									label={t('settings:users.form.dejurArea')}
									name='dejurArea'
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item md={1} xs={2}>
								<Submit type="search" submitting={isLoading || isSubmitting} />
							</Grid>
						</Grid>
						<Clean action={action} page={pathname} />
						{!isLoading && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default DejurAreaFilter;
