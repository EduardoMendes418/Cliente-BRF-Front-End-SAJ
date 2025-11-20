import {
	TOfficeManagementRequestRefundParams
} from "src/core/models/office-management-request-refund";
  
  import { paymentsInstance } from ".";
  
  const BASE_URL = "OfficeManagementRefund";
  
  const api = {
	list(params: TOfficeManagementRequestRefundParams) {
	  return paymentsInstance.get(`${BASE_URL}/get-refund-solicitation-all`, { params });
	},
	add(values:any) {
		return paymentsInstance.post(`${BASE_URL}/post-refund-solicitation`, values);
	}
	
  };
  
  export default api;
  