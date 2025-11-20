import { Grid } from '@material-ui/core';
import Checkbox from '@mui/material/Checkbox';
import { TPaymentFormGPS } from 'src/core/models/payment';
import { TextField, CurrencyField, DateField, SwitchField } from 'src/components/form';
import Panel from 'src/components/Panel';
import FieldColumn from 'src/components/FieldColumn';
import { useTranslation } from 'src/locale/i18n';
import { useFormikContext } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { getParameterizationItems } from 'src/core/store/modules/parameterization/selectors';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { sum, calcPercentage } from 'src/core/utils/calc';
import useFinancialTerm from '../../common/useFinancialTerm';
import InternalLawyerField from '../../common/InternalLawyerField';
import SupplierField from '../../common/SupplierField';
import { getItemTaxRatesINSS } from 'src/core/store/modules/tax-rates-inss/selectors';
import { calculateBaseValue, calculateClaimedINSSValue, calculateComplainantINSSValue, getAliquotByCalculationBaseValue } from './func';
import { numberToCurrency, toNumber } from 'src/core/utils/func';
import { getProcessFormData } from 'src/core/store/modules/process/selectors';
import { editGeneratedGuide, getRatValues } from 'src/core/store/modules/payment/thunks';
import { getPaymentSearch, ratValues } from 'src/core/store/modules/payment/selectors';
import { valuesToNumber } from 'src/core/utils/func';
import StatusFlow from '../../common/StatusFlow';
import { HandleOnBlurProvision } from "src/screen/payment/request/Form/common/handleOnBlurProvision"
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { usePaymentType } from 'src/hooks/fetchLists';
import { Modulos } from 'src/core/models/modules';
import { getListESocialAreas } from 'src/core/store/modules/e-social-areas/selectors';

const useStyles = makeStyles({
  helperText: {
    color: '#ff000a',
	size: "120%"
  },
});

export type GPSDataProp = {
	editable?: boolean
}

