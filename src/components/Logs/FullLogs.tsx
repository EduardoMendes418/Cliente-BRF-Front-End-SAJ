import { useMemo } from "react"
import { Chip } from "@material-ui/core"
import { makeStyles } from "@material-ui/core"

import TableComponent, { ColumnData } from "src/components/Table"
import Accordion from "src/components/Accordion"
import { TLogs } from "src/core/models"
import { useTranslation } from "src/locale/i18n"

export { default as removeDuplicatedLogsAndSortByDate } from './utils/removeDuplicatedLogsAndSortByDate'

const useStyles = makeStyles({
	info: {
		backgroundColor: "#BADEF6",
		color: "#004894",
	},
	infoInverted: {
		backgroundColor: "#F3E6F3",
		color: "#004894",
	},
	warn: {
		backgroundColor: "#FFEDB4",
		color: "#F04E23",
	},
	success: {
		backgroundColor: "#E8F6EA",
		color: "#1C6226",
	},
	successDark: {
		backgroundColor: "#6FCF97",
		color: "#FFFFFF",
	},
	danger: {
		backgroundColor: "#CC2027",
		color: "#FFFFFF",
	},
	purple: {
		backgroundColor: "#BB6BD9",
		color: "#FFFFFF",
	},
	orange: {
		backgroundColor: "#F2994A",
		color: "#FFFFFF",
	},
})

export type Color = 'info' | 'infoInverted' | 'warn' | 'success' | 'successDark' |'danger' | 'purple' | 'orange'

export type RowConfig = {
	text: string
	color: Color
}

type Props<T = any> = {
	logs?: TLogs[]
	rule: (log: TLogs, index: number, ruleProps: T) => RowConfig
	ruleProps?: T
}

const FullLogs = ({ logs = [], rule, ruleProps = {} }: Props) => {
	const { t } = useTranslation()
	const styles = useStyles()

	const rows = useMemo(() => logs.map((item, index) => {
		const rowConfig = rule(item, index, ruleProps)
		return {
			...item,
			observation: (
				<div className="tablecell-observation-log">
					{item.observation}
				</div>
			),
			status: (
				<Chip label={rowConfig.text} className={styles[rowConfig.color]} />
			),
		}
	}), [logs, rule, ruleProps, styles])

	const columns: ColumnData[] = [
		{ label: t("userName"), field: "userName" },
		{
			label: t("Pagamentos:logs.date"),
			field: "occurrenceDate",
			type: "dateHour",
		},
		{ label: t("status"), field: "status" },
		{ label: t("Pagamentos:logs.obs"), field: "observation" },
	]

	return !logs.length ? null : (
		<div className="margin-top-16 form-accordion">
			<Accordion title={t("Pagamentos:logs.titleList")}>
				<TableComponent columns={columns} rows={rows} />
			</Accordion>
		</div>
	)
}

export default FullLogs
