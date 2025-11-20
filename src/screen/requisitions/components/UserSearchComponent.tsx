import React, {useCallback, useMemo, useState} from "react";
import {AutocompleteField} from "../../../components/form";
import {useSearchUsers} from "../../../hooks/users";
import {AutocompleteInputChangeReason} from "@material-ui/lab";
import {useFormikContext} from "formik";
import AutocompleteMultipleField from "src/components/form/AutocompleteMultipleField";

export type TOptions = ReturnType<typeof useSearchUsers>["usersOptions"];

export type Props = {
	name: string;
	label: string;
	remapping?: (value: TOptions) => TOptions;
	isMultiple?: boolean;
	isActive?: boolean;
}

const UserSearchComponent: React.FC<Props> = (props) => {
	const [searchUser, setSearchUser] = useState<string | undefined>(undefined)
	const {usersOptions, isLoading, cleanList} = useSearchUsers({name: searchUser, isActive: props.isActive}, props.name)
	const {setFieldValue} = useFormikContext()

	const search = useCallback((value: string, reason: AutocompleteInputChangeReason) => {
		switch (reason) {
			case "input": {
				if (value.length >= 3) {
					setSearchUser(value)
				}
				break
			}
			case "clear": {
				setFieldValue(props.name, '')
				setSearchUser(undefined)
				cleanList()
				break
			}
			default: {
				break
			}
		}
	
	}, [setFieldValue, setSearchUser, cleanList])

	const options = useMemo(() => {
		let items = usersOptions
		if (props.remapping) {
			items = props.remapping(items)
		}

		return items;
	
	}, [props.remapping, usersOptions])

	return <>
	{
		props.isMultiple === true ? <AutocompleteMultipleField
		name={props.name} 
		loading={isLoading && Boolean(searchUser) && options.length === 0} 
		label={props.label} 
		options={options} 
		onValueChange={search}
		limitTags={1}
		onDemand
		/> : <AutocompleteField 
		name={props.name} 
		loading={isLoading && Boolean(searchUser) && options.length === 0} 
		label={props.label} 
		options={options} 
		onValueChange={search}
		onDemand
	/>
	}
	</> 
}

export default UserSearchComponent