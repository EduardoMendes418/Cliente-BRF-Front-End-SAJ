import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector,  } from 'react-redux';

import {
	TPaymentDataGPS,
	TPaymentFormGPS,
	TPaymentFormGeneral,
	TPropsForm,
} from 'src/core/models/payment';
import { 
	addPaymentRequest, 
	addPaymentRequestTax, 
	editPaymentRequest, 
	rawEditPaymentRequest 
} from 'src/core/store/modules/payment/thunks';
import { 
	getHasItemTaxRatesINSS,
	getLoadingTaxRatesINSS, 
	getStatusTaxRatesINSS
} from 'src/core/store/modules/tax-rates-inss/selectors';

import { t } from 'src/locale/i18n';
import { modal } from 'src/components/modals';
import { AppDispatch, actions } from 'src/core/store';
import { getDateWithoutDays, valuesToNumber } from 'src/core/utils/func';
import { getProcessFormData } from 'src/core/store/modules/process/selectors';
import { searchTaxRatesINSS } from 'src/core/store/modules/tax-rates-inss/thunks';
import { fetchParameterization } from 'src/core/store/modules/parameterization/thunks';
import { 
	getFolderInfoPayment, 
	getModalEsocialLinkId
} from "src/core/store/modules/payment/selectors";

import GPSData from './GPSData';
import FormCore from '../../common/FormCore';
import { getListESocialAreas } from 'src/core/store/modules/e-social-areas/selectors';
/* import ESocialForm from '../../common/ESocialForm'; */

type Props = TPropsForm & { 
	eSocialFormVisibility?: boolean;
	uploadESocialPJC?: boolean;
	item?: TPaymentDataGPS & {
		statusFlowId?: number,
		statusApprovalId?: number
	}  
};

type TForm = TPaymentFormGeneral & TPaymentFormGPS & {
	newStatusFlowId: number
};

const FormGPS = (props: Props) => {
	const dispatch = useDispatch<AppDispatch>();
	const folder = useSelector(getFolderInfoPayment);
	const processData = useSelector(getProcessFormData);
	const hasTaxRatesINSS = useSelector(getHasItemTaxRatesINSS);
	const loadingTaxRatesINSS = useSelector(getLoadingTaxRatesINSS)
	const alreadyFetch = useRef(false)
	const statusTaxRatesINSS = useSelector(getStatusTaxRatesINSS)
	const history = useHistory();
	const isRequestTaxtPayment = history.location.pathname.includes("solicitacao-imposto");
	const listESocialAreas = useSelector(getListESocialAreas);

	// ID ESOCIAL RECEBIDO PELO MODAL
	const eSocialID = useSelector(getModalEsocialLinkId);

	useEffect(() => {
		dispatch(searchTaxRatesINSS(moment().format('YYYY-MM-DD')))
		dispatch(
			fetchParameterization([
				'prazoDiasFinanceiro',
				'indiceInssGpsRatAjustado',
				'indiceInssGpsReclamado',
				'indiceInssGpsRat',
				'indiceInssGpsOutrasEntidades',
			])
		);
		return () => {
			dispatch(actions.parameterization.clear());
		};
	}, [dispatch]);

	useEffect(() => {
		if (loadingTaxRatesINSS || hasTaxRatesINSS || !alreadyFetch.current) return

		modal({
			title: t('Pagamentos:indiceInssGps.dialog.title'),
			component: t('Pagamentos:indiceInssGps.dialog.text'),
			buttons: [],
			dialogProps: { maxWidth: 'md', showCloseButton: true, fullWidth: true },
		})

	}, [loadingTaxRatesINSS, hasTaxRatesINSS]);

	useEffect(() => {
		if (statusTaxRatesINSS !== 'fetching') return
		alreadyFetch.current = true
	}, [statusTaxRatesINSS]);

	const valorPrincipal = props.hasItem && props.item
		&& props.item.valorPrincipal >= props.item.valorJurosHistorico
		&& props.item.valorPrincipal !== ""
		&& props.item.valorJurosHistorico !== ""
		? props.item.valorPrincipal + props.item.valorJurosHistorico
		: 0

	// TODO: 158812 checar retorno eSocial ao editar pagamento
	const customInitialValues: TPaymentDataGPS = {
		baseCalculo: 0,
		valorINSSReclamante: 0,
		valorINSSReclamado: 0,
		valorPrincipal,
		valorOutrasEntidades: 0,
		valorMulta: 0,
		valorJuros: 0,
		valorJurosHistorico: 0,
		valorPagamentoJudicial: 0,
		encargo: 0,
		sucumbencia:0,
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

	const editable = !(props.hasItem &&
		(props.item?.statusFlowId === 22 || props.item?.statusFlowId === 1) &&
		props.isApprovalLegalControl)

	const onSubmit = useCallback(async (values: TForm) => {

		if (!values.advogadoInterno || !values.fornecedor) return;
		const periodoApuracao = getDateWithoutDays(values.periodoApuracao ?? '');

		const normalizedValues = {
			...valuesToNumber([
				'baseCalculo',
				'valorINSSReclamante',
				'valorINSSReclamado',
				'valorOutrasEntidades',
				'valorMulta',
				'valorJuros',
				'valorJurosHistorico',
				'encargo',
				'sucumbencia',
			], values) as TForm,
			...processData,
			nomeReclamante: processData.nomeReclamante ?? folder.nomeReclamante,
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

		const valuesToSend = {
			...normalizedValues,
			valorPrincipal: Number(normalizedValues.valorINSSReclamante) + Number(normalizedValues.valorINSSReclamado) - Number(normalizedValues.valorJurosHistorico)
		}
		const isDejurAreaPaymentListed = listESocialAreas?.find(area => area.areaId ===  valuesToSend.legalDepartmentAreaId);

		if(props.hasItem === false && isDejurAreaPaymentListed === undefined){
			delete valuesToSend.pagamentosESocial
		}

		if (props.hasItem) {
			if (!editable) {
				await dispatch(rawEditPaymentRequest({
					...valuesToSend,
					statusFlowId: valuesToSend.newStatusFlowId
				}))
			} else {
				await dispatch(editPaymentRequest(valuesToSend));
			}
			history.push("/pagamentos/solicitacao")
		}
		else await dispatch(addPaymentRequestTax(valuesToSend)); 

	},[dispatch, editable, history, processData, props.hasItem, listESocialAreas]);


	return (
		<FormCore
			form='gps'
			onSubmit={onSubmit}
			customInitialValues={customInitialValues}
			eSocialFormVisibility={props?.eSocialFormVisibility} 
			uploadESocialPJC={props.uploadESocialPJC ?? false}
			{...props}
		>
			<GPSData editable={editable} />
			{/* <ESocialForm 
				isVisible={props?.eSocialFormVisibility} 
				uploadESocialPJC={props.uploadESocialPJC ?? false}
			/> */}
		</FormCore>
	);
};

export default FormGPS;
