import React from 'react';
import { Formik } from 'formik';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { modal } from "src/components/modals";
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import { getPaymentsToEsocialLink } from 'src/core/store/modules/payment/thunks';
import { TPaymentsToEsocialLink } from 'src/core/models/payment';
import { getModalEsocialLinkId } from "src/core/store/modules/payment/selectors";

import { actions } from 'src/core/store';
import FormModalESocialLink from './formModalESocialLink';

type TModalESocialLink = {
	folderNumber: string
	isSubmitting: boolean
	eSocialRestriction: boolean
}

type TFormikValues = {
	eSocialList: TPaymentsToEsocialLink[]
	eSocialLinkedPaymentId: number
	lastChecked: number
}

const ModalESocialLink = ({ folderNumber, isSubmitting, eSocialRestriction }: TModalESocialLink) => {
	const { pathname } = useLocation();
	const dispatch = useDispatch();

	const isPaymentTaxPath = pathname === ("/pagamentos/solicitacao-imposto/novo");
	const useModal = isPaymentTaxPath && eSocialRestriction;

	const [isOpen, setIsOpen] = React.useState(true);

	const eSocialID = useSelector(getModalEsocialLinkId);
	const modalId = useSelector(getLastModalOpen);

	const handleGetPayments = async (folderNumber: string) => {
		// @ts-ignore
		const { payload } = await dispatch(getPaymentsToEsocialLink(folderNumber));

		const newValues = {
			eSocialList: payload?.map((item: TPaymentsToEsocialLink) => ({ ...item, checked: false })),
			eSocialLinkedPaymentId: 0,
			lastChecked: 0,
		};

		showModal(newValues);
		setIsOpen(true);
	};
	
	const updatePaymentId = ({ eSocialLinkedPaymentId }: TFormikValues) => {
		// ATUALIZA ESOCIAL ID A SER USADO NO FORMULARIO DE CRIAR PAGAMENTO
		dispatch(actions.paymentRequest.setModalESocialLinkId(eSocialLinkedPaymentId));
		setIsOpen(false);
	};

	React.useEffect(() => {
		if (useModal && isSubmitting) handleGetPayments(folderNumber);		
	}, [useModal, isSubmitting, folderNumber]);

	React.useEffect(() => {
		if (!isOpen) dispatch(actions.modal.close({ modalId }));
	}, [isOpen, modalId]);

	// TODO: types
	const showModal = (initialValues: any) => modal({
		title: "Qual o pagamento que deseja vincular?",
		component: (
			<Formik initialValues={initialValues} onSubmit={updatePaymentId}>
				{ () => <FormModalESocialLink /> }
			</Formik>
		),
		buttons: [],
		dialogProps: {
			maxWidth: "lg",
			showCloseButton: true,
			fullWidth: true,
		},
		onCloseAction: () => {
			if (eSocialID === 0) 
				showModal(initialValues);
		}
	})

	return null;
}

export default ModalESocialLink;
