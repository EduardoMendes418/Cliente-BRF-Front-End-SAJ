import { paymentsInstance } from ".";
import { upload } from "./utils";

const BASE_URL = 'CircularizationBaseGenerationHeader'

const circularizationBaseGenerationHeaderAPI = {
	list(params?: any) {
		return paymentsInstance.get(BASE_URL, {params})
	},
	add(values: any) {
		return paymentsInstance.post(BASE_URL, JSON.stringify(values));
	},
	uploadFiles(circularizationBaseGenerationHeaderId: number, filesList: FileList | any, isMainFile: boolean ) {
		const url = `${BASE_URL}/uploadFiles?circularizationBaseGenerationHeaderId=${circularizationBaseGenerationHeaderId}&isMainFile=${isMainFile}`;
		return upload(paymentsInstance, url, filesList);
	},
	deleteFile(id: number) {
		return paymentsInstance.delete(`${BASE_URL}/deleteFile?fileId=${id}`);
	},
	getById(id: number){
		return paymentsInstance.get(`${BASE_URL}/${id}`)
	},
	setStatus(params: any){
		return paymentsInstance.patch(`${BASE_URL}/set-status`, undefined, { params })
	},
	getOffices(params?: any){
		return paymentsInstance.get(`${BASE_URL}/get-offices`, {params})
	}
}

export default circularizationBaseGenerationHeaderAPI;