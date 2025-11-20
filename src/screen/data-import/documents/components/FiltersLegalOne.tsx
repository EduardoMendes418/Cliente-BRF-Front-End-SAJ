import { ChangeEvent } from 'react';
import { SelectField, TextField, Upload } from 'src/components/form';
import { useFormikContext } from 'formik';
import { useTranslation } from 'src/locale/i18n';
import { Grid } from '@material-ui/core';
import { modal } from 'src/components/modals';

import { folderOption } from '../constants';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import { useStatusProcessOptions } from 'src/hooks/useProcessFilterOptions';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const FiltersLegalOne = () => {
	const { t } = useTranslation();
	const { setFieldValue }: any = useFormikContext();

	const { groupedAreasAsOptions } = useGroupedAreas();
	const statusOptions = useStatusProcessOptions();

	const isValidFile = (files: FileList | null): boolean => {
		return !!files?.length && files[0].name.split('.').pop() === 'csv';
	}

	const showErrorModal = (title: string) => {
		const component = (<div style={{fontSize: "14px"}}>{t('dataImport:documents.modalErrorText')}</div>);

		modal({
			title,
			component,
			buttons: [],
			dialogProps: { maxWidth: 'md', showCloseButton: true },
		})
	}

	const getFormattedfoldersNumber = (contentFile: string): string[] => {
		try {
			const foldersNumber = contentFile.split('\n')
				.filter(foldersNumber => foldersNumber !== "" && foldersNumber !== "\r")
				.map(foldersNumber => {
					const value = foldersNumber.replace(/(\r\n|\n|\r)/gm, "");
					if (Number(value)) throw new Error('Invalid format');

					return value;
				})
	
				for(let x = 0; x < foldersNumber.length; x++){
					foldersNumber[x] = foldersNumber[x].replace('#', '')
				}
			if (!foldersNumber || !foldersNumber.length) throw new Error('Empty file');

			return foldersNumber
		} catch (err: any) {
			const error = t('validations.emptyFile');
			showErrorModal(error);
			return [];
		}
	}

	const onUploadfoldersNumberFile = (event: ChangeEvent) => {
		const { files } = event.target as HTMLInputElement;
		if (!isValidFile(files)) {
			showErrorModal(t('validations.invalidFileFormat'));
			setFieldValue('foldersNumber', '')
			return
		}

		const reader = new FileReader();
		files && reader.readAsText(files[0]);
		reader.onload = function (loadedEvent: any) {
			const foldersNumberFromFile = getFormattedfoldersNumber(loadedEvent.target.result)
			setFieldValue('foldersNumber', foldersNumberFromFile.join(";"))
		}
	}

	const onDeletefoldersNumberFile = () => {
		setFieldValue('foldersNumber', '')
	}
	return (
		<Grid container spacing={2}>
			<Grid item md={3} xs={12}>
				<TextField
					name='foldersNumber'
					label={t('dataImport:documents.form.foldersNumber')}
					maxLength={99999999}
					multiline
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<SelectField
					options={folderOption}
					label={t('dataImport:documents.form.folderOptions')}
					name='folderOptions'
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<GroupedSelectFiledMultiple
					options={groupedAreasAsOptions}
					label={t('dataImport:documents.form.areasId')}
					name='areasId'
					multiple
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<SelectField
					options={statusOptions}
					label={t('dataImport:documents.form.folderStatus')}
					name='folderStatus'
					multiple
				/>
			</Grid>
			<Grid item xs={10} md={4}>
				<Upload
					id='file'
					onUploadAfterChanges={event => onUploadfoldersNumberFile(event)}
					onDelete={() => onDeletefoldersNumberFile()}
					name={'file'}
					disabled={false}
					text={"Carregar Arquivo"}
				/>
			</Grid>

		</Grid>
	)
}

export default FiltersLegalOne;