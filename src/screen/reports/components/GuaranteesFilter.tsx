import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, Box} from '@material-ui/core';

import Panel from 'src/components/Panel';
import { CheckboxField, DateField, NumericField, SelectField } from 'src/components/form';
import { useTranslation } from "src/locale/i18n";
import UserSearchComponent from "src/screen/requisitions/components/UserSearchComponent";

import { useBanks, useGuaranteeModality, useEvaluationReasons } from 'src/hooks/fetchLists';
import { bearishReasonsOptionsList, requestTypesOptionsAll } from 'src/screen/goods-and-guarantees/constants';
import { accountabilityStatusOptions, noteTypesOptions, situationStatusOptions } from 'src/screen/goods-and-guarantees/accountability/constants';
import { accountabilityStatusOptions as asOptions } from 'src/core/utils/constants';

import { getListAsOptionPaymentType, getListAsOptionPaymentTypeAllStatus } from 'src/core/store/modules/payment-type/selectors';
import { fetchPaymentType } from 'src/core/store/modules/payment-type/thunks';
import { Modulos } from 'src/core/models/modules';
import { TReportComponent } from 'src/core/models/reports';
import { TReportFilterField } from 'src/core/models/report-configuration';

import { useGenerateReport } from '../hooks/useGenerateReport';
import ActionsButton from './ActionButtons';
import { useGoodsAndGuaranteesInsurer } from 'src/hooks/goodsAndGuarantees';
import { statusFlowIdListAsOptionNoGuaranteeModeId, statusFlowIdListAsOptionGuaranteeModeIdTwo, statusFlowIdListAsOptionGuaranteeModeIdThree, statusFlowIdListAsOptionGuaranteeModeIdFourOrFive, statusFlowIdListAsOptionGuaranteeModeIdOne } from 'src/screen/goods-and-guarantees/statusInfo';

type Props = {
	hasItem: boolean
	submitting: boolean
	customFields: TReportFilterField[]
	isGoodsAndGuarantees?: boolean
}

const statusOptions = [
	{ label: 'Ativo', value: 1 },
	/* { label: 'Endossado', value: 2 },
	{ label: 'Não Vigente', value: 3 }, */
	{ label: 'Morto', value: 4 }
]

const situationOptions = situationStatusOptions.map(opt => ({ ...opt, value: String(opt.value) }))

