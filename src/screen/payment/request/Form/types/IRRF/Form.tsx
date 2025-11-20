import { useHistory } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
	TPaymentDataIRRF,
	TPaymentFormIRRF,
	TPaymentFormGeneral,
	TPropsForm,
} from 'src/core/models/payment';
import { 
	addPaymentRequest, 
	editPaymentRequest, 
	rawEditPaymentRequest 
} from 'src/core/store/modules/payment/thunks';
import { AppDispatch } from 'src/core/store';
import ordersAPI from "src/core/api/process";
import { modal } from 'src/components/modals';
import { getDateWithoutDays, valuesToNumber } from 'src/core/utils/func';
import { getProcessFormData } from 'src/core/store/modules/process/selectors';
import { fetchParameterization } from 'src/core/store/modules/parameterization/thunks';
import AccountabilityModalPayment from "src/screen/payment/request/Form/common/AccountabilityModalPayment";
import { 
	getFolderInfoPayment, 
	getModalEsocialLinkId
} from "src/core/store/modules/payment/selectors";

import IRRFData from './IRRFData';
import IRTable from './IRTable';
import FormCore from '../../common/FormCore';
/* import ESocialForm from '../../common/ESocialForm'; */
import useValidProcessOrders from '../../../hooks/useValidProcessOrders';
import { getListESocialAreas } from 'src/core/store/modules/e-social-areas/selectors';

type Props = TPropsForm & { 
	eSocialFormVisibility?: boolean;
	uploadESocialPJC?: boolean;
	item?: TPaymentDataIRRF & {
		statusFlowId?: number,
		statusApprovalId?: number
	} 
};

type TForm = TPaymentFormGeneral & TPaymentFormIRRF  & {
	newStatusFlowId: number
};

