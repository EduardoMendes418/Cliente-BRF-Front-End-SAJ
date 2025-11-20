import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import { t } from 'src/locale/i18n';
import Form from 'src/components/form';
import ScreenTemplate from 'src/components/Screen';
import { 
	addESocialEvent, 
	editESocialEvent, 
	fetchESocialEventById 
} from 'src/core/store/modules/e-social-event/thunks';
import { TEventGridList } from 'src/core/models/e-social-tables';

import { useSnackbar } from 'notistack';
import ESocialEventPanel from './eSocialEventPanel';

const validationSchema = yup.object({
	description: yup.string().required(t('required')).max(100)
});

const ESocialEventForm = () => {
	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo';
	const dispatch = useDispatch();
	const [tableData, setTableData] = useState<any>();
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();

	const initialValues = {
		description: tableData?.description ?? '',
		code: tableData?.code ?? '',
		automaticSend: tableData?.automaticSend ?? false
	};

	const onSubmit = async (values: TEventGridList) => {
		if(isNew === false){
			const { payload } = await dispatch(editESocialEvent({
				id: tableData?.id, 
				description: values.description,
				code: values.code, 
				status: tableData?.status,
				automaticSend: values.automaticSend,
			})) as any;

			if(payload.status === 500){
				return enqueueSnackbar(`${payload.detail}`, {
					variant: "error",
				});
			}
			if(payload.status === 200){
				history.goBack();
				return enqueueSnackbar("Evento editado com sucesso!", {
					variant: "success",
				});
			}
		} else {
			const { payload } = await dispatch(addESocialEvent({...values, status: true})) as any;
			if(payload.status === 500){
				return enqueueSnackbar(`${payload.detail}`, {
					variant: "error",
				});
			}

			if(payload.status === 201){
				history.goBack();
				return enqueueSnackbar("Evento criado com sucesso!", {
					variant: "success",
				});
			}
		}
	};

	const getTableData = async () => {
		const { payload } = await dispatch(fetchESocialEventById(id)) as any;
		setTableData(payload);
	};

	useEffect(() => {
		if(isNew === false) getTableData();
	}, []);

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{() => <ESocialEventPanel />}
			</Form>
		</ScreenTemplate>
	);
};

export default ESocialEventForm;
