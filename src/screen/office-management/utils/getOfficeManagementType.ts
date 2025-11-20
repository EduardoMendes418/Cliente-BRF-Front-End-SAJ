export enum OfficeManagementTypeEnum {
  requestPayment = 1,
  lawyerReview = 2,
  invoicePosting = 3,
  evaluationJuridical = 4,
  evaluationControl = 5,
}

export const OfficeManagementType = {
  [OfficeManagementTypeEnum.requestPayment]:
    "/gestao-escritorio/solicitar-pagamento",
  [OfficeManagementTypeEnum.lawyerReview]:
    "/gestao-escritorio/avaliacao-advogado",
  [OfficeManagementTypeEnum.invoicePosting]:
    "/gestao-escritorio/lacamento-fatura",
  [OfficeManagementTypeEnum.evaluationJuridical]:
    "/gestao-escritorio/avaliacao-area-juridica",
  [OfficeManagementTypeEnum.evaluationControl]:
    "/gestao-escritorio/avaliacao-controle-juridico",
} as any;

export const OfficeManagementStageStatus = {
  [OfficeManagementTypeEnum.requestPayment]: "Solicitar Pagamento",
  [OfficeManagementTypeEnum.lawyerReview]: "Solicitado",
  [OfficeManagementTypeEnum.invoicePosting]: "Lançamento de fatura",
  [OfficeManagementTypeEnum.evaluationJuridical]:
    "Avaliação resp. área jurídica",
  [OfficeManagementTypeEnum.evaluationControl]:
    "Avaliação resp. controle jurídico",
  "-1": "Reprovado",
};

export const OfficeManagementStageStatusList = {
	[OfficeManagementTypeEnum.requestPayment]: "Solicitar Pagamento",
	[OfficeManagementTypeEnum.lawyerReview]: "Solicitado",
	[OfficeManagementTypeEnum.invoicePosting]: "Lançamento de fatura",
	[OfficeManagementTypeEnum.evaluationJuridical]:
	  "Avaliação resp. área jurídica",
	[OfficeManagementTypeEnum.evaluationControl]:
	  "Avaliação resp. controle jurídico",
	"-1": "Reprovado",
  };

export const getOfficeManagementType = (path: string): number => {
  let selectedPage: number = OfficeManagementTypeEnum.requestPayment;
  Object.keys(OfficeManagementType).forEach((key) => {
    if (path.includes(OfficeManagementType[key])) selectedPage = parseInt(key);
  });
  return selectedPage;
};
