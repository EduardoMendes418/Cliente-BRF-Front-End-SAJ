export type Dependent = {
	id: number | '';
	cpfDep: string;
	tpDep: string;
	descDep: string;
	eventLaunchId: number | '';
}

export type Remuneration = {
	id: number | '';
	dtRemun: string | null;
	vrSalFx: number | '';
	undSalFixo: string;
	dscSalVar: string;
	eventLaunchId: number | '';
}

export type Observations = {
	id: number | '';
	observacao: string;
	eventLaunchId: number | '';
}

export type MudCategAtiv = {
	id: number | '';
	codCateg: string;
	natAtividade: string;
	dtMudCategAtiv: string | null;
	eventLaunchId: number | '';
}

export type UnicContr = {
	id: number | '';
	matUnic: string;
	codCateg: number | '';
	dtInicio: string | null;
	eventLaunchId: number | '';
}

export type IdePeriodo = {
	id: number | '';
	perRef: string;
	vrBcCpMensal: number | '';
	vrBcCp13: number | '';
	baseCalculoVrBcFgts: number | '';
	baseCalculoVrBcFgts13: number | '';
	grauExp: string;
	vrBcFgtsGuia: number | '';
	vrBcFgts13Guia: number | '';
	pagDireto: string;
	codCateg: string;
	vrBcCPrev: number | '';
	baseMudCategVrBcFgts: number | '';
	baseMudCategVrBcFgts13: number | '';
	eventLaunchId: number | '';
}

export type InfoContr = {
	id: number | '';
	infoContrTpContr: string;
	indContr: string;
	dtAdmOrig: string | null;
	indReint: string;
	indCateg: string;
	indNatAtiv: string;
	indMotDeslig: string;
	indUnic: string;
	matricula: string;
	codCateg: number | '';
	dtInicio: string | null;
	codCBO: string;
	natAtividade: string;
	remuneracao: Remuneration[];
	tpRegTrab: string;
	tpRegPrev: string;
	dtAdm: string | null;
	tmpParc: string;
	duracaoTpContr: string;
	duracaoDtTerm: string | null;
	clauAssec: string;
	objDet: string;
	observacoes: Observations[];
	sucessaoVincTpInsc: string;
	sucessaoVincNrInsc: string;
	matricAnt: string;
	dtTransf: string | null;
	dtDeslig: string | null;
	mtvDeslig: string;
	dtProjFimAPI: string | null;
	infoTermDtTerm: string | null;
	mtvDesligTSV: string;
	mudCategAtiv: MudCategAtiv[];
	unicContr: UnicContr[];
	ideEstabTpInsc: string;
	ideEstabNrInsc: string;
	compIni: DateType;
	compFim: DateType;
	repercProc: string;
	vrRemun: number | '';
	vrAPI: number | '';
	vr13API: number | '';
	vrInden: number | '';
	vrBaseIndenFGTS: number | '';
	pagDiretoResc: string;
	idePeriodo: IdePeriodo[];
	eventLaunchId: number | '';
}

export type ESocialS2500old = {
	id: number;
	accrualMonth: string | null;
	processId: number | '';
	eventLaunchBaseId: number | null;
	dateOfSubmissionToTheGovernment: string | null;
	eventCode: number | '';
	eventLaunchStatus: number | null;
	indRetif: string;
	nrRecibo: string;
	procEmi: string;
	verProc: string;
	ideEmpregadorTpInsc: string;
	ideEmpregadorNrInsc: string;
	ideRespTpInsc: string;
	ideRespNrInsc: string;
	origem: string;
	nrProcTrab: string;
	obsProcTrab: string;
	dtSent: string | null;
	ufVara: string;
	codMunic: string;
	idVara: number | '';
	dtCCP: string | null;
	tpCCP: string;
	cnpjCCP: string;
	cpfTrab: string;
	nmTrab: string;
	dtNascto: string | null;
	dependente: Dependent[] | [];
	infoContr: InfoContr[] | [];
}

type DateType = string | null;
type NumberOrEmptyString = number | "";

export type RemuneracaoType = {
	id: NumberOrEmptyString,
	dtRemun: DateType,
	vrSalFx: NumberOrEmptyString,
	undSalFixo: string,
	dscSalVar: string
};

