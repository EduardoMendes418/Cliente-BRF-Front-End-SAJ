import { useFormikContext } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Grid } from '@material-ui/core';
import Checkbox from '@mui/material/Checkbox';
import { TPaymentFormIRRF } from 'src/core/models/payment';
import { TextField, CurrencyField, DateField, DecimalField, MaskField, SwitchField } from 'src/components/form';
import Panel from 'src/components/Panel';
import FieldColumn from 'src/components/FieldColumn';
import { useTranslation } from 'src/locale/i18n';
import { sum } from 'src/core/utils/calc';
import useFinancialTerm from '../../common/useFinancialTerm';
import InternalLawyerField from '../../common/InternalLawyerField';
import SupplierField from '../../common/SupplierField';
import StatusFlow from '../../common/StatusFlow';
import { HandleOnBlurProvision } from "src/screen/payment/request/Form/common/handleOnBlurProvision"
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editGeneratedGuide } from 'src/core/store/modules/payment/thunks';
import { useSnackbar } from 'notistack';
import { usePaymentType } from 'src/hooks/fetchLists';
import { Modulos } from 'src/core/models/modules';
import { getPaymentSearch } from 'src/core/store/modules/payment/selectors';
import { getListESocialAreas } from 'src/core/store/modules/e-social-areas/selectors';

type IRRFDataProps = {
	editable?: boolean
}

const IRRFData = (props: IRRFDataProps) => {
	const { t } = useTranslation();
	const { values, setFieldValue, status } = useFormikContext<TPaymentFormIRRF>();
	const showInfoMessage = useFinancialTerm();
	const { handleOnBlur } = HandleOnBlurProvision();
	const [isSwitchFieldCLicked, setIsSwitchFieldClicked] = useState(false);
	const { location: { pathname } } = useHistory();
	const dispatch = useDispatch();
	const isFormReadOnly = useMemo(() => status === 'readOnly', [status]);
	const { enqueueSnackbar } = useSnackbar();
	const { tipoPagamentoId } = useSelector(getPaymentSearch);
	const dejurAreaName = useSelector(getListESocialAreas);
	const { paymentType } = usePaymentType(Modulos.Pagamento);

	const tipoPagamento = paymentType.find(({ id }) => id === tipoPagamentoId);
	const isRequired = dejurAreaName?.length === 0;

	const { valorPrincipal, valorMulta, valorJuros, valorJurosHistorico } = values;

	useEffect(() => {
		setFieldValue(
			'valorPagamentoJudicial',
			sum([valorPrincipal, valorMulta, valorJuros, valorJurosHistorico])
		);
	}, [setFieldValue, valorPrincipal, valorMulta, valorJuros, valorJurosHistorico]);

	useEffect(() => {
		if(isSwitchFieldCLicked === true && values?.guiaGerada === true){
			setFieldValue('dataGuiaGerada', moment().format("YYYY-MM-DD"))
		}
	}, [isSwitchFieldCLicked]) 

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

		<Panel title={t('solicitacaoPagamento:dadosPagamento.title')} withPadding>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t('solicitacaoPagamento:dadosPagamento.dataSolicitacao')}
						value={values.dataSolicitacao}
						type='date'
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<DateField
						name="dataCienciaDecisao"
						label={t("solicitacaoPagamento:dadosPagamento.dataCienciaDecisao")}
						readOnly={!props.editable}
						required={!isRequired}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<DateField
						name="safeDate"
						label={t("goodsAndGuarantees:form.safeDate")}
						readOnly={!props.editable}
						required={!isRequired}
					/>
				</Grid><Grid item md={3} xs={12}>
					<DateField
						name="finalDate"
						label={t("goodsAndGuarantees:form.finalDate")}
						readOnly={!props.editable}
						required={!isRequired}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<DateField
						required
						name='periodoApuracao'
						label={t('solicitacaoPagamento:dadosPagamento.periodoApuracao')}
						views={['year', 'month']}
						format='MM/yyyy'
						readOnly={!props.editable}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<DateField
						required
						name='dataPagamento'
						label={t('solicitacaoPagamento:dadosPagamento.dataPagamento')}
						minDate={moment()}
						onChange={showInfoMessage}
						readOnly={!props.editable}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name='baseCalculo'
						label={t('solicitacaoPagamento:dadosPagamento.baseCalculoIRRF')}
						readOnly={!props.editable}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						required
						name='valorPrincipal'
						label={t('solicitacaoPagamento:dadosPagamento.valorPrincipal')}
						min={0.01}
						onBlur={(event) => handleOnBlur(event, 1)}
						readOnly={!props.editable}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name='valorMulta'
						label={t('solicitacaoPagamento:dadosPagamento.valorMulta')}
						onBlur={(event) => handleOnBlur(event, 2)}
						readOnly={!props.editable}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name='valorJuros'
						label={t('solicitacaoPagamento:dadosPagamento.adjustmentInterestAmount')}
						onBlur={(event) => handleOnBlur(event, 3)}
						readOnly={!props.editable}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name='valorJurosHistorico'
						label={t('solicitacaoPagamento:dadosPagamento.valorJurosHistorico')}
						readOnly={!props.editable}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t('solicitacaoPagamento:dadosPagamento.valorPagamentoJudicial')}
						value={values.valorPagamentoJudicial}
						testid='pagamento-valorPagamentoJudicial'
						type='currency'
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						required
						name='rendimentoTributavel'
						label={t('solicitacaoPagamento:dadosPagamento.rendimentoTributavel')}
						min={0.01}
						readOnly={!props.editable}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name='previdenciaOficial'
						label={t('solicitacaoPagamento:dadosPagamento.previdenciaOficial')}
						readOnly={!props.editable}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<DecimalField
						required
						name='quantidadeMeses'
						label={t('solicitacaoPagamento:dadosPagamento.quantidadeMeses')}
						maxLength={4}
						readOnly={!props.editable}
					/>
				</Grid>
				<SupplierField 
					readonly={!props.editable} 
				/>
				<InternalLawyerField 
					readonly={!props.editable} 
				/>
				{ !props.editable && 
					<StatusFlow />
        }
		{
			pathname.includes('/pagamentos/aprovacao-controle-juridico/') === true && isFormReadOnly !== true ? <>
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
					}
			</> : null
		}
		{
			isFormReadOnly && !props.editable !== true ? <>
				<Grid item md={3} xs={12}>	
					{"Guia gerada"}
						<Checkbox
							disabled={true}
							checked={values?.guiaGerada === null ? false : true}
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
					</> : null
				}
				<Grid item md={3} xs={12}>
						<MaskField
							label={t('solicitacaoPagamento:dadosPagamento.cpfPerito')}
							name="cpfPerito"
							mask={"999.999.999-99"}
							maskChar={null}
							readOnly={!props.editable}
							required={values.nomePerito?.length > 0 ? true : false}
						/>
				</Grid>
				<Grid item md={3} xs={12}>
					<TextField
						name='nomePerito'
						label={t('solicitacaoPagamento:dadosPagamento.nomePerito')}
						readOnly={!props.editable}
						required={values.cpfPerito?.length > 0 ? true : false}
					/>
				</Grid>
				<Grid item md={9} xs={12}>
					<TextField
						name='observacao'
						label={t('solicitacaoPagamento:dadosPagamento.observacoes')}
						readOnly={!props.editable}
					/>
				</Grid>
			</Grid>
		</Panel>
	);
};

export default IRRFData;
