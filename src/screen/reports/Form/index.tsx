import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';

import ScreenTemplate from 'src/components/Screen';

import { actions } from 'src/core/store';
import { getReportConfiguration } from 'src/core/store/modules/report-configuration/thunks'
import { getAddedReportConfiguration, getHasItemReportConfiguration, getStatusReportConfiguration } from 'src/core/store/modules/report-configuration/selectors';

import FormPayment from './types/payment/Form'
import FormPensions from './types/pensions/Form'
import FormGuarantees from './types/guarantees/Form'
import FormJudicialBlocksAndTransfers from './types/judicialBlocksAndTransfers/Form'
import FormStatisticalOrder from './types/statisticalOrder/Form'
import FormNoticeInspectionPayment from './types/noticeInspectionPayment/Form';
import FormCreditReceipt from './types/creditReceipt/Form';
import FormLegalDocument from './types/legal-document/Form';

const REPORT_FORM = {
	pagamentos: <FormPayment />,
	pensoes: <FormPensions />,
	'bens-e-garantias': <FormGuarantees />,
	'accountability': <FormGuarantees />,
	'bloqueios-e-transferencias': <FormJudicialBlocksAndTransfers />,
	'pedido-estatistico': <FormStatisticalOrder />,
	'pagamento-de-fiscalizacao': <FormNoticeInspectionPayment />,
	"recebimento-de-credito": <FormCreditReceipt />,
	"legal-document": <FormLegalDocument />
} as any;

const ReportsForm = () => {
	const dispatch = useDispatch();
	const { pathname } = useLocation()
	const { id } = useParams<{ id: string }>();
	const history = useHistory();
	const status = useSelector(getStatusReportConfiguration);
	const hasItem = useSelector(getHasItemReportConfiguration);
	const reportConfigurationAdded = useSelector(getAddedReportConfiguration);

	const isNew = id === 'novo';

	useEffect(() => {
		if (id && !isNew) dispatch(getReportConfiguration(Number(id)))
		return () => {
			dispatch(actions.reportConfiguration.clear());
		}
	}, [dispatch, id, isNew])


	useEffect(() => {
		if (status !== 'added' || !reportConfigurationAdded) return;

		const newUrl = pathname.replace('novo', String(reportConfigurationAdded))
		history.replace(newUrl)
	}, [status, reportConfigurationAdded, history, pathname])

	const getForm = () => {
		const routeName = pathname.split('/')[2];
		return REPORT_FORM[routeName] ?? null;
	};

	return (
		<ScreenTemplate>
			{status === 'fetching' || (!isNew && !hasItem)
				? <CircularProgress className='margin-top-16 align-center' />
				: getForm()
			}
		</ScreenTemplate>
	);
};

export default ReportsForm;
