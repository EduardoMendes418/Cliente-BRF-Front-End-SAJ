import { TLogs } from "src/core/models";

export default function removeDuplicatedLogsAndSortByDate(logs: TLogs[] = []) {
	const filterdLogs: TLogs[] = []
	let lastStatusFlowId = undefined
	let lastStatusApprovalId = undefined

	for (const log of logs as any) {
		if (log.statusFlowId === lastStatusFlowId && log.statusApprovalId === lastStatusApprovalId)
			continue

		lastStatusFlowId = log.statusFlowId
		lastStatusApprovalId = log.statusApprovalId
		filterdLogs.push(log)
	}

	return filterdLogs.sort(
		(item1, item2) =>
			new Date(item1.occurrenceDate).getTime() - new Date(item2.occurrenceDate).getTime()
	)
}
