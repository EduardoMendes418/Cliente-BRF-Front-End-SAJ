import React from 'react';
import Button from '@material-ui/core/Button';
import { useFormikContext } from 'formik';
import { TPayment } from 'src/core/models/payment'; // Ajuste o caminho de importação conforme necessário
import { useSnackbar } from 'notistack';

const FileBase64Uploader: React.FC = () => {
	const { values, setFieldValue } = useFormikContext<TPayment>();
	const { enqueueSnackbar } = useSnackbar();


	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if(Object.keys(values?.filesEsocial).length > 0){
			return enqueueSnackbar( "Permitido apenas um anexo eSocial",
				{ variant: "error" })
		} 
		if (event.target.files) {
			const files = event.target.files;
			const currentFilesBase64 = values.filesEsocial ? { ...values.filesEsocial } : {};
			const newFilesBase64: { [filename: string]: string } = {};

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const base64 = await convertToBase64(file);
				newFilesBase64[file.name] = base64;
			}

			const updatedFilesBase64 = { ...currentFilesBase64, ...newFilesBase64 };
			setFieldValue('filesEsocial', updatedFilesBase64);
		}
	};

	const convertToBase64 = async (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);

			fileReader.onload = () => {
				const result = fileReader.result as string;
				const base64Data = result.split(',')[1];
				resolve(base64Data);
			};

			fileReader.onerror = (error) => {
				reject(error);
			};
		});
	};

	return (
		<div>
			<input
				accept=".pjc, .xlsx"
				style={{ display: 'none' }}
				id="raised-button-file"
				multiple={false}
				type="file"
				onChange={handleFileChange}
			/>
			<label htmlFor="raised-button-file">
				<Button variant="outlined" color="secondary" component="span">
					Adicionar arquivo
				</Button>
			</label>
		</div>
	);
};

export default FileBase64Uploader;
