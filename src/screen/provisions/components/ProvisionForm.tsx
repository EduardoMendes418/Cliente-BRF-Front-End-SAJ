import { ChangeEvent, RefObject, useState } from 'react'
import { Box, Button as Btn, Divider, Grid, IconButton, Typography } from '@material-ui/core'
import { Formik, FormikHelpers, FormikProps } from 'formik'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'

import AccordionPanel from 'src/components/AccordionPanel'
import { CurrencyField, DateField, SelectField } from 'src/components/form'
import { Submit } from 'src/components/button'
import { useFormulaCorrectionRule } from 'src/hooks/fetchLists'
import { t } from 'src/locale/i18n'
import {
	TProvisionOrderForm,
	TProvisionOrder,
	TOrderRatingForm,
	TOrderFile,
	TTreatedOrderForm
} from 'src/core/models/provision-order'
import {
	getRatings,
	getOrderOnEdit,
	getOrders,
	getBlockedData,
	getProvisionsProcess
} from 'src/core/store/modules/provision-order/selectors'
import {
	addOrder,
	addOrderRating,
	clearOrderToEdit,
	editOrder,
	editOrderRating,
} from 'src/core/store/modules/provision-order'
import { getListOrderDescription } from 'src/core/store/modules/order-description/selectors'
import useOptionsList from 'src/hooks/useProvisionFilterOptions'
import useBoolean from 'src/hooks/useBoolean'
import { alert } from 'src/components/modals'

import {
	getDescription,
	getOrderForm,
	getOrderRatingForm,
	validateOrderRatingsValues,
	validateRequiredFields,
	generateOrderRatingsFromForm,
	checkOrderFormChanged,
	convertNewFileToOrderFile,
} from '../utils/func'
import { SUBMITION_TYPE } from '../utils/constantes'
import OrderRatingTable from './OrderRatingTable'
import OrderAttachments from './OrderAttachments'
import { useSnackbar } from 'notistack'

const buttonStyle = { marginLeft: '16px' }

export const initialValues: TProvisionOrderForm = {
	...getOrderForm(),
	...getOrderRatingForm(),
	orderStatusId: 1
}

type Props = {
	formikRef: RefObject<FormikProps<TProvisionOrderForm>>,
	onChangeOrderDescription: (event: ChangeEvent<HTMLSelectElement>) => void
	setFormValues: (overrideValues: Partial<TProvisionOrderForm>) => void
	clearOrderDescription: () => void
	isEditable: boolean
	setToActive?: any;
}

