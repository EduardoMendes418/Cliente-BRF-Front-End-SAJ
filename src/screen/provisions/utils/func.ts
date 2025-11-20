import { isEqual } from 'lodash'

import {
	TOrderRating,
	TGroupedOrderRatingProbabilities,
	TProvisionOrderForm,
	TOrderRatingForm,
	TOrderForm,
	ChangableOrder,
	TProvisionOrder,
	TOrderFile
} from 'src/core/models/provision-order'
import { TOptionsSelect } from 'src/components/form';
import { t } from 'src/locale/i18n'

import { SUCCESS_FEE_DESCRIPTION } from '../components/TotalOrderRatingTable';
import { SUBMITION_TYPE, PROBABILITY_TYPE_CAMEL, orderRatingsChangableProperties } from './constantes';
import handleFileToBase64 from './fileToBase64';

export const validateRequiredFields = (values: TProvisionOrderForm) => {
	const errors = {} as any
	const requiredMsg = t('required')
	const orderRequiredFields = ['orderDescriptionId', 'orderExpectationId'/* , 'orderProbabilityId' */]
	const orderRatingRequiredFields = ['orderRatingDescriptionId', 'riskValue', 'probableValue', 'possibleValue',
		'remoteValue', 'dataBase', 'formulaCorrectionRuleId']
	const submissionType = (document.activeElement as any)?.dataset.flag;

	const requiredFields = submissionType === SUBMITION_TYPE.ORDER
		? orderRequiredFields : orderRatingRequiredFields

	requiredFields.forEach((key) => {
		if (!(values as any)[key])
			errors[key] = requiredMsg
	})

	return errors
}

export const getDescription = (options: TOptionsSelect[], value: number | string) => {
	return options.find((o) => o.value === value)?.label
}

export const currencyToNumber = (value: number | string) => {
	if (typeof value === 'number') return value
	return parseFloat(`${value}`.replace(/(R\$\s)|\./g, '').replace(/,/g, '.'))
}


/**
 * Groups orderRatingProbabilites by order rating description.
 * @param orderRatings disordered list
 * @returns grouped probabilities
 */
export const groupOrderRatingsByDescrition = (orderRatings: TOrderRating[]) => {
	const dictionary = orderRatings.reduce((acc, item) => {
		if (!acc[item.orderRatingDescriptionId])
			acc[item.orderRatingDescriptionId] = {} as TGroupedOrderRatingProbabilities

		const groupingObj = acc[item.orderRatingDescriptionId]
		// orderRatingProbababilityId - 1 is expected to match ORDER_PROBABILITIES
		// and PROBABILITY_TYPE_CAMEL contants
		const probabilityType = PROBABILITY_TYPE_CAMEL[item.orderRatingProbababilityId - 1]

		groupingObj[`${probabilityType}Value`] = item.value
		groupingObj.orderRatingDescriptionId = item.orderRatingDescriptionId
		groupingObj.riskValue = item.riskValue
		groupingObj.dataBase = item.dataBase
		groupingObj.formulaCorrectionRuleId = item.formulaCorrectionRuleId
		groupingObj.orderRatingDescription = item.orderRatingDescription?.name
		groupingObj.formulaCorrectionRule = item.formulaCorrectionRule?.formulaName
		groupingObj.transientId = item.transientId

		return acc
	}, {} as any)

	const groupedOrderRatingProbabilites = Object.keys(dictionary).map((key) => dictionary[key])
	return groupedOrderRatingProbabilites as TGroupedOrderRatingProbabilities[]
}

export const generateOrderRatingsFromForm = (
	form: TOrderRatingForm,
	transientId: string,
	orderRatingDescription: string,
	formulaName: string,
	statusName: string
) => {
	return PROBABILITY_TYPE_CAMEL.map((key, index) => {
		const { probableValue, possibleValue, remoteValue, ...rest } = form
		return {
			...rest,
			// orderRatingProbababilityId + 1 is expected to match ORDER_PROBABILITIES
			// and PROBABILITY_TYPE_CAMEL contants
			orderRatingProbababilityId: index + 1,
			value: form[`${key}Value`],
			transientId,
			orderRatingDescription: { name: orderRatingDescription },
			formulaCorrectionRule: { formulaName },
			orderStatus: { name: statusName }
		} as unknown as TOrderRating
	})
}

export const getOrderRatingForm = (order?: Partial<TProvisionOrderForm>) => {
	const {
		orderRatingDescriptionId = '',
		riskValue = 0,
		probableValue = 0,
		possibleValue = 0,
		remoteValue = 0,
		dataBase = null,
		formulaCorrectionRuleId = ''
	} = order || {}

	return {
		orderRatingDescriptionId,
		riskValue: currencyToNumber(riskValue),
		probableValue: currencyToNumber(probableValue),
		possibleValue: currencyToNumber(possibleValue),
		remoteValue: currencyToNumber(remoteValue),
		dataBase,
		formulaCorrectionRuleId,
	} as TOrderRatingForm
}

export const getOrderForm = (row?: Partial<TProvisionOrderForm>) => {
	const {
		orderDescriptionId = '',
		createdDate = '',
		orderExpectationId = '',
		orderStatusId = 1,
		/* orderProbabilityId = '', */
		orderFiles = []
	} = row || {}

	return {
		orderDescriptionId,
		createdDate,
		orderExpectationId,
		orderStatusId,
		/* orderProbabilityId, */
		orderFiles
	} as TOrderForm
}

