import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import {
	getProcessFormData,
	getProcessIsEmpty,
	getProcessIsFetching,
} from 'src/core/store/modules/process/selectors';
import {
	getHasItemAgreementAuthorization,
	getLoadingAgreementAuthorization,
	getProcessFolderDataAgreementAuthorization,
} from 'src/core/store/modules/agreement-authorization/selectors'
import { getAgreementAuthorization } from 'src/core/store/modules/agreement-authorization/thunks'
import { actions } from 'src/core/store';

import ScreenTemplate from 'src/components/Screen';
import Search from './Search';
import AgreementForm from './AgreementForm';
import ProcessFormData from 'src/components/ProcessFormData';

const AgreementAuthorizationForm = () => {

	const dispatch = useDispatch()
	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo'

	const hasItem = useSelector(getHasItemAgreementAuthorization)
	const loadingItem = useSelector(getLoadingAgreementAuthorization)
	const processFolderDataItem = useSelector(getProcessFolderDataAgreementAuthorization)

	const isEmpty = useSelector(getProcessIsEmpty)
	const loadingFolder = useSelector(getProcessIsFetching)
	const processFolderDataFolder = useSelector(getProcessFormData)

	const hasFolder = !isEmpty && !loadingFolder && !processFolderDataFolder.closed
	const loading = loadingItem || (isNew && loadingFolder)
	const processFolderData = isNew ? processFolderDataFolder : processFolderDataItem
	const { numeroProcesso: processNumber } = processFolderDataItem || processFolderDataFolder

	useEffect(() => {
		if (id && !isNew) {
			dispatch(getAgreementAuthorization(Number(id)))
		} else if (isNew) {
			dispatch(actions.process.clear())
		}

		return () => {
			dispatch(actions.agreementAuthorization.clear())
		}
	}, [dispatch, id, isNew])

	return (
		<ScreenTemplate>
			<Search
				loading={loading}
				disabled={isNew && hasFolder}
				readOnly={hasItem}
			/>
			{
				((isNew && hasFolder) || hasItem) && (
					<>
						<ProcessFormData processData={processFolderData} />
						<AgreementForm hasItem={hasItem} processNumber={processNumber} />
					</>
				)
			}
		</ScreenTemplate>
	)
}

export default AgreementAuthorizationForm;
