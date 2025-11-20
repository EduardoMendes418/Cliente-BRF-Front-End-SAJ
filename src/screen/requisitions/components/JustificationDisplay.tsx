import { Grid } from '@material-ui/core';
import {
	TextField,
} from 'src/components/form';

import { useTranslation } from 'src/locale/i18n';
import FieldColumn from 'src/components/FieldColumn';

type TJustificationDisplay = {
	justificationDisapproval: string;
}

const JustificationDisplay = ({ justificationDisapproval }: TJustificationDisplay) => {
	const { t } = useTranslation();

	return (
		<Grid container spacing={3}>
			<Grid item md={3} xs={12}>
				<TextField
					label={t('requisitions:form.disapprovalReason')}
					name='disapprovalReason'
					readOnly />
			</Grid>
			<Grid item md={9} xs={12}>
				<FieldColumn
					label={t('requisitions:form.justificationDisapproval')}
					value={justificationDisapproval}
					multiline
				/>
			</Grid>
		</Grid>
	)
}

export default JustificationDisplay;