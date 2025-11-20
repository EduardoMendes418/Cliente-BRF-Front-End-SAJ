import { Box, Button } from "@material-ui/core";
import { useSelector } from "react-redux";

import Form from "src/components/form";
import Attachments from "src/components/Attachments";

import { useTranslation } from "src/locale/i18n";
import { getDataImportStatus } from "src/core/store/modules/data-import/selectors";
import { Props } from "./types";
import { useHistory } from "react-router-dom";
import { Submit } from "src/components/button";

const FormImportMultipleAttachmentsRequest = ({
	onSubmit,
	filters,
	fileName,
	labelFormFile,
	labelFileAttachments,
	setIsImportScreen,
	button,
	labelFormFileText,
	labelFileAttachmentsText,
	accept
}: Props) => {
	const { t } = useTranslation();
	const status = useSelector(getDataImportStatus);

	const {
		location: { pathname },
	} = useHistory();

	return (
		<Form
			initialValues={{ formFile:[], formFileAttend:[], formFileRequest: []}}
			onSubmit={onSubmit}
			permission
		>
			{({ handleSubmit, values }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Attachments
						name="formFile"
						id="formFile" 
						multiple={false}
						accept={accept}
						label={labelFormFile}
						text={labelFormFileText}
					/>
					 <Attachments
						name="formFileRequest"
						id="formFileRequest"
						label={labelFileAttachments}
						text={labelFileAttachmentsText}
					/> 
					<Attachments
						name="formFileAttend" 
						id="formFileAttend" 
						label={"Anexo de Atendimento"}
						text={labelFileAttachmentsText}
					/>
					<Box
						display="flex"
						justifyContent="flex-end"
						className="margin-top-16"
						gridGap="1rem"
					>
						{setIsImportScreen !== undefined && (
							<Button
								variant="outlined"
								style={{ marginRight: "16px" }}
								onClick={() => setIsImportScreen(false)}
							>
								{t("dataImport:goBack")}
							</Button>
						)}
						<Submit
							text={t("dataImport:common.importSpreadsheet")}
							disabled={!values.formFile?.length}
							submitting={status === "saving"}
						/>

						{pathname !== "/carga-de-dados/requisicoes" && pathname !== "/carga-de-dados/recebimento-de-credito"
							? fileName !== undefined && (
									<Button
										color="primary"
										variant="contained"
										href={`${import.meta.env.PUBLIC_URL}/downloads/${fileName}`}
										target="_blank"
										rel="noopener"
									>
										{t("dataImport:common.generateSpreadsheet")}
									</Button>
							  )
							: button}
					</Box>
				</form>
			)}
		</Form>
	);
};

export default FormImportMultipleAttachmentsRequest;
