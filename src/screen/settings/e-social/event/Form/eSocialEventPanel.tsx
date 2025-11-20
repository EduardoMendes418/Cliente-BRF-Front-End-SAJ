
import { Grid } from '@material-ui/core';
import { TextField, RadioGroup, FormikContext } from 'src/components/form';
import { useFormikContext } from "formik";
import { t } from 'src/locale/i18n';

import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';
import { useParams } from 'react-router-dom';

const ESocialEventPanel = () => {
	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo';

	const radioOption = [
		{ label: 'Sim', value: true },
		{ label: 'Não', value: false },
	];

	const { handleSubmit, isSubmitting, dirty } = useFormikContext<FormikContext>();

	return (
		<form noValidate onSubmit={handleSubmit}>
			<Panel title={ isNew === true ? t('eSocial:eSocialEvent.form.title') :  t('eSocial:eSocialEvent.editTitle')} 
				withPadding
				slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
				slotBottonRightPermission={isNew ? 'add' : 'edit'}
			>
			<Grid container spacing={2}>
				<Grid item md={3} spacing={3}>
					<TextField
						label={t('eSocial:eSocialTables.form.description')}
						name={'description'}
						maxLength={100}
						required
					/>
				</Grid>
				<Grid item md={3} spacing={3}>
					<TextField
						label={"Código evento"}
						name={'code'}
						maxLength={10}
						required
					/>
				</Grid>
				<Grid item md={6} style={{ display: "flex" }}>
					<RadioGroup
						name='automaticSend'
						label="Automático"
						options={radioOption} 
						required 
					/>
				</Grid>
			</Grid>
			</Panel>
		</form>			
	);
};

export default ESocialEventPanel;
