import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	TIntegrationContribuitorData,
	TIntegrationResult,
	TIntegrationsPayload,
	TIntegrationsRequestForm,
} from "src/core/models/integrations";
import api from "src/core/api/integrations";
import { RootState } from "../..";

export const integrateCnpj = createAsyncThunk(
	"integrations/cnpj",
	async (form: TIntegrationsRequestForm, { getState }) => {
		const state = getState() as RootState;
		const oldResult = state.integrations.integrationsResult;

		try {
			const response = await api.integrateCnpj(form);
			return [...oldResult, ...transformResponse(response.data)];
		} catch (e: any) {
			return [...oldResult, ...transformResponse(e.response.data)];
		}
	}
);

export const integrateCpf = createAsyncThunk(
	"integrations/cpf",
	async (form: TIntegrationsRequestForm, { getState }) => {
		const state = getState() as RootState;
		const oldResult = state.integrations.integrationsResult;

		try {
			const response = await api.integrateCpf(form);
			return [...oldResult, ...transformResponse(response.data)];
		} catch (e: any) {
			return [...oldResult, ...transformResponse(e.response.data)];
		}
	}
);

export const integrateEmployeeData = createAsyncThunk(
	"integrations/cpf",
	async (form: TIntegrationContribuitorData) => {

		try {
			const response = await api.integrateEmployeeData(form);
			return response;

		} catch (e: any) {
			return e.response.data;
		}
	}
);

function transformResponse(response: unknown): TIntegrationResult[] {
	if (typeof response === "string") return [{ cpfcnpj: "", message: response, status: "" }];

	const responsePayload = response as TIntegrationsPayload[];

	return responsePayload.map((x) => {
		if (typeof x.data === "string")
			return { cpfcnpj: x.cpfOrCnpj, message: x.data, status: x.status };

		return {
			cpfcnpj: x.cpfOrCnpj,
			message: Object.entries(x.data as { [key: string]: string })
				.map(([k, v]) => `${k}: ${v}`)
				.join(", "),
			status: x.status
		};
	});
}