const FormIRRF = ({ hasItem, ...props }: Props) => {
	const dispatch = useDispatch<AppDispatch>();
	const folder = useSelector(getFolderInfoPayment);
	const processData = useSelector(getProcessFormData);
	const history = useHistory()
	const validProcessOrders = useValidProcessOrders();
	const isRequestTaxtPayment = history.location.pathname.includes("solicitacao-imposto");
	const listESocialAreas = useSelector(getListESocialAreas);

	// ID ESOCIAL RECEBIDO PELO MODAL
	const eSocialID = useSelector(getModalEsocialLinkId);

	const valorPrincipal = hasItem && props.item
		&& props.item.valorPrincipal >= props.item.valorJurosHistorico
		&& props.item.valorPrincipal !== ""
		&& props.item.valorJurosHistorico !== ""
		? props.item.valorPrincipal + props.item.valorJurosHistorico
		: 0

	// TODO: 158812 checar retorno eSocial ao editar pagamento
	const customInitialValues: TPaymentDataIRRF = {
		baseCalculo: 0,
		valorPrincipal,
		valorMulta: 0,
		valorJuros: 0,
		valorJurosHistorico: 0,
		valorPagamentoJudicial: 0,
		valorOutrasEntidades: 0,
		rendimentoTributavel: 0,
		previdenciaOficial: 0,
		encargo: 0,
		sucumbencia: 0,
		quantidadeMeses: '',
		cpfPerito: '',
		nomePerito: '',
		cpf: folder.cpf,
		nomeReclamante: folder.nomeReclamante,
		numeroProcesso: folder.processNumber,
		fornecedor: folder.nomeReclamante,
		fornecedorId: folder.supplierId,
		periodoApuracao: null,
		eSocialRestriction: isRequestTaxtPayment,
		eSocialLinkedPaymentId: eSocialID ?? null,
		pagamentosESocial: !props.eSocialFormVisibility ? null : { 
			id: folder?.pagamentosESocial?.id ?? 0,
			agreementApprovalDate: folder?.pagamentosESocial?.agreementApprovalDate ?? "",
			remunerationAmount: folder?.pagamentosESocial?.remunerationAmount ?? 0,
			compensationAmount: folder?.pagamentosESocial?.compensationAmount ?? 0,
			fgtsReflexes: folder?.pagamentosESocial?.fgtsReflexes ?? 0,
			cprb: folder?.pagamentosESocial?.cprb ?? 0,
			startDateForESocialCalculation: folder?.pagamentosESocial?.startDateForESocialCalculation ?? "",
			endDateForESocialCalculation: folder?.pagamentosESocial?.endDateForESocialCalculation ?? "",
			typeOfEmploymentContract: folder?.pagamentosESocial?.typeOfEmploymentContract ?? "",	
			decisionType: folder?.pagamentosESocial?.decisionType ?? "",
			///////////////////////
			ESocialEvent: null,
			observation: ""
			//////////////////////
		}
	};

	const editable = !(hasItem &&
		(props.item?.statusFlowId === 22 || props.item?.statusFlowId === 1) &&
		props.isApprovalLegalControl)

	const onSubmit = useCallback(async (values: TForm) => {
		if (!values.advogadoInterno || !values.fornecedor) return;
		const periodoApuracao = getDateWithoutDays(values.periodoApuracao ?? '');
		const normalizedValues = {
			...valuesToNumber([
				'baseCalculo',
				'valorPrincipal',
				'valorMulta',
				'valorJuros',
				'valorJurosHistorico',
				'rendimentoTributavel',
				'previdenciaOficial',
				'quantidadeMeses',
				'encargo',
				'sucumbencia',
				'valorOutrasEntidades'
			], values) as TForm,
			...processData,
			eSocialLinkedPaymentId: values.eSocialLinkedPaymentId === 0 ? null : values.eSocialLinkedPaymentId,
			pagamentosESocial: !props.eSocialFormVisibility ? null : {
				...values.pagamentosESocial,
				...(valuesToNumber([
					"compensationAmount", 
					"remunerationAmount",
				], values.pagamentosESocial)),
			},
			periodoApuracao
		}

		const principal = normalizedValues.valorPrincipal === "" ? 0 : normalizedValues.valorPrincipal
		const historico = normalizedValues.valorJurosHistorico === "" ? 0 : normalizedValues.valorJurosHistorico
		const pagamentoJudicial = normalizedValues.valorPagamentoJudicial === "" ? 0 : normalizedValues.valorPagamentoJudicial

		const data = {
			...normalizedValues, 
			valorPrincipal: principal > historico && props?.item?.statusApprovalId !== 1 ? principal - historico : principal,
			valorPagamentoJudicial: props?.item?.statusApprovalId !== 1 ? pagamentoJudicial - historico : pagamentoJudicial  
		}

		const { data: ordersData } = await ordersAPI.getProvisionsProcessPaymentPendingStatus(
			normalizedValues.folderNumber
		);

		const isDejurAreaPaymentListed = listESocialAreas?.find(area => area.areaId ===  data.legalDepartmentAreaId);

		if(hasItem === false && isDejurAreaPaymentListed === undefined){
			delete data.pagamentosESocial
		}

		if (!ordersData || validProcessOrders.length <= 1) {
			if (hasItem) {
				if (!editable) {
					await dispatch(rawEditPaymentRequest({
						...data,
						statusFlowId: data.newStatusFlowId
					}))
				} else {
					await dispatch(editPaymentRequest(data));
				}
				history.goBack()
			}
			else await dispatch(addPaymentRequest(data));
			return;
		} 
		modal({
			title: "",
			buttons: [],
			dialogProps: { maxWidth: "md", showCloseButton: true },
			component: (
				<AccountabilityModalPayment
					folderNumber={normalizedValues.folderNumber}
					paymentTypeId={normalizedValues.tipoPagamentoId}
					paymentMethodId={normalizedValues.formaPagamentoId}
					handleSubmitModal={(orders) => {
						if (hasItem) {
							if (!editable) {
								dispatch(rawEditPaymentRequest({
									...data,
									statusFlowId: data.newStatusFlowId,
									paymentOrders: orders
								}))
							} else {
								dispatch(editPaymentRequest({
									...data,
									paymentOrders: orders
								}));
							}
							history.push("/pagamentos/solicitacao")
						}
						else dispatch(addPaymentRequest({
							...data,
							paymentOrders: orders
						}));

						return;
					}}
				/>
			),
		});
	}, [processData, validProcessOrders, hasItem, dispatch, editable, history, listESocialAreas]);

	useEffect(() => {
		dispatch(fetchParameterization(['prazoDiasFinanceiro']));
	}, [dispatch]);

	return (
		<FormCore
			form='irrf'
			onSubmit={onSubmit}
			customInitialValues={customInitialValues}
			hasItem={hasItem}
			eSocialFormVisibility={props?.eSocialFormVisibility} 
			uploadESocialPJC={props.uploadESocialPJC ?? false}
			{...props}
		>
			{
				!hasItem && (
					<IRTable
						admissionDate={folder.admissionDate}
						dismissalDate={folder.dismissalDate}
						distributionDate={folder.distributionDate}
					/>
				)
			}
			<IRRFData editable={editable} />
			{/* <ESocialForm 
				isVisible={props?.eSocialFormVisibility}
				uploadESocialPJC={props.uploadESocialPJC ?? false}
			/> */}
		</FormCore>
	);
};

export default FormIRRF;
