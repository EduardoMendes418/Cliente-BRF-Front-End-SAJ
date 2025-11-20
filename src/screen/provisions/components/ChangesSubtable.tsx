import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { format } from 'date-fns'

import { groupConfrontingOrderRatingByDescription } from 'src/screen/confronter/utils/groupConfrontingOrderRatingByDescription'
import { TConfrontingOrderLog } from 'src/core/models/confronting-orders'
import { numberToCurrency } from 'src/core/utils/func'

export default function ChangesSubtable(row: TConfrontingOrderLog) {
	if (![1, 9].includes(row.statusFlowId ?? 0))
		return null  
	
	const confrontingOrder = row.confrontingOrder!
	const confrontingOrderFiles = row.confrontingOrder!.confrontingOrderFiles

	const filesChanges: any[] = []

		for(const file of confrontingOrderFiles){
			filesChanges.push({
				field: "Anexo",
				from: file.from,
				to: file.to
			})
		}	

	const orderChanges: any[] = []
	if (confrontingOrder.fromIsActive !== confrontingOrder.toIsActive)
		orderChanges.push({
			field: 'Ativo/Inativo',
			from: confrontingOrder.fromIsActive == null
				? '-' : confrontingOrder.fromIsActive
				? 'Ativo' : 'Inativo',
			to: confrontingOrder.toIsActive ? 'Ativo' : 'Inativo',
		})
	if (confrontingOrder.fromOrderExpectationName !== confrontingOrder.toOrderExpectationName)
		orderChanges.push({
			field: 'Expectativa',
			from: confrontingOrder.fromOrderExpectationName ?? '-',
			to: confrontingOrder.toOrderExpectationName,
		})
	if (confrontingOrder.fromOrderProbabilityName !== confrontingOrder.toOrderProbabilityName)
		orderChanges.push({
			field: 'Probabilidade',
			from: confrontingOrder.fromOrderProbabilityName ?? '-',
			to: confrontingOrder.toOrderProbabilityName,
		})

	const ratingsByDescription = groupConfrontingOrderRatingByDescription(confrontingOrder.confrontingOrderRatings)
	const ratingDescriptionArray = Object.values(ratingsByDescription)

	const orderRatingChanges: any[] = []
	for (const item of ratingDescriptionArray) {
		if (item.hasProbableValueChanged)
			orderRatingChanges.push({
				description: item.orderRatingDescriptionName,
				field: 'Valor provável',
				from: item.fromProbableValue ? numberToCurrency(item.fromProbableValue) : '-',
				to: numberToCurrency(item.toProbableValue ?? '0'),
			})
		if (item.hasPossibleValueChanged)
			orderRatingChanges.push({
				description: item.orderRatingDescriptionName,
				field: 'Valor possível',
				from: item.fromPossibleValue ? numberToCurrency(item.fromPossibleValue) : '-',
				to: numberToCurrency(item.toPossibleValue ?? '0'),
			})
		if (item.hasRemoteValueChanged)
			orderRatingChanges.push({
				description: item.orderRatingDescriptionName,
				field: 'Valor remoto',
				from: item.fromRemoteValue ? numberToCurrency(item.fromRemoteValue) : '-',
				to: numberToCurrency(item.toRemoteValue ?? '0'),
			})
		if (item.hasDatabaseChanged)
			orderRatingChanges.push({
				description: item.orderRatingDescriptionName,
				field: 'Data base',
				from: item.fromDatabase ? format(new Date(item.fromDatabase), 'dd/MM/yyyy') : '-',
				to: format(new Date(item.toDatabase), 'dd/MM/yyyy'),
			})
		if (item.hasFormulaCorrectionRuleNameChanged)
			orderRatingChanges.push({
				description: item.orderRatingDescriptionName,
				field: 'Formula de correção',
				from: item.fromFormulaCorrectionRuleName ?? '-',
				to: item.toFormulaCorrectionRuleName,
			})
	}

	const hasOrderChanged = orderChanges.length !== 0
	const hasOrderRatingChanged = orderRatingChanges.length !== 0
	const hasFileChanged = filesChanges.length !== 0

	if (!hasOrderChanged && !hasOrderRatingChanged && !hasFileChanged)
		return null

	return (
			<TableContainer>
				<Table>
					{hasOrderChanged && (
						<>
							<TableHead>
								<TableRow>
									<TableCell colSpan={hasOrderRatingChanged ? 2 : undefined}>Campo</TableCell>
									<TableCell>De</TableCell>
									<TableCell>Para</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{orderChanges.map(oc => (
									<TableRow>
										<TableCell colSpan={hasOrderRatingChanged ? 2 : undefined}>{oc.field}</TableCell>
										<TableCell>{oc.from}</TableCell>
										<TableCell>{oc.to}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</>
					)} 
					{hasFileChanged && (
							<>
							<TableHead>
								<TableRow>
									<TableCell colSpan={ hasOrderRatingChanged ?  2  : undefined }>Campo</TableCell>
									<TableCell>De</TableCell>
									<TableCell>Para</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{filesChanges.map(oc => (
									
									<TableRow>
										<TableCell colSpan={ hasOrderRatingChanged ?  2  : undefined }>{oc.field}</TableCell>
										<TableCell>{oc.from}</TableCell>
										<TableCell>{oc.to}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</>
						)
					}

					{hasOrderRatingChanged && (
						<>
							<TableHead>
								<TableRow>
									<TableCell>Descrição da abertura</TableCell>
									<TableCell>Campo</TableCell>
									<TableCell>De</TableCell>
									<TableCell>Para</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{orderRatingChanges.map(orc => (
									<TableRow>
										<TableCell>{orc.description}</TableCell>
										<TableCell>{orc.field}</TableCell>
										<TableCell>{orc.from}</TableCell>
										<TableCell>{orc.to}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</>
					)}
				</Table>
			</TableContainer>
	)
}
