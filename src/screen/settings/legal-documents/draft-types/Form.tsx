import { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FormikHelpers } from 'formik'
import { useSnackbar } from 'notistack'
import { Box, Button, CircularProgress, Grid } from '@material-ui/core'

import ScreenTemplate from 'src/components/Screen'
import Form, { SelectField, TextField, Upload } from 'src/components/form'
import Panel from 'src/components/Panel'
import Submit from 'src/components/button/Submit'
import AccordionPanel from 'src/components/AccordionPanel'
import { useRegisterDefault } from 'src/hooks'
import {
	getBlocks,
	getErrorMessageLegalDocDraftTypes as getErrorMessage,
	getItemLegalDocDraftTypes,
	getLoadingLegalDocDraftTypes,
	getStatusLegalDocDraftTypes as getStatus,
	getVariables,
} from 'src/core/store/modules/legal-document-draft-types/selectors'
import {
	addLegalDocDraftTypes,
	deleteFileLegalDocDraftTypes,
	editLegalDocDraftTypes,
	getLegalDocDraftTypes,
	uploadFileLegalDocDraftTypes,
} from 'src/core/store/modules/legal-document-draft-types/thunks'
import { actions, AppDispatch } from 'src/core/store'
import { t } from 'src/locale/i18n'

import { LegalDocFormType, legalDocFormTypeOptions } from '../utils/constants'
import BlocksTable from './components/BlocksTable'
import VariablesTable from './components/VariablesTable'
import { Variable } from 'src/core/models/legal-document-draft-types'
import { setBlocksAndVariables} from 'src/core/store/modules/legal-document-draft-types'
import { PayloadAction } from '@reduxjs/toolkit'

type RealForm = {
	name: string
	legalDocumentFormType: LegalDocFormType | ''
	files?: any[]
}

type AdditionalForm = {
	blockName: string
	blockValue: string
	variableName: string
	tableId: number | ''
	variableId: number | ''
	blockId: number | ''
}

export type DraftTypeCompleteForm = RealForm & AdditionalForm

const additionalFormFields: AdditionalForm = {
	blockName: '',
	blockValue: '',
	variableName: '',
	tableId: '',
	variableId: '',
	blockId: ''
}

const defaultValues: DraftTypeCompleteForm = {
	name: '',
	legalDocumentFormType: '',
	files: [],
	...additionalFormFields,
}

const initialTouched = {
	blockName: true,
	blockValue: true,
	variableName: true,
	legalDocumentTableVariableId: true,
	recordIndex: true,
	legalDocumentDraftTypeBlockId: true
}

