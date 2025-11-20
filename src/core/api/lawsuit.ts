import { integrationInstance } from ".";

const BASE_URL = "Lawsuit";

const api = {
	postByFolderIds(param: number[]){
		return integrationInstance.post(`${BASE_URL}/RunIntegrationByFolderIds?recordCustomFields=${true}`, param)
	},

	postByFolderNumber(param: number[]){
		return integrationInstance.post(`${BASE_URL}/RunIntegrationByListFolderNumber`, param)
	}
}

export default api;