import { ChangeEvent } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { useTranslation } from 'src/locale/i18n';
import { MainDiv, StyledLabel } from './styled';

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

type Props = {
	id?: string;
	disabled?: boolean;
	onChange: (event: ChangeEvent) => void;
};

const UploadFileButton = (props: Props) => {
	const { t } = useTranslation();
	const classes = useStyles();
	const { onChange, disabled, id } = props;


	return (
		<MainDiv
			className={classes.root}
		>
			<input
				className={classes.input}
				id={id ? id : 'contained-button-file'}
				type='file'
				onChange={onChange}
				disabled={disabled}
			/>
			<StyledLabel htmlFor={id ? id : 'contained-button-file'}>
				<Button
					style={{
						backgroundColor: '#2c3890',
						color: '#ffffff',
						paddingTop: 10,
						paddingBottom: 10,
						paddingRight: 20,
						paddingLeft: 20
					}}
					color="primary"
					aria-label="submit"
					component="span">
					{t('settings:economicIndices.form.uploadButtonText')}
				</Button>
			</StyledLabel>
		</MainDiv>
	);
};

export default UploadFileButton;
