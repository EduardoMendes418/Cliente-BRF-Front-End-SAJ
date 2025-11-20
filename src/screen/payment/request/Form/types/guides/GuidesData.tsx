import { Grid } from "@material-ui/core";
import { TPaymentFormGuides } from "src/core/models/payment";
import { useDispatch, useSelector } from "react-redux";
import {
	TextField,
	CurrencyField,
	DateField,
	SelectField,
	SwitchField,
} from "src/components/form";
import Panel from "src/components/Panel";
import FieldColumn from "src/components/FieldColumn";
import { useTranslation } from "src/locale/i18n";
import { useFormikContext } from "formik";
import { useEffect, useMemo, useState } from "react";
import Checkbox from '@mui/material/Checkbox';
import moment from "moment";
import { sum } from "src/core/utils/calc";
import useFinancialTerm from "../../common/useFinancialTerm";
import InternalLawyerField from "../../common/InternalLawyerField";
import SupplierField from "../../common/SupplierField";
import { getBanks } from "src/core/store/modules/banks/selectors";
import { TBank } from "src/core/models/banks";
import { useBanks, usePaymentType } from "src/hooks/fetchLists";
import StatusFlow from "../../common/StatusFlow";
import { HandleOnBlurProvision } from "src/screen/payment/request/Form/common/handleOnBlurProvision"
import { editGeneratedGuide } from "src/core/store/modules/payment/thunks";
import { useSnackbar } from "notistack";
import { Modulos } from "src/core/models/modules";
import { getPaymentSearch } from "src/core/store/modules/payment/selectors";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import { getListESocialAreas } from "src/core/store/modules/e-social-areas/selectors";

type GuidesDataProp = {
	editBankAndJudicial: boolean;
};