export const validateOrderRatingsValues = (values: TProvisionOrderForm, isOnEdit: boolean) => {
	const errorMessages: any[] = []
	const allNumberFieds = ['riskValue', 'probableValue', 'possibleValue', 'remoteValue']

	if (!isOnEdit && allNumberFieds.every((key) => currencyToNumber((values as any)[key]) === 0)) {
		errorMessages.push(t('provisions:request.errors.invalidZeroValues'))
		return errorMessages
	}

	return errorMessages
}

export const createNewObjectWithSelectedProperties = (original: Record<string, any>, properties: string[]) => {
	const newObject: Record<string, any> = {}
	properties.forEach(key => {
		newObject[key] = original[key]
	})
	return newObject
}

export const checkOrderFormChanged = (newValues: TOrderForm, newRatings: TOrderRating[] = [], oldValues?: TProvisionOrder) => {
	const originalValues = oldValues || {} as TProvisionOrder
	if (typeof newValues.createdDate !== 'string' || typeof originalValues.createdDate !== 'string') {
		return
	}
	/* throw Error('This method only works with createDate as string') */

	const newDate = newValues.createdDate.substring(0, 10)
	const originalDate = originalValues.createdDate.substring(0, 10)
	if (originalValues.orderDescriptionId !== newValues.orderDescriptionId
		|| newDate !== originalDate
		|| originalValues.orderExpectationId !== newValues.orderExpectationId
		|| originalValues.orderStatusId !== newValues.orderStatusId
		|| originalValues.orderProbabilityId !== newValues.orderProbabilityId
		|| originalValues.orderFiles !== newValues.orderFiles)
		return true

	return checkOrderRatingChanged(newRatings, originalValues?.orderRatings ?? [])
}

export const checkOrderChanged = (original: ChangableOrder, derived: ChangableOrder) => {
	const { orderRatings: originalRatings, ...originalRest } = original
	const { orderRatings: derivedRatings, ...derivedRest } = derived

	const originalOrderRest = { ...originalRest, createdDate: originalRest.createdDate.substring(0, 10) }
	const derivedOrderRest = { ...derivedRest, createdDate: originalOrderRest.createdDate.substring(0, 10) }

	if (!isEqual(originalOrderRest, derivedOrderRest))
		return true

	return checkOrderRatingChanged(originalRatings, derivedRatings)
}

export const checkOrderRatingChanged = (original: TOrderRating[], derived: TOrderRating[]) => {
	if (original.length !== derived.length)
		return true

	const groupedOriginalOrderRatings = groupOrderRatingsByDescrition(original)
	const groupedDerivedlOrderRatings = groupOrderRatingsByDescrition(derived)

	let index = 0
	while (index < groupedOriginalOrderRatings.length) {
		let originalOrderRating =
			createNewObjectWithSelectedProperties(groupedOriginalOrderRatings[index], orderRatingsChangableProperties)
		let derivedOrderRating =
			createNewObjectWithSelectedProperties(groupedDerivedlOrderRatings[index], orderRatingsChangableProperties)

		originalOrderRating = { ...originalOrderRating, dataBase: originalOrderRating.dataBase.substring(0, 10) }
		derivedOrderRating = { ...derivedOrderRating, dataBase: derivedOrderRating.dataBase.substring(0, 10) }

		if (!isEqual(originalOrderRating, derivedOrderRating))
			return true
		index++
	}

	return false
}

export const getOrderRatingInfo = (orders: TProvisionOrder[]) => {
	const successFeeOrder = orders?.find(item => item.orderDescription.name.trim() === SUCCESS_FEE_DESCRIPTION)

	const provisionOrdersRatings = orders
		?.filter((item) => item.orderDescription.name.trim() !== SUCCESS_FEE_DESCRIPTION)
		.reduce((accumulator, item) => {
			accumulator = accumulator.concat(item.orderRatings)
			return accumulator
		}, [] as TOrderRating[])

	const getEqualityStatus = (array: TOrderRating[], key: string) => {
		if (array.length <= 1) return true;

		const firstItemKey = (array[0] as any)?.[key];
		return !array.some(item => (item as any)?.[key] !== firstItemKey);
	};

	const provisionDataBase = provisionOrdersRatings[0]?.dataBase;
	const allProvisionDatesAreEqual = getEqualityStatus(provisionOrdersRatings, 'dataBase');

	const provisionFormulaCorrectionRuleName = provisionOrdersRatings[0]?.formulaCorrectionRule?.formulaName;
	const allProvisionCorrectionRulesAreEqual = getEqualityStatus(provisionOrdersRatings, 'formulaCorrectionRule.formulaName');


	return {
		successFeeOrder,
		provisionDataBase,
		provisionFormulaCorrectionRuleName,
		allProvisionDatesAreEqual,
		allProvisionCorrectionRulesAreEqual,
	}
}

export const convertNewFileToOrderFile = async (files: (TOrderFile | File)[]) => {
	const oldFiles: TOrderFile[] = []
	const newFiles: File[] = []
	let newOrderFiles: TOrderFile[] = []

	files.forEach(file => {
		if (file instanceof File)
			newFiles.push(file)
		else
			oldFiles.push(file)
	})


	if (newFiles.length) {
		const convertedFiles = await handleFileToBase64(newFiles)
		newOrderFiles = newFiles.map((file, index) => ({
			documentName: file.name,
			file: convertedFiles[index]
		}) as TOrderFile)
	}

	return [...oldFiles, ...newOrderFiles]
}