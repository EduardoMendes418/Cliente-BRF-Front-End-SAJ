import { Grid } from "@material-ui/core";

import Panel from "src/components/Panel";
import { DateField, SelectField } from "src/components/form";
import { useTranslation } from "src/locale/i18n";

import { TReportComponent } from "src/core/models/reports";
import { useBanks } from "src/hooks/fetchLists";
import {
	occurrenceTypesOptions,
	transferStatusOptions,
	blockStatusOptions,
} from "src/screen/judicial-blocks-and-transfers/constants";
import { TReportFilterField } from "src/core/models/report-configuration";

import { useGenerateReport } from "../hooks/useGenerateReport";
import { Modulos } from "src/core/models/modules";
import { usePaymentType } from "src/hooks/fetchLists";
import ActionsButton from "./ActionButtons";
import { accountabilityStatusOptions } from "src/core/utils/constants";

type Props = {
	hasItem: boolean;
	submitting: boolean;
	customFields: TReportFilterField[];
};

const JudicialBlocksAndTransfersFilter = ({
	hasItem,
	submitting,
	customFields,
}: Props) => {
	const { t } = useTranslation();

	const isNew = !hasItem;

	const { banksAsOptions } = useBanks();
	const { generateReport, isGeneratingReport } = useGenerateReport({
		reportType: TReportComponent.JUDICIAL_BLOCKS_AND_TRANSFERS,
	});
	const { paymentTypeAsOptions } = usePaymentType(Modulos.Pagamento);

	return (
		<Panel
			title={t("reports:judicialBlocksAndTransfers.title")}
			withPadding
			slotBottomRight={
				<ActionsButton
					isGeneratingReport={isGeneratingReport}
					isSavingConfiguration={submitting}
					generateReport={() => generateReport(customFields)}
				/>
			}
			slotBottonRightPermission={isNew ? "add" : "edit"}
		>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t("reports:judicialBlocksAndTransfers.form.requestDateInitial")}
								name="requestDateInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t("reports:common.form.until")}
								name="requestDateFinal"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t("reports:judicialBlocksAndTransfers.form.blockAndTransfersDateInitial")}
								name="blockOrTransfDateInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t("reports:common.form.until")}
								name="blockOrTransfDateFinal"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t("reports:judicialBlocksAndTransfers.form.finishedDateInitial")}
								name="completionDateInitial"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t("reports:common.form.until")}
								name="completionDateFinal"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						options={occurrenceTypesOptions}
						label={t("reports:judicialBlocksAndTransfers.form.occurrenceType")}
						name="occurrenceType"
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						options={blockStatusOptions}
						label={t("reports:judicialBlocksAndTransfers.form.occurrenceBlockStatus")}
						name="judicialBlockStatus"
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						options={transferStatusOptions}
						label={t("reports:judicialBlocksAndTransfers.form.occurrenceTransferStatus")}
						name="judicialTransferStatus"
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						options={paymentTypeAsOptions}
						label={t("reports:judicialBlocksAndTransfers.form.occurrenceReason")}
						name="occurrenceReason"
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						options={banksAsOptions}
						label={t("reports:payment.form.bankId")}
						name="bankId"
						multiple
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
							label={t("judicialBlocksAndTransfers:form.statusApprovalId")}
							name="statusApprovalId"
							options={accountabilityStatusOptions}
						/>
					</Grid>
				<Grid item md={3} xs={12}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								name="contabilizationDateStart"
								label={"Data da contabilização de"}
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								name="contabilizationDateEnd"
								label={"até"}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Panel>
	);
};

export default JudicialBlocksAndTransfersFilter;
