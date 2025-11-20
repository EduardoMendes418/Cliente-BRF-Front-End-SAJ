import * as yup from 'yup';
import { Formik } from "formik";
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Grid, IconButton } from "@material-ui/core";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

import { NumericField } from "src/components/form";
import Panel from "src/components/Panel";
import SearchInfo from "src/components/SearchInfo";
import FieldColumn from 'src/components/FieldColumn';

import { t, useTranslation } from "src/locale/i18n";
import {
	getProcessIsFetching,
	getProcessError,
	getProcessStatus
} from 'src/core/store/modules/process/selectors';
import { fetchProcessFolder } from 'src/core/store/modules/process/thunks';
import { actions } from 'src/core/store';

const validationSchema = yup.object({
	folderNumber: yup.string().required(t('form.CTGFolderRequiredMessage')),
});

type TSearch = {
	folderNumber: string;
	readOnly: boolean;
	requestNumber?: number;
	setVerifyStatusId?: any;
	verifyStatusId?: boolean;
}

const Search = ({ folderNumber, requestNumber, readOnly, setVerifyStatusId, verifyStatusId }: TSearch) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const closed = useSelector(getProcessStatus);
	const error = useSelector(getProcessError);
	const isFetching = useSelector(getProcessIsFetching)

	const onSubmit = async ({ folderNumber }: any, { setSubmitting }: any) => {
		dispatch(actions.judicialBlocksAndTransfers.clear());
		const { payload } = await dispatch(fetchProcessFolder({ folderNumber })) as any;

		if(payload?.statusId === 3){
			setVerifyStatusId(true)
		}
		setSubmitting(false);
	}

	return (
		<Panel title={t('judicialBlocksAndTransfers:form.judicalBlocksAndTransfersOccurrences')} withPadding>
			<Formik
				initialValues={{ folderNumber }}
				validationSchema={validationSchema}
				enableReinitialize
				onSubmit={onSubmit}
			>
				{({ handleSubmit, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2} alignItems='flex-start'>
							<Grid item xs={10} md={3}>
								<NumericField
									required
									name='folderNumber'
									label={t('form.CTGFolder')}
									placeholder={t('form.typeHere')}
									readOnly={readOnly}
								/>
							</Grid>
							{readOnly && (
								<Grid item xs={10} md={3}>
									<FieldColumn
										label={t('goodsAndGuarantees:requestNumber')}
										value={requestNumber}
									/>
								</Grid>
							)}
							{!readOnly && (
								<Grid item xs={2}>
									{
										isFetching
											? <CircularProgress />
											: (
												<IconButton
													type='submit'
													color='primary'
													data-testid='ctg-button'
													disabled={!dirty}
												>
													<SearchOutlinedIcon />
												</IconButton>
											)
									}
								</Grid>
							)}
						</Grid>
					</form>
				)}
			</Formik>
			{!isFetching  && <SearchInfo closed={verifyStatusId === true ? false : closed} error={verifyStatusId === true ? null : error} />}
		</Panel>
	)
};

export default Search;