export type ObservacoesType = {
	id: NumberOrEmptyString,
	observacao: string
};

export type MudCategAtivType = {
	id: NumberOrEmptyString,
	codCateg: string,
	natAtividade: string,
	dtMudCategAtiv: DateType
};

export type UnicContrType = {
	id: NumberOrEmptyString,
	matUnic: string,
	codCateg: NumberOrEmptyString,
	dtInicio: DateType
};

export type IdePeriodoType = {
	id: NumberOrEmptyString,
	perRef: string,
	vrBcCpMensal: NumberOrEmptyString,
	vrBcCp13: NumberOrEmptyString,
	grauExp: string,
	vrBcFGTSProcTrab: NumberOrEmptyString,
	vrBcFGTSSefip: NumberOrEmptyString,
	vrBcFGTSDecAnt: NumberOrEmptyString,
	codCateg: string,
	vrBcCPrev: NumberOrEmptyString,
	// baseMudCategVrBcFgts: NumberOrEmptyString,
	// baseMudCategVrBcFgts13: NumberOrEmptyString
};

export type InfoContrType = {
	id: NumberOrEmptyString,
	infoContrTpContr: string,
	indContr: string,
	dtAdmOrig: DateType,
	indReint: string,
	indCateg: string,
	indNatAtiv: string,
	indMotDeslig: string,
	matricula: string,
	codCateg: NumberOrEmptyString,
	dtInicio: DateType,
	codCBO: string,
	natAtividade: string,
	remuneracao: RemuneracaoType[],
	tpRegTrab: string,
	tpRegPrev: string,
	dtAdm: DateType,
	tmpParc: string,
	duracaoTpContr: string,
	duracaoDtTerm: DateType,
	clauAssec: string,
	objDet: string,
	observacoes: ObservacoesType[],
	sucessaoVincTpInsc: string,
	sucessaoVincNrInsc: string,
	matricAnt: string,
	dtTransf: DateType,
	dtDeslig: DateType,
	mtvDeslig: string,
	dtProjFimAPI: DateType,
	pensAlim: NumberOrEmptyString,
	percAliment: NumberOrEmptyString,
	vrAlim: NumberOrEmptyString,
	infoTermDtTerm: DateType,
	mtvDesligTSV: string,
	mudCategAtiv: MudCategAtivType[],
	unicContr: UnicContrType[],
	ideEstabTpInsc: string,
	ideEstabNrInsc: string,
	compIni: DateType,
	compFim: DateType,
	indReperc: NumberOrEmptyString,
	indenSD: string,
	indenAbono: string,
	abono: { id: NumberOrEmptyString, anoBase: string }[],
	idePeriodo: IdePeriodoType[],
	hrsTrab: string,
	dia: string,
};
export type IdeTrabType = {
    cpfTrab: string;
    calcTrib: CalcTribType[];
}

export type ESocialS2500 = {
	id: number,
	submitAction?: null | string,
	accrualMonth: DateType,
	processId: NumberOrEmptyString,
	eventLaunchBaseId: NumberOrEmptyString | null,
	dateOfSubmissionToTheGovernment: DateType,
	eventCode: NumberOrEmptyString,
	eventLaunchStatus: NumberOrEmptyString,
	indRetif: string,
	nrRecibo: string,
	tpAmb: string,
	procEmi: string,
	verProc: string,
	ideEmpregadorTpInsc: string,
	ideEmpregadorNrInsc: string,
	ideRespTpInsc: string,
	ideRespNrInsc: string,
	ideRespDtAdmRespDir: string,
	ideRespMatRespDir: string,
	origem: string,
	nrProcTrab: string,
	obsProcTrab: string,
	dtSent: DateType,
	ufVara: string,
	codMunic: string,
	idVara: NumberOrEmptyString,
	dtCCP: DateType,
	tpCCP: string,
	cnpjCCP: string,
	cpfTrab: string,
	nmTrab: string,
	dtNascto: DateType,
	infoContr: InfoContrType[],
};

