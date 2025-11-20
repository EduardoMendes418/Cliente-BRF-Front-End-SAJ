import { useMemo } from "react";
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
import { fetchProcessFolder } from 'src/core/store/modules/process/thunks';
import { actions } from 'src/core/store';
import { Clean, Submit } from 'src/components/button';
import {
	getListPreRequestRefundItem,
} from "src/core/store/modules/office-management-request-refund/selectors";

const validationSchema = yup.object({
	folderNumber: yup.string().required(t('form.CTGFolderRequiredMessage')),
});

type TSearch = {
	folderNumber: string;
	readOnly: boolean;
}
type TinitialValues = {
	folderNumber: string
}

const Search = ({ folderNumber, readOnly }: TSearch) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const closed = useSelector(getProcessStatus);
	const error = useSelector(getProcessError);
	const isFetching = useSelector(getProcessIsFetching)
	const itemFolder = useSelector(getListPreRequestRefundItem);


	const onSubmit = ({ folderNumber }: TinitialValues, { setSubmitting }: any) => {
		dispatch(actions.officeManagementPayment.clear());
		dispatch(fetchProcessFolder({ folderNumber }));
		setSubmitting(false);
	}
	const initialValues: TinitialValues = useMemo(() => {
		if (itemFolder.folderNumber) return {folderNumber: itemFolder.folderNumber}
		return {folderNumber}
	}, [itemFolder, folderNumber]);

	return (
		<Panel title={"Nova solicitação"} withPadding>
			<Formik
				initialValues={initialValues}
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
									readOnly={readOnly || !!itemFolder.folderNumber}
								/>
							</Grid>
							{!readOnly && !itemFolder.folderNumber && (
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