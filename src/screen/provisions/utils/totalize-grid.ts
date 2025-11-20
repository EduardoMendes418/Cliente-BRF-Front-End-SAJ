export default function totalizeGrid(rows: GridRow[] = []) {
	const totalLine: Omit<GridRow, 'orderRatingDescriptionId' | 'orderRatingProbabilityId'> = {
		probableValue: 0,
		probableCorrectedValue: 0,
		probableFeesValue: 0,
		probableProbabilitySubtotal: 0,
		possibleValue: 0,
		possibleCorrectedValue: 0,
		possibleFeesValue: 0,
		possibleProbabilitySubtotal: 0,
		remoteValue: 0,
		remoteCorrectedValue: 0,
		remoteFeesValue: 0,
		remoteProbabilitySubtotal: 0,
		total: 0,
		orderRatingDescriptionName: 'Total'
	}

	const rowsWithTotalLine = rows.map((item) => {
		const { probableProbabilitySubtotal, possibleProbabilitySubtotal, remoteProbabilitySubtotal } = item
		const newItem: GridRow = {
			...item,
			total: probableProbabilitySubtotal + possibleProbabilitySubtotal + remoteProbabilitySubtotal
		}

		totalLine.probableValue += newItem.probableValue
		totalLine.probableCorrectedValue += newItem.probableCorrectedValue
		totalLine.probableFeesValue += newItem.probableFeesValue
		totalLine.probableProbabilitySubtotal += newItem.probableProbabilitySubtotal
		totalLine.possibleValue += newItem.possibleValue
		totalLine.possibleCorrectedValue += newItem.possibleCorrectedValue
		totalLine.possibleFeesValue += newItem.possibleFeesValue
		totalLine.possibleProbabilitySubtotal += newItem.possibleProbabilitySubtotal
		totalLine.remoteValue += newItem.remoteValue
		totalLine.remoteCorrectedValue += newItem.remoteCorrectedValue
		totalLine.remoteFeesValue += newItem.remoteFeesValue
		totalLine.remoteProbabilitySubtotal += newItem.remoteProbabilitySubtotal
		totalLine.total = totalLine.total! + newItem.total!

		return newItem
	})

	return [...rowsWithTotalLine, totalLine as GridRow]

}

export type GridRow = {
	orderRatingDescriptionId: number
	orderRatingDescriptionName: string
	orderRatingProbabilityId: number
	probableValue: number
	probableCorrectedValue: number
	probableFeesValue: number
	probableProbabilitySubtotal: number
	possibleValue: number
	possibleCorrectedValue: number
	possibleFeesValue: number
	possibleProbabilitySubtotal: number
	remoteValue: number
	remoteCorrectedValue: number
	remoteFeesValue: number
	remoteProbabilitySubtotal: number
	total?: number
}

export type Grid = {
	orderExpectationId: number | null
	folderNumber: string
	rows: GridRow[]
}
