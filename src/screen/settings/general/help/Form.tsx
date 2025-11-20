import { useEffect, useMemo, useState } from "react";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import Panel from "src/components/Panel";
import ScreenTemplate from "src/components/Screen";
import { Submit } from "src/components/button";
import Form, { TextField, Upload } from "src/components/form";
import { useTranslation } from "src/locale/i18n";

import { actions, AppDispatch } from "src/core/store";


import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { addHelpFiles, editHelpFiles, fetchHelpFilesById } from "src/core/store/modules/HelpFiles/thunks";
import { getItemHelpFiles, getLoadingHelpFiles, getStatusHelpFiles as getStatus } from "src/core/store/modules/HelpFiles/selectors";


const HelpForm = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const history = useHistory();

	const item = useSelector(getItemHelpFiles);
	const isLoading = useSelector(getLoadingHelpFiles);
	const statusSubmit = useSelector(getStatus);
	const [hasEditedOrigin, setHasEditedOrigin] = useState<boolean>(false);
	const [hasEditedPublish, setHasEditedPublish] = useState<boolean>(false);
	const isNew = id === "novo";

	const initialValues = useMemo<any>(
		() => ({
		documentName: item?.data?.documentName ?? "",
		keyWords: item?.data?.keyWords ?? "",
		fileOrigin: isNew === false && item?.data?.pathOrigin !== ""? [{documentName: `${item?.data?.pathOrigin}`.slice(79), isMainFile: false, path: item?.data?.pathOrigin}] : null,
		filePublish: isNew === false && item?.data?.pathPublish !== "" ?[{documentName: `${item?.data?.pathPublish}`.slice(79), isMainFile: false, path: item?.data?.pathPublish}] : null,
		}),
		[item, isNew]
	);

	const readFileToBase64 = (file: File) => new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => resolve(reader.result as string)
		reader.onerror = error => reject(error)
	})
	
	  async function handleFileToBase64(file: File) {
		const promises: Promise<string>[] = []
		let base64ResolvedPromisesFiles: string[]
	
		promises.push(readFileToBase64(file))
		base64ResolvedPromisesFiles = await Promise.all(promises)
		return base64ResolvedPromisesFiles.map(base64File => base64File.replace(/^data:text\/plain;base64,/i, ''))
	}

	

	const onSubmit = async (values: any) => {
		
		  if (isNew === true) {
			const fileOriginBase = await handleFileToBase64(values?.fileOrigin[0]);
			const filePublishBase =  await handleFileToBase64(values?.filePublish[0]); 
			const valuesToSend = {...values, fileOrigin: fileOriginBase[0], filePublish:  filePublishBase[0],  pathPublish: "", pathOrigin: "", isActive: true}
			
			 const { type} = await dispatch(
				addHelpFiles({...valuesToSend, fileNamePublish: values.filePublish[0].name, fileNameOrigin: values.filePublish[0].name})
			);

			 if (type !== "helpFiles/add/fulfilled") {
				enqueueSnackbar(t("anErrorHasOcurred"), {
					variant: "error",
				});
			} else {
				enqueueSnackbar("Publicação realizada com sucesso", {
					variant: "success",
				});
				history.goBack();
			}  
		}  else if (isNew === false) {
		
			let valuesToEdit = {...values}
			
			if(values.fileOrigin.length === 0){

				valuesToEdit = {...valuesToEdit, fileOrigin: ""}
			}

			if(hasEditedOrigin === true){
				const fileOriginEdited = await handleFileToBase64(values?.fileOrigin[0])
				valuesToEdit = {...valuesToEdit, fileOrigin: fileOriginEdited[0]}
			}

			if(values.filePublish.length === 0){
				valuesToEdit = {...valuesToEdit, filePublish: ""}
			}

			if(hasEditedPublish === true){
				const filePublishEdited = await handleFileToBase64(values?.filePublish[0]);
				valuesToEdit = {...valuesToEdit, filePublish: filePublishEdited[0]}
			}

			if(hasEditedOrigin === false){
				valuesToEdit = {...valuesToEdit, fileOrigin: ""}
			}
			if(hasEditedPublish === false){
				valuesToEdit = {...valuesToEdit, filePublish: ""}
			}

			const { type, payload } = await dispatch(
				editHelpFiles({ ...valuesToEdit, pathPublish: "", pathOrigin: "", fileNamePublish: values.filePublish[0].name, fileNameOrigin: values.filePublish[0].name, isActive: item?.data?.isActive, id: Number(id)})
			) as any; 

			 if (type === "helpFiles/edit/rejected") {
				enqueueSnackbar(payload?.detail || t("anErrorHasOcurred"), {
					variant: "error",
				});
			} else {
				enqueueSnackbar("Edição realizada com sucesso", {
					variant: "success",
				});
				history.goBack();
			}
		 }  
	};

	useEffect(() => {
		if (id && !isNew) dispatch(fetchHelpFilesById(Number(id)));
		return () => {
			dispatch(actions.helpFiles.clear());
		};
	}, [dispatch, id, isNew]);

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, setSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={ isNew ? "Criação" : 'Edição'}
							slotBottomRight={
								<Submit
									isNew={isNew}
									submitting={isSubmitting || isLoading}
									disabled={!dirty}
								/>
							}
							slotBottonRightPermission={isNew ? "add" : "edit"}
							withPadding
						>
							<Grid container spacing={2}>
								<Grid item md={6} xs={12}>
									<TextField
										label={t("settings:helpFiles.form.documentName")}
										name="documentName"
										required
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										label={t("settings:helpFiles.form.keywords")}
										name="keyWords"
										required
									/>
								</Grid>
							</Grid>
							 <Panel
                            title={t("settings:helpFiles.form.fileOrigin")}
                            withPadding
                        >
                            <Upload
								id="fileOrigin"
                                name="fileOrigin"
								confirmDeletionGoodsAndGuarantees
                                onDelete={(file) => console.log}
								onUploadAfterChanges={(event) => setHasEditedOrigin(true)}
                            />
                        </Panel>
						<Panel
                            title={t("settings:helpFiles.form.filePublish")}
                            withPadding
                        >
                            <Upload
								id="filePublish"
                                name="filePublish"
								confirmDeletionGoodsAndGuarantees
                                onDelete={(file) => console.log}
								onUploadAfterChanges={(event) => setHasEditedPublish(true)}
                            />
                        </Panel> 
						</Panel>				
						{statusSubmit === "failure" && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default HelpForm;
