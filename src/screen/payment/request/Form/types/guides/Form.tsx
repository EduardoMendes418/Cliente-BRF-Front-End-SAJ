import { useSnackbar } from 'notistack';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from 'src/core/api/payment';

import { 
	addPaymentRequest,
	addPaymentRequestTax,
	addPaymentRequestTaxDefault,
	editPaymentRequest, 
	editPaymentRequestTax, 
	editPaymentRequestWithoutStatusUpdate, 
	updateBankAndJudicial 
} from 'src/core/store/modules/payment/thunks';
import {
	TPaymentDataGuides,
	TPaymentFormGuides,
	TPaymentFormGeneral,
	TPropsForm,
} from 'src/core/models/payment';
import { AppDispatch } from 'src/core/store';
import { useTranslation } from 'src/locale/i18n';
import { valuesToNumber } from 'src/core/utils/func';
import { getProcessFormData } from 'src/core/store/modules/process/selectors';
import { getFolderInfoPayment, getPaymentSearch } from 'src/core/store/modules/payment/selectors';
import { fetchParameterization } from 'src/core/store/modules/parameterization/thunks';

import GuidesData from './GuidesData';
import FormCore from '../../common/FormCore';
import { getListESocialAreas } from 'src/core/store/modules/e-social-areas/selectors';
import { fetchESocialAreasGridList } from 'src/core/store/modules/e-social-areas/thunks';
import { usePaymentType } from 'src/hooks/fetchLists';
import { Modulos } from 'src/core/models/modules';
/* import ESocialForm from '../../common/ESocialForm'; */

// import { 
// 	getPaymentOrders, 
// 	// getProvisionsProcess 
// } from 'src/core/store/modules/provision-order/selectors';
// import { TProvisionOrder } from "src/core/models/provision-order";

export type Props = TPropsForm & { 
	eSocialFormVisibility?: boolean;
	uploadESocialPJC?: boolean;
	item?: TPaymentDataGuides & {
		statusFlowId?: number,
		statusApprovalId?: number
	} 
};

export type TForm = TPaymentFormGeneral & TPaymentFormGuides & {
	newStatusFlowId: number
};

