import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import FavoredData from "./FavoredData";
import DefaultData from "./DefaultData";
import FormCore from "../../common/FormCore";

import { t } from "src/locale/i18n";
import { getFolderInfoPayment } from "src/core/store/modules/inspection/selectors";
import { TPropsForm, TPaymentFormGeneral } from "src/core/models/payment";
import {
	TPayment,
	TPaymentDatasDefault,
	TPaymentFormDefault,
} from "src/core/models/inspection";
import {
	addPaymentInspectionRequest,
	editPaymentInspectionRequest,
} from "src/core/store/modules/inspection/thunks";
import { getProcessFormData } from "src/core/store/modules/process/selectors";
import {
	numberWithoutMask,
	valuesToNumber,
} from "src/core/utils/func";
import { fetchParameterization } from "src/core/store/modules/parameterization/thunks";
import ApportionmentData from "./ApportionmentData";
import { useSnackbar } from "notistack";
import { FormikHelpers } from "formik";
import Logs from "src/components/Logs";
import { statusTextApprovalsFlow } from "src/core/utils/constants";

type Props = TPropsForm & { item?: TPayment, submitWithoutFolder?: boolean };

type TForm = TPaymentFormGeneral & TPaymentFormDefault;

const FormDefault = (props: Props) => {
	const dispatch = useDispatch();
	const folder = useSelector(getFolderInfoPayment);
	const processData = useSelector(getProcessFormData);
	const [apportionmentFines, setApportionmentFines] = useState<any[]>();
    const [pendingValueToCheck, setPendingValueToCheck] = useState();
	const { enqueueSnackbar } = useSnackbar();

	const customInitialValues: TPaymentDatasDefault = {
		valorPrincipal: 0,
		valorMulta: 0,
		valorJuros: 0,
		encargo: 0,
		sucumbencia: 0,
		valorOutrasEntidades: 0,
		valorPagamentoJudicial: 0,
		nomeReclamante: "",
		cnpj: folder.cpf ?? "",
		mainResponsible: "",
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
		fornecedor: "",
		fornecedorId: 0,
		centroCusto: "",
		valorJurosHistorico: 0,
	};

	const onSubmit = (values: TForm, { setSubmitting }: FormikHelpers<{}>) => {
		
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
					"valorOutrasEntidades",
					"valorTotalGuia"
				],
				values
			) as TForm),
			...folderInfo,
			process: null,
			centroCusto: values.centroCusto,
			cep: cepWithoutMask,
			paymentInspectionApportionmentFines: apportionmentFines,
			filesIsGuide: values.filesIsGuide
		};

		if(values.filesIsGuide.length === 0){
			enqueueSnackbar('O anexo guia é obrigatório.', {
				variant: "error"
			})
			setSubmitting(false)
			return
		}
	
		if(pendingValueToCheck !== 0){
			enqueueSnackbar('O valor pendente dos lançamentos da guia deve ser zero', {
				variant: "error"
			})
			setSubmitting(false)
			return
		}
		
		if (props.hasItem) dispatch(editPaymentInspectionRequest(normalizedValues));
		else dispatch(addPaymentInspectionRequest(normalizedValues)); 
		setSubmitting(false)
	};

	useEffect(() => {
		dispatch(fetchParameterization(["prazoDiasFinanceiro"]));
	}, [dispatch]);

	return (
		<FormCore
			form="default"
			onSubmit={onSubmit}
			customInitialValues={customInitialValues}
			/* validationSchema={validationSchema} */
			{...props}
		>
			<FavoredData />
			<DefaultData submitWithoutFolder={props.submitWithoutFolder}/>
			<ApportionmentData
				setPendingValueToCheck={setPendingValueToCheck}
				setData={setApportionmentFines}
				initialList={props.item?.paymentInspectionApportionmentFines}
				statusFlow={props.item?.statusFlowId}
			/>
			<Logs
						logs={props.item?.logs}
						statusOrder={["flow"]}
						statuses={statusTextApprovalsFlow}
					/>
			
		</FormCore>
	);
};

export default FormDefault;
