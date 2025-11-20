import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button } from '@material-ui/core';

import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import { getFeedbackErrorMessageRequisitions, getLoadingRequisitions } from 'src/core/store/modules/requisitions/selectors';
import { getItemRequestParameters } from 'src/core/store/modules/request-parameters/selectors'
import { fetchUsers } from 'src/core/store/modules/users/thunks';
import { FolderNumber } from 'src/core/models/requisitions';
import { actions } from 'src/core/store';
import { t } from 'src/locale/i18n';

import Form from './Form';
import Search from './Search'

const RequestPensionsForm = () => {
	const dispatch = useDispatch()

	const item = useSelector(getItemRequestParameters)
	const errorFeedbackLines = useSelector(getFeedbackErrorMessageRequisitions)
	const isLoading = useSelector(getLoadingRequisitions)

	const [folderNumbers, setFolderNumbers] = useState<FolderNumber[]>([])

	useEffect(() => {
		dispatch(fetchUsers({}));
		dispatch(actions.requestParameters.clear());
	}, [dispatch])


	return (
		<ScreenTemplate>
			{!errorFeedbackLines ? (
				<>
					<Search setFolderNumbers={setFolderNumbers} />
					{item && <Form folderNumbers={folderNumbers} />}
				</>
			) : (
				<>
					<Panel title={t('dataImport:importErrors.importErrors')}>
						<Table
							rows={errorFeedbackLines ?? []}
							columns={columns}
							isLoading={isLoading}
						/>
					</Panel>
					<Box sx={{ flexDirection: "row-reverse" }} className='margin-top-16' display="flex">
							<Button
								color='primary'
								variant='contained'
								onClick={() => dispatch(actions.requisitions.clearStatus())}
							>
								{t("dataImport:goBack")}
							</Button>
						</Box>
				</>
			)}
		</ScreenTemplate>
	);
};

const columns: ColumnData[] = [
	{
		label: t('dataImport:importErrors.line'),
		field: 'rowIndex',
	},
	{
		label: t('dataImport:importErrors.error'),
		field: 'message',
	}
];

export default RequestPensionsForm;
