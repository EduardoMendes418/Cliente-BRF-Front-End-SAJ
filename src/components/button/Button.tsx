import { Button as MUIButton, CircularProgress, ButtonProps } from '@material-ui/core';

type TProps = {
	text?: string;
	disabled?: boolean;
	className?: string;
	submitting?: boolean;
	onClick: () => void;
} & ButtonProps

const Button = ({ text, submitting, disabled, ...props }: TProps) => {

	if (submitting) return <CircularProgress />

	return (
		<MUIButton
			color="primary"
			type="button"
			variant={disabled ? undefined : "contained"}
			disabled={disabled}
			{...props}
		>
			{text}
		</MUIButton>
	)
}

export default Button;