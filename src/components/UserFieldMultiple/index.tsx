import { useFormikContext } from "formik";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	getListFiltersUsers,
	getListUsers,
	getLoadingUsers,
} from "src/core/store/modules/users/selectors";
import { AutocompleteField, FormikContext } from "../form";
import debounce from "lodash/debounce";
import { TOptions } from "../form/AutocompleteField";
import { actions } from "src/core/store";
import { fetchUsers } from "src/core/store/modules/users/thunks";
import { AutocompleteInputChangeReason } from "@mui/material";
import AutocompleteMultipleField from "../form/AutocompleteMultipleField";

type TUserField = {
	name: string;
	label: string;
	setInvalidValueWhenTyping?: boolean;
	required?: boolean;
	labelValueTarget?: boolean;
	initialValue?: TOptions;
};

const UserFieldMultiple = ({
	setInvalidValueWhenTyping,
	labelValueTarget,
	initialValue,
	...props
}: TUserField) => {
	const dispatch = useDispatch();
	const { initialValues, setFieldValue } = useFormikContext<FormikContext>();

	const users = useSelector(getListUsers);
	const loading = useSelector(getLoadingUsers);
	const currentSearchFilter = useSelector(getListFiltersUsers);

	const options = useMemo(
		() =>
			users.map(
				({ id, name }) => ({ label: name, value: id ?? "" })
			),
		[users]
	);

	const deletedFetch = debounce((value: string) => {
		dispatch(actions.users.setFilters({ name: props.name, isActive: true }));
		dispatch(fetchUsers({ name: value, isActive: true }));
	}, 500);

	const search = useCallback(
		(value: string, reason: AutocompleteInputChangeReason) => {
			if (reason === "clear") {
				dispatch(actions.users.clearList());
			} else if (reason === "input" && value) {
				if (setInvalidValueWhenTyping) {
					setFieldValue(props.name, -1);
				}
				if (value.length >= 3) {
					deletedFetch(value);
				}
			}
		},
		[
			deletedFetch,
			dispatch,
			props.name,
			setFieldValue,
			setInvalidValueWhenTyping,
		]
	);

	useEffect(() => {
		if (initialValues[props.name] && Number(initialValues[props.name])) {
			dispatch(fetchUsers({ id: Number(initialValues[props.name]) }));
		} else {
			dispatch(actions.users.clearList());
		}
	}, [dispatch, initialValues, props.name]);

	return (
		<AutocompleteMultipleField
			{...props}
			options={options}
			loading={loading && currentSearchFilter === props.name}
			onValueChange={search}
			valuePropName={labelValueTarget ? "label" : "value"}
			initialValue={initialValue}
			onDemand
			limitTags={1}
		/>
	);
};

export default UserFieldMultiple;
