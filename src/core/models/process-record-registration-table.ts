export type TSearchTableProcessRecordRegistration = {
    id: number,
    tableId: number,
    tableIdToRemove: number[],
    status: boolean,
    description: string,
    page: number,
    pageSize: number,
}
 


export type TGetTableAttributes = {
    processTableId?: number[];
    descriptionLike?: string;
    attributes?: Array<{
        typeAttributeId?: number;
        processTableId?: number;
        value: number;
    }>;
}
 
export type TCreateProcessRecordRegistration = {
    id: number,
    description: string,
    status: boolean,
    processTableId: number,
    processRegistrationTablesAttributesValues?: [
        {
            id: number,
            processRegistrationTableId: number,
            processTablesTypeAttributeId: number,
            valueInt: number,
            valueText: string,
            status: boolean
        }
    ]
}

export enum AttributeType {
    AMBITO_TRIBUTO = 1,
    AREA,
    CATEGORIA_CONTABIL,
    CBO,
    CIDADE,
    CLASSE_PROVISAO,
    CLASSIFICACAO,
    CODIGO_VARA,
    COMARCA_FORO,
    ESCRITORIO,
    ESFERA,
    ESPECIE,
    ESTADO_UF,
    FASE_CADASTRO,
    FASE_PROCESSUAL,
    FECHAMENTO,
    GRUPO,
    INDICADOR,
    INSTANCIA,
    JUSTICA,
    NATUREZA,
    ORDINAL_VARA,
    ORGAO_TRIBUNAL,
    PAIS,
    PROBABILIDADE_PERDA,
    RESULTADO,
    STATUS,
    SUBGRUPO,
    TIPO_ACAO,
    TIPO_LIMINAR_DOENCA,
    TIPO_PEDIDO,
    TIPO_FUNCIONARIO,
    TRIBUTO,
    VARA_TURMA,
    TIPO_DOCUMENTO,
    LOCALIDADE,
    TIPO_ANDAMENTO,
    TIPO_COMPROMISSO,
    SEGURADORA
}