export enum ESocial {
	S2500 = 1,
	S2501 = 2,
	S3500 = 3,
	S5501 = 4,
}
export const objESocial = {
	[ESocial.S2500]: "S-2500",
	[ESocial.S2501]: "S-2501",
	[ESocial.S3500]: "S-3500",
	[ESocial.S5501]: "S-5501",
}

export type TSearchESocial = {
	accrualMonth: string | null;
	eventCode: ESocial | "";
	folderNumber: string;
	processId?: number | '';
	paymentId?: number | undefined;
	eventLaunchBaseId?: number | null;
	cprb?: any
}

export type TAutoCompleteESocial = {
	admissionDate: string
	calculationEndDate: string
	calculationStartDate: string
	courtPanelNumber: number
	courtPanelUF: string
	processNumber: string
	registration: string
	repercussionIndication: number
	sentenceDate: string
	typeOfContract: string | number
	workersCPF: string
	workersName: string
	cprb?: boolean | null
}

type InfoDepType = {
	cpfDep: string,
	dtNascto: DateType,
	nome: string,
	depIRRF: string,
	tpDep: string,
	descrDep: string
};

type BenefPenType = {
	cpfDep: string,
	vlrDepenSusp: number,
	dtLaudo: DateType,
	infoDep: InfoDepType[]
};

type DedSuspType = {
	indTpDeducao: number,
	vlrDedSusp: number,
	benefPen: BenefPenType[]
};

type InfoValoresType = {
	indApuracao: NumberOrEmptyString,
	vlrNRetido: NumberOrEmptyString,
	vlrDepJud: NumberOrEmptyString,
	vlrCmpAnoCal: NumberOrEmptyString,
	vlrCmpAnoAnt: NumberOrEmptyString,
	vlrRendSusp: NumberOrEmptyString,
	dedSusp: DedSuspType[]
};

type InfoProcRetType = {
	tpProcRet: NumberOrEmptyString,
	nrProcRet: string,
	codSusp: string,
	infoValores: InfoValoresType[]
};

type InfoCRIRRFType = {
	id: NumberOrEmptyString,
	tpCr: string,
	vrCr: NumberOrEmptyString,
	vrRendTrib: NumberOrEmptyString,
	vrRendTrib13: NumberOrEmptyString,
	vrRendMoleGrave: NumberOrEmptyString,
	vrRendIsen65: NumberOrEmptyString,
	vrJurosMora: NumberOrEmptyString,
	vrRendIsenNTrib: NumberOrEmptyString,
	descIsenNTrib: string,
	vrPrevOficial: NumberOrEmptyString,
	descRRA: string,
	qtdMesesRRA: NumberOrEmptyString,
	vlrDespCustas: NumberOrEmptyString,
	vlrDespAdvogados: NumberOrEmptyString,
	ideAdv: { id: NumberOrEmptyString, tpInsc: string, nrInsc: string, vlrAdv: NumberOrEmptyString }[],
	dedDepen: { id: NumberOrEmptyString, tpRend: NumberOrEmptyString, cpfDepen: string, vlrDecucao: NumberOrEmptyString }[],
	penAlim: { id: NumberOrEmptyString, tpRend: NumberOrEmptyString, cpfDep: string, vlrPensao: NumberOrEmptyString }[],
	infoProcRet: InfoProcRetType[]
};

type CalcTribType = {
	id: NumberOrEmptyString,
	cpfTrab: string,
	perRef: string,
	vrBcCpMensal: NumberOrEmptyString,
	vrBcCp13: NumberOrEmptyString,
	infoCRContrib: { id: NumberOrEmptyString, tpCr: string, vrCr: NumberOrEmptyString }[] | [],
	infoCRIRRF: InfoCRIRRFType[],
	vlrDedPensao: NumberOrEmptyString,
	vlrDedDepen: NumberOrEmptyString,
	dedDepen: { id: NumberOrEmptyString, tpRend: NumberOrEmptyString, cpfDepen: string, vlrDecucao: NumberOrEmptyString }[] | [],
	penAlim: { id: NumberOrEmptyString, tpRend: NumberOrEmptyString, cpfDep: string, vlrPensao: NumberOrEmptyString }[] | [],
	descRRA: string,
	qtdMesesRRA: NumberOrEmptyString,
	vlrDespCustas: NumberOrEmptyString,
	vlrDespAdvogados: NumberOrEmptyString,
	ideAdv: { id: NumberOrEmptyString, tpInsc: string, nrInsc: string, vlrAdv: NumberOrEmptyString }[] | []
};

