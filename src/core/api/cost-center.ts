import { paymentsInstance } from ".";
import { TCostCenterWithLikeParams } from "../models/cost-center";

const BASE_URL = "Process";

const costCenterAPI = {
  getById(id: number) {
    return paymentsInstance.get(`${BASE_URL}/get-process-by-id`, { params: { id } });
  },
  getByCostCenter(costCenter: string) {
    return paymentsInstance.get(
      `CostCenter/get-cost-centers-with-like?costCenter=${costCenter}`
    );
  },
  getCostCentersWithLike(params: TCostCenterWithLikeParams) {
    return paymentsInstance.get(
      `${BASE_URL}/get-process-cost-centers-with-like`,
      { params }
    );
  },
  getCustomFieldCostCenterOptions(valueCriteria: string, customFieldName: string) {
	return paymentsInstance.get(
	  `SmartSwap/get-customFieldOptions-smart-swap?customFieldName=${customFieldName}&valueCriteria=${valueCriteria}`
	);
  }
};

export default costCenterAPI;
