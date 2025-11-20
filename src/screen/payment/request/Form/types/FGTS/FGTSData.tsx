import { Grid } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Checkbox from '@mui/material/Checkbox';
import { TPaymentFormFGTS } from 'src/core/models/payment';
import { TextField, CurrencyField, DateField, SwitchField } from 'src/components/form';
import Panel from 'src/components/Panel';
import { useTranslation } from 'src/locale/i18n';
import { getParameterizationItems } from 'src/core/store/modules/parameterization/selectors';
import { sum, calcPercentage, calcBase } from 'src/core/utils/calc';
import useFinancialTerm from '../../common/useFinancialTerm';
import InternalLawyerField from '../../common/InternalLawyerField';
import SupplierField from '../../common/SupplierField';
import FieldColumn from 'src/components/FieldColumn';
import StatusFlow from '../../common/StatusFlow';

import {HandleOnBlurProvision} from "src/screen/payment/request/Form/common/handleOnBlurProvision"
import { useHistory } from 'react-router-dom';
import { editGeneratedGuide } from 'src/core/store/modules/payment/thunks';
import { useSnackbar } from 'notistack';
import { getListESocialAreas } from 'src/core/store/modules/e-social-areas/selectors';

type FGTSDataProps = {
	editable?: boolean
}

const FGTSData = (props: FGTSDataProps) => {
	const { t } = useTranslation();
	const { setFieldValue, values } = useFormikContext<TPaymentFormFGTS>();
	const showInfoMessage = useFinancialTerm();
	const { indiceFgts } = useSelector(getParameterizationItems);
	const dejurAreaName = useSelector(getListESocialAreas);
	const { valorPrincipal, valorMulta, valorJuros, valorJurosHistorico } = values;
	const [isSwitchFieldCLicked, setIsSwitchFieldClicked] = useState(false);
	const { handleOnBlur } = HandleOnBlurProvision();
	const { location: { pathname } } = useHistory();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const isRequired = dejurAreaName?.length === 0;

	useEffect(() => {
		setFieldValue(
			'valorPagamentoJudicial',
			sum([valorPrincipal, valorMulta, valorJuros, valorJurosHistorico])
		)
	}, [setFieldValue, valorPrincipal, valorMulta, valorJuros, valorJurosHistorico]);

	const onChangeCalc = ({ target: { value, name } }: ChangeEvent<HTMLInputElement>) => {
		setFieldValue(name, value)
		if (name === 'valorPrincipal')
			setFieldValue('baseCalculo', calcBase(value, indiceFgts))
		else setFieldValue('valorPrincipal', calcPercentage(value, indiceFgts))
	}

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
						required
						name='baseCalculo'
						label={t('solicitacaoPagamento:dadosPagamento.baseCalculoFGTS')}
						min={0.01}
						onChange={onChangeCalc}
						readOnly={!props.editable}
						/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						required
						name='valorPrincipal'
						min={0.01}
						onChange={onChangeCalc}
						label={t('solicitacaoPagamento:dadosPagamento.valorPrincipal')}
						readOnly={!props.editable}
						onBlur={(event) => handleOnBlur(event, 1)}

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
						readOnly={!props.editable}
						label={t('solicitacaoPagamento:dadosPagamento.adjustmentInterestAmount')}
						onBlur={(event) => handleOnBlur(event, 3)}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name='valorJurosHistorico'
						readOnly={!props.editable}
						label={t('solicitacaoPagamento:dadosPagamento.valorJurosHistorico')}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<CurrencyField
						name='valorPagamentoJudicial'
						label={t('solicitacaoPagamento:dadosPagamento.valorPagamentoJudicial')}
						onBlur={(event) => handleOnBlur(event, 4)}
						readOnly
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
					pathname.includes('/pagamentos/aprovacao-controle-juridico/') === true  ? <>
						<Grid item md={3} xs={12}>
							<SwitchField
								onClick={(e: any) => {setGeneratedGuide(e.target.value)}}
								name={`guiaGerada`}
							/>
							{"Guia Gerada"}
						</Grid>
					{ values?.guiaGerada === true ? 
					
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
					pathname !== "/pagamentos/solicitacao/novo" && !props.editable !== true ? <>
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
		
				<Grid item xs={12}>
					<TextField
						name='observacao'
						readOnly={!props.editable}
						label={t('solicitacaoPagamento:dadosPagamento.observacoes')}
					/>
				</Grid>
			</Grid>
		</Panel>
	);
};

export default FGTSData;
