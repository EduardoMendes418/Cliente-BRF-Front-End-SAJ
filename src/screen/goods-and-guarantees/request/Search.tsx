import * as yup from 'yup';
import { Formik } from "formik";
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from "@material-ui/core";

import { NumericField } from "src/components/form";
import Panel from "src/components/Panel";
import SearchInfo from "src/components/SearchInfo";
import { t, useTranslation } from "src/locale/i18n";
import {
	getProcessIsFetching,
	getProcessError,
	getProcessStatus,
} from 'src/core/store/modules/process/selectors';
import { fetchProcessFolderPayW } from 'src/core/store/modules/process/thunks';
import { actions } from 'src/core/store';
import FieldColumn from 'src/components/FieldColumn';
import { Clean, Submit } from 'src/components/button';

const validationSchema = yup.object({
	folderNumber: yup.string().required(t('form.CTGFolderRequiredMessage')),
});

type TSearch = {
	folderNumber: string;
	readOnly: boolean;
	requestNumber?: number;
	status?: string;
	requestDate?: string;
}

const Search = ({ folderNumber, requestNumber, status, readOnly, requestDate }: TSearch) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const closed = useSelector(getProcessStatus);
	const error = useSelector(getProcessError);
	const isFetching = useSelector(getProcessIsFetching)

	const onSubmit = ({ folderNumber }: any, { setSubmitting }: any) => {
		dispatch(actions.goodsGuaranteesRequest.clear());
		dispatch(fetchProcessFolderPayW({ folderNumber }));
		setSubmitting(false);
	}

	return (
		<Panel title={t('requestGoodsAndGuarantees')} withPadding>
			<Formik
				initialValues={{ folderNumber }}
				validationSchema={validationSchema}
				enableReinitialize
				onSubmit={onSubmit}
			>
				{({ handleSubmit, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2} alignItems='flex-start'>
							<Grid item xs={12} md={3}>
								<NumericField
									required
									name='folderNumber'
									label={t('form.CTGFolder')}
									placeholder={t('form.typeHere')}
									readOnly={readOnly}
								/>
							</Grid>
							{readOnly && (
								<>
									<Grid item xs={12} md={3}>
										<FieldColumn
											label={t('goodsAndGuarantees:requestNumber')}
											value={requestNumber}
										/>
									</Grid>
									<Grid item xs={12} md={3}>
										<FieldColumn
											label={"Data da solicitação"}
											value={requestDate}
											type='date'
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<FieldColumn
											label={t('status')}
											value={status}
										/>
									</Grid>
								</>
							)}
							{!readOnly && (
								<Grid item xs={2}>
									<Submit type="search" disabled={!dirty} submitting={isFetching} />
								</Grid>
							)}
						</Grid>
						<Clean action='goodsGuaranteesRequest' disabled={!submitCount || isFetching} />
					</form>
				)}
			</Formik>
			{!isFetching && <SearchInfo closed={closed} error={error} />}
		</Panel>
	)
};

export default Search;