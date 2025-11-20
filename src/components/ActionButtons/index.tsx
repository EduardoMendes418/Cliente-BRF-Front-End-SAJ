import { useState } from 'react';
import { Button, CircularProgress, Grid } from "@material-ui/core";

type TActionButton = {
	label: string;
	onClick?: () => void;
	disabled?: boolean;
};

type TActionButtons = {
	buttons: TActionButton[];
	hidden?: boolean;
	isSubmitting?: boolean;
};

const ActionButtons = ({
	buttons,
	hidden,
	isSubmitting = false,
}: TActionButtons) => {
	const [buttonClicked, setButtonClicked] = useState(false);

	const handleButtonClick = (onClick: () => void) => {
		onClick();
		setButtonClicked(true);

		setTimeout(() => {
			setButtonClicked(false);
		}, 3000);
	};

	return hidden ? null : (
		<Grid
			container
			justifyContent="flex-end"
			className="margin-top-16"
			spacing={2}
		>
			{buttonClicked || isSubmitting ? (
				<CircularProgress />
			) : (
				buttons.map(({ label, onClick, disabled }, index) => (
					<Grid item key={index}>
						<Button
							color="primary"
							type={onClick ? "button" : "submit"}
							variant={disabled ? undefined : "contained"}
							onClick={onClick ? () => handleButtonClick(onClick) : onClick}
							disabled={disabled || buttonClicked}
						>
							{label}
						</Button>
					</Grid>
				))
			)}
		</Grid>
	);
};

export default ActionButtons;