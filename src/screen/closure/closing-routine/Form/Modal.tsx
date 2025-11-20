import { Grid, Box } from '@material-ui/core';
import { Formik, FormikHelpers } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import Fields from './Fields';

import { getStatusClosures } from 'src/core/store/modules/closures/selectors';
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import { TClosures } from 'src/core/models/closures';
import { editClosure } from 'src/core/store/modules/closures/thunks';
import { Submit } from 'src/components/button';
import { AppDispatch, actions } from 'src/core/store';
import { useSnackbar } from 'notistack';

type EditModalProps = {
	row: TClosures,
	isSchedule?: boolean
}

const EditModal = ({
	row: { id, period, startDateCompetence, endDateCompetence, status, dataHoraAgendamento },
	isSchedule = false
}: EditModalProps) => {
	const dispatch = useDispatch<AppDispatch>();
	const statusClosures = useSelector(getStatusClosures)
	const modalId = useSelector(getLastModalOpen)
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();

	const initialValues: TClosures = {
		id,
		period,
		startDateCompetence,
		endDateCompetence,
		status,
		dataHoraAgendamento
	}

	const onSubmit = async (
		values: TClosures,
		{ resetForm }: FormikHelpers<TClosures>
	) => {
		if (values.status === 2 && values.endDateCompetence && values.period && values.endDateCompetence.split("-")[1] !== values.period.split("-")[1]){
			return enqueueSnackbar('Data fim de competência deve ser dentro do mês de competência.', { variant: 'error' });
		}
		const {payload} = dispatch(editClosure(values)) as any;
		if(values.status === 2 && payload?.status === undefined && values.endDateCompetence !== null){
			enqueueSnackbar('Executando fotografia do fechamento. Favor aguardar o processo ser finalizado', { variant: 'info' });}
			setTimeout(() => {
				history.push(`/fechamento/competencia-de-fechamento`);
			}, 1000)
		resetForm();
		dispatch(actions.modal.close({ modalId }));
	}

	return <Formik
		initialValues={initialValues}
		onSubmit={onSubmit}
		enableReinitialize
	>
		{({ handleSubmit }) => (
			<form noValidate onSubmit={handleSubmit}>
				<Grid container spacing={2}>
					<Fields form={false} isSchedule={isSchedule} />
					<Grid item md={12} xs={12} >
						<Box sx={{ flexDirection: "row-reverse" }} className='margin-top-16' display="flex">
							<Submit submitting={statusClosures === 'fetching'} />
						</Box>
					</Grid>
				</Grid>
			</form>
		)}
	</Formik>;
};
export default EditModal;