const GPSData = (props: GPSDataProp) => {
	const dispatch = useDispatch()
	const { t } = useTranslation();
	const classes = useStyles();
	const {
		indiceInssGpsRatAjustado,
		indiceInssGpsReclamado,
		indiceInssGpsRat,
		indiceInssGpsOutrasEntidades,
	} = useSelector(getParameterizationItems);
	const { values, setFieldValue, status } = useFormikContext<TPaymentFormGPS>();
	const { location: { pathname }, } = useHistory();
	const showInfoMessage = useFinancialTerm();
	const taxRatesINSS = useSelector(getItemTaxRatesINSS);
	const { processKey } = useSelector(getProcessFormData);
	const dejurAreaName = useSelector(getListESocialAreas);
	const [isBaseValueClicked, setIsBaseValueClicked ] = useState<boolean>(false);
	const [isSwitchFieldCLicked, setIsSwitchFieldClicked] = useState(false);
	const ratValue = useSelector(ratValues);
	const { enqueueSnackbar } = useSnackbar();

	const { tipoPagamentoId } = useSelector(getPaymentSearch);
	const { paymentType } = usePaymentType(Modulos.Pagamento);


	const { handleOnBlur } = HandleOnBlurProvision();
	const isFormReadOnly = useMemo(() => status === 'readOnly', [status]);

	const tipoPagamento = paymentType.find(({ id }) => id === tipoPagamentoId);

	const isRequired = dejurAreaName?.length === 0;


	const {
		valorINSSReclamante,
		valorINSSReclamado,
		valorPrincipal,
		valorOutrasEntidades,
		valorMulta,
		valorJuros,
		baseCalculo,
		dataPagamento
	} = values;

	useEffect(() => {
		if (isFormReadOnly) return;

		setFieldValue(
			'valorPrincipal',
			sum([valorINSSReclamante, valorINSSReclamado])
		);
	}, [setFieldValue, valorINSSReclamante, valorINSSReclamado, isFormReadOnly]);

	useEffect(() => {
		if (isFormReadOnly) return;

		setFieldValue(
			'valorPagamentoJudicial',
			sum([valorPrincipal, valorOutrasEntidades, valorMulta, valorJuros])
		);
	}, [setFieldValue, valorPrincipal, valorOutrasEntidades, valorMulta, valorJuros, isFormReadOnly]);

	const valorReclamado = useMemo(() => 
		ratValue?.claimed ? ratValue.claimed : indiceInssGpsReclamado, 
		[indiceInssGpsReclamado, ratValue]
	);

	const valorRat = useMemo(() => 
		ratValue?.rat ? ratValue.rat : indiceInssGpsRat,
		[indiceInssGpsRat, ratValue]
	);

	const valorRatAjustado = useMemo(() =>
		ratValue?.adjustedRat ? ratValue.adjustedRat : indiceInssGpsRatAjustado,
		[indiceInssGpsRatAjustado, ratValue]
	);

	const valorOutrasEntidade = useMemo(() => 
		ratValue?.otherEntities ? ratValue.otherEntities : indiceInssGpsOutrasEntidades,
		[indiceInssGpsOutrasEntidades, ratValue]
	);

	useEffect(() => {
		if (processKey && dataPagamento) {
			dispatch(getRatValues({
				processId: processKey,
				paymentDate: dataPagamento
			}))
		}
		if(!props.editable === false && pathname.includes('novo') === false){
			   dispatch(getRatValues({
				processId: values?.process?.id,
				paymentDate: values?.dataPagamento?.slice(0, 10)
			}))   
		}
	}, [dataPagamento, dispatch, processKey])

	useEffect(() => {
		if (isFormReadOnly) return;

		if (isBaseValueClicked === true) {
			setFieldValue(
				'valorINSSReclamante',
				numberToCurrency(calculateComplainantINSSValue(baseCalculo === "" ? 0 : toNumber(baseCalculo), taxRatesINSS.taxRatesINSSValues))
			);
	
			setFieldValue(
				'valorINSSReclamado',
				numberToCurrency(calculateClaimedINSSValue(baseCalculo === "" ? 0 : toNumber(baseCalculo), Number(valorReclamado), Number(valorRat), Number(valorRatAjustado)))
			);
	
			setFieldValue(
				'valorOutrasEntidades',
				calcPercentage(baseCalculo, valorOutrasEntidade)
			); 
		} else {
			setFieldValue(
				'baseCalculo',
				numberToCurrency(calculateBaseValue(valorINSSReclamado === "" ? 0 : toNumber(valorINSSReclamado), Number(valorReclamado), Number(valorRat), Number(valorRatAjustado)))
			);
			setFieldValue(
				'valorOutrasEntidades',
				calcPercentage(baseCalculo, valorOutrasEntidade)
			);
		}

		
	}, [baseCalculo, valorOutrasEntidade, valorRat, valorRatAjustado, valorReclamado, isBaseValueClicked, isFormReadOnly, setFieldValue, taxRatesINSS.taxRatesINSSValues, valorINSSReclamado]); 
	const valores = valuesToNumber([
		"valorOutrasEntidades", 
		"valorINSSReclamante",
		"valorINSSReclamado",
		"valorJurosHistorico"
	], {
		valorOutrasEntidades, 
		valorINSSReclamante,
		valorINSSReclamado,
		valorJurosHistorico: values.valorJurosHistorico
	})

	const setGeneratedGuide = async (generatedGuide: string) => {
		await setIsSwitchFieldClicked(!isSwitchFieldCLicked)
		const {payload, data, status} = await dispatch(
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
				</Grid>
				<Grid item md={3} xs={12}>
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
						onClick={() => setIsBaseValueClicked(true)}
						required
						name='baseCalculo'
						label={t('solicitacaoPagamento:dadosPagamento.baseCalculoINSS')}
						readOnly={!props.editable}
					/>
				</Grid>
				
				<Grid item md={3} xs={12}>
					<CurrencyField
						required
						name='valorINSSReclamante'
						label={t('solicitacaoPagamento:dadosPagamento.valorINSSReclamante')}
						helperText={`Cálculo do reclamante: ${getAliquotByCalculationBaseValue(taxRatesINSS.taxRatesINSSValues, baseCalculo === "" ? 0 : toNumber(baseCalculo),) ?? '-'} %`}
						readOnly={!props.editable}
						FormHelperTextProps={{ className: classes.helperText }}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						required
						name='valorINSSReclamado'
						onClick={() => setIsBaseValueClicked(false)}
						label={t('solicitacaoPagamento:dadosPagamento.valorINSSReclamado')}
						helperText={`Cálculo do reclamado: ${baseCalculo ?? '-'} * (${valorReclamado ?? '-'}% + ${valorRat ?? '-'}% * ${valorRatAjustado})`}
						readOnly={!props.editable}
						FormHelperTextProps={{ className: classes.helperText }}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<Grid container spacing={3}>
						<Grid item md={6} xs={12}>
							<FieldColumn
								label={"Valor INSS principal"}
								value={valores.valorINSSReclamante + valores.valorINSSReclamado}
								type='currency'
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<FieldColumn
								label={t('solicitacaoPagamento:dadosPagamento.valorPrincipal')}
								value={valores.valorINSSReclamante + valores.valorINSSReclamado + valores.valorOutrasEntidades - valores.valorJurosHistorico}
								type='currency'
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						required={values.baseCalculo !== "R$ 0,00"}
						name='valorOutrasEntidades'
						label={t('solicitacaoPagamento:dadosPagamento.valorOutrasEntidades')}
						helperText={`Cálculo de outras entidades: ${valorOutrasEntidade ?? '-'}%`}
						FormHelperTextProps={{ className: classes.helperText }}
						readOnly={!props.editable}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name='valorMulta'
						label={t('solicitacaoPagamento:dadosPagamento.valorMulta')}
						readOnly={!props.editable}
						onBlur={(event) => handleOnBlur(event, 2)}

					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name='valorJuros'
						label={t('solicitacaoPagamento:dadosPagamento.adjustmentInterestAmount')}
						readOnly={!props.editable}
						onBlur={(event) => handleOnBlur(event, 3)}

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
			pathname.includes('/pagamentos/aprovacao-controle-juridico/') === true && isFormReadOnly === false ? <>
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
				<Grid item xs={12}>
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

export default GPSData;