const ProvisionForm = ({ formikRef, onChangeOrderDescription, setFormValues, clearOrderDescription, isEditable, setToActive }: Props) => {
	const dispatch = useDispatch()

	const [isOrderRatingOnEdit, { setTrue: enableEditingOrderRating, setFalse: disableEditinOrderRating }] = useBoolean(false)

	const orders = useSelector(getOrders);
	const ratings = useSelector(getRatings);
	const { enqueueSnackbar } = useSnackbar();
	const orderOnEdition = useSelector(getOrderOnEdit);
	const { legalDepartmentAreaId } = useSelector(getProvisionsProcess);
	const { isFormBlocked } = useSelector(getBlockedData);
	const orderDescriptions = useSelector(getListOrderDescription);
	const [ dataBaseDisabled, setDataBaseDisabled ] = useState<boolean>(false);

	const {
		orderDescriptionOptions,
		orderExpectationOptions,
		orderProbabilityOptions,
		orderRatingDescriptionOptions,
		orderStatusOptions
	} = useOptionsList(legalDepartmentAreaId, true)
	const { formulaCorrectionRuleAsOptions } = useFormulaCorrectionRule()

	const isOrderOnEdit = Boolean(orderOnEdition)

	const handleAddNewOrder = async (values: TTreatedOrderForm) => {
		dispatch(addOrder({
			...values,
			orderDescription: {
				name: getDescription(orderDescriptionOptions, values.orderDescriptionId),
				sumProvision: orderDescriptions.find(od => od.id === values.orderDescriptionId)?.sumProvision ?? false,
			},
			orderExpectation: { name: getDescription(orderExpectationOptions, values.orderExpectationId) },
			/* orderProbability: { name: getDescription(orderProbabilityOptions, values.orderProbabilityId) }, */
			orderStatus: { name: getDescription(orderStatusOptions, values.orderStatusId) },
			isActive: true,
			transientId: v4(),
			orderRatings: ratings
		} as TProvisionOrder))
		const emptyForm = { ...getOrderForm(), ...getOrderRatingForm() }
		setFormValues(emptyForm)
	}

	const handleEditOrder = async (values: TTreatedOrderForm) => {
		dispatch(editOrder({
			...orderOnEdition,
			...values,
			orderRatings: ratings,
			orderExpectation: { name: getDescription(orderExpectationOptions, values.orderExpectationId) },
			/* orderProbability: { name: getDescription(orderProbabilityOptions, values.orderProbabilityId) }, */
			hasChanged: true
		} as TProvisionOrder))
		dispatch(clearOrderToEdit())
		const emptyForm = { ...getOrderForm(), ...getOrderRatingForm() }
		setFormValues(emptyForm)
	}

	const handleAddNewOrderRating = (values: TProvisionOrderForm) => {
		const orderRatingForm = getOrderRatingForm(values)
		const description = getDescription(orderRatingDescriptionOptions, values.orderRatingDescriptionId)!
		const formula = getDescription(formulaCorrectionRuleAsOptions, values.formulaCorrectionRuleId)!
		const status = getDescription(orderStatusOptions, values.orderStatusId)!
		const newOrderRatings = generateOrderRatingsFromForm(orderRatingForm, v4(), description, formula, status)

		dispatch(addOrderRating(newOrderRatings))
		const emptyOrderRatingForm = getOrderRatingForm()
		setFormValues(emptyOrderRatingForm)
	}

	const handleEditOrderRating = (values: TProvisionOrderForm) => {
		const orderRatingForm = getOrderRatingForm(values)
		const editedOrderRating = {
			...orderRatingForm,
			formulaCorrectionRule: { formulaName: getDescription(formulaCorrectionRuleAsOptions, values.formulaCorrectionRuleId) },
			hasChanged: true
		} as TOrderRatingForm

		dispatch(editOrderRating(editedOrderRating))
		disableEditinOrderRating()
		const emptyOrderRatingForm = getOrderRatingForm()
		setFormValues(emptyOrderRatingForm)
	}

	const onSubmit = async (values: TProvisionOrderForm, { setSubmitting, resetForm }: FormikHelpers<TProvisionOrderForm>) => {

		const submissionType = (document.activeElement as any)?.dataset.flag
		try {
			const hasLongFileName = values?.orderFiles?.some((file: any) => (file?.name?.length || 0) > 119);
			if (hasLongFileName) {
				return enqueueSnackbar(
					t("goodsAndGuarantees:characterLimiterWarningMessage"),
					{ variant: "error" }
				);
			}

		} catch (error) {
			console.error(error)
		}


		if (submissionType === SUBMITION_TYPE.ORDER
			&& !isOrderOnEdit
			&& orders.some(o => o.orderDescriptionId === values.orderDescriptionId)) {
			alert(t('provisions:request.errors.duplicatedDescriptions'), t('provisions:request.errors.invalidValues'))
			setSubmitting(false)
			return
		}

		if (submissionType === SUBMITION_TYPE.ORDER) {
			const { orderFiles, ...orderForm } = values
			let treatedOrderFiles: TOrderFile[] = []
			try {
				treatedOrderFiles = await convertNewFileToOrderFile(orderFiles)
			} catch (err) {
				alert(t('provisions:request.errors.attachments'))
				setSubmitting(false)
				return
			}

			const handleFunction = isOrderOnEdit ? handleEditOrder : handleAddNewOrder
			await handleFunction({ ...orderForm, orderFiles: treatedOrderFiles })
			setSubmitting(false)
			setToActive(false)
			return
		}

		if (submissionType === SUBMITION_TYPE.ORDER_RATING
			&& !isOrderRatingOnEdit
			&& ratings.filter((or) => or.orderRatingDescriptionId === values.orderRatingDescriptionId).length >= 3) {
			alert(t('provisions:request.errors.duplicatedDescriptions'), t('provisions:request.errors.invalidValues'))
			setSubmitting(false)
			return
		}

		 if (submissionType === SUBMITION_TYPE.ORDER_RATING) {
			const errors = validateOrderRatingsValues(values, isOrderRatingOnEdit)
			if (errors.length) {
				alert(errors[0], t('provisions:request.errors.invalidValues'))
				setSubmitting(false)
				return
			}
		} 

		if (submissionType === SUBMITION_TYPE.ORDER_RATING) {
			const errors = validateOrderRatingsValues(values, isOrderRatingOnEdit)
			if (errors.length) {
				alert(errors[0], t('provisions:request.errors.invalidValues'))
				setSubmitting(false)
				return
			}
		}

		const handleFunction = isOrderRatingOnEdit ? handleEditOrderRating : handleAddNewOrderRating
		handleFunction(values)
		setSubmitting(false)
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	const onChangeOrderRatingDescriptionId = (event: any, setFieldValue: Function) => {
		if(event === 3){
			setDataBaseDisabled(true);
			 setFieldValue('dataBase', "2099-12-31");
		} else {
			setDataBaseDisabled(false)
			setFieldValue('dataBase', null);
		}
	}

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			enableReinitialize
			validateOnChange={false}
			validate={validateRequiredFields}
			innerRef={formikRef}
		>
			{({ handleSubmit, values, setFieldValue }) => (
				<form noValidate onSubmit={handleSubmit}>
					<AccordionPanel title={t('provisions:request.provisionRequestTitle')} startExpanded>
						<Grid container spacing={2}>
							<Grid item xs={12} md={3}>
								<SelectField
									label={`${t('provisions:fields.requestDescription')} *`}
									name="orderDescriptionId"
									disabled={isOrderOnEdit || isFormBlocked}
									readOnly={!isEditable}
									options={orderDescriptionOptions}
									onChange={onChangeOrderDescription}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<DateField
									label={t('provisions:fields.requestDate')}
									name="createdDate"
									disabled={isOrderOnEdit || isFormBlocked}
									readOnly={!isEditable}
									required={isEditable}
								/>
							</Grid>

							<Grid item xs={12} md={3}>
								<SelectField
									label={`${t('provisions:fields.expectation')} *`}
									name="orderExpectationId"
									options={orderExpectationOptions}
									readOnly={!isEditable}
									disabled={true}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									disabled
									label={t('provisions:fields.status')}
									name="orderStatusId"
									options={orderStatusOptions}
									readOnly={!isEditable}
								/>
							</Grid>
							{/* <Grid item xs={12} md={3}>
								<p>2</p>
								<SelectField
									label={`${t('provisions:fields.probability')} *`}
									name="orderProbabilityId"
									options={orderProbabilityOptions}
									readOnly={!isEditable}
									disabled={isFormBlocked}
								/>
							</Grid> */}
						</Grid>

						<OrderAttachments isEditable={isEditable} />

						<Grid container>
							<Grid item xs={12}>
								<Box marginX={0} marginY={3}>
									<Divider />
								</Box>
							</Grid>
						</Grid>

						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Box marginX={0} mb={1}>
									<Typography variant='h3'>
										{t('provisions:request.openingReleaseTitle')}
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={12}>
								<SelectField
									label={`${t('provisions:fields.openingDescription')} *`}
									name="orderRatingDescriptionId"
									disabled={isOrderRatingOnEdit || isFormBlocked}
									readOnly={!isEditable}
									options={orderRatingDescriptionOptions}
									onChange={(event: any) => onChangeOrderRatingDescriptionId(event.target.value, setFieldValue)}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<CurrencyField
									label={`${t('provisions:fields.forecastValue')}`}
									name="riskValue"
									readOnly={!isEditable}
									disabled={isFormBlocked}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<CurrencyField
									label={t('provisions:fields.probableValue')}
									name="probableValue"
									readOnly={!isEditable}
									disabled={isFormBlocked}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<CurrencyField
									label={t('provisions:fields.possibleValue')}
									name="possibleValue"
									readOnly={!isEditable}
									disabled={isFormBlocked}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<CurrencyField
									label={t('provisions:fields.remoteValue')}
									name="remoteValue"
									readOnly={!isEditable}
									disabled={isFormBlocked}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<DateField
									label={`${t('provisions:fields.baseDate')} *`}
									name="dataBase"
									readOnly={!isEditable}
									disabled={isFormBlocked || dataBaseDisabled ||  values.orderRatingDescriptionId === 3 ? true : false}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={`${t('provisions:fields.correctionIndex')} *`}
									name="formulaCorrectionRuleId"
									options={formulaCorrectionRuleAsOptions}
									readOnly={!isEditable}
									disabled={isFormBlocked}
								/>
							</Grid>
							{(isEditable && !isFormBlocked) && (
								<Grid item xs={12} md={3}>
									<IconButton
										type="submit"
										data-flag={SUBMITION_TYPE.ORDER_RATING}
										aria-label={isOrderRatingOnEdit ? 'Edit' : 'Add'}
										color='primary'
									>
										{isOrderRatingOnEdit ? <SaveOutlinedIcon /> : <AddOutlinedIcon />}
									</IconButton>
									<Btn
										variant="outlined"
										onClick={() => {
											disableEditinOrderRating()
											const emptyOrderRatingForm = getOrderRatingForm()
											setFormValues(emptyOrderRatingForm)
											clearOrderDescription()
											setDataBaseDisabled(false)
										}}
										style={buttonStyle}
									>
										{t('clear')}
									</Btn>
								</Grid>
							)}
						</Grid>

						<OrderRatingTable
							isEditable={isEditable && !isFormBlocked}
							setFormValues={setFormValues}
							enableEditingOrderRating={enableEditingOrderRating}
						/>

						<Grid item xs={12}>
							<Box mt={3} display="flex" justifyContent="flex-end">
								<Btn
									variant="outlined"
									onClick={() => {
										dispatch(clearOrderToEdit())
										disableEditinOrderRating()
										const emptyForm = { ...getOrderForm(), ...getOrderRatingForm() }
										setFormValues(emptyForm)
										clearOrderDescription()
									}}
								>
									{t('clear')}
								</Btn>
								{(isEditable && !isFormBlocked) && (
									<Submit
										data-flag={SUBMITION_TYPE.ORDER}
										style={buttonStyle}
										text={t(`provisions:request.button.${isOrderOnEdit ? 'edit' : 'add'}ProvisionRequest`)}
										disabled={
											ratings.length === 0
											|| (isOrderOnEdit ? !checkOrderFormChanged(values, ratings, orderOnEdition) : false)
										}
									/>
								)}
							</Box>
						</Grid>
					</AccordionPanel>
				</form>
			)}
		</Formik>
	)
}

export default ProvisionForm