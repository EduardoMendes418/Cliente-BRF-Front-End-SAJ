import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import ScreenTemplate from 'src/components/Screen';
import { 
	fetchStatisticalOrderCalculate,
	fetchProcessStatisticalOrderCalculate 
} from 'src/core/store/modules/process/thunks';
import {
	getProcessIsFetching,
	getProcessIsEmpty,
} from 'src/core/store/modules/process/selectors';
import {
	getCalculationsIsEdited,
	getCalculationsIsFailure,
	getCalculationsFolderInfo
} from 'src/core/store/modules/calculations/selectors';
import { actions } from 'src/core/store';
import { useTranslation } from 'src/locale/i18n';

import Form from './Form';
import Search from './Search';
import List from './List';
import { usePagination } from 'src/hooks/pagination';
import AddNewButton from 'src/components/button/AddNew';

const StatisticalOrderCalculation = () => {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const { t } = useTranslation();
	const history = useHistory();
	const [isRegisterScreen, setRegisterScreen] = useState(false);

	const { id } = useParams<{ id: string }>();

	const isFetching = useSelector(getProcessIsFetching);
	const isEmpty = useSelector(getProcessIsEmpty);
	const isEdited = useSelector(getCalculationsIsEdited);
	const isFailure = useSelector(getCalculationsIsFailure);
	const folder = useSelector(getCalculationsFolderInfo);

	const { page, pageSize } = usePagination();

	useEffect(() => {
		if (id) {
			setRegisterScreen(true)
		}
		if (id !== "novo") {
			dispatch(fetchStatisticalOrderCalculate({ folderNumber: id }));
		}
	}, [dispatch, id]);

	useEffect(() => {
		!id && dispatch(fetchProcessStatisticalOrderCalculate({ page, pageSize }))
	}, [dispatch, page, pageSize, id]);

	useEffect(() => {
		return () => {
			dispatch(actions.calculations.clear());
			dispatch(actions.process.clear());
		}		
	}, [dispatch]);

	useEffect(() => {
		if (isEdited) {
			enqueueSnackbar('Registro editado com sucesso', { variant: 'success' });
			history.push('/calculos');
			dispatch(actions.calculations.clearStatus());
		}
		if (isFailure) {
			enqueueSnackbar('Ocorreu um erro', { variant: 'error' });
			dispatch(actions.calculations.clearStatus());
		}
	}, [isEdited, isFailure, enqueueSnackbar, dispatch, history]);

	return (
		<ScreenTemplate
			slotTopRight={!isRegisterScreen && <AddNewButton
				to={"/calculos/novo"}
			>
				{t('btnNew')}
			</AddNewButton>}
		>
			<Search
				folderNumber={id}
				isFetching={isFetching}
				isEmpty={isEmpty}
				folder={folder}
			/>
			{
				!isFetching && isRegisterScreen &&
				(!isEmpty || folder.closed) && <Form folderNumber={id} />

			}
			{!isRegisterScreen && <List />}
		</ScreenTemplate >
	);
};

export default StatisticalOrderCalculation;
