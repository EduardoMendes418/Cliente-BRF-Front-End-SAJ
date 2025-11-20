import { AxiosInstance } from 'axios';

import { TDataImport } from '../models/data-import';

export const customUploadFilesConfig = {
	headers: {
		'Content-Type': 'multipart/form-data',
	},
}

export const upload = (client: AxiosInstance, url: string, filesList: FileList, filesFieldName = 'files') => {
	const data = new FormData();
	 Array.from(filesList).forEach((file) => {
		data.append(filesFieldName, file);
	});
	return client.post(url, data, { ...customUploadFilesConfig });
}

export const createFormImport = (payload: TDataImport) => {
	const data = new FormData();
	Array.from(payload.formFile as any).forEach((file) => {
		data.append('formFile', file as File);
	});
	Array.from(payload.formFileAnexos as any).forEach((file) => {
		data.append('formFileAnexos', file as File);
	}); 
	return data;
}

export const createFormImportRequest = (payload: TDataImport) => {
	const data = new FormData();
	Array.from(payload.formFile as any).forEach((file) => {
		data.append('formFile', file as File);
	});
	Array.from(payload.formFileAttend as any).forEach((file) => {
		data.append('formFileAttend', file as File);
	});
	Array.from(payload.formFileRequest as any).forEach((file) => {
		data.append('formFileRequest', file as File);
	});
	return data;
}

export const ifZeroToNull = (keysToVerirify: string[], values: any): any => {
	keysToVerirify.forEach((key) => {
		if (values[key] === 0) {
			values[key] = null;
		}}
	)
	return values;
}