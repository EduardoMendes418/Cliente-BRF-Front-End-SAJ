import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { State } from './index'
import { AttributeType } from 'src/core/models/process-record-registration-table';

const state = (state: RootState) => state.processRecordRegistrationTable;

export const getListProcessRecordRegistrationTables = createSelector(
	[state],
	({ list }: State) => list
);

export const getListFiltersProcessRecordRegistrationTables = createSelector(
	[state],
	({ listFilters }: State) => listFilters
);

export const getLoadingProcessRecordRegistrationTables = createSelector(
	[state],
	(state) => state.status === 'fetching'
);

export const getProcessRecordTableAttributesWithLike = createSelector(
    [state],
    ({ tableAttributesWithLike }: State) =>
        Array.isArray(tableAttributesWithLike)
            ? tableAttributesWithLike.map((item: any) => ({
                label: item.description,
                value: item.id
            }))
            : []
); 

export const getProcessRecordTableAttributes = createSelector(
    [state],
    (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.AREA)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableNature = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.NATUREZA)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableSphere = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.ESFERA)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableResult = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.RESULTADO)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableAction= createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.TIPO_ACAO)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableClassification = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.CLASSIFICACAO)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableJustice = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.JUSTICA)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableCourt = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.ORGAO_TRIBUNAL)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableState = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.ESTADO_UF)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableCourtCode = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.CODIGO_VARA)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableProceduralPhase = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.FASE_PROCESSUAL)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableEmployeeType = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.TIPO_FUNCIONARIO)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableCbo = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.CBO)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableCountry = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.PAIS)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableTax = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.TRIBUTO)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableTaxScope = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.AMBITO_TRIBUTO)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableGroup = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.GRUPO)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableSubgroup = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.SUBGRUPO)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableSpecies = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.ESPECIE)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableInjunction = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.TIPO_LIMINAR_DOENCA)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableRegistrationPhase = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.FASE_CADASTRO)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableClosing = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.FECHAMENTO)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableProvisionClass = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.CLASSE_PROVISAO)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableAccountingCategory = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.CATEGORIA_CONTABIL)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableIndicator = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.INDICADOR)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableProbabilityOfLoss = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.PROBABILIDADE_PERDA)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableStatus = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.STATUS)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableOrderType = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.TIPO_PEDIDO)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordTableInstaceType = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.INSTANCIA)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessRecordOffice = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.ESCRITORIO)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);

export const getProcessProgress = createSelector(
  [state],
  (tableAttributes) => {
    const enums = tableAttributes.tableAttributesList || [];
    return Array.isArray(enums)
      ? enums
          .filter((item: any) => item.processTableId === AttributeType.TIPO_ANDAMENTO)
          .map((item: any) => ({
            label: item.description,
            value: item.id
          }))
      : [];
  }
);