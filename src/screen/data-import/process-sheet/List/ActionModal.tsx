import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid } from "@material-ui/core";
import { Formik } from "formik";

import { SelectField, TOptionsSelect } from "src/components/form";
import UploadFileButton from "src/components/form/Upload/UploadButton";
import { t } from "src/locale/i18n";

import { getLastModalOpen } from "src/core/store/modules/modals/selectors";
import { actions } from "src/core/store";

export type MODEL_TYPE = 'processSheet' | 'involved' | '';

const options: TOptionsSelect[] = [
	{ label: t('dataImport:processSheet.title'), value: 'processSheet' },
	{ label: t('dataImport:processSheet.form.involved'), value: 'involved' }
]

type TActionModal = {
	action: 'import' | 'generate';
	onActionClick: ({ model, file }: { model: MODEL_TYPE, file?: FileList }) => void
}

const ActionModal = ({ action, onActionClick }: TActionModal) => {
	const dispatch = useDispatch();
	const modalId = useSelector(getLastModalOpen);

	const inputFileRef = useRef<HTMLInputElement>(null);

	const onSubmit = (values: { model: MODEL_TYPE }) => {
		onActionClick(values);
		dispatch(actions.modal.close({ modalId }));
	}

	const handleImport = (model: MODEL_TYPE) => {
		const file = inputFileRef.current?.files;
		if (file) {
			onActionClick({ model, file })
			dispatch(actions.modal.close({ modalId }));
		}
	}

	return (
		<Formik
			initialValues={{ model: '' }}
			onSubmit={onSubmit}
			enableReinitialize
		>
			{({ handleSubmit, values }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						<Grid item md={12} xs={12}>
							<SelectField
								options={options}
								label={t('dataImport:processSheet.form.model')}
								name='model'
								required
							/>
						</Grid>
						<Grid item md={12} xs={12} style={{ textAlign: 'right' }}>
							{ action === 'import' ? (
								<UploadFileButton
									variant='contained'
									color='primary'
									text={t('dataImport:common.importSpreadsheet')}
									onChange={() => handleImport(values.model)}
									inputRef={inputFileRef}
									disabled={!values.model}					
								/>
							) : (
								<Button
									type='submit'
									color='primary'
									variant='contained'
								>
									{t('dataImport:common.generateSpreadsheet')}
								</Button>
							)}
						</Grid>
					</Grid>
				</form>
			)}
		</Formik>
	)
}

export default ActionModal
