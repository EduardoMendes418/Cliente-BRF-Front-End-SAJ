import { ReactNode } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	DialogProps,
	IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

export type ModalButton = {
	text: string;
	value: any;
	variant?: "text" | "outlined" | "contained" | undefined;
};

export type DialogAllowedProps = Omit<
	DialogProps,
	'open' | 'aria-labelledby' | 'aria-describedby' | 'onClose'
> & {
	showCloseButton?: boolean;
};

type ModalProps = DialogAllowedProps & {
	title: string;
	buttons: ModalButton[];
	children: ReactNode;
	onClose: (val?: any) => void;
};

const useStyle = makeStyles((theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
}));

const Modal = (props: ModalProps) => {
	const { title, children, buttons, onClose, showCloseButton, maxWidth } = props;
	const classes = useStyle(props);

	const dialogProps = {
		...props,
	};
	delete dialogProps['showCloseButton'];

	return (
		<Dialog
			{...dialogProps}
			open
			onClose={() => onClose()}
			aria-labelledby='confirm-dialog-title'
			aria-describedby='confirm-dialog-description'
			style={{ minWidth: '560px' }}
			maxWidth={maxWidth}
		>
			<DialogTitle id='confirm-dialog-title'>
				{title}
				{showCloseButton ? (
					<IconButton
						aria-label='close'
						className={classes.closeButton}
						onClick={onClose}
					>
						<CloseIcon />
					</IconButton>
				) : null}
			</DialogTitle>
			<DialogContent>{children}</DialogContent>
			<DialogActions>
				{buttons.map((button, idx) => (
					<Button
						key={idx}
						onClick={(e) => onClose(button.value)}
						color='primary'
						variant={button.variant}
					>
						{button.text}
					</Button>
				))}
			</DialogActions>
		</Dialog>
	);
};

export default Modal;