const GuidesData = (props: GuidesDataProp) => {
	
	const { t } = useTranslation();
	const showInfoMessage = useFinancialTerm();
	const banks: TBank[] = useSelector(getBanks);
	const dejurAreaName = useSelector(getListESocialAreas);
	const { values, setFieldValue, status, setStatus } = useFormikContext<TPaymentFormGuides>();
	const [isSwitchFieldCLicked, setIsSwitchFieldClicked] = useState(false);
	const { handleOnBlur } = HandleOnBlurProvision();
	
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const path = window.location.pathname;

	const { id: userId } = useSelector(getDataCurrentUser);
	const { tipoPagamentoId } = useSelector(getPaymentSearch);
	const { paymentType } = usePaymentType(Modulos.Pagamento);

	const tipoPagamento = paymentType.find(({ id }) => id === tipoPagamentoId);

	const isRequest = path.includes("/pagamentos/solicitacao");
	const isApprovalLegalControl = path.includes("/pagamentos/aprovacao-controle-juridico");

	const isRequired = dejurAreaName?.length === 0;


	const {
		valorPrincipal,
		valorMulta,
		valorJuros,
		encargo,
		sucumbencia,
		numeroContaJudicial,
		valorJurosHistorico,
		statusFlowId,
		requesterId
	} = values;

	const { banksAsOptions } = useBanks();
	const isReadOnlyRequester = isRequest && requesterId !== userId

	const isFormReadOnly =  useMemo(() => status === 'readOnly', [status]);

	const disableWhenStatusFlow = isApprovalLegalControl && statusFlowId === 3;

	const disable = disableWhenStatusFlow === false ? props.editBankAndJudicial : disableWhenStatusFlow;
	const categoryId = tipoPagamento?.financeChartOfAccountsCategory?.id;
	const renderFields = categoryId !== undefined && [281, 283, 284].includes(categoryId) ? false : true;

	useEffect(() => {
		const banco =
			banks.find(({ id }: TBank) => id === values.bancoId) ?? ({} as TBank);

		setFieldValue("banco", banco.name);
	}, [setFieldValue, banks, values.bancoId]);

	useEffect(() => {
		if(isReadOnlyRequester === true && statusFlowId === 2){
			setStatus('readOnly')
		}
	}, [values]);

	useEffect(() => {
		setFieldValue(
			"valorPagamentoJudicial",
			sum([valorPrincipal, valorMulta, valorJuros, encargo, sucumbencia, valorJurosHistorico])
		);
		setFieldValue("numeroContaJudicial", numeroContaJudicial);
	}, [
		setFieldValue,
		valorPrincipal,
		valorMulta,
		valorJuros,
		encargo,
		sucumbencia,
		numeroContaJudicial,
		valorJurosHistorico
	]);

	const setGeneratedGuide = async (generatedGuide: string) => {
		await setIsSwitchFieldClicked(!isSwitchFieldCLicked)
		const {payload} = await dispatch(
			editGeneratedGuide({
				paymentId: values.id,
				generatedGuide: generatedGuide === "true" ? false : true ,
				generatedDate: generatedGuide === "true" ? "" : moment()
			})
		) as any;

		if(payload?.status === 200){
			enqueueSnackbar("Guia gerada alterada com sucesso", {
				variant: "success",
			});
		}
		if(generatedGuide !== "true"){
			setFieldValue('dataGuiaGerada', moment().format("YYYY-MM-DD"))
		}
	}

	return (
		
		tipoPagamento?.retificacaoESocial === true ? null : 

		<Panel title={t("solicitacaoPagamento:dadosPagamento.title")} withPadding>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t("solicitacaoPagamento:dadosPagamento.dataSolicitacao")}
						value={values.dataSolicitacao}
						type="date"
					/>
				</Grid>
				{
					renderFields === true ? <>
					<Grid item md={3} xs={12}>
					<DateField
						name="dataCienciaDecisao"
						label={t("solicitacaoPagamento:dadosPagamento.dataCienciaDecisao")}
						readOnly={disable}
						required={!isRequired}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<DateField
						name="safeDate"
						label={t("goodsAndGuarantees:form.safeDate")}
						readOnly={disable}
						required={!isRequired}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<DateField
						name="finalDate"
						label={t("goodsAndGuarantees:form.finalDate")}
						readOnly={disable}
						required={!isRequired}
					/>
				</Grid>
					</> : null
				}
				
				<Grid item md={3} xs={12}>
					<DateField
						required
						name="dataPagamento"
						label={t("solicitacaoPagamento:dadosPagamento.dataPagamento")}
						minDate={moment()}
						onChange={showInfoMessage}
						readOnly={disable}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						required
						name="valorPrincipal"
						label={t("solicitacaoPagamento:dadosPagamento.valorPrincipal")}
						min={0.01}
						readOnly={disable}
						onBlur={(event) => handleOnBlur(event, 1)}

					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name="valorMulta"
						readOnly={disable}
						onBlur={(event) => handleOnBlur(event, 2)}
						label={t("solicitacaoPagamento:dadosPagamento.valorMulta")}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name="valorJurosHistorico"
						readOnly={disable}
						onBlur={(event) => handleOnBlur(event, 3)}
						label={t("solicitacaoPagamento:dadosPagamento.valorJurosHistorico")}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name="encargo"
						readOnly={disable}
						onBlur={(event) => handleOnBlur(event, 4)}
						label={t("solicitacaoPagamento:dadosPagamento.encargos")}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name="sucumbencia"
						readOnly={disable}
						onBlur={(event) => handleOnBlur(event, 5)}
						label={t("solicitacaoPagamento:dadosPagamento.sucumbencia")}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t("solicitacaoPagamento:dadosPagamento.valorPagamentoJudicial")}
						value={values.valorPagamentoJudicial}
						testid="pagamento-valorPagamentoJudicial"
						type="currency"
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<SelectField
						label={t("solicitacaoPagamento:dadosPagamento.banco")}
						name="bancoId"
						readOnly={!disable}
						options={banksAsOptions}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<TextField
						label={t("solicitacaoPagamento:dadosPagamento.numeroContaJudicial")}
						readOnly={!disable}
						name="contaJudicial"
						maxLength={50}
					/>
				</Grid>
				  <SupplierField 
				readonly={disable} 
				 /> 
				<InternalLawyerField readonly={disable} />
				
				{ props.editBankAndJudicial && <>
					<StatusFlow />
					{ isFormReadOnly !== true ? <>
					<Grid item md={3} xs={12}>
							<SwitchField
								onClick={(e: any) => {setGeneratedGuide(e.target.value)}}
								name={`guiaGerada`}
							/>
							{"Guia Gerada"}
					</Grid>
					{values?.guiaGerada === true ? 
					
					<Grid item md={3} xs={12}>
					<FieldColumn
						label={"Data da guia gerada"}
						value={values.dataGuiaGerada}
						type="date"
					/>
				</Grid> : null
					} </> : null	}
				</>				
}
		{
			isFormReadOnly && <>
				<Grid item md={3} xs={12}>	
					{"Guia gerada"}
						<Checkbox
							disabled={true}
							checked={values?.guiaGerada === null ? false : values?.guiaGerada}
							name={`guiaGerada`}/>
				</Grid>
					{
					values?.dataGuiaGerada !== null ? <>
						<Grid item md={3} xs={12}>
							<FieldColumn
								label={"Data da guia gerada"}
								value={values?.dataGuiaGerada}
								type='date'
							/>
					</Grid>
						</> : null
					}
					</>

		}
				<Grid item xs={6}>
					<TextField
						name="observacao"
						label={t("solicitacaoPagamento:dadosPagamento.observacoes")}
						readOnly={disable}
					/>
				</Grid>
			</Grid>
		</Panel>
	);
};

export default GuidesData;