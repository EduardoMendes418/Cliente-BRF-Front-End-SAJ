import { useMsal } from '@azure/msal-react';
import { Grid } from '@material-ui/core';
import { useFormikContext } from 'formik';

import Panel from 'src/components/Panel';
import { SelectField, TextField, DateField, CurrencyField, FormikContext, NumericField } from 'src/components/form';
import FieldColumn from 'src/components/FieldColumn';

import { useTranslation } from 'src/locale/i18n';
import { TGuaranteeAccountability } from 'src/core/models/guarantee-accountability';

import { BEARISH_REASONS, notJudicialDepositBearishReasonsOptions } from '../../../constants';
import { accountabilityStatusOptionsAsObject, situationStatusOptionsAsObject } from '../../constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getItemGoodsGuaranteesRequest } from 'src/core/store/modules/goods-guarantee/selectors';
import { useGuaranteeModality } from 'src/hooks/fetchLists';
import goodsGuaranteesRequestApi from 'src/core/api/goods-guarantee';
import { useParams } from 'react-router-dom';

type Props = {
	readOnly: boolean;
	itemAccountability: TGuaranteeAccountability;
	isSolicitacao: boolean;
}

const RequesterForm = ({ itemAccountability, readOnly, isSolicitacao }: Props) => {
	
	const { initialValues, setFieldValue, values } = useFormikContext<FormikContext>();
	const { t } = useTranslation();
	const { accounts } = useMsal();
	const [bearishReason, setBearishReason] = useState<BEARISH_REASONS | "">("");
	const [newGuaranteeValues, setNewGuaranteeValues] = useState<any>();
	const item = useSelector(getItemGoodsGuaranteesRequest);
	const { guaranteeModalityAsOptions } = useGuaranteeModality();
	const { id } = useParams<{ id: string }>();
	const isNew = id === "novo";

	const onBearishReasonsChanges = (event: any) => {
		const selectedValue = event.target.value;
		setBearishReason(selectedValue);
	};

	const doNewGuaranteeRequest = async (newGuaranteeId: any) => {
		const response = await goodsGuaranteesRequestApi.listNewGuarantee({id: newGuaranteeId});

		setNewGuaranteeValues({
			guaranteeModeId:  response?.data?.items[0]?.guaranteeModeId,
			valueGuarantee: response?.data?.items[0]?.valueGuarantee
		})
		setFieldValue('replacementGoodGuaranteeId', newGuaranteeId)
	}

	const getNewGuaranteeValues = async () => {
		const response = await goodsGuaranteesRequestApi.listNewGuarantee({id: Number(values.replacementGoodGuaranteeId)});
		setFieldValue('goodsGuaranteesRequest.guaranteeModalityId', response?.data?.items[0]?.guaranteeModeId)
		setFieldValue('goodsGuaranteesRequest.valueGuarantee', response?.data?.items[0]?.valueGuarantee)
	}

	useEffect(() => {
		if(isNew === false && values.bearishReasons === BEARISH_REASONS.INTERNAL_DELIBERATION_REPLACEMENT){
			getNewGuaranteeValues()
		}
	}, [values.bearishReasons]) 

	const sortedBearishReasonsOptionsList = notJudicialDepositBearishReasonsOptions?.sort((a, b) => {
			if (a.label < b.label) return -1;
			if (a.label > b.label) return 1;
			return 0;
		});

	return (
		<Panel title={t('goodsAndGuarantees:accountability.title')} withPadding>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t('goodsAndGuarantees:accountability.accountabilityDate')}
						value={(itemAccountability.accountabilityDate || new Date()) as Date}
						type='date'
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t('goodsAndGuarantees:accountability.applicantName')}
						value={itemAccountability.applicantName || accounts[0]?.name}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CurrencyField
						label={t('goodsAndGuarantees:accountability.amountWrittenOff')}
						name='amountWrittenOff'
						readOnly
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t('goodsAndGuarantees:accountability.accountabilityStatus')}
						value={accountabilityStatusOptionsAsObject[initialValues.statusFlowId]}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t('goodsAndGuarantees:accountability.situation')}
						value={situationStatusOptionsAsObject[initialValues.status]}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name="bearishReasons"
						label={t('goodsAndGuarantees:accountability.bearishReasons')}
						options={sortedBearishReasonsOptionsList}
						onChange={onBearishReasonsChanges}
						readOnly={readOnly}
						required
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<TextField
						name="licenseNumber"
						label={t('goodsAndGuarantees:accountability.licenseNumber')}
						placeholder={t('form.typeHere')}
						readOnly={readOnly}
						required
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<DateField
						name="licenseDate"
						label={t('goodsAndGuarantees:accountability.licenseDate')}
						placeholder={t('form.typeHere')}
						readOnly={readOnly}
						required
					/>
				</Grid>
				{
				values.bearishReasons === BEARISH_REASONS.INTERNAL_DELIBERATION_REPLACEMENT && item.guaranteeModalityId !== 1 /* && readOnly === true */ &&(
					<> 
					<Grid item xs={12} md={3}>
									<NumericField
										required
										onChange={(e)=> doNewGuaranteeRequest(e.target.value)}
										name="replacementGoodGuaranteeId"
										label={"ID da nova garantia"}
										readOnly={readOnly}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<FieldColumn
										label={t("goodsAndGuarantees:form.guaranteeModality")}
										value={readOnly === true ? values.goodsGuaranteesRequest?.guaranteeModalityId : newGuaranteeValues?.guaranteeModeId}
										type="list"
										options={guaranteeModalityAsOptions}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<FieldColumn
										label={"Valor da garantia"}
										value={readOnly === true ? values.goodsGuaranteesRequest?.valueGuarantee : newGuaranteeValues?.valueGuarantee}
										type="currency"
									/>
								</Grid>
					</>
				)
			}
			</Grid>
			
			<Grid container spacing={3} justifyContent="center" className="margin-top-16">
				{!isSolicitacao && (
					<Grid item xs={12} md={3} >
						<TextField
							name="email"
							label={t('goodsAndGuarantees:accountability.mail')}
							placeholder={t('form.typeHere')}
							readOnly={readOnly}
						/>
					</Grid>
				)}
				<Grid item xs={12} md={isSolicitacao ? 12 : 9}>
					<TextField
						name="description"
						label={t('goodsAndGuarantees:accountability.description')}
						placeholder={t('form.typeHere')}
						readOnly={readOnly}
						rows={5}
						maxLength={2000}
						multiline
					/>
				</Grid>
			</Grid>
		</Panel>
	)
}

export default RequesterForm