const GuaranteesFilter = ({ hasItem, submitting, customFields, isGoodsAndGuarantees }: Props) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	
const isNew = !hasItem

	const paymentTypeOptions = useSelector(getListAsOptionPaymentType);
	const path = window.location.pathname;
	const { rejectionReasonsAsOptions, returnReasonsAsOptions } = useEvaluationReasons(5);
	const { guaranteeModalityAsOptions, guaranteeModalityAsOptionsAll } = useGuaranteeModality();
	const [statusFlowIdListAsOption, setStatusFlowListAsOptions] = useState<any>(statusFlowIdListAsOptionNoGuaranteeModeId);


	const { banksAsOptions } = useBanks();
	const { generateReport, isGeneratingReport } = useGenerateReport({ reportType: isGoodsAndGuarantees ? TReportComponent.GOODS_GUARANTEES : TReportComponent.ACCOUNTABILITYR});
	const { companiesOptions } = useGoodsAndGuaranteesInsurer();
	const paymentTypeAsOptionsAllStatus = useSelector(getListAsOptionPaymentTypeAllStatus);

	useEffect(() => {
		dispatch(fetchPaymentType({ modulo: Modulos.Pagamento }));
	}, [dispatch]);

	const statusFlowAllOptions = statusFlowIdListAsOptionNoGuaranteeModeId.concat(statusFlowIdListAsOptionGuaranteeModeIdTwo, statusFlowIdListAsOptionGuaranteeModeIdThree, statusFlowIdListAsOptionGuaranteeModeIdFourOrFive)

	const statusFlowAsOptionByGuaranteeModeId = [
		{ guaranteeMode: [], option: statusFlowIdListAsOptionNoGuaranteeModeId},
		{ guaranteeMode: 1, option: statusFlowIdListAsOptionGuaranteeModeIdOne},
		{ guaranteeMode: 2, option: statusFlowIdListAsOptionGuaranteeModeIdTwo},
		{ guaranteeMode: 3, option: statusFlowIdListAsOptionGuaranteeModeIdThree},
		{ guaranteeMode: 4, option: statusFlowIdListAsOptionGuaranteeModeIdFourOrFive},
		{ guaranteeMode: 5, option: statusFlowIdListAsOptionGuaranteeModeIdFourOrFive},
		{ guaranteeMode: 'all', option: statusFlowAllOptions},
	]

	const getStatusFlowIdOption = (guaranteeModeId: any[]) => {
		const isUnselected = guaranteeModeId.slice(-1)[0];

		if(isUnselected === 'nil'){
			return setStatusFlowListAsOptions(statusFlowIdListAsOptionNoGuaranteeModeId)
		} 

		const filteredValues = statusFlowAsOptionByGuaranteeModeId.filter(
		({ guaranteeMode }) => guaranteeModeId.includes(guaranteeMode)
		);

		const statusFlowOptions = filteredValues.reduce((acc, { option }) => acc.concat(option as any), []);

		return setStatusFlowListAsOptions(statusFlowOptions); 
	}

	const sortedBearishReasonsOptionsList = bearishReasonsOptionsList?.sort((a, b) => {
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        return 0;
    });

	return (
		<Panel
			title={t('reports:guarantees.title')}
			withPadding
			slotBottomRight={<ActionsButton
				isGeneratingReport={isGeneratingReport}
				isSavingConfiguration={submitting}
				generateReport={() => generateReport(customFields)}
			/>}
			slotBottonRightPermission={isNew ? 'add' : 'edit'}
		>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<SelectField
						options={path === "/relatorios/bens-e-garantias/novo" ? guaranteeModalityAsOptionsAll : guaranteeModalityAsOptions}
						label={t('reports:guarantees.form.guaranteeModality')}
						name="guaranteeModeId"
						onChange={(e: any) => getStatusFlowIdOption(e.target.value)}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						options={requestTypesOptionsAll}
						label={t('reports:guarantees.form.requestType')}
						name="requestTypeId"
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						options={statusOptions}
						label={t('reports:guarantees.form.goodStatus')}
						name="statusBem"
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						options={path === "/relatorios/bens-e-garantias/novo" ? paymentTypeAsOptionsAllStatus : paymentTypeOptions}
						label={t('reports:payment.form.tipoPagamentoId')}
						name='paymentTypeId'
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						options={banksAsOptions}
						label={t('reports:guarantees.form.bank')}
						name="bankId"
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						label={t('reports:guarantees.form.broker')}
						name="insuranceCompanyIds"
						options={companiesOptions}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:guarantees.form.guaranteeDateInitial')}
								name="guaranteeDateInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:common.form.until')}
								name="guaranteeDateFinal"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:guarantees.form.emissionDateInitial')}
								name="emissionDateInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:common.form.until')}
								name="emissionDateFinal"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:guarantees.form.startDate')}
								name="effectiveDateInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:guarantees.form.finalDate')}
								name="effectiveDateFinal"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:guarantees.form.writeOffDateInitial')}
								name="writeOffDateInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:common.form.until')}
								name="writeOffDateFinal"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:guarantees.form.paymentDateInitial')}
								name="paymentDateInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:common.form.until')}
								name="paymentDateFinal"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:guarantees.form.createdDate')}
								name="startRequestDate"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:common.form.until')}
								name="endRequestDate"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						label={t('reports:guarantees.form.requestStatus')}
						name="statusFlowId"
						options={statusFlowIdListAsOption}
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						label={"Status da contabilização"}
						name="guaranteeStatusApprovalId"
						options={asOptions}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<UserSearchComponent
						label={"Solicitante"}
						name="RequesterIds"
						isMultiple
					/>
				</Grid>
				<Grid item xs={12} md={12}>

				</Grid>
			</Grid>
			{!isGoodsAndGuarantees && <>
				<Box my={3}>
					<Typography variant='h3'>
						{t('reports:guarantees.accountability.title')}
					</Typography>
				</Box>
				<Grid container spacing={3}>
					<Grid item xs={12} md={3}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('reports:guarantees.accountability.form.accountabilityDateInitial')}
									name="accountabilityDateInitial"
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('reports:common.form.until')}
									name="accountabilityDateFinal"
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={3}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('reports:guarantees.form.writeOffDateInitial')}
									name="accountabilityWriteOffDateInitial"
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('reports:common.form.until')}
									name="accountabilityWriteOffDateFinal"
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={3}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('reports:guarantees.accountability.form.dateSentToTheBankInitial')}
									name="submissionDateInitial"
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('reports:common.form.until')}
									name="submissionDateFinal"
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							options={banksAsOptions}
							label={t('reports:guarantees.form.bank')}
							name="accountabilityBankId"
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<NumericField
							label={t('reports:guarantees.accountability.form.pendingTime')}
							name="pendingTime"
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							options={accountabilityStatusOptions}
							label={t('reports:guarantees.accountability.form.statusFlowId')}
							name="accountabilityStatusFlowId"
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<CheckboxField
							label={t('reports:guarantees.accountability.form.situation')}
							name="status"
							options={situationOptions}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							options={sortedBearishReasonsOptionsList}
							label={t('reports:guarantees.accountability.form.dismissalReason')}
							name="bearishReasons"
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							options={asOptions}
							label={t('reports:main.form.statusApprovalId')}
							name="statusApprovalId"
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('reports:guarantees.evaluator.form.releaseDateInitial')}
									name="releaseDateInitial"
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('reports:common.form.until')}
									name="releaseDateFinal"
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Box my={3}>
					<Typography variant='h3'>
						{t('reports:guarantees.evaluator.title')}
					</Typography>
				</Box>
				<Grid container spacing={3}>
					<Grid item xs={12} md={3}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('reports:guarantees.evaluator.form.valuationDateInitial')}
									name="valuationDateInitial"
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									label={t('reports:common.form.until')}
									name="valuationDateFinal"
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t('reports:guarantees.evaluator.form.reasonForFailure')}
							name="rejectionReasonsId"
							options={rejectionReasonsAsOptions}
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t('reports:guarantees.evaluator.form.reasonForReturn')}
							name="returnReasonsId"
							options={returnReasonsAsOptions}
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t('reports:guarantees.evaluator.form.explanatoryNote')}
							name="note"
							options={noteTypesOptions}
							multiple
						/>
					</Grid>
				</Grid>

			</>}
		</Panel>
	)
}

export default GuaranteesFilter;