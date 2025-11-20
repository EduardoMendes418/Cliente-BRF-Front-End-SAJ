export enum OCCURENCE_REASON_TYPE {
	PAYMENT = 1,
	GOODS_GUARANTEE
}

type TValuesWithOccuredReason = {
	occurrenceReason: number | ""
	occurrenceReasonType?: OCCURENCE_REASON_TYPE
}

export function verifyOccurenceReasonTypeAndId(occurrenceReason: number | "") {
	const occurrenceReasonType = OCCURENCE_REASON_TYPE.PAYMENT;
	return { occurrenceReasonType, occurrenceReason }
}

export function treatFormValuesWithOccurrenceReason<T extends TValuesWithOccuredReason>(values: T) {
	const { occurrenceReason } = values;

	if (Array.isArray(occurrenceReason)) {
		const list = occurrenceReason.map((item) => verifyOccurenceReasonTypeAndId(item))
		return {
			...values,
			occurrenceReason: list
		}
	}

	const treatedOccurrenceReason = verifyOccurenceReasonTypeAndId(occurrenceReason)
	return {
		...values,
		...treatedOccurrenceReason
	};
}

export function treatInitialValuesWithOccurrenceReason(values: TValuesWithOccuredReason) {
	const { occurrenceReason, occurrenceReasonType } = values

	if (!occurrenceReasonType)
		return { ...values, occurrenceReason: '' }

	return {
		...values,
		occurrenceReason: occurrenceReason,
	}
}

export function getOccurenceReasonValue(occurenceReasonType: OCCURENCE_REASON_TYPE, occurenceReason: string | number) {
	const prefix = occurenceReasonType === OCCURENCE_REASON_TYPE.PAYMENT ? 'P' : 'G'
	return `${prefix}${occurenceReason}`
}
