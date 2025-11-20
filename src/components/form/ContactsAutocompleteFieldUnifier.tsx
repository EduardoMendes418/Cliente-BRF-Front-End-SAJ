import { ReactElement, useState } from "react";
import { ContactsAutocompleteField, TextField } from "src/components/form";
import { Grid, Popover } from "@material-ui/core";
import { TContactsAutocompleteField } from "./ContactsAutocompleteField";
import { useFormikContext } from "formik";
import { FormikContext } from "src/components/form";
import { ContactsDiv } from "./styled";

type TProps = {
	children: ReactElement;
	mainName: string;
	mainLabel: string;
	isInspection?: boolean;
	popoverDisabled?: boolean;
	required?: boolean;
};

const ContactsAutocompleteFieldUnifier = ({
	children,
	mainName,
	mainLabel,
	isInspection,
	popoverDisabled,
	required,
	...props
}: TProps & TContactsAutocompleteField) => {
	const { status, values } = useFormikContext<FormikContext>();
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const [isFocus, setIsFocus] = useState<boolean>(false);

	const handleClose = () => {
		setAnchorEl(null);
		setIsFocus(false);
	};

	if (status === "readOnly")
		return (
			<>
				<Grid item md={isInspection ? 4 : 3} xs={12}>
					<ContactsAutocompleteField onBlur={handleClose} {...props} />
				</Grid>
				{children}
			</>
		);
		
	if (values[mainName] !== "")
		return (
			<Grid item md={3} xs={12}>
				<TextField
					required={required}
					name={mainName}
					label={mainLabel}
					onClick={(event: any) => {
						setAnchorEl(event.currentTarget);
						setIsFocus(true);
					}}
				/>
				{
					popoverDisabled === true ? null : <Popover open={isFocus} onClose={handleClose} anchorEl={anchorEl}>
					<ContactsDiv>
						<ContactsAutocompleteField {...props} onBlur={handleClose} />
					</ContactsDiv>
				</Popover>
				}			
			</Grid>
		);

	return (
		<>
			<Grid item md={3} xs={12}>
				<ContactsAutocompleteField onBlur={handleClose} {...props} />
			</Grid>
		</>
	);
};

export default ContactsAutocompleteFieldUnifier;
