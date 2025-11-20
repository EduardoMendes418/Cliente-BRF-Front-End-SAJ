import {
	Box,
	Radio,
	FormControl,
	InputLabel,
	ListSubheader,
	MenuItem,
	OutlinedInput,
	TextField,
	Typography,
} from "@material-ui/core";
import { Field as FormikField, useFormikContext } from "formik";
import { Select } from "formik-material-ui";
import {
	ChangeEvent,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { isNull } from "src/core/utils/func";
import { t } from "src/locale/i18n";
import { FormikContext, Props } from ".";
import FieldColumn from "../FieldColumn";
import debounce from "lodash/debounce";
import Pagination from "../Pagination";
import { usePagination } from "src/hooks/pagination";

export type TExtraData = {
	text: string;
	width?: string;
};

export type TMultipleOptionsSelect = {
	value: string;
	label: string;
	extraData?: TExtraData[];
};

type ContactSelectFieldProps = {
	error?: boolean;
	placeholder?: string;
	options: TMultipleOptionsSelect[];
	required?: boolean;
	selectLabel?: string;
	onChange?: (
		event: ChangeEvent<{ value: string }>,
		child: ReactNode
	) => void;
	onSearch?: (text: string) => void;
	extraDataHeader?: TExtraData[];
};

const ContactSelectField = ({
	name,
	error,
	disabled,
	readOnly,
	label,
	options,
	required,
	validate,
	selectLabel,
	onChange,
	placeholder = t("select"),
	extraDataHeader,
	...props
}: ContactSelectFieldProps & Props) => {
	const { pageSize, itemCount } = usePagination();

	const { errors, touched, setFieldValue, values, status } =
		useFormikContext<FormikContext>();
	const inputLabel = useRef<HTMLLabelElement>(null);
	const showError = error || (touched[name] && !!errors[name]);
	const [labelWidth, setLabelWidth] = useState(0);
	const [searchText, setSearchText] = useState("");
	const [selectedValues, setSelectedValues] = useState<
		TMultipleOptionsSelect
	>();

	useEffect(() => {
		if (inputLabel.current !== null)
			setLabelWidth(inputLabel.current.offsetWidth);
	}, []);

	const renderValue = useCallback(
		(selected: any): ReactNode => {
			return selectedValues?.value === selected
		},
		[selectedValues]
	);

	const handleChange = (
		event: ChangeEvent<{ value: string }>,
		child: ReactNode
	) => {
		const value = event.target.value;
		 if (value) {
			setFieldValue(name, value);

			setSelectedValues({label: "teste", value: "teste"});

		}

		if (onChange) onChange(event, child);
	};

	useEffect(() => {
		if (searchText !== undefined) {
			props.onSearch?.(searchText);
		}
	}, [props, searchText]);

	const delayedSetSearchText = useMemo(
		() => debounce((text) => setSearchText(text), 500),
		[]
	);

	return (
		<FormControl error={showError} disabled={disabled} required={required}>
			{!(status === "readOnly" || readOnly) && (
				<InputLabel htmlFor={name} shrink ref={inputLabel}>
					{label}
				</InputLabel>
			)}
			<FormikField
				component={
					status === "readOnly" || readOnly
						? (props: any) => (
								<FieldColumn
									options={options}
									label={label}
									value={options.length ? props.field.value : ""}
									type="list"
								/>
						  )
						: Select
				}
				name={name}
				inputProps={{ id: name }}
				input={<OutlinedInput notched labelWidth={labelWidth} />}
				disabled={disabled}
				renderValue={renderValue}
				required={required}
				validate={(value: string) => {
					if (required && isNull(value)) return t("required");
					else return validate && validate(value);
				}}
				onChange={handleChange}
				MenuProps={{ autoFocus: false }}
				onClose={() => delayedSetSearchText("")}
				{...props}
			>
				<ListSubheader disableSticky>
					<TextField
						label={t("form.search")}
						autoFocus
						fullWidth
						placeholder={t("form.typeHere")}
						onChange={(e) => delayedSetSearchText(e.target.value)}
						onKeyDown={(e) => e.stopPropagation()}
					/>
				</ListSubheader>
				{selectedValues !== undefined&& searchText.length === 0 && (
					<ListSubheader disableSticky>
						<Box display="flex" flexWrap="no-wrap" alignItems="center">
							<Box width="2.6rem">
								<Typography>Check</Typography>
							</Box>
							{extraDataHeader &&
								extraDataHeader.length > 0 &&
								extraDataHeader.map((x) => (
									<Box
										width={x.width ?? "5rem"}
										paddingRight="1rem"
										textAlign="center"
									>
										<Typography>{x.text}</Typography>
									</Box>
								))}
							<Box width="2.6rem">
								<Typography>Nome</Typography>
							</Box>
						</Box>
					</ListSubheader>
				)}
				{searchText.length === 0 &&
					selectedValues && (
						<MenuItem value={selectedValues.value}>
							<Box display="flex" flexWrap="no-wrap" alignItems="center">
								<Box>
									<Radio
										color="primary"
										checked={
											values[name] === selectedValues.value
										}
									/>
								</Box>
								
								<Box>{label}</Box>
							</Box>
						</MenuItem>
					)}
				{options && options.length > 0 && (
					<ListSubheader disableSticky>
						<Box display="flex" flexWrap="no-wrap" alignItems="center">
							<Box width="2.6rem">
								<Typography>Check</Typography>
							</Box>
							{extraDataHeader &&
								extraDataHeader.length > 0 &&
								extraDataHeader.map((x) => (
									<Box
										width={x.width ?? "5rem"}
										paddingRight="1rem"
										textAlign="center"
									>
										<Typography>{x.text}</Typography>
									</Box>
								))}
							<Box width="2.6rem">
								<Typography>Nome</Typography>
							</Box>
						</Box>
					</ListSubheader>
				)}
				{options.map(({ label, value, extraData }, i) => (
					<MenuItem value={value} key={i}>
						<Box display="flex" flexWrap="no-wrap" alignItems="center">
							<Box>
								<Radio
									color="primary"
									checked={
										values[name] === value
									}
								/>
							</Box>
							{extraData &&
								extraData.length > 0 &&
								extraData.map((x) => (
									<Box
										width={x.width ?? "5rem"}
										paddingRight="1rem"
										textAlign="center"
									>
										{x.text}
									</Box>
								))}
							<Box>{label}</Box>
						</Box>
					</MenuItem>
				))}
				{itemCount > pageSize && (
					<ListSubheader>
						<Pagination />
					</ListSubheader>
				)}
			</FormikField>
		</FormControl>
	);
};

export default ContactSelectField;
