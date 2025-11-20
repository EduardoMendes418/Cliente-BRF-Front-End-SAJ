import { useHistory } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	TPaymentFormFGTS,
	TPaymentDataFGTS,
	TPaymentFormGeneral,
	TPropsForm,
} from "src/core/models/payment";
import {
	addPaymentRequest,
	editPaymentRequest,
	rawEditPaymentRequest,
} from "src/core/store/modules/payment/thunks";
import { AppDispatch, actions } from "src/core/store";
import { getDateWithoutDays, valuesToNumber } from "src/core/utils/func";
import { getProcessFormData } from "src/core/store/modules/process/selectors";
import { fetchParameterization } from "src/core/store/modules/parameterization/thunks";
import { 
	getFolderInfoPayment, 
	getModalEsocialLinkId
} from "src/core/store/modules/payment/selectors";

import FGTSData from "./FGTSData";
import FormCore from "../../common/FormCore";
import { getListESocialAreas } from "src/core/store/modules/e-social-areas/selectors";

type Props = TPropsForm & { 
	eSocialFormVisibility?: boolean;
	uploadESocialPJC?: boolean;
	item?: TPaymentDataFGTS & {
		statusFlowId?: number,
		statusApprovalId?: number
	} 
};

type TForm = TPaymentFormGeneral & TPaymentFormFGTS & {
	newStatusFlowId: number,
	
};

const FormFGTS = (props: Props) => {
	const dispatch = useDispatch<AppDispatch>();
	const folder = useSelector(getFolderInfoPayment);
	const processData = useSelector(getProcessFormData);
	const history = useHistory()
	const isRequestTaxtPayment = history.location.pathname.includes("solicitacao-imposto");
	const listESocialAreas = useSelector(getListESocialAreas);

	// ID ESOCIAL RECEBIDO PELO MODAL
	const eSocialID = useSelector(getModalEsocialLinkId);

	useEffect(() => {
		dispatch(fetchParameterization(["prazoDiasFinanceiro", "indiceFgts"]));
		return () => {
			dispatch(actions.parameterization.clear());
		};
	}, [dispatch]);

	const valorPrincipal =
		props.hasItem &&
		props.item &&
		props.item.valorPrincipal >= props.item.valorJurosHistorico &&
		props.item.valorPrincipal !== "" &&
		props.item.valorJurosHistorico !== ""
			? props.item.valorPrincipal + props.item.valorJurosHistorico
			: 0;

	// TODO: 158812 checar retorno eSocial ao editar pagamento
	const customInitialValues: TPaymentDataFGTS = {
		baseCalculo: 0,
		valorPrincipal,
		valorMulta: 0,
		valorJuros: 0,
		valorJurosHistorico: 0,
		valorPagamentoJudicial: 0,
		encargo: 0,
		sucumbencia: 0,
		valorOutrasEntidades: 0,

		contaContabil: "",
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

	const onSubmit = useCallback(
		async (values: TForm) => {
			if (!values.advogadoInterno || !values.fornecedor) return;
			const periodoApuracao = getDateWithoutDays(values.periodoApuracao ?? "");
			const normalizedValues = {
				...(valuesToNumber(
					[
						"baseCalculo",
						"valorPrincipal",
						"valorMulta",
						"valorJuros",
						"valorJurosHistorico",
						"valorPagamentoJudicial",
						"encargo",
						"sucumbencia",
						"valorOutrasEntidades",
					],
					values
				) as TForm),
				...processData,
				eSocialLinkedPaymentId: values.eSocialLinkedPaymentId === 0 ? null : values.eSocialLinkedPaymentId,
				pagamentosESocial: !props.eSocialFormVisibility ? null : {
					...values.pagamentosESocial,
					...(valuesToNumber([
						"compensationAmount", 
						"remunerationAmount",
					], values.pagamentosESocial)),
				},
				periodoApuracao,
			};

			const principal =
				normalizedValues.valorPrincipal === ""
					? 0
					: normalizedValues.valorPrincipal;
			const historico =
				normalizedValues.valorJurosHistorico === ""
					? 0
					: normalizedValues.valorJurosHistorico;
			const pagamentoJudicial =
				normalizedValues.valorPagamentoJudicial === ""
					? 0
					: normalizedValues.valorPagamentoJudicial;

			const data = {
				...normalizedValues,
				valorPrincipal:
					principal > historico && props?.item?.statusApprovalId !== 1 ? principal - historico : principal,
				valorPagamentoJudicial: props?.item?.statusApprovalId !== 1 ? pagamentoJudicial - historico : pagamentoJudicial 
			};

				const isDejurAreaPaymentListed = listESocialAreas?.find(area => area.areaId ===  data.legalDepartmentAreaId);
	
				if(props.hasItem === false && isDejurAreaPaymentListed === undefined){
					delete data.pagamentosESocial
				}
			if (props.hasItem) {
				if (!editable) {
					await dispatch(rawEditPaymentRequest({
						...data,
						statusFlowId: data.newStatusFlowId
					}))
				} else {
					await dispatch(editPaymentRequest(data));
				}
				history.push("/pagamentos/solicitacao")
			}
			else await dispatch(addPaymentRequest(data));
		},
		[dispatch, editable, history, processData, props.hasItem, listESocialAreas]
	);

	return (
		<FormCore
			form="fgts"
			onSubmit={onSubmit}
			customInitialValues={customInitialValues}
			eSocialFormVisibility={props?.eSocialFormVisibility} 
			uploadESocialPJC={props.uploadESocialPJC ?? false}
			{...props}
		>
			<FGTSData editable={editable} />
			{/* <ESocialForm 
				isVisible={props?.eSocialFormVisibility} 
				uploadESocialPJC={props.uploadESocialPJC ?? false}
			/> */}
		</FormCore>
	);
};

export default FormFGTS;

