import { useMemo } from "react"
import { Box, Grid, Typography } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import { DateField, SelectField } from "src/components/form"
import Panel from "src/components/Panel"
import { Modulos } from "src/core/models/modules"
import { TReportFilterField } from "src/core/models/report-configuration"
import { TReportComponent } from "src/core/models/reports"
import { getListAsOptionPaymentType } from "src/core/store/modules/payment-type/selectors"
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks"
import { useTranslation } from "src/locale/i18n"
import { useGenerateReport } from "../hooks/useGenerateReport"
import ActionsButton from "./ActionButtons"
import { useEffect } from 'react'
import { statusOptions } from "src/screen/credit-receipt/constants"
import { useBanks } from "src/hooks/fetchLists"
import { fetchRejectionAndReturnReasonList } from 'src/core/store/modules/rejection-and-return-reason/thunks';
import {
	getListRejectionAndReturnReason,
} from "src/core/store/modules/rejection-and-return-reason/selectors";
import { TOptionsSelect } from "src/components/form/index"
import { accountabilityStatusOptions } from "src/core/utils/constants"

type Props = {
	hasItem: boolean
	submitting: boolean
	customFields: TReportFilterField[]
}

const CreditReceiptFilter = ({ hasItem, submitting, customFields }: Props) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const isNew = !hasItem
	const { generateReport, isGeneratingReport } = useGenerateReport({ reportType: TReportComponent.CREDIT_RECEIPT });

	const { banksAsOptions } = useBanks();
	const paymentTypeOptions = useSelector(getListAsOptionPaymentType);
	const list = useSelector(getListRejectionAndReturnReason);
	const disapproval = useMemo(() => list.filter(({reasonType}) => reasonType === 1).map(({description, id}) => ({value: id, label: description})), [list]) as TOptionsSelect[]
	const devolution = useMemo(() => list.filter(({reasonType}) => reasonType === 2).map(({description, id}) => ({value: id, label: description})), [list]) as TOptionsSelect[]
	
	useEffect(() => {
		dispatch(fetchPaymentType({ modulo: Modulos.Credito}));
		dispatch(fetchRejectionAndReturnReasonList({ page:1, pageSize: 100, moduloId: Modulos.Credito, notPaginate: true }));
	}, [dispatch]);

	return (
		<Panel title={t('reports:creditReceipt.title')}
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
						options={paymentTypeOptions}
						label={t('reports:creditReceipt.form.tipoPagamento')}
						name='paymentTypes'
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:creditReceipt.form.dataLancamento')}
								name="requestDateInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:creditReceipt.form.until')}
								name="requestDateFinal"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField 
						options={statusOptions}
						label={t("reports:creditReceipt.form.status")}
						name='statuses'
						multiple
					/>
				</Grid>
			</Grid>	
			<Box my={3}>
				<Typography variant='h3'>
					{t('reports:creditReceipt.form.evaluator.title')}
				</Typography>
			</Box>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<SelectField
						options={banksAsOptions}
						label={t("reports:creditReceipt.form.evaluator.form.bank")}
						name="evaluatorBankId"
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:creditReceipt.form.evaluator.form.dataAvaliacao')}
								name="evaluatorDateInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:creditReceipt.form.until')}
								name="evaluatorDateFinal"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:creditReceipt.form.evaluator.form.dataBaixa')}
								name="evaluatorWriteOffDateInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:creditReceipt.form.until')}
								name="evaluatorWriteOffDateFinal"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:creditReceipt.form.evaluator.form.dataSend')}
								name="evaluatorSendBankDateInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:creditReceipt.form.until')}
								name="evaluatorSendBankDateFinal"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						options={devolution}
						label={"Motivo devolução"}
						name="devolution"
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						options={disapproval}
						label={"Motivo reprovação"}
						name="disapproval"
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						label={t("judicialBlocksAndTransfers:form.statusApprovalId")}
						name="statusApprovalIds"
						options={accountabilityStatusOptions}			
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:creditReceipt.form.sapRequestDateStart')}
								name="sapRequestDateStart"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t('reports:creditReceipt.form.until')}
								name="sapRequestDateEnd"
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Panel>
	)
}

export default CreditReceiptFilter;