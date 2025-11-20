import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import ScreenTemplate from 'src/components/Screen';
import Form from './Form';
import Search from './Search'
import { getHasItemRequestParameters } from 'src/core/store/modules/request-parameters/selectors'
import {
	getProcessFormData,
	getProcessIsFetching,
} from 'src/core/store/modules/process/selectors';
import ProcessFormData from 'src/components/ProcessFormData';
import { FolderNumber } from 'src/core/models/requisitions';
import { getRequisitions, getDeadlineDateRequisitions } from 'src/core/store/modules/requisitions/thunks';
import { fetchProcessFolder } from 'src/core/store/modules/process/thunks';
import { actions } from 'src/core/store';
import { getHasItemRequisitions, getItemRequisitions } from 'src/core/store/modules/requisitions/selectors';
import { fetchRequestParameters, getRequestParameters } from 'src/core/store/modules/request-parameters/thunks';

const RequisitionsForm = () => {
	const dispatch = useDispatch()
	const { id } = useParams<{ id: string }>(); 
	const isNew = id === 'novo';

	const hasRequestParametersItem = useSelector(getHasItemRequestParameters)
	const hasRequisitionsItem = useSelector(getHasItemRequisitions)
	const requisitionItem = useSelector(getItemRequisitions)
	const loading = useSelector(getProcessIsFetching)


	const [folderNumber, setFolderNumber] = useState<FolderNumber | undefined>()

	useEffect(() => {
		if (id && !isNew) {
			dispatch(getRequisitions({ id }));
		}

		dispatch(fetchRequestParameters({ notPaginate: true, status: true }));

		return () => {
			dispatch(actions.requisitions.clear());
			dispatch(actions.process.clear());
			dispatch(actions.requestParameters.clear());
		};
	}, [dispatch, id, isNew]);

	useEffect(() => {
		if (!hasRequisitionsItem || !requisitionItem.requestParameter || !requisitionItem.requestParameter.id) return;

		dispatch(getRequestParameters(requisitionItem.requestParameter.id));
		dispatch(getDeadlineDateRequisitions({ requestParameterId: requisitionItem.requestParameter.id,	dateTime: moment().format('YYYY-MM-DD') }))

		if (requisitionItem.folderNumber)
			setFolderNumber({ folderNumber: requisitionItem.folderNumber })
	}, [dispatch, requisitionItem, hasRequisitionsItem])

	useEffect(() => {
		folderNumber?.folderNumber && dispatch(fetchProcessFolder({ folderNumber: folderNumber.folderNumber }))
	}, [dispatch, folderNumber?.folderNumber])

	const processFolderData = useSelector(getProcessFormData)

	useEffect(() => {
		if (isNew) {
			dispatch(actions.process.clear())
		}
	}, [])

	return (
		<ScreenTemplate>
			<Search setFolderNumber={setFolderNumber} />
			<ProcessFormData processData={processFolderData} loading={loading} full />
			{
				((isNew && hasRequestParametersItem) || (!isNew && hasRequisitionsItem)) && (
					<Form
						folderNumber={folderNumber}
						loading={loading}
						isNew={isNew}
					/>
				)
			}
		</ScreenTemplate>
	);
};

export default RequisitionsForm;
