import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ScreenTemplate from 'src/components/Screen'
import {
	getErrorProcess,
	getProvisionsProcess,
	getProvisionsProcessChecks,
	getProvisionsProcessRequestScreenLoading,
} from 'src/core/store/modules/provision-order/selectors'
import { getListOrderConfronting } from 'src/core/store/modules/order-confronting-parameters/selectors'
import { FOLDER_STATUS } from "src/screen/settings/constants"
import { clearProvisionProcess } from 'src/core/store/modules/provision-order'
import { checkHasJudicialDepositPending, checkHasPaymentPending, fetchProvisionsProcess, checkProcessHasBlockAndTransferPending } from 'src/core/store/modules/provision-order/thunks'
import { fetchOrderConfrontings } from 'src/core/store/modules/order-confronting-parameters/thunks'
import { t } from 'src/locale/i18n'
import ProcessFormData from "src/components/ProcessFormData";

import Search from '../components/Search'
import TotalOrderRatingTable from '../components/TotalOrderRatingTable'
import ProvisionForm from '../components/ProvisionForm'
import ConfronterForm from '../components/ConfronterForm'
import OrderTable from '../components/OrderTable'
import useManageProvisionFormFields from '../hooks/use-manage-provision-form-fields'
import { CLASSIC_PROVISION_CLASS } from '../utils/constantes'
import { getOrders } from "src/core/store/modules/provision-order/selectors";
import { getDataCurrentUser } from 'src/core/store/modules/currentUser/selectors'
import { fetchESocialEventLauch } from 'src/core/store/modules/e-social-event-launch/thunks'
import { getListESocialEventLauch } from 'src/core/store/modules/e-social-event-launch/selectors'

const ProvisionRequest = () => {
	const dispatch = useDispatch();
	const {
		formikRef,
		setFormValues,
		onChangeOrderDescription,
		clearOrderDescription
	} = useManageProvisionFormFields()
	const orders: any[] = useSelector(getOrders);
	const filtredAccountingError = orders.filter(({orderStatus}) => orderStatus.id === 5)
	const [hasSearched, setHasSearched] = useState(false)

	const process = useSelector(getProvisionsProcess)
	const processError = useSelector(getErrorProcess)
	const listESocialEventLauch = useSelector(getListESocialEventLauch) as any[]
	const { responsibleAreas, dejurAreas } = useSelector(getDataCurrentUser);

	const isLoading = useSelector(getProvisionsProcessRequestScreenLoading)
	const { hasDepositPending, hasPaymentPending, hasBlockAndTransferPendingBool } = useSelector(getProvisionsProcessChecks)
	const confrontingParameters = useSelector(getListOrderConfronting)
	const hasCTGFolder = !isLoading && Object.keys(process).length > 0
	const [toActive, setToActive] = useState<boolean>(false)

	const onSearch = useCallback(async (folderNumber) => {
		await dispatch(clearProvisionProcess())
		dispatch(fetchProvisionsProcess(folderNumber))
		dispatch(checkHasJudicialDepositPending(folderNumber))
		dispatch(checkHasPaymentPending(folderNumber))
		dispatch(checkProcessHasBlockAndTransferPending(folderNumber))	
		dispatch(fetchESocialEventLauch({page: 1, folderNumber: folderNumber}))
	}, [dispatch])

	useEffect(() => {
		if (!hasSearched && isLoading)
			setHasSearched(true)
	
	}, [isLoading])

	useEffect(() => {
		const { legalDepartmentAreaId } = process
		legalDepartmentAreaId !== undefined && dispatch(fetchOrderConfrontings({ idAreaDejur: legalDepartmentAreaId }))
	}, [dispatch, process])

	useEffect(() => () => {
		dispatch(clearProvisionProcess())
	}, [dispatch])

	const alert = []
	const { isPendingOnTheConfronter } = process

	let hasAreaDejurInactive = true
	if (confrontingParameters.length) {
		const { isActive } = confrontingParameters[0]
		hasAreaDejurInactive = !isActive
	}

	const isProcessWritable = process.statusId === FOLDER_STATUS.ACTIVE
	&& (
		process.provisionClass === CLASSIC_PROVISION_CLASS
	)

	const isEditable = isProcessWritable && !isPendingOnTheConfronter
		&& !hasDepositPending && !hasPaymentPending && !isLoading && !hasBlockAndTransferPendingBool 
		&& filtredAccountingError.length === 0
	if (hasSearched && !isLoading) {
		if (!hasCTGFolder || processError.detail !== undefined) { 
			if (processError.detail !== undefined) alert.push(processError.detail)
			else alert.push(t('provisions:request.alert.noCTGFolder'))
		} else {
			if (!dejurAreas?.includes(process.legalDepartmentAreaId) || !responsibleAreas?.includes(process.responsibleAreaId)){
				if (!dejurAreas?.includes(process.legalDepartmentAreaId)) alert.push("Você não possui acesso a essa área DEJUR")
				if (!responsibleAreas?.includes(process.responsibleAreaId)) alert.push("Você não possui acesso a esse escritório")
			}
			if (filtredAccountingError.length !== 0) alert.push(t('provisions:request.alert.accountingWithError'))
			if (hasDepositPending) alert.push(t('provisions:request.alert.hasPendingDeposite')) 
			if (hasPaymentPending) alert.push(t('provisions:request.alert.hasPendingPayments'))
			if (hasBlockAndTransferPendingBool) alert.push(t('provisions:request.alert.hasBlockAndTransferPending'))
			if (!isProcessWritable) alert.push(t('provisions:request.alert.processNotWritable'))
			if (isPendingOnTheConfronter) alert.push(t('provisions:request.alert.pendingConfronter'))
			if (hasAreaDejurInactive && responsibleAreas?.includes(process.responsibleAreaId)) alert.push(t('provisions:request.alert.noParamsRegistered'))
			if (listESocialEventLauch.some((item: any) => item.eventLaunchStatus !== 4)) alert.push("Pasta/CTG possui um processo e-Social em andamento.")
		}
	}
	return (
		<ScreenTemplate>
			<Search
				title={t('provisions:request.searchTitle')}
				onSearch={onSearch}
				isLoading={isLoading}
				message={alert.join("; ")}
				generateGps
			/>

			{hasCTGFolder && 
				dejurAreas?.includes(process.legalDepartmentAreaId) && 
				responsibleAreas?.includes(process.responsibleAreaId) && (
				<>
					<ProcessFormData doViaFolderNumber folderNumber={process?.folderNumber ?? ''} />

					<OrderTable
						setToActive={setToActive}
						process={process}
						setFormValues={setFormValues}
						isLoading={isLoading}
						isEditable={isEditable}
					/>

					<TotalOrderRatingTable />

					<ProvisionForm
						formikRef={formikRef}
						isEditable={isEditable}
						setFormValues={setFormValues}
						onChangeOrderDescription={onChangeOrderDescription}
						clearOrderDescription={clearOrderDescription}
						setToActive={setToActive}
					/>
					<ConfronterForm
						isEditable={isEditable}
						setHasSearched={setHasSearched}
						hasAreaDejurInactive={hasAreaDejurInactive}
						toActive={toActive}
					/>
				</>
			)}
		</ScreenTemplate>
	)
}

export default ProvisionRequest
