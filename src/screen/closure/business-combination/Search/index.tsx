import { useCallback, useState } from 'react';
import Panel from 'src/components/Panel';
import { Formik } from 'formik';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'src/locale/i18n';
import { useGroupedAreas } from "src/hooks/fetchLists";
import { useDispatch } from "react-redux";
import { useSnackbar } from 'notistack';
import FileSaver from 'file-saver';

import { DateField, SelectField, RadioGroup } from 'src/components/form';
import { Submit } from 'src/components/button';
import { TBusinessCombinationParameters } from 'src/core/models/provision'
import { radioOption } from '../constants';
import { AppDispatch } from 'src/core/store';
import { businessCombination } from 'src/core/store/modules/provision/thunks'
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const initialValues: TBusinessCombinationParameters = {
	dejurAreaId: null,
	competence: null,
	haveBusinessCombination: true
}

type SearchProps = {
	fetchList: () => void
}

const Search = ({ fetchList }: SearchProps) => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();
	const [isLoading, setIsLoading] = useState(false);

	const { groupedAreasAsOptions} = useGroupedAreas();

	const onSubmit = useCallback(async (values: TBusinessCombinationParameters) => {
		setIsLoading(true);
		const { payload, type } = await dispatch(businessCombination(values))
		setIsLoading(false);

		if (type === 'provision/businessCombination/rejected') {
			enqueueSnackbar((payload as any).error ?? 'Não existem informações com os parâmetros informados', { variant: 'error' })
			return
		}

		FileSaver.saveAs(payload as Blob, `Business_Combination.xlsx`)

		fetchList()
	}, [dispatch, enqueueSnackbar, fetchList])

	return (
		<Panel title='Business combination' withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<DateField
									name='competence'
									label={t('closure:businesCombination.search.competencyYear')}
									views={['year', 'month']}
									format='MM/yyyy'
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									label={t('closure:businesCombination.search.dejurArea')}
									name="dejurAreaId"
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item md={2} xs={12} style={{ display: "flex" }}>
								<RadioGroup
									name='haveBusinessCombination'
									label={t('closure:businesCombination.search.itHasBC')}
									options={radioOption}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<Submit
									type="search"
									submitting={isLoading || isSubmitting}
								/>
							</Grid>
						</Grid>
					</form>
				)
				}
			</Formik>
		</Panel>
	)
};

export default Search;
