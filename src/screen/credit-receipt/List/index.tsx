import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import ScreenTemplate from 'src/components/Screen';
import { Modulos } from 'src/core/models/modules';
import {
	getLoadingCreditReceipt,
	getFiltersCreditReceipt,
} from 'src/core/store/modules/credit-receipt/selectors';
import { fetchCreditReceiptList } from 'src/core/store/modules/credit-receipt/thunks';
import { fetchPaymentType } from 'src/core/store/modules/payment-type/thunks';
import { usePagination } from 'src/hooks/pagination';
import AddNewButton from 'src/components/button/AddNew';
import { getCreditReceipt } from 'src/core/store/modules/guarantee-accountability/selectors';


import List from './List';
import Search from './Search';
import { ButtonDiv } from './styled';

const CreditReceiptList = () => {
	const dispatch = useDispatch();
	const { location: { pathname } } = useHistory();

	const isRequest = pathname.includes('solicitacao')
	const isEvaluation = pathname.includes("avaliacao")

	const { page, pageSize } = usePagination();
	const creditReceiptFilters = useSelector(getFiltersCreditReceipt);
	const creditReceipt = useSelector(getCreditReceipt);

	const loading = useSelector(getLoadingCreditReceipt);

	useEffect(() => {
		const filters = creditReceiptFilters[pathname] ?? {};
		dispatch(fetchCreditReceiptList({ page, pageSize, ...filters }));
	}, [dispatch, page, pageSize, creditReceiptFilters, pathname]);

	useEffect(() => {
		dispatch(fetchPaymentType({ pageSize: 100, notPaginate: true, modulo: Modulos.Pagamento }));
	}, [dispatch])

	return (
		<ScreenTemplate slotTopRight={isRequest}>
			{isEvaluation && creditReceipt.length !== 0 && (
				<ButtonDiv>
					<AddNewButton to={"/recebimento-credito/avaliacao/multipla"} showIcon>
						Avaliação
					</AddNewButton>
				</ButtonDiv>
			)}
			<Search loading={loading} pathname={pathname} />
			<List loading={loading} isRequest={isRequest} pathname={pathname} />
		</ScreenTemplate>
	)
};

export default CreditReceiptList;
