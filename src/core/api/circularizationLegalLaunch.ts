import { paymentsInstance } from ".";
import { getIdToken } from "../utils/func";
import { upload } from './utils';


const BASE_URL = 'CircularizationLegalLaunch'

const circularizationLegalLaunchAPI = {
	list(params?: any) {
		return paymentsInstance.get(BASE_URL, {params})
	},
	getById(id: any){
		return paymentsInstance.get(`${BASE_URL}/${id}`)
	},
	uploadFiles(circularizationLegalLaunchId: number, filesList: FileList | any, isMainFile: boolean ) {
		const url = `${BASE_URL}/uploadFiles?circularizationLegalLaunchId=${circularizationLegalLaunchId}&isMainFile=${isMainFile}`;
		return upload(paymentsInstance, url, filesList);
	},
	deleteFile(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/deleteFile?fileId=${id}`);
	},
	edit(
		params: any,
	) {
		const options = {
			method: "PUT",
			headers: {
				accept: "*/*",
				Authorization: `Bearer ${getIdToken()}`,
				"Content-Type": "application/json-patch+json",
			},
			body: JSON.stringify(params),
		};
		return fetch(
			`${import.meta.env.REACT_APP_BASE_URL_PAYMENTS}${BASE_URL}`,
			options
		).then((response) => response);
	}
}

export default circularizationLegalLaunchAPI;