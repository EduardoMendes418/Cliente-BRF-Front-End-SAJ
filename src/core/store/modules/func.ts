import { TProcess, TProcessFormData } from "src/core/models/process";

export const finderParty =
  (select: string) =>
  ({ situation }: { situation: string }) =>
    situation.toUpperCase() === select;

export const normalizeProcessFolderData = ({
  legalDepartmentArea,
  legalDepartmentAreaId,
  processNumber,
  oldNumber,
  id,
  processParties,
  internalLawyer,
  costCenter,
  folderNumber,
  closed,
  agent,
  sphere,
  statusId,
  empresa,
  officeResponsible,
	legalResponsibleName
}: TProcess): TProcessFormData => {
  return {
    legalDepartmentArea,
    legalDepartmentAreaId,
    numeroProcesso: processNumber ?? oldNumber,
    processKey: id,
    nomeReclamante:
      processParties?.find(finderParty("OUTRA PARTE"))?.name ?? "",
    empresa,
	processParties,
    internalLawyer,
    centroCusto: costCenter,
    folderNumber,
    closed,
    agent,
    sphere,
    statusId,
    officeResponsible,
		legalResponsible: legalResponsibleName
  };
};
