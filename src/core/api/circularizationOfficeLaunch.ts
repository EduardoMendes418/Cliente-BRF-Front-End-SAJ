import { paymentsInstance } from ".";
import { getIdToken } from "../utils/func";
import { upload } from './utils';


const BASE_URL = 'CircularizationOfficeLaunch'

const circularizationOfficeLaunchAPI = {
	list(params?: any) {
		return paymentsInstance.get(BASE_URL, {params})
	},
	add(values: any) {
		return paymentsInstance.post(BASE_URL, values)
	},
	getById(id: any){
		return paymentsInstance.get(`${BASE_URL}/${id}`)
	},
	uploadFiles(circularizationOfficeLaunchId: number, filesList: FileList | any, isMainFile: boolean ) {
		const url = `${BASE_URL}/uploadFiles?circularizationOfficeLaunchId=${circularizationOfficeLaunchId}&isMainFile=${isMainFile}`;
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

export default circularizationOfficeLaunchAPI;