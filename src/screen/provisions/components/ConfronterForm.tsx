import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { useSnackbar } from 'notistack'

import AccordionPanel from 'src/components/AccordionPanel'
import { Button } from 'src/components/button'
import useBoolean from 'src/hooks/useBoolean'
import { getProvisionsProcess, getOrders, getIsOrdersChanged } from 'src/core/store/modules/provision-order/selectors'
import { updateProvisionsProcess } from 'src/core/store/modules/provision-order/thunks'
import { clearProvisionProcess } from 'src/core/store/modules/provision-order'
import { t } from 'src/locale/i18n'
import { AppDispatch } from 'src/core/store'

import ConfronterLog from './ConfronterLog'

const buttonStyle = { marginLeft: '16px' }

type ConfronterFormProps = {
	isEditable: boolean
	setHasSearched: (state: boolean) => void
	hasAreaDejurInactive: boolean;
	toActive?: boolean;
}

export default function ConfronterForm({ hasAreaDejurInactive, isEditable, setHasSearched, toActive }: ConfronterFormProps) {
	const dispatch = useDispatch<AppDispatch>()
	const { enqueueSnackbar } = useSnackbar()

	const [isSubmitting, { setTrue, setFalse }] = useBoolean(false)

	const process = useSelector(getProvisionsProcess)
	const orders = useSelector(getOrders)
	const isOrdersChanged = useSelector(getIsOrdersChanged)

	const handleSendToConfronter = async () => {
		setTrue()
		const processToSend = { ...process, orders }
		const { meta, payload } = await dispatch(updateProvisionsProcess(processToSend)) 

		if (meta.requestStatus === 'rejected')
			enqueueSnackbar(payload?.detail || t('anErrorHasOcurred'), {
				variant: 'error',
				autoHideDuration: 6000
			})

		enqueueSnackbar(payload || t('successfulOperation'), { variant: 'success' })
		dispatch(clearProvisionProcess())
		setFalse()
	}

	return (
		<>
			<AccordionPanel title="Log do confrontador">
				<ConfronterLog folderNumber={process.folderNumber} />
			</AccordionPanel>

			<Box marginY={4} display="flex" justifyContent="flex-end">
				<Button
					color="default"
					onClick={() => {
						setHasSearched(false)
						dispatch(clearProvisionProcess())
					}}
					text={t('cancel')}
				/>
				<Button
					submitting={isSubmitting}
					disabled={!isEditable || hasAreaDejurInactive  || !isOrdersChanged || toActive }
					style={buttonStyle}
					text={t('provisions:request.button.sendConfronter')}
					onClick={() => {
						handleSendToConfronter()
						setHasSearched(false)
					}}
				/>
			</Box>
		</>
	)
}
