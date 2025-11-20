import { Grid } from "@material-ui/core";
import { TLogs } from "src/core/models";
import { useEvaluationReasons } from "src/hooks/fetchLists";

import { t } from "src/locale/i18n";

import FieldColumn from "../FieldColumn";
import Panel from "../Panel";

const TITLE = {
	cancelled: t("justification.cancelled"),
	returned: t("justification.returned"),
	rejected: t("justification.rejected"),
	reversed: t("justification.reversed"),
};

type TJustificationDisplay = {
	logs?: TLogs[];
	status: number;
	type: "cancelled" | "rejected" | "returned" | "reversed";
	moduloId: number;
	reasonType?: number;
};

const JustificationDisplay = ({
	status,
	logs = [],
	type,
	moduloId,
	reasonType,
}: TJustificationDisplay) => {
	const { reasons } = useEvaluationReasons(moduloId, reasonType);

	if (!logs.length) return null;

	const selectedLog = [...logs]
		.sort(
			(item1, item2) =>
				new Date(item1.occurrenceDate).getTime() -
				new Date(item2.occurrenceDate).getTime()
		)
		.reverse()
		.filter(x => x.rejectionAndReturnReasonsId)
		.find((log) => log.statusFlowId === status);

	if (!selectedLog) return null;

	return (
		<Panel title={TITLE[type]} withPadding>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t("justification.evaluator")}
						value={selectedLog.userName}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t("justification.date")}
						value={selectedLog.occurrenceDate}
						type="date"
					/>
				</Grid>
				{selectedLog.dueDate && (
					<Grid item md={3} xs={12}>
						<FieldColumn
							label={t("justification.dueDate")}
							value={selectedLog.dueDate}
							type="date"
						/>
					</Grid>
				)}
				<Grid item md={6} xs={12}>
					<FieldColumn
						label={t("justification.reason")}
						value={selectedLog.rejectionAndReturnReasonsId}
						type="list"
						options={reasons[type] ?? []}
					/>
				</Grid>
				<Grid item md={12} xs={12}>
					<FieldColumn
						label={t("justification.description")}
						value={selectedLog.observation}
						multiline
					/>
				</Grid>
			</Grid>
		</Panel>
	);
};

export default JustificationDisplay;
