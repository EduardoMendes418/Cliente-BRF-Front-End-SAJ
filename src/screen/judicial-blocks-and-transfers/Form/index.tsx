import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import ProcessFormData from "src/components/ProcessFormData";
import ScreenTemplate from "src/components/Screen";

import {
	getItemJudicialBlocksAndTransfers,
	getJudicialBlocksAndTransfersAccounting,
	getRedirectUrl
} from "src/core/store/modules/judicial-blocks-and-transfers/selectors";
import { getProcessFormData, getProcessIsFetching, getProcessStatus } from "src/core/store/modules/process/selectors";
import { listAccountingSapResponseByJudicialBlocksAndTransferId } from "src/core/store/modules/accountability/selectors";
import { useJudicialBlocksAndTransfersItem } from "src/hooks/judicialBlocksAndTransfers";
import { t } from "src/locale/i18n";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";
import { Modulos } from "src/core/models/modules";
import {
	getLoadingPaymentType
} from "src/core/store/modules/payment-type/selectors";
import Search from './Search';
import Form from './Form';
import { useEffect, useState } from "react";

const JudicialBlocksAndTransfersForm = () => {
	const history = useHistory();
	const { id } = useParams<{ id: string }>();
	const [verifyStatusId, setVerifyStatusId] = useState<boolean>(false);
	const dispatch = useDispatch();

	useJudicialBlocksAndTransfersItem(Number(id));
	
	const redirectUrl = useSelector(getRedirectUrl);
	if (redirectUrl) history.replace(redirectUrl);
	useEffect(() => { 
		dispatch(fetchPaymentType({ pageSize: 100, notPaginate: true, modulo: Modulos.Pagamento }))
	}, [dispatch])
	const item = useSelector(getItemJudicialBlocksAndTransfers);
	const processForm = useSelector(getProcessFormData);
	const isFetching = useSelector(getProcessIsFetching);
	const isFolderClosed = useSelector(getProcessStatus);
	const accounting = useSelector(getJudicialBlocksAndTransfersAccounting)
	const unlocks = useSelector(listAccountingSapResponseByJudicialBlocksAndTransferId)
	const paymentTypeLoading = useSelector(getLoadingPaymentType);
	const hasFolder = processForm && Object.keys(processForm).length > 0;
	const isFolderValid = !isFetching && ((hasFolder && !isFolderClosed) || item?.process);
	const isNew = id === 'novo';

	let slotTopRight;
	if (item.paymentId) {
		slotTopRight = {
			title: t('judicialBlocksAndTransfers:form.goToPaymentRequest'),
			to: `/pagamentos/solicitacao/${item.paymentId}`
		};
	} else if (item.goodsGuaranteesRequestId) {
		slotTopRight = {
			title: t('judicialBlocksAndTransfers:form.goToGoodsGuaranteesRequest'),
			to: `/bens-e-garantias/gestao/${item.goodsGuaranteesRequestId}`
		};
	}

	return (
		<ScreenTemplate slotTopRight={slotTopRight && { ...slotTopRight, showIcon: false }}>
			<Search setVerifyStatusId={setVerifyStatusId} verifyStatusId={verifyStatusId} readOnly={!isNew} requestNumber={item?.id} folderNumber={item?.folderNumber ?? ''} />
			<ProcessFormData processData={processForm} loading={isFetching} />
			{(isFolderValid || verifyStatusId === true) && !paymentTypeLoading && (
				<>
					<Form
						item={item}
						isNew={isNew}
						folderNumber={processForm?.folderNumber ?? ''}
						accounting={accounting}
						unlocks={unlocks}
					/>
				</>
			)}
		</ScreenTemplate>
	)
}

export default JudicialBlocksAndTransfersForm;