import { TConfrontingOrder, TConfrontingOrderRating, TGroupedConfrontingOrder } from "src/core/models/confronting-orders";
import { PROBABILITY_TYPE_PASCAL } from "src/screen/provisions/utils/constantes";

export default function confrontingOrdersToRows(orders: TConfrontingOrder[]) {
	let allRatingDescriptions = {} as Record<number, TGroupedConfrontingOrder>

	const rows = orders.map((item) => {
		const ratingsByDescription = groupConfrontingOrderRatingByDescription(item.confrontingOrderRatings)

		allRatingDescriptions = { ...allRatingDescriptions, ...ratingsByDescription }

		return { ...item, ratingsByDescription }
	})

	const sortedColumns = Object.keys(allRatingDescriptions).sort((keyA, keyB) => {
		const orderA = (allRatingDescriptions as any)[keyA].orderRatingDescriptionOrderById
		const orderB = (allRatingDescriptions as any)[keyB].orderRatingDescriptionOrderById
		return orderA - orderB
	})

	const dynamicColumns = sortedColumns.map(key => ({
		orderRatingDescriptionId: (allRatingDescriptions as any)[key].orderRatingDescriptionId as number,
		orderRatingDescriptionName: (allRatingDescriptions as any)[key].orderRatingDescriptionName as string
	}))

	return { rows, dynamicColumns }
}

export function groupConfrontingOrderRatingByDescription(ratings: TConfrontingOrderRating[] = []) {

	return ratings.reduce((acc, item) => {
		if (!acc[item.orderRatingDescriptionId])
			acc[item.orderRatingDescriptionId] = {} as TGroupedConfrontingOrder

		const groupingObj = acc[item.orderRatingDescriptionId]
		const pascalProbabilityType: 'Probable' | 'Possible' | 'Remote' =
			PROBABILITY_TYPE_PASCAL[item.orderRatingProbababilityId - 1]

		groupingObj.orderRatingDescriptionId = item.orderRatingDescriptionId
		groupingObj.orderRatingDescriptionName = item.orderRatingDescriptionName
		groupingObj.orderRatingDescriptionOrderById = item.orderRatingDescriptionOrderById

		groupingObj.fromFormulaCorrectionRuleName = item.fromFormulaCorrectionRuleName
		groupingObj.toFormulaCorrectionRuleName = item.toFormulaCorrectionRuleName
		groupingObj.hasFormulaCorrectionRuleNameChanged =
			item.fromFormulaCorrectionRuleName !== item.toFormulaCorrectionRuleName

		groupingObj.fromDatabase = item.fromDatabase
		groupingObj.toDatabase = item.toDatabase
		groupingObj.hasDatabaseChanged = item.fromDatabase !== item.toDatabase

		groupingObj[`from${pascalProbabilityType}Value`] = item.fromValue ?? 0
		groupingObj[`to${pascalProbabilityType}Value`] = item.toValue ?? 0
		groupingObj[`has${pascalProbabilityType}ValueChanged`] = (item.fromValue ?? 0) !== (item.toValue ?? 0)

		return acc
	}, {} as Record<number, TGroupedConfrontingOrder>)
}