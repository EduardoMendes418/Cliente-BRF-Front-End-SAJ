import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { useDispatch, useSelector } from "react-redux";

import { t } from "src/locale/i18n";
import { AppDispatch } from "src/core/store";
import { numberWithoutMask, valuesToNumber } from "src/core/utils/func";
import { getProcessFormData } from "src/core/store/modules/process/selectors";
import { getFolderInfoPayment } from "src/core/store/modules/payment/selectors";
import { fetchParameterization } from "src/core/store/modules/parameterization/thunks";
import {
	TPaymentFormDefault,
	TPaymentDatasDefault,
	TPaymentFormGeneral,
	TPropsForm,
} from "src/core/models/payment";
import {
	addPaymentRequest,
	editPaymentRequest,
	getPaymentBanks,
	rawEditPaymentRequest,
} from "src/core/store/modules/payment/thunks";
import FavoredData from "./FavoredData";
import DefaultData from "./DefaultData";
import FormCore from "../../common/FormCore";
import { getListESocialAreas } from "src/core/store/modules/e-social-areas/selectors";

const validationSchema = yup.object().shape({
	cpf: yup
		.string()
		.required(t("required"))
		.test(
			"is-cpf-cnpj",
			t("validations.invalidField"),
			(value) => cpf.isValid(String(value)) || cnpj.isValid(String(value))
		),
	email: yup.string().email("Email invÃ¡lido").required(t("required")),
});

type Props = TPropsForm & { 
	eSocialFormVisibility?: boolean;
	uploadESocialPJC?: boolean;
	item?: TPaymentDatasDefault & {
		statusFlowId?: number,
		statusApprovalId?: number
	} 
};

type TForm = TPaymentFormGeneral & TPaymentFormDefault & {
	newStatusFlowId: number
};

const FormDefault = (props: Props) => {
	const history = useHistory();
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();

	const { location: { pathname } } = useHistory();
	const isRequestTaxtPayment = pathname.includes("solicitacao-imposto");
	const listESocialAreas = useSelector(getListESocialAreas);

	const folder = useSelector(getFolderInfoPayment);
	const processData = useSelector(getProcessFormData);

	const customInitialValues: TPaymentDatasDefault = {
		valorPrincipal: 0,
		valorMulta: 0,
		valorJuros: 0,
		encargo: 0,
		sucumbencia: 0,
		valorPagamentoJudicial: 0,
		valorJurosHistorico: 0,
		valorOutrasEntidades: 0,
		cpf: folder?.cpf ?? "",
		nomeReclamante: "",
		dataNascimento: folder.dataNascimento,
		bancoId: folder.bancoId,
		agencia: folder.agencia,
		agenciaDv: folder.agenciaDv,
		conta: folder.conta,
		contaDv: folder.contaDv,
		cep: folder.cep,
		endereco: folder.endereco,
		numero: folder.numero,
		bairro: folder.bairro,
		cidadeId: folder.cidadeId,
		estadoId: folder.estadoId,
		telefone: folder.telefone ?? "",
		email: folder.email,
		fornecedor: "",
		fornecedorId: "",
		eSocialLinkedPaymentId: null,
		eSocialRestriction: isRequestTaxtPayment,
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
				let fornecedorIdToSend = values.fornecedorId;

				if (pathname.includes("aprovacao-advogado-interno") || pathname.includes("solicitacao")) {

					const { payload } = await dispatch(getPaymentBanks(values.cpf!));
					const {codAgencia, codConta, digAgencia, digConta} = payload[0];

					if(codAgencia !== values.agencia || codConta !== values.conta || (digAgencia === null || digAgencia === "X" ? 0 : Number(digAgencia)) !==(values.agenciaDv === "X" ? 0 : Number(values.agenciaDv)) || (digConta === null || digConta === "X" ? 0 : Number(digConta)) !== (values.contaDv === "X" ? 0 : Number(values.contaDv))){
					
						return enqueueSnackbar("Cadastro do fornecedor no SAP ainda não atualizado. Aguardar atendimento de Dados Mestres.", {
							variant: "error",
						});
					}
					if (!values.advogadoInterno) return;
					fornecedorIdToSend = payload?.length === 1 ? payload[0]?.codsapFornTransp : values.fornecedorId;

				}
				
				const { nomeReclamante, ...folderInfo } = processData;
				const cepWithoutMask = numberWithoutMask(values.cep);
				
				const normalizedValues = {
					...(valuesToNumber(
						[
							"valorPrincipal",
							"valorMulta",
							"valorJuros",
							"encargo",
							"sucumbencia",
							"valorJurosHistorico",
							"valorOutrasEntidades"
						],
						values
					) as TForm),
					...folderInfo,
					cep: cepWithoutMask,
					fornecedorId: fornecedorIdToSend
				};
				const isDejurAreaPaymentListed = listESocialAreas?.filter(area => area.areaId === normalizedValues?.legalDepartmentAreaId);
				
				if(props.hasItem === false && isDejurAreaPaymentListed === undefined){ 
					delete normalizedValues.pagamentosESocial
				}  

				if (props.hasItem) {
					if (!editable) {
						await dispatch(rawEditPaymentRequest({
							...normalizedValues,
							statusFlowId: normalizedValues.newStatusFlowId
						}))
					} else {
						await dispatch(editPaymentRequest(normalizedValues));
					}
					history.push("/pagamentos/solicitacao")
				}
				else await dispatch(addPaymentRequest(normalizedValues)); 
				
			},
			[dispatch, editable, history, processData, props.hasItem, listESocialAreas]
		);

	useEffect(() => {
		dispatch(fetchParameterization(["prazoDiasFinanceiro"]));
	}, [dispatch]);

	return (
		<FormCore
			form="default"
			onSubmit={onSubmit}
			customInitialValues={customInitialValues}
			validationSchema={validationSchema}
			eSocialFormVisibility={props?.eSocialFormVisibility} 
			uploadESocialPJC={props.uploadESocialPJC ?? false}
			{...props}
		>
			<FavoredData editable={editable} />
			{/********** QUANDO  retificacaoEsocial === true N EXIBIR*/}
			<DefaultData editable={editable} />
			{/* <ESocialForm 
				isVisible={props?.eSocialFormVisibility} 
				uploadESocialPJC={props.uploadESocialPJC ?? false}
			/> */}
		</FormCore>
	);
};

export default FormDefault;
