import { SelectField, TextField } from 'src/components/form';
import { useTranslation } from 'src/locale/i18n';
import { Grid } from '@material-ui/core';

export enum FOLDER_OPTIONS {
	ALL = 0,
	MAIN = 1,
	LINKED = 2
};

export const folderOption = [
	{ label: 'Todas', value: FOLDER_OPTIONS.ALL },
	{ label: 'Principal', value: FOLDER_OPTIONS.MAIN },
	{ label: 'Vinculada', value: FOLDER_OPTIONS.LINKED },
];

const CTGOption = ({ foldersName = "folders" , foldersOptionName = 'litigationRelationship' }: { foldersName?: string ,foldersOptionName?: string }) => {
	const { t } = useTranslation();

	return (
		<>
			<Grid item md={3} xs={12}>
				<TextField
					name={foldersName}
					label={t('dataImport:documents.form.foldersNumber')}
					maxLength={11}
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<SelectField
					options={folderOption}
					label={t('dataImport:documents.form.folderOptions')}
					name= {foldersOptionName}
				/>
			</Grid>
		</>
	)
}

export default CTGOption;