export type THierarchy = {
	id?: number;
	approver: string | null;
	approverName: string | null;
	approverEmail: string | null;
	hierarchy: string | null;
	juridicalArea?: string | null;
	sequence: string | null;
	hierarchyCode: string;
	areaId: number[] | null | number;
	status?: boolean;
};

export type TSapHierarchy = {
	hierarchyCode: string;
	hierarchyDescription: string;
	message: string;
	contributorName: string;
	contributorEmail: string;
	hierarchySequence: string;
};

export const renameSearchProps = {
	areaJuridica: 'juridicalArea',
};

export const renameProps = {
	aprovador: 'approver',
	nomeAprovador: 'approverName',
	emailAprovador: 'approverEmail',
	hierarquia: 'hierarchy',
	areaJuridica: 'juridicalArea',
	sequencia: 'sequence',
	codigoHierarquia: 'hierarchyCode'
};

export const renamePropsSAP = {
	codigoHierarquia: 'hierarchyCode',
	descricaoHierarquia: 'hierarchyDescription',
	mensagem: 'message',
	nomeColaborador: 'contributorName',
	emailColaborador: 'contributorEmail',
	sequenciaHierarquia: 'hierarchySequence'
}

export type THierarchyList = {
	codigoHierarquia: string;
	hierarquia: string;
}

export type THierarchyFilter = {
	areaJuridica: string,
	nomeAprovador: string,
	hierarquia: string
	notPaginate?: boolean | undefined
}