import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutocompleteInputChangeReason } from "@material-ui/lab";
import debounce from "lodash/debounce";
import { useFormikContext } from "formik";

import { actions } from "src/core/store";
import {
	getListUsersAsOptions,
	getLoadingUsers,
} from "src/core/store/modules/users/selectors";
import { fetchUsers } from "src/core/store/modules/users/thunks";
import { AutocompleteField, FormikContext } from ".";
import { TOptions } from "./AutocompleteField";

type TUserField = {
	name: string;
	label: string;
	readOnly?: boolean;
	hasServiceTeam?: boolean;
	onlyActive?: boolean;
	onChange?: (value: TOptions) => void;
};
const label = "Equipe de Atendimento";

const UserField = ({
	readOnly,
	hasServiceTeam,
	onlyActive,
	onChange,
	...props
}: TUserField) => {
	const dispatch = useDispatch();
	const { initialValues, setFieldValue } = useFormikContext<FormikContext>();

	const listUsersOptions = useSelector(getListUsersAsOptions);

	const loading = useSelector(getLoadingUsers);
	const [searchValue, setSearchValue] = useState("");

	const list = useMemo(
		() =>
			hasServiceTeam && label.includes(searchValue)
				? [
						{
							label,
							value: -1,
						},
						...listUsersOptions,
				]
				: [...listUsersOptions],
		[hasServiceTeam, listUsersOptions, searchValue]
	);

	const delayedFetch = debounce((value: string) => {
		dispatch(
			fetchUsers({
				name: value,
				pageSize: 100,
				isActive: onlyActive ? true : undefined,
			})
		);
	}, 500);

	const search = useCallback(
		(value: string, reason: AutocompleteInputChangeReason) => {
			setSearchValue(value);
			if (reason === "clear") {
				dispatch(actions.users.clearList());
				setFieldValue(props.name, "");
			} else if (reason === "input" && value && value.length >= 3)
				delayedFetch(value);
			
		},
		
		[dispatch, props.name, setFieldValue]
	);

	useEffect(() => {
		if (initialValues[props.name] && Number(initialValues[props.name]))
			dispatch(fetchUsers({ id: Number(initialValues[props.name]) }));
		else dispatch(actions.users.clearList());
		
	}, []);

	const handleChange = useCallback((value: TOptions | null) => value && onChange?.(value), [onChange]);

	return (
		<AutocompleteField
			{...props}
			options={list as never}
			loading={loading}
			onValueChange={search}
			onSelectValue={handleChange}
			readOnly={readOnly}
			onDemand
		/>
	);
};

export default UserField;