export type ESocialS2501 = {
	id: number,
	accrualMonth: DateType,
	submitAction?: null | string,
	processId: NumberOrEmptyString,
	dateOfSubmissionToTheGovernment: DateType,
	eventCode: NumberOrEmptyString,
	eventLaunchStatus: NumberOrEmptyString,
	indRetif: string,
	nrRecibo: string,
	tpAmb: string,
	procEmi: string,
	verProc: string,
	ideEmpregadorTpInsc: string,
	ideEmpregadorNrInsc: string,
	nrProcTrab: string,
	perApurPgto: string,
	/* ideSeqProc: string, */
	obs: string,
	cprb: any,
	calcTrib: CalcTribType[]
} & TSearchESocial;


export type ESocialS2501Old = {
	id: number;
	accrualMonth: string | null;
	processId: number | '';
	eventLaunchBaseId: number | '';
	dateOfSubmissionToTheGovernment: string | null;
	eventCode: number | '';
	eventLaunchStatus: number | '';
	indRetif: string;
	nrRecibo: string;
	tpAmb: string;
	procEmi: string;
	verProc: string;
	ideEmpregadorTpInsc: string;
	ideEmpregadorNrInsc: string;
	nrProcTrab: string;
	perApurPgto: string;
	obs: string;
	calcTrib: CalcTrib[] | [];
};

export type CalcTrib = {
	id: number | '';
	cpfTrab: string;
	perRef: string;
	vrBcCpMensal: number | '';
	vrBcCp13: number | '';
	vrRendIRRF: number | '';
	vrRendIRRF13: number | '';
	infoCRContrib: InfoCRContrib[] | [];
	infoCRIRRF: InfoCRIRRF[] | [];
	vlrDedPensao: number | '';
	vlrDedDepen: number | '';
	dedDepen: DedDepen[] | [];
	penAlim: PenAlim[] | [];
	descRRA: string;
	qtdMesesRRA: number | '';
	vlrDespCustas: number | '';
	vlrDespAdvogados: number | '';
	ideAdv: IdeAdv[] | [];
};

export type InfoCRContrib = {
	id: number | '';
	tpCr: string;
	vrCr: number | '';
};

export type InfoCRIRRF = {
	id: number | '';
	tpCr: string;
	vrCr: number | '';
};

export type DedDepen = {
	id: number | '';
	cpfDepen: string;
	vlrDecucao: number | '';
};

export type PenAlim = {
	id: number | '';
	cpfDep: string;
	vlrPensao: number | '';
};

export type IdeAdv = {
	id: number | '';
	tpInsc: string;
	nrInsc: string;
	vlrAdv: number | '';
};

export type ESocialS3500 = {
	id: number;
	submitAction?: null | string;
	accrualMonth: string | null;
	processId: number | '';
	eventLaunchBaseId: number | '' | null;
	dateOfSubmissionToTheGovernment: string | null;
	eventCode: number | '';
	eventLaunchStatus: number | '';
	verProc: string;
	ideEmpregadorTpInsc: string;
	ideEmpregadorNrInsc: string;
	tpEvento: string;
	nrRecEvt: string;
	nrProcTrab: string;
	cpfTrab: string;
	perApurPgto: string;
	process?: null;
	/* ideSeqProc: string */
};

export const objEventLaunchStatus = {
	1: "Pendente",
	2: "Enviado SAP",
	3: "Erro validador",
	4: "Processado",
	5: "Excluído",
	6: "Cancelado"
}

export type ExtractEsocialFile = {
	paymentId?: any
	fileName: string;
	fileBase64: any;
	folderNumber: string;
	pagamentoESocial: {
		agreementApprovalDate: string;
		remunerationAmount: number;
		compensationAmount: number;
		fgtsReflexes: number;
		cprb: boolean;
		startDateForESocialCalculation: string;
		endDateForESocialCalculation: string;
		typeOfEmploymentContract: string;
		decisionType: number;
		paymentId: number;
	}
}