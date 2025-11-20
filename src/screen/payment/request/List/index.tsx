import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import ScreenTemplate from 'src/components/Screen';
import { useTranslation } from 'src/locale/i18n';
import { actions } from 'src/core/store';
import Search from './Search';
import List from './List';

import { Button } from "src/components/button";
import { modal } from 'src/components/modals';

const PaymentRequest = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { location: { pathname } } = useHistory();

	// // RESET MODAL ESOCIAL CASO RETORNAR VIA NAVEGADOR
	// const modalId = useSelector(getLastModalOpen);
	// React.useEffect(() => {
	// 	if (modalId) dispatch(actions.modal.close({ modalId }));
	// }, [modalId]);

	return (
		<ScreenTemplate slotTopRight={t('solicitacaoPagamento:buttonNew')}>
			
			<Search pathname={pathname} />
			<List pathname={pathname} />
		</ScreenTemplate>
	);
};

export default PaymentRequest;
