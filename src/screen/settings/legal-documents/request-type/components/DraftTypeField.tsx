import { ChangeEvent, RefObject, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { CircularProgress, makeStyles, TextField } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import debounce from 'lodash/debounce'

import {
	getLoadingLegalDocDraftTypes,
	getListLegalDocDraftTypeAsOptions
} from "src/core/store/modules/legal-document-draft-types/selectors"
import { fetchLegalDocDraftTypes } from "src/core/store/modules/legal-document-draft-types/thunks"
import { actions } from "src/core/store"

const useStyles = makeStyles(() => ({
	inputRoot: {
		'&[class*="MuiOutlinedInput-root"]': {
			padding: 0
		},
		'&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
			padding: '15px 14px'
		},
	}
}));

type TOption = { label: string, value: number }

type TDraftTypeField = {
	name: string
	label: string
	value: TOption | null
	onChange: (e: ChangeEvent<{}>, value: TOption|null) => void
	required?: boolean
	imperativeRef?: RefObject<{ clear: () => void; }>
}

const DraftTypeField = ({ name, imperativeRef, onChange, ...props }: TDraftTypeField) => {
	const classes = useStyles();
	const dispatch = useDispatch()

	const [inputValue, setInputValue] = useState('')

	const draftTypesOptions = useSelector(getListLegalDocDraftTypeAsOptions)
	const loading = useSelector(getLoadingLegalDocDraftTypes)

	const delayedFetch = useMemo(() => debounce((value: string) => {
		dispatch(fetchLegalDocDraftTypes({ name: value, isActive: true }))
	}, 800), [dispatch])

	return (
		<Autocomplete
			{...props}
			classes={classes}
			inputValue={inputValue}
			onChange={onChange}
			onInputChange={(event, newInputValue, reason) => {
				if (reason === 'clear')
					dispatch(actions.legalDocDraftTypes.clear())
				else if (reason === "input" && newInputValue) {
					if (newInputValue.length >= 3) delayedFetch(newInputValue)
				}
				setInputValue(newInputValue);
			}}
			options={draftTypesOptions}
			getOptionLabel={(option: TOption) => option.label || ''}
			getOptionSelected={(option, value) => option.value === value.value}
			renderInput={(params) => (
				<TextField
					{...params}
					{...props}
					InputLabelProps={{ shrink: true }}
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<>
								{loading ? <CircularProgress color="primary" size={20} /> : null}
								{params.InputProps.endAdornment}
							</>
						),
					}}
				/>
			)}
		/>
	)
}

export default DraftTypeField
