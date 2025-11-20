import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { useSnackbar } from 'notistack'

import ScreenTemplate from 'src/components/Screen'
import ProcessDataPanel from 'src/components/ProcessDataPanel'
import { Button } from 'src/components/button'
import useBoolean from 'src/hooks/useBoolean'
import { fetchProvisionsProcess, fetchProvisionsProcessByCsv } from 'src/core/store/modules/provision-order/thunks'
import { getProvisionsProcess, getProvisionsProcessLoading } from 'src/core/store/modules/provision-order/selectors'
import { useTranslation } from 'src/locale/i18n'
import { updateValues } from 'src/core/store/modules/provision/thunks'
import { AppDispatch } from 'src/core/store'

import Search from '../components/Search'
import { clearProvisionProcess } from 'src/core/store/modules/provision-order'
import AccordionPanel from 'src/components/AccordionPanel'
import Table from 'src/components/Table'
import Pagination from 'src/components/Pagination'
import { usePagination } from 'src/hooks/pagination'
import { FOLDER_STATUS } from 'src/screen/settings/constants'

type FolderError = {
	folderNumber: string
	error: string
}

export default function UpdatedValues() {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>()
	const { enqueueSnackbar } = useSnackbar()
	const [errors, setErrors] = useState<FolderError[]>([])
	const pagination = usePagination()

	const process = useSelector(getProvisionsProcess)
	const isFetchingProcess = useSelector(getProvisionsProcessLoading)
	const { folderNumber } = process

	const [isSubmitting, { setTrue, setFalse }] = useBoolean(false)

	useEffect(() => () => {
		dispatch(clearProvisionProcess())
	}, [dispatch])

	const onSearch = async (folderNumber: string, formFile?: FileList) => {
		if (!formFile) {
			const { meta, payload } = await dispatch(fetchProvisionsProcess(folderNumber))
			if (meta.requestStatus === "rejected") {
				const errorMsg = typeof payload === 'string' ? payload :
					payload.status === 404 ? "Pasta/CTG informada não existe" : t("anErrorHasOcurred")

				enqueueSnackbar(errorMsg, { variant: "error" })
			}
			if (payload.statusId === FOLDER_STATUS.DEAD) {
				enqueueSnackbar('Pasta CTG com status Morto', { variant: "error" })
			}
		} else {
			setErrors([])
			const { meta, payload } = await dispatch(fetchProvisionsProcessByCsv(formFile))

			if (meta.requestStatus === "rejected" && payload.status === 422) {
				setErrors(payload.errors)
			}

			if (meta.requestStatus === "fulfilled") {
				enqueueSnackbar(t("provisions:updateValues.fileSuccess"), { variant: 'success' })
			}
		}
	}

	const onProcess = async () => {
		setTrue()
		const { type, payload } = await dispatch(updateValues(folderNumber))

		if (type === 'provision/updateValues/rejected')
			enqueueSnackbar(payload?.error.detail || t('anErrorHasOcurred'), { variant: 'error' })
		if (type === 'provision/updateValues/fulfilled')
			enqueueSnackbar(t('successfulOperation'), { variant: 'success' })
		setFalse()
	}

	const errorColumns = useMemo(() => [
		{
			label: "Pasta/CTG",
			field: "folderNumber"
		},
		{
			label: "Descrição do LOG",
			field: "error"
		}
	], [])

	const isProcessable = process.statusId !== FOLDER_STATUS.DEAD
	const hasProcess = Boolean(Object.keys(process).length)
	return (
		<ScreenTemplate>
			<Search
				title={t('provisions:updateValues.title')}
				onSearch={onSearch}
				isLoading={isFetchingProcess}
				file
			/>
			{hasProcess && (
				<ProcessDataPanel
					process={process}
					loading={isFetchingProcess}
					startExpanded
				/>
			)}
			{
				errors.length !== 0 && (
					<>
						<AccordionPanel
							title={t('provisions:updateValues.errors')}
							noContentMargin
							startExpanded
						>
							<Table
								columns={errorColumns}
								rows={errors.slice((pagination.page - 1) * pagination.pageSize, pagination.pageSize)}
							/>
						</AccordionPanel>
						<Pagination pageCount={errors.length / pagination.pageSize} />
					</>
				)
			}
			<Box display="flex" justifyContent="flex-end" pt={4}>
				<Button
					submitting={isSubmitting}
					disabled={!hasProcess || !isProcessable}
					onClick={onProcess}
					text={t('provisions:updateValues.button.process')}
				/>
			</Box>

		</ScreenTemplate>
	)
}