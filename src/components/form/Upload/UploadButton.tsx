import { ChangeEvent, MutableRefObject, ReactNode } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Button, IconButton, ButtonProps } from '@material-ui/core';
import { AttachFile as AttachFileIcon } from '@material-ui/icons';

import { t } from 'src/locale/i18n';
import { Label, MainDiv } from './styled';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& > *': {
				margin: theme.spacing(1),
			},
		},
		input: {
			display: 'none',
		},
	})
);

type Props = Omit<ButtonProps, 'onChange'> & {
	id?: string;
	text?: string;
	multiple?: boolean;
	accept?: string;
	disabled?: boolean;
	inputRef?: MutableRefObject<HTMLInputElement | null>;
	isIconButton?: boolean;
	onChange: (event: ChangeEvent) => void;
	startIcon?: ReactNode;
	clearInputFilesOnChange?: boolean;
};

const UploadFileButton = ({
	multiple,
	onChange,
	disabled,
	text,
	id,
	inputRef,
	isIconButton,
	startIcon,
	accept,
	clearInputFilesOnChange = true,
	...rest
}: Props) => {
	const classes = useStyles();

	return (
		<MainDiv
			className={classes.root}
			isIconButton={isIconButton}
		>
			<input
				className={classes.input}
				id={id ? id : 'contained-button-file'}
				multiple={multiple}
				accept={accept}
				type='file'
				onChange={(event: ChangeEvent<HTMLInputElement>) => {
					onChange(event);
					if (clearInputFilesOnChange)
						event.target.value = ''
				}}
				disabled={disabled}
				ref={inputRef}
			/>
			<Label htmlFor={id ? id : 'contained-button-file'} style={{ margin: 0 }}>
				{isIconButton
					? (
						<IconButton aria-label='attach' component="span">
							<AttachFileIcon style={{ color: '#F5821F' }} />
						</IconButton>
					)
					: (
						<Button
							{...rest}
							component='span'
							startIcon={startIcon}
							disabled={disabled}
						>
							{text ? text : t('attachments.addFile')}
						</Button>
					)
				}
			</Label>
		</MainDiv>
	);
};

export default UploadFileButton;
