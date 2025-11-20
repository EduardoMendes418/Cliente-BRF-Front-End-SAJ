import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "src/core/api/cost-center";
import { TCostCenterWithLikeParams } from "src/core/models/cost-center";
import { RootState } from "../..";

export const fetchCostCenterWithLike = createAsyncThunk(
  "costCenter/fetch",
  async (
    { field, disableCache, ...params }: TCostCenterWithLikeParams & { field?: string, disableCache?: boolean },
    { rejectWithValue, getState }
  ) => {
    try {
      const {
        costCenter: { multipleList },
      } = getState() as RootState;

      if (!disableCache && multipleList && field && multipleList[field]) {
        const item = multipleList[field].find(({ id }) => id === params.id);
        if (item) return { items: [item], field };
      }

      const response = params.id
        ? await api.getById(params.id)
        : await api.getCostCentersWithLike(params);

      const items = response.data.costcenters ?? response.data.items;
      return { items, field };
    } catch (err: any) {
      return rejectWithValue({ error: err.response.data });
    }
  }
);

export const fetchCostCenter = createAsyncThunk(
  "fetchCostCenter/fetch",
  async (costCenter: string, { rejectWithValue, getState }) => {
    try {
      const { data } = await api.getByCostCenter(costCenter);

      return { items: data.costcenters };
    } catch (err: any) {
      return rejectWithValue({ error: err.response.data });
    }
  }
);

type TFetchCostCenter = {
	valueCriteria: string,
	customFieldName: string
}

export const fetchCostCenterSmartSwap = createAsyncThunk(
	"fetchCostCenter/fetchSmartSwap",
	async ({valueCriteria, customFieldName }: TFetchCostCenter, { rejectWithValue }) => {
	  try {
		const { data } = await api.getCustomFieldCostCenterOptions(valueCriteria, customFieldName);
		return { items: data.items};
	  } catch (err: any) {
		return rejectWithValue({ error: err.response.data });
	  }
	}
  );