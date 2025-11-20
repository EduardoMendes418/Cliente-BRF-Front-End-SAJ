import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import { t } from 'src/locale/i18n';
import Form from 'src/components/form';
import ScreenTemplate from 'src/components/Screen';
import { 
	fetchESocialAreasCreate,
	fetchESocialAreasUpdate,
} from 'src/core/store/modules/e-social-areas/thunks';
import DejurZonePanel from './dejurZonePanel';

const validationSchema = yup.object({
	id:  yup.number(),
	areaId:  yup.number().required(t('required')),
	isActive:  yup.boolean(),
});

const DejurZoneForm = () => {
	const { enqueueSnackbar } = useSnackbar();
	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo';

	const history = useHistory();
	const dispatch = useDispatch();

	const initialValues = {
		id: 0,
		areaId: 0,
		isActive: true,
	};

	const onSubmit = async (values: any) => {
		if(isNew === false) {
			// @ts-ignore eslint-disable-next-line
			const { error, meta } = await dispatch(fetchESocialAreasUpdate(values));

			if(meta?.requestStatus === "rejected"){
				return enqueueSnackbar(`${error?.message}`, { variant: "error", });
			}
			if(meta?.requestStatus === "fulfilled"){
				history.goBack();
				return enqueueSnackbar("Configuração editada com sucesso!", { variant: "success" });
			}
		} else {
			// @ts-ignore eslint-disable-next-line
			const { error, meta } = await dispatch(fetchESocialAreasCreate(values));
			
			if(meta?.requestStatus === "rejected"){
				return enqueueSnackbar(`${error?.message}`, { variant: "error" });
			}
			if(meta?.requestStatus === "fulfilled"){
				history.goBack();
				return enqueueSnackbar("Configuração realizada com sucesso!", { variant: "success" });
			}
		}
	};

	return (
		<ScreenTemplate>
			<Form
			enableReinitialize
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
			>
				{() => <DejurZonePanel />}				
			</Form>
		</ScreenTemplate>
	);
};

export default DejurZoneForm;
