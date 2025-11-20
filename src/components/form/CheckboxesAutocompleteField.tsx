import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { useFormikContext } from "formik";
import { FormikContext } from "./";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import {
	FormControl,
	FormHelperText,
	makeStyles,
	Theme,
} from "@material-ui/core";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" color="primary" />;

type TOptions = {
	label: string;
	value: string | number;
};

type Props = {
	options: TOptions[];
	name: string;
	label: string;
	customError?: string;
	hasSelectAllOption?: boolean;
	limitTags?: number;
	readOnly?: boolean;
	required?: boolean;
	onChange?: (value: string) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
	input: {
		'&[class*="MuiAutocomplete-input"]': {
			marginTop: 3,
			marginBottom: 3,
		},
	},
	option: {
		'&[class*="MuiAutocomplete-option"]': {
			fontSize: 14,
		},
	},
	root: {
		"& label.MuiInputLabel-root": {
			color: "black",
			fontSize: 14,
			fontFamily: "Noto Sans",
		},
		"& label.Mui-focused": {
			color: theme.palette.primary.main,
		},
		"& .MuiOutlinedInput-root": {
			"&:hover fieldset": {
				borderColor: "black",
			},
			"&.Mui-focused fieldset": {
				borderColor: theme.palette.primary.main,
			},
		},
	},
}));

const CheckboxesAutocompleteField = ({
	options,
	label,
	name,
	customError,
	hasSelectAllOption,
	limitTags = 25,
	readOnly,
	required,
	onChange,
}: Props) => {
	const { setFieldValue, errors, touched, initialValues } =
		useFormikContext<FormikContext>();
	const [selectedValues, setSelectedValues] = useState<TOptions[]>([]);
	const showError = touched[name] && (!!errors[name] || !!customError);
	const classes = useStyles();

	useEffect(() => {
		if (hasSelectAllOption && !options.find((option) => option.value === -1))
			options.unshift({ label: "TODOS", value: -1 });
	}, [hasSelectAllOption, options]);

	useEffect(() => {
		if (
			selectedValues.length !== 0 ||
			options.filter((option) => option.value !== -1).length === 0
		)
			return;
		const selectedOptions = options.filter((option: TOptions) =>
			initialValues[name]?.includes(option.value)
		);
		if (selectedOptions) setSelectedValues(selectedOptions);
		
	}, [initialValues, name, options]);

	const onChangeValues = (newValues: TOptions[]) => {
		const values = newValues.map((option) => option.value);
		const isAllOptionsSelected = values.includes(-1);
		if (isAllOptionsSelected) {
			const allValues = options
				.map((option) => option.value)
				.filter((value) => value !== -1);
			setFieldValue(name, allValues);
			setSelectedValues(options);
			return;
		}
		setFieldValue(
			name,
			values.filter((value) => value !== -1)
		);
		setSelectedValues(newValues);
	};

	const popupComponentMinHeight =
		options?.length > 6 ? 380 : 50 * options?.length + 30;

	const Pop = (props: any) => <div {...props} />;

	const PopperComponent = useCallback(Pop, []);

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			onChange && onChange(e.target.value);
		},
		[onChange]
	);

	return (
		<FormControl error={showError}>
			<Autocomplete
				autoComplete={false}
				disabled={readOnly}
				value={selectedValues}
				multiple
				classes={classes}
				id="checkboxes-tags-demo"
				options={options}
				disableCloseOnSelect
				onChange={(event, newValues) => {
					onChangeValues(newValues);
				}}
				size={"small"}
				getOptionLabel={(option) => option.label}
				limitTags={limitTags}
				PopperComponent={PopperComponent}
				ListboxProps={{
					style:
						options?.length > 6 ? { minHeight: popupComponentMinHeight } : {},
				}}
				renderOption={(props, option, { selected }) => (
					<li {...props}>
						<Checkbox
							color="primary"
							icon={icon}
							checkedIcon={checkedIcon}
							style={{ marginRight: 8 }}
							checked={selected}
							size="small"
						/>
						{option.label}
					</li>
				)}
				renderInput={({ disabled, ...params }) => (
					<TextField
						{...params}
						label={label}
						disabled={disabled}
						required={required}
						onChange={handleChange}
						autoComplete="off"
						InputLabelProps={{
							shrink: true,
						}}
					/>
				)}
			/>
			{showError && (
				<FormHelperText>{customError ?? errors[name]}</FormHelperText>
			)}
		</FormControl>
	);
};

export default CheckboxesAutocompleteField;
