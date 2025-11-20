import { useCallback, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AutocompleteInputChangeReason } from "@material-ui/lab"
import debounce from 'lodash/debounce'

import { FormikContext } from "src/components/form"
import AutocompleteMultipleField from "../form/AutocompleteMultipleField";
import { actions } from "src/core/store"

import {
	getIsFetchingComarca,
	getListComarcaAsOptions
} from "src/core/store/modules/litigation-jurisdictions/selectors"
import { fetchComarca } from "src/core/store/modules/litigation-jurisdictions/thunks"

import { useFormikContext } from "formik"

type TComarcaField = {
	name: string
	label: string
	required?: boolean
	justiceId?: number
	stateId?: number
	disabled?: any
}

const ComarcaField = ({ name, justiceId, stateId, disabled, ...props }: TComarcaField) => {
	const dispatch = useDispatch()
	const { initialValues } = useFormikContext<FormikContext>()

	const comarcaOptions = useSelector(getListComarcaAsOptions)
	const loading = useSelector(getIsFetchingComarca)

	const delayedFetch = useMemo(() => debounce((value: string) => {
		dispatch(fetchComarca({ name: value, stateId, justiceId, pageSize: 855 }))
	}, 800), [dispatch, stateId, justiceId])

	const search = useCallback((value: string, reason: AutocompleteInputChangeReason) => {
		if (reason === 'clear')
			dispatch(actions.litigationJurisdictions.reset())
		else if (reason === "input" && value) {
			if (value.length >= 3) delayedFetch(value)
		}
	}, [delayedFetch, dispatch])

	useEffect(() => {
		const fieldInitialValue = initialValues[name]

		if (fieldInitialValue && Number(fieldInitialValue)){
			dispatch(fetchComarca({ id: Number(fieldInitialValue), justiceId, stateId, pageSize: 855}))}
		else
			dispatch(actions.litigationJurisdictions.reset())
	}, [initialValues, name, dispatch, justiceId, stateId])

	  useEffect(() => {
		if(stateId && justiceId !== null)
			 delayedFetch('')
		  if(typeof justiceId === 'string'){
			 delayedFetch('1')
		 }  
	
	 }, [stateId, justiceId])  

	return (
		<AutocompleteMultipleField
			{...props}
			name={name}
			options={comarcaOptions}
			loading={loading}
			onValueChange={search}
			disabled={disabled}
			disableField={disabled}
			onDemand
		/>
	)
}

export default ComarcaField