import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
	addLegalDocDraftTypes,
	editLegalDocDraftTypes,
	fetchLegalDocDraftTypes,
	getLegalDocDraftTypes,
} from './thunks'
import { Block, TLegalDocDraftType, TLegalDocDraftTypeFilter, Variable, VariableForm } from 'src/core/models/legal-document-draft-types'
import { TState } from 'src/core/models'
import { clears, caseDefaultRegister, caseDefault } from '..'
import { v4 } from 'uuid'

export type TError = { detail: string }


export type TLegalDocDraftTypeState = {
	list: TLegalDocDraftType[]
	item?: TLegalDocDraftType
	listFilters: TLegalDocDraftTypeFilter
	blocks: Block[]
	blockOnEdition?: Block
	variables: Variable[]
	variableOnEdition?: Variable
	error?: TError
}

const initialState: TState & TLegalDocDraftTypeState = {
	status: 'initial',
	list: [],
	item: undefined,
	error: {} as TError,
	listFilters: {} as TLegalDocDraftTypeFilter,
	blocks: [],
	variables: [],
}

const slice = createSlice({
	name: 'legalDocDrafTypes',
	initialState,
	reducers: {
		...clears(initialState),

		setItem: (state, action: PayloadAction<TLegalDocDraftType>) => {
			state.item = action.payload
		},

		setFilters: (state, { payload }: PayloadAction<TLegalDocDraftTypeFilter>) => {
			state.listFilters = payload
		},

		setBlocksAndVariables: (state, action: PayloadAction<{ blocks: Block[], variables: Variable[] }>) => {
			const variableBlockIdToTransientId = new Map<number, string>()
			const { blocks, variables } = action.payload

			const newBlocks = blocks.map(block => {
				const transientId = v4()
				variableBlockIdToTransientId.set(block.id!, transientId)
				return { ...block, transientId }
			})

			const newVariables = variables.map((variable) => {
				const { legalDocumentDraftTypeBlockId } = variable
				const variableWithAdditionalData = { ...variable, transientId: v4() }
				if (legalDocumentDraftTypeBlockId)
					variableWithAdditionalData.transientBlockId = variableBlockIdToTransientId.get(legalDocumentDraftTypeBlockId)
				return variableWithAdditionalData
			})

			state.blocks = newBlocks
			state.variables = newVariables
		},
		setBlockOnEdition: (state, action: PayloadAction<Block>) => {
			state.blockOnEdition = action.payload
		},
		clearBlockOnEdition: (state) => {
			state.blockOnEdition = undefined
		},
		addBlock: (state, action: PayloadAction<{ name: string, value: string }>) => {
			state.blocks = [...state.blocks, {
				transientId: v4(),
				name: action.payload.name,
				value: action.payload.value,
				isActive: true,
				variables: []
			}]
		},
		editBlock: (state, action: PayloadAction<{ name: string, value: string }>) => {
			const transientIdOnEdition = state.blockOnEdition?.transientId
			const { name, value } = action.payload
			const newBlocks = state.blocks.map(item => item.transientId !== transientIdOnEdition ? item : { ...item, name, value })

			state.blocks = newBlocks
			state.blockOnEdition = undefined
		},
		changeBlockIsActive: (state, action: PayloadAction<{ transientId: string, value: boolean }>) => {
			const { transientId, value } = action.payload

			const newBlocks = state.blocks.map(
				block => block.transientId === transientId ? { ...block, isActive: value } : block
			)
			const newVariables = state.variables.map(variable =>
				variable.transientBlockId === transientId ? { ...variable, isActive: value } : variable
			)

			state.variables = newVariables
			state.blocks = newBlocks
		},

		setVariableOnEdition: (state, action: PayloadAction<Variable>) => {
			state.variableOnEdition = action.payload
		},
		clearVariableOnEdition: (state) => {
			state.variableOnEdition = undefined
		},
		addVariable: (state, action: PayloadAction<VariableForm>) => {
			state.variables = [...state.variables, {
				transientId: v4(),
				...action.payload,
				isActive: true,
			}]
		},
		editVariable: (state, action: PayloadAction<VariableForm>) => {
			const editedValues = action.payload
			const variableBeforeEdition = state.variableOnEdition!
			if (variableBeforeEdition.legalDocumentDraftTypeBlockId && !editedValues.legalDocumentDraftTypeBlockId)
				editedValues.legalDocumentDraftTypeBlockId = undefined
			if (variableBeforeEdition.transientBlockId && !editedValues.transientBlockId)
				editedValues.transientBlockId = undefined

			const newVariables = state.variables.map(variable =>
				variable.transientId !== variableBeforeEdition.transientId ? variable : {
					...variable,
					...editedValues
				}
			)

			state.variables = newVariables
			state.variableOnEdition = undefined
		},
		changeVariableIsActive: (state, action: PayloadAction<{ transientId: string, value: boolean }>) => {
			const { transientId, value } = action.payload
			const newVariables = state.variables.map(variable =>
				variable.transientId !== transientId ? variable : {
					...variable,
					isActive: value
				}
			)
			state.variables = newVariables
		}
	},
	extraReducers: ({ addCase }) => {
		caseDefault(addCase, fetchLegalDocDraftTypes)
		caseDefault(addCase, getLegalDocDraftTypes, 'item')
		caseDefaultRegister(addCase, addLegalDocDraftTypes, 'added')
		caseDefaultRegister(addCase, editLegalDocDraftTypes, 'edited')
	},
})

export default slice

export const {
	setBlocksAndVariables,
	setBlockOnEdition,
	clearBlockOnEdition,
	addBlock,
	editBlock,
	changeBlockIsActive,
	setVariableOnEdition,
	clearVariableOnEdition,
	addVariable,
	editVariable,
	changeVariableIsActive,
} = slice.actions
