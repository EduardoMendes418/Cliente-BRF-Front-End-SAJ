import { Grid, Button } from '@material-ui/core';
import { useTranslation } from "src/locale/i18n";

type Props = {
	onClick: any
	marginTop?: number
}

const CustomFieldsButton = ({ onClick, marginTop = 16 }: Props) => {
	const { t } = useTranslation();

	return (
		<Grid container justifyContent="flex-end" className={`margin-top-${marginTop}`} spacing={2}>
			<Grid item>
				<Button
					color="primary"
					type="button"
					variant="contained"
					onClick={onClick}
				>
					{t('reports:modal.title')}
				</Button>
			</Grid>
		</Grid>
	)
}

export default CustomFieldsButton;