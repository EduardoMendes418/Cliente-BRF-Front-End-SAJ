import Panel from 'src/components/Panel';
import { useTranslation } from 'src/locale/i18n';
import { Button, Grid } from "@material-ui/core";
import { Formik, useFormikContext } from 'formik';
import ScreenTemplate from 'src/components/Screen';
import { useDispatch } from 'react-redux';
import { RunIntegrationByFolderIds, RunIntegrationByListFolderNumber } from 'src/core/store/modules/lawsuit/thunks';
import { SelectField, TextField, Upload } from 'src/components/form';
import { SendServiceBusByIds } from 'src/core/store/modules/contacts/thunks';
import { useSnackbar } from 'notistack';
import { ChangeEvent, useState } from 'react';
import { modal } from 'src/components/modals';


const validate = ({ ids }: any) => {
	if (ids === "" || !!ids?.match(/(^\d)+(;?\d)+$/)  || ids?.includes('/'))
		return {};
	return { ids: "Deve seguir esse padrão {999;999}" };
};

const IntegrateRecordsAndContacts = () => {

	const { t } = useTranslation();
	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const isValidFile = (files: FileList | null): boolean => {
		return !!files?.length && files[0].name.split('.').pop() === 'csv';
	}

	const initialValues = {
		integrationType: null,
		ids: null
	}

	const doRequestByFolder = async (idsToSend: any) => {
		setIsLoading(true)
		const {meta} = await dispatch(RunIntegrationByFolderIds(idsToSend)) as any;

		if(meta?.requestStatus === "fulfilled"){
			setIsLoading(false)
			enqueueSnackbar("Tarefa sendo executada em segundo plano. Aguarde!", {
				variant: "success",
			});
		} else if (meta?.requestStatus === "rejected"){
			enqueueSnackbar("Ocorreu um erro", {
				variant: "error",
			});
		}
		setIsLoading(false)
	}

	const doRequestListFolder = async (idsToSend: any) => {
		setIsLoading(true)
		const {meta} = await dispatch(RunIntegrationByListFolderNumber(idsToSend)) as any;

		if(meta?.requestStatus === "fulfilled"){
			setIsLoading(false)
			enqueueSnackbar("Tarefa sendo executada em segundo plano. Aguarde!", {
				variant: "success",
			});
		} else if (meta?.requestStatus === "rejected"){
			enqueueSnackbar("Ocorreu um erro", {
				variant: "error",
			});
		}
		setIsLoading(false)
	}

	const doRequestServiceBus = async (idsToSend: any) => {
		setIsLoading(true)
		const {meta} = await dispatch(SendServiceBusByIds(idsToSend)) as any;

		if(meta?.requestStatus === "fulfilled"){
			setIsLoading(false)
			enqueueSnackbar("Tarefa sendo executada em segundo plano. Aguarde!", {
				variant: "success",
			});
		} else if (meta?.requestStatus === "rejected"){
			enqueueSnackbar("Ocorreu um erro", {
				variant: "error",
			});
		}
		setIsLoading(false)
	}

	const onSubmit = (values: any) => {
		const idsToSend = values?.ids.split(";")

		switch(values.integrationType){
			case 1:
				return doRequestByFolder(idsToSend)
			case 2:
				return doRequestListFolder(idsToSend)
			case 3:
				return doRequestServiceBus(idsToSend)
			default:
				return 
		}
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
			const foldersNumber = contentFile.split('\n')
				.filter(foldersNumber => foldersNumber !== "" && foldersNumber !== "\r")
				.map(foldersNumber => {
					const value = foldersNumber.replace(/(\r\n|\n|\r)/gm, "");
					return value;
				})
			return foldersNumber
	}

	const onUploadfoldersNumberFile = (event: ChangeEvent, setFieldValue: any) => {
		const { files } = event.target as HTMLInputElement;
		 if (!isValidFile(files)) { 
			showErrorModal(t('validations.invalidFileFormat'));
			 setFieldValue('ids', '')
			return
		} 

		const reader = new FileReader();
		files && reader.readAsText(files[0]);
		reader.onload = function (loadedEvent: any) {
			const foldersNumberFromFile = getFormattedfoldersNumber(loadedEvent.target.result)
			setFieldValue('ids', foldersNumberFromFile.join(";"))
		}
	}

	const onDeletefoldersNumberFile = (setFieldValue: any) => {
		setFieldValue('ids', '')
	}
	
	return (
		<ScreenTemplate>
			<Formik
                	initialValues={initialValues}
                	onSubmit={console.log}
					validate={validate}
                	enableReinitialize
            	>
                {({ handleSubmit, values, setFieldValue }) => (
                    <form noValidate onSubmit={handleSubmit}>
						<Panel title={"Selecione o tipo de integração"} withPadding>
		 					<Grid container spacing={3}>
		 						<Grid item xs={12} md={3}>
                					<SelectField
                    					label={"Tipo de integração"}
                    					name="integrationType"
										options={[
											{label: "Id do processo", value: 1},
											{label: "Pasta/CTG", value: 2},
											{label: "Id do contato", value: 3},
										]}
                					/>
             					</Grid>							 
							</Grid>
						</Panel>
						<Panel title={ t("integrations:integrateRecordsAndContacts")} withPadding>
							<Grid container spacing={3}>
								<Grid item xs={12} md={3}>
								 	<TextField
										required
										name='ids'
										label={"Informar"}
										maxLength={99999999}
										multiline
										disabled={values.integrationType === null || values.integrationType === '' ? true : false || isLoading}
									/>
								 </Grid>
								 <Grid item md={1} xs={2}>
								 	<Button
										style={{marginTop: '8px'}}
										color="primary"
										variant={"contained"}
										onClick={() => onSubmit(values)}
										disabled={values.integrationType === null || values.integrationType === '' ? true : false || isLoading || values.ids === ''}
									>
									{"Executar"}
									</Button>
								</Grid>
						</Grid>
						<Grid container spacing={3} >
									<Grid item xs={12} md={3}>
				 						<Upload
					 						id='file'
					 						onUploadAfterChanges={event => onUploadfoldersNumberFile(event, setFieldValue)}
					 						onDelete={() => onDeletefoldersNumberFile(setFieldValue)}
					 						name={'file'}
					 						disabled={values.integrationType === null || values.integrationType === '' ? true : false || isLoading}
					 						text={"Carregar Arquivo"}
				 						/>
									</Grid>
								</Grid>	 
						</Panel>
					</form>
                )}
            </Formik>
		</ScreenTemplate>
	);
};

export default IntegrateRecordsAndContacts;
