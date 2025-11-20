import * as yup from 'yup';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { Grid } from '@material-ui/core';
import { Formik, FormikHelpers } from 'formik';

import { fetchProcessStatisticalOrderCalculate } from 'src/core/store/modules/process/thunks';
import { DateField } from 'src/components/form';
import { Clean, Submit } from 'src/components/button';
import ContactField from 'src/components/ContactField';
import NumericField from 'src/components/form/NumericField';
import { t } from 'src/locale/i18n';
import { useSnackbar } from 'notistack';

const CTGSearchSchema = yup.object({
	folderNumber: yup.string(),
	distributionDateFinal: yup.string().nullable(),
	city: yup.number().nullable(),
	oppositePart: yup.number().nullable(),
});

type Props = {
	folderNumber: string;
	distributionDateFinal?: string,
	city?: number | null,
	oppositePart?: number | null,
	isFetching?: boolean;
};

type TSubmit = {
	folderNumber: string, 
	distributionDateFinal?: string, 
	city?: number | null,
	oppositePart?: number, 
}

const CTGSearch = ({ 
	folderNumber = '', 
	isFetching = false 
}: Props) => {
	const [hasRedirected, setHasRedirected] = useState(false);
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();

	const onSubmit = async (
		values: TSubmit,
		{ setSubmitting }: FormikHelpers<{ folderNumber: string }>,
	) => {
		setSubmitting(true);
		const {payload, type} = await dispatch(fetchProcessStatisticalOrderCalculate({
			page: 1,
			pageSize: 10,
			folderNumber: values.folderNumber,
			RequesterDate: values.distributionDateFinal,
			LocationId: values.city,
			ContraryPartyId: values.oppositePart,
		})) as any;

		if (folderNumber === "novo" && payload?.itemCount >= 1) {
			setHasRedirected(true);
			history.push(`/calculos/${values.folderNumber}`);
		} 

		if(type === "process/StatisticalOrderCalculate/rejected"){
			return enqueueSnackbar(
				`${payload}`,
				{ variant: "error" }
			);
		}

		setSubmitting(false);
	};

	return (
		<Formik
			initialValues={{ folderNumber }}
			validationSchema={CTGSearchSchema}
			onSubmit={onSubmit}
		>
			{({ handleSubmit, values, isSubmitting }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Grid container spacing={2} alignItems='flex-start'>
						<Grid item xs={12} md={6} lg={3}>
							<NumericField
								name='folderNumber'
								label={t('form.CTGFolder')}
								disabled={isFetching}
							/>
						</Grid>
						{
							folderNumber !== "novo" && !hasRedirected && 
							<>
								<Grid item xs={6} md={6} lg={2}>
									<DateField
										name='distributionDateFinal'
										label={t('calculations:filter.recordInclusion')}
									/>
								</Grid>
								<Grid item xs={6} md={5} lg={3}>
									<ContactField
										name='city'
										label={t('calculations:filter.city')}
										setInvalidValueWhenTyping
									/>
								</Grid>
								<Grid item xs={10} md={5} lg={3}>
									<ContactField
										name='oppositePart'
										label={t('calculations:filter.oppositePart')}
										setInvalidValueWhenTyping
									/>
								</Grid>
							</>
						}
						<Grid item xs={2} md={2} lg={1}>
							<Submit type="search" submitting={isSubmitting}  />
						</Grid>
						<Grid xs={10} md={4}>
							<Clean />
						</Grid>
					</Grid>
				</form>
			)}
		</Formik>
	);
};

export default CTGSearch;
