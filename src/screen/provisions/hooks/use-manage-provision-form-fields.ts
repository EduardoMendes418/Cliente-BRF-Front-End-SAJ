import { useCallback, useRef, useEffect, RefObject, ChangeEvent, useState } from 'react'
import { FormikProps } from 'formik'
import { useDispatch, useSelector } from 'react-redux'

import { TProvisionOrderForm } from 'src/core/models/provision-order'
import { getListCivilMass } from 'src/core/store/modules/civil-mass/selectors'
import { fetchCivilMassList } from 'src/core/store/modules/civil-mass/thunks'
import { getProvisionsProcess } from 'src/core/store/modules/provision-order/selectors'
import { FOLDER_STATUS } from "src/screen/settings/constants";

import { ORDER_EXPECTATIONS, CONTINGENCY } from '../utils/constantes'
import { clearOrderToEdit } from 'src/core/store/modules/provision-order'
import { getOrderRatingForm } from '../utils/func'

export default function useManageFormFields() {
	const dispatch = useDispatch()
	const formikRef = useRef<FormikProps<TProvisionOrderForm>>(null)

	const [currentOrderDescriptionId, setCurrentOrderDescriptionId] = useState<number | "">("")
	const [predefinedValues, setPredefinedValues] = useState<Partial<TProvisionOrderForm>>({})

	const { legalDepartmentAreaId, statusId, contingency } = useSelector(getProvisionsProcess)
	const civilMassList = useSelector(getListCivilMass)

	const setFormValues = useCallback(
		(overrideValues: Partial<TProvisionOrderForm>) => overrideFormikValues(formikRef, overrideValues),
	[])

	useEffect(() => {
		const loadedValues = civilMassList.find(cm => cm.orderDescriptionId === currentOrderDescriptionId)
		const orderExpectationId = contingency === CONTINGENCY.PASSIVA
			? ORDER_EXPECTATIONS.PERDA : contingency === CONTINGENCY.ATIVA
			? ORDER_EXPECTATIONS.GANHO : '';
		if (loadedValues) {
			setPredefinedValues({
				orderDescriptionId: loadedValues?.orderDescriptionId || '',
				orderExpectationId,
				orderProbabilityId: loadedValues?.orderProbabilityId || '',
				createdDate: new Date(),

				orderRatingDescriptionId: loadedValues?.orderRatingDescriptionId || '',
				riskValue: 0,
				probableValue: loadedValues?.orderProbabilityId === 1 ? loadedValues?.value : 0 || 0,
				possibleValue: loadedValues?.orderProbabilityId === 2 ? loadedValues?.value : 0 || 0,
				remoteValue: loadedValues?.orderProbabilityId === 3 ? loadedValues?.value : 0 || 0,
				dataBase: loadedValues ? new Date() : null,
				formulaCorrectionRuleId: loadedValues?.formulaCorrectionRuleId || '',
			})
		}
		else {
			dispatch(clearOrderToEdit())
			const emptyOrderRatingForm = getOrderRatingForm()
			if (currentOrderDescriptionId)
				setFormValues({...emptyOrderRatingForm, createdDate: new Date()})
			else
				setFormValues(emptyOrderRatingForm)
			setPredefinedValues({ orderExpectationId })
		}
	}, [civilMassList, contingency, currentOrderDescriptionId, dispatch, setFormValues])

	useEffect(() => {
		if (Object.keys(predefinedValues).length > 0)
			overrideFormikValues(formikRef, predefinedValues)
	}, [predefinedValues])

	useEffect(() => {
		if (legalDepartmentAreaId && statusId)
			dispatch(fetchCivilMassList({
				dejurArea: legalDepartmentAreaId,
				folderStatus: FOLDER_STATUS.ACTIVE,
				isActive: true,
				page: 1,
				pageSize: 100
			}))
	}, [dispatch, legalDepartmentAreaId, statusId])

	const onChangeOrderDescription = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
		setCurrentOrderDescriptionId(Number(event.target.value))
	}, [])

	const clearOrderDescription = useCallback(() => setCurrentOrderDescriptionId(""), [])

	return {
		formikRef,
		setFormValues,
		onChangeOrderDescription,
		clearOrderDescription
	}
}

export function useManageFormFieldsProvision() {
	const dispatch = useDispatch()
	const formikRef = useRef<FormikProps<TProvisionOrderForm>>(null)

	const [currentOrderDescriptionId, setCurrentOrderDescriptionId] = useState<number | "">("")
	const [predefinedValues, setPredefinedValues] = useState<Partial<TProvisionOrderForm>>({})

	const { legalDepartmentAreaId, statusId, contingency } = useSelector(getProvisionsProcess)
	const civilMassList = useSelector(getListCivilMass)

	const setFormValues = useCallback(
		(overrideValues: Partial<TProvisionOrderForm>) => overrideFormikValues(formikRef, overrideValues),
	[])

	useEffect(() => {
		const loadedValues = civilMassList.find(cm => cm.orderDescriptionId === currentOrderDescriptionId)
		const orderExpectationId = contingency === CONTINGENCY.PASSIVA
			? ORDER_EXPECTATIONS.PERDA : contingency === CONTINGENCY.ATIVA
			? ORDER_EXPECTATIONS.GANHO : '';
		if (loadedValues) {
			setPredefinedValues({
				orderDescriptionId: loadedValues?.orderDescriptionId || '',
				orderExpectationId,
				orderProbabilityId: loadedValues?.orderProbabilityId || '',

				orderRatingDescriptionId: loadedValues?.orderRatingDescriptionId || '',
				riskValue: 0,
				probableValue: loadedValues?.orderProbabilityId === 1 ? loadedValues?.value : 0 || 0,
				possibleValue: loadedValues?.orderProbabilityId === 2 ? loadedValues?.value : 0 || 0,
				remoteValue: loadedValues?.orderProbabilityId === 3 ? loadedValues?.value : 0 || 0,
				dataBase: loadedValues ? new Date() : null,
				formulaCorrectionRuleId: loadedValues?.formulaCorrectionRuleId || '',
			})
		}
		else {
			dispatch(clearOrderToEdit())
			const emptyOrderRatingForm = getOrderRatingForm()
			setFormValues(emptyOrderRatingForm)
		}
	}, [civilMassList, contingency, currentOrderDescriptionId, dispatch, setFormValues])

	useEffect(() => {
		if (Object.keys(predefinedValues).length > 0)
			overrideFormikValues(formikRef, predefinedValues)
	}, [predefinedValues])

	useEffect(() => {
		if (legalDepartmentAreaId && statusId)
			dispatch(fetchCivilMassList({
				dejurArea: legalDepartmentAreaId,
				folderStatus: FOLDER_STATUS.ACTIVE,
				isActive: true,
				page: 1,
				pageSize: 100
			}))
	}, [dispatch, legalDepartmentAreaId, statusId])

	const onChangeOrderDescription = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
		setCurrentOrderDescriptionId(Number(event.target.value))
	}, [])

	const clearOrderDescription = useCallback(() => setCurrentOrderDescriptionId(""), [])

	return {
		formikRef,
		setFormValues,
		onChangeOrderDescription,
		clearOrderDescription
	}
}

const overrideFormikValues = (
	ref: RefObject<FormikProps<TProvisionOrderForm>>,
	overrideValues: Partial<TProvisionOrderForm>,
) => {
	if (ref.current) {
		const { resetForm, values } = ref.current
		resetForm({ values: { ...values, ...overrideValues } })
	}
}
