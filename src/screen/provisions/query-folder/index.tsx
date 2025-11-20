import { useCallback, useEffect, useMemo } from 'react';
import AccordionPanel from 'src/components/AccordionPanel'
import { useSelector, useDispatch } from "react-redux";

import ScreenTemplate from 'src/components/Screen';
import SearchLogOfProvisions from './components/SearchLogOfProvisions'
import SumOfValues from './components/SumOfValues'
import Lists from './components/Lists'
import { getProcessError } from "src/core/store/modules/process/selectors";
import { fetchProcessFolder } from "src/core/store/modules/process/thunks";
import { fetchLogProvisionSumOfValues } from 'src/core/store/modules/log-provision/thunks'
import { TLogProvisionBasicParameters } from 'src/core/models/log-provision';
import { fetchProvisionsProcess } from 'src/core/store/modules/provision-order/thunks';
import { getIsFetchingLogProvision } from 'src/core/store/modules/log-provision/selectors';
import TotalOrderRatingTable from 'src/screen/provisions/components/TotalOrderRatingTable';
import { renameKeys } from 'src/core/utils/func';
import { t } from 'src/locale/i18n'
import { actions } from 'src/core/store';
import { getProvisionsProcess } from 'src/core/store/modules/provision-order/selectors';
import ProcessFormData from "src/components/ProcessFormData";
import { fetchLogInterest } from 'src/core/store/modules/log-interest/thunks';
import { fetchESocialEventLauch } from 'src/core/store/modules/e-social-event-launch/thunks';
import { getListESocialEventLauch } from 'src/core/store/modules/e-social-event-launch/selectors';

const renamedKeys = {
	processParties: 'processParty',
	officeResponsible: 'officeManager',
}

const QueryFolder = () => {
	const dispatch = useDispatch();
	const error = useSelector(getProcessError); 
	const loading = useSelector(getIsFetchingLogProvision);
	const listESocialEventLauch = useSelector(getListESocialEventLauch)

	const process = useSelector(getProvisionsProcess); 
	const isESocialError = listESocialEventLauch.some((item: any) => item.eventLaunchStatus !== 4)

	const onSubmit = useCallback(async (values: TLogProvisionBasicParameters) => {
		const { folderNumber } = values
		dispatch(actions.goodsGuaranteesRequest.setFilters({ filters: { folderNumber, page: 1 }, page: '/provisoes/consulta-pasta' }));
		dispatch(actions.logProvison.setFilter({ filters: values, page: '/provisoes/consulta-pasta' }));
		dispatch(fetchLogProvisionSumOfValues(values));
		dispatch(actions.paymentRequest.setFilters({ filters: { folderNumber, page: 1 }, page: '/provisoes/consulta-pasta' }));
		dispatch(fetchProcessFolder({ folderNumber }));
		dispatch(fetchProvisionsProcess(folderNumber));
		dispatch(fetchLogInterest({ folderNumber, page: 1 }))
		dispatch(fetchESocialEventLauch({page: 1, folderNumber: folderNumber}))
	}, [dispatch])
	useEffect(() => () => dispatch(actions.logProvison.clear()), [dispatch]);

	const processData = useMemo(() => renameKeys(renamedKeys)( process), [process])
	const isProcessEmpty = Object.keys(processData).length === 0
	const feedbackMsg = error ? error : undefined

	const dataWithOtherPartName = {...processData, otherPartName: process.otherPartName}
	return (
		<ScreenTemplate>
			<SearchLogOfProvisions onSubmit={onSubmit} feedback={(!isESocialError) ? feedbackMsg : "Pasta/CTG possui um processo e-Social em andamento."} loading={loading} />
			{!isProcessEmpty && !loading && (
				<>
					<ProcessFormData doViaFolderNumber folderNumber={process?.folderNumber ?? ''} startExpanded={false} />
					<AccordionPanel title={'Tabela de valores'} noContentMargin>
					<SumOfValues />
					</AccordionPanel>
					<TotalOrderRatingTable />
					<Lists />
				</>
			)}
		</ScreenTemplate>
	);
};

export default QueryFolder;