export default function DraftTypesForm() {
	const dispatch = useDispatch<AppDispatch>()
	const { enqueueSnackbar } = useSnackbar()
	const { id } = useParams<{ id: string }>()
	const history = useHistory()

	useRegisterDefault({
		action: 'legalDocDraftTypes',
		getStatus,
		getErrorMessage,
	})

	const item = useSelector(getItemLegalDocDraftTypes)
	const isLoading = useSelector(getLoadingLegalDocDraftTypes)
	const blocks = useSelector(getBlocks)
	const variables = useSelector(getVariables)

	const isNew = id === 'novo'
	const initialValues = item ? { ...item, ...additionalFormFields } : defaultValues

	useEffect(() => {
		const idNumber = parseInt(id)
		if (!item && !isNaN(idNumber))
			dispatch(getLegalDocDraftTypes({ id: idNumber }))
		if (item) {
			dispatch(setBlocksAndVariables({
				blocks: item.blocks,
				variables: item.variables,
			}))
		}
	}, [dispatch, id, item])

	useEffect(() => () => {
		dispatch(actions.legalDocDraftTypes.setItem(undefined))
		dispatch(setBlocksAndVariables({
			blocks: [],
			variables: [],
		}))
	}, [dispatch])

	const handleDeleteFile = (file: any) => {
		file?.id && dispatch(deleteFileLegalDocDraftTypes(file.id));
	};

	const onSubmit = async (values: DraftTypeCompleteForm, { setSubmitting }: FormikHelpers<DraftTypeCompleteForm>) => {
		const variablesWithouBlocks: Variable[] = []
		const variableMap = new Map<number | string, Variable[]>()

		// sort variables by blocks
		variables.forEach(variable => {
			const {legalDocumentDraftTypeBlockId, transientBlockId} = variable
			if (legalDocumentDraftTypeBlockId) {
				if(!variableMap.has(legalDocumentDraftTypeBlockId))
					variableMap.set(legalDocumentDraftTypeBlockId, [])
				variableMap.get(legalDocumentDraftTypeBlockId)?.push(variable)
			}
			else if (transientBlockId) {
				if(!variableMap.has(transientBlockId))
					variableMap.set(transientBlockId, [])
				variableMap.get(transientBlockId)?.push(variable)
			}
			else {
				variablesWithouBlocks.push(variable)
			}
		})

		// append variables by block
		const blockWithVariables = blocks.map(block => {
			let variables: Variable[] = []
			if (block.id && variableMap.has(block.id))
				variables = variableMap.get(block.id)!
			if (block.transientId && variableMap.has(block.transientId))
				variables = variableMap.get(block.transientId)!
			return {
				...block,
				variables,
			}
		})

		const { name, legalDocumentFormType, files } = values
		const data = {
			name,
			legalDocumentFormType,
			blocks: blockWithVariables,
			variables: variablesWithouBlocks,
		}

		// Choose create or update method
		let saveRequest: () => Promise<PayloadAction<any>>
		if (isNew) saveRequest = async () => await dispatch(addLegalDocDraftTypes({ ...data, isActive: true }))
		if (item) saveRequest = async () => await dispatch(editLegalDocDraftTypes({ ...item, ...data }))

		const { type, payload } = await saveRequest!()
		if (type.endsWith('/rejected')) {
			enqueueSnackbar(payload?.detail || t('anErrorHasOcurred'), { variant: 'error' })
			setSubmitting(false)
			return
		}

		// Upload attached files
		if (files?.length) {
			const { type } = await dispatch(uploadFileLegalDocDraftTypes({
				draftTypeId: item?.id || payload.id,
				files: files as unknown as FileList
			}))

			if (type.endsWith('/rejected')) {
				enqueueSnackbar(payload?.detail || t('anErrorHasOcurred'), {
					variant: 'error',
					autoHideDuration: 6000
				})
			}
		}
		setSubmitting(false)
	}

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				initialTouched={initialTouched}
				onSubmit={onSubmit}
			>
				{({ dirty, handleSubmit, isSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={t('legalDocs:draftTypes.formTitle')}
							withPadding
						>
							{isLoading && <CircularProgress />}
							{!isLoading && (
								<Grid container spacing={3}>
									<Grid item md={3} xs={12}>
										<TextField
											required
											name='name'
											label={t('legalDocs:draftTypes.field.draftType')}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											required
											label={t('legalDocs:draftTypes.field.formType')}
											name="legalDocumentFormType"
											options={legalDocFormTypeOptions}
										/>
									</Grid>
								</Grid>
							)}
						</Panel>

						<BlocksTable />

						<VariablesTable />

						<AccordionPanel title={t('form.attachments')} startExpanded>
							<Upload
								multiple
								name="files"
								confirmDeletion
								onDelete={handleDeleteFile}
							/>
						</AccordionPanel>

						<Box marginY={4} display="flex" justifyContent="flex-end">
							<Button
								color="default"
								onClick={() => history.goBack()}
							>
								{t('cancel')}
							</Button>
							<Submit
								submitting={isSubmitting}
								isNew={isNew}
								style={{ marginLeft: '16px' }}
							/>
						</Box>
					</form>
				)}
			</Form>
		</ScreenTemplate >
	)
}