const FormGuides = (props: Props) => {
	const { t } = useTranslation()
	const history = useHistory()
	const dispatch = useDispatch<AppDispatch>();
	const folder = useSelector(getFolderInfoPayment);
	const processData = useSelector(getProcessFormData);
	const listESocialAreas = useSelector(getListESocialAreas);
	const { tipoPagamentoId } = useSelector(getPaymentSearch);
	const { paymentType } = usePaymentType(Modulos.Pagamento);
	const { pathname } = useLocation();

	// const paymentOrders = useSelector(getPaymentOrders);
	// const process = useSelector(getProvisionsProcess);
	const { enqueueSnackbar } = useSnackbar();
	// let probablePaymentValue = paymentOrders.map((order: any) => order.value).reduce((a, b) => a + b, 0);
	// let validProcessOrders = process?.orders?.filter((order: TProvisionOrder) => { return order.isActive === true && order.orderDescription?.sumProvision === true && order.orderStatus?.name === "Aprovado" && order.orderExpectation?.name === "Perda"})

	const isRequestTaxtPayment = history.location.pathname.includes("solicitacao-imposto");

	const tipoPagamento = paymentType.find(({ id }) => id === tipoPagamentoId);

	
	const customInitialValues: TPaymentDataGuides = {
		valorPrincipal: 0,
		valorMulta: 0,
		valorJuros: 0,
		encargo: 0,
		sucumbencia: 0,
		valorPagamentoJudicial: 0,
		banco: '',
		bancoId: 0,
		numeroContaJudicial: '',
		valorJurosHistorico: 0,
		valorOutrasEntidades: 0,
		empresa: folder.empresa,
		fornecedor: '',//folder.nomeReclamante,
		fornecedorId: '',//folder.supplierId,
		eSocialRestriction: isRequestTaxtPayment,
	};

	const editBankAndJudicial = props.hasItem && 
		props.item?.statusApprovalId === 1 && 
		(props.item?.statusFlowId === 1 || props.item.statusFlowId === 22) && 
		props.isApprovalLegalControl;

	const onSubmit = useCallback(async (values: TForm) => {
		if(!values.advogadoInterno || !values.fornecedor && tipoPagamento?.retificacaoESocial !== true) return;
		if (!values.advogadoInterno) return enqueueSnackbar("Pasta/CTG não possui advogado interno.", {
				variant: "error",
			});
		if (!values.fornecedor && tipoPagamento?.retificacaoESocial !== true) return enqueueSnackbar("Pasta/CTG não possui fornecedor.", {
			variant: "error",
		});
		const normalizedValues = {
			...valuesToNumber([
				'valorPrincipal',
				'valorMulta',
				'valorJuros',
				'encargo',
				'sucumbencia',
				'valorJurosHistorico',
				"valorOutrasEntidades",
				"pagamentosESocial.compensationAmount",
				"pagamentosESocial.remunerationAmount"
			], values) as TForm,
			...processData,
		}

		// let paymentValue: Number = validProcessOrders?.length <= 1 ? 0 : probablePaymentValue;

		// if(normalizedValues.valorPagamentoJudicial < paymentValue){
		// 	enqueueSnackbar("Valor da provisão não pode exceder o valor do pagamento judicial.", {
		// 		variant: "error",
		// 	});

		// 	return
		// }

		if (props.hasItem && editBankAndJudicial) {
			const { payload, meta } = await dispatch(updateBankAndJudicial({
				id: normalizedValues.id,
				bankId: normalizedValues.bancoId,
				judicialAccount: normalizedValues.contaJudicial,
				files: normalizedValues.files,
				statusFlowId: normalizedValues.newStatusFlowId
			}))

			if(props?.item?.statusFlowId !== Number(normalizedValues.newStatusFlowId)){
				await api.updateStatus(normalizedValues?.id, Number(normalizedValues.newStatusFlowId))
				normalizedValues.statusFlowId = Number(normalizedValues.newStatusFlowId);
			}

			await dispatch(editPaymentRequestWithoutStatusUpdate(normalizedValues)) 
			
			if (meta.requestStatus === "rejected") {
				enqueueSnackbar(payload.detail, { variant:"error" })
			} else {
				enqueueSnackbar(t("recordEditedSuccessfully"), { variant: "success" })
				history.goBack()
			}

			return 
		}
		const isDejurAreaPaymentListedGuides = listESocialAreas?.find(area => area.areaId ===  normalizedValues.legalDepartmentAreaId);

		if(props.hasItem === false && isDejurAreaPaymentListedGuides === undefined){
			delete normalizedValues.pagamentosESocial
		}

		if (props.hasItem) {
			pathname.includes("solicitacao-imposto") === true ? dispatch(editPaymentRequestTax(normalizedValues)) : dispatch(editPaymentRequest(normalizedValues))
		}
		else { 
			
			if(isRequestTaxtPayment){
				await dispatch(addPaymentRequestTaxDefault(normalizedValues))
					return
			}

			dispatch(addPaymentRequest(normalizedValues)); }
		
	},[processData, props.hasItem, editBankAndJudicial, dispatch, history, listESocialAreas]);

	useEffect(() => {
		dispatch(fetchParameterization(['prazoDiasFinanceiro']));
	}, [dispatch]);

	return (
		<>
			<FormCore
				form='guia'
				onSubmit={onSubmit}
				customInitialValues={customInitialValues}
				eSocialFormVisibility={props?.eSocialFormVisibility} 
				uploadESocialPJC={props.uploadESocialPJC ?? false}
				isFormGuia={true}
				{...props}
			>
				<GuidesData editBankAndJudicial={editBankAndJudicial} />
				{/* <ESocialForm 
					isVisible={props?.eSocialFormVisibility} 
					uploadESocialPJC={props.uploadESocialPJC ?? false}
				/> */}
			</FormCore>
		</>
	);
};

export default FormGuides;
