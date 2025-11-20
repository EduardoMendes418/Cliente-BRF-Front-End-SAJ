export type TIntegrationsRequestForm = {
	folderNumbers: string[];
	cpf: string[];
	cnpjs: string[];
};

export type TIntegrateCpf = {
	folderNumbers: string[];
	cpf: string[];
};

export type TIntegrateCnpj = {
	cnpjs: string[];
};

export type TIntegrationsPayload = {
	status: string;
	cpfOrCnpj: string;
	data: unknown;
};

export type TIntegrationResult = {
	cpfcnpj: string;
	message: string;
	status: string;
};

export type TIntegrationContribuitorData = {
	folderNumbers: string[];
	cpf: string;
	id: string;
}
