import i18n, { i18n as I18n } from "i18next";
import {
  initReactI18next,
  useTranslation as useTranslationI18n,
  withTranslation,
  WithTranslation as WithTranslationI18n,
} from "react-i18next";

// Definições de recursos
import ptBrDefault from "./pt-BR/default.json";
import ptBrPagamentos from "./pt-BR/pagamentos.json";
import ptBrPaymentRequest from "./pt-BR/solicitacao-pagamento.json";
import ptBrPension from "./pt-BR/pension.json";
import ptBrProvisions from "./pt-BR/provisions.json";
import ptBrConfronter from "./pt-BR/confronter.json";
import ptBrApproversRegistration from "./pt-BR/approvers-registration.json";
import ptBrCaulculations from "./pt-BR/calculations.json";
import ptBrGoodsAndGuarantees from "./pt-BR/goods-and-guarantees.json";
import ptBrSettings from "./pt-BR/settings.json";
import ptBrJudicialBlocksAndTransfers from "./pt-BR/judicial-blocks-and-transfers.json";
import ptBrRequisitions from "./pt-BR/requisitions.json";
import ptBrCreditReceipt from "./pt-BR/credit-receipt.json";
import ptBrReports from "./pt-BR/reports.json";
import ptBrDataImport from "./pt-BR/data-import.json";
import ptBrClosure from "./pt-BR/closure.json";
import ptBrProvision from "./pt-BR/provisions.json";
import ptBrInspection from "./pt-BR/inspection.json";
import ptBrLegalDocs from "./pt-BR/legal-documents.json";
import ptBrOfficeManagement from "./pt-BR/office-management.json";
import ptBrIntegrations from './pt-BR/integrations.json';
import ptBrESocial from './pt-BR/e-social.json'

import enDefault from "./en/default.json";
import enPagamentos from "./en/pagamentos.json";
import enPaymentRequest from "./en/solicitacao-pagamento.json";
import enPension from "./en/pension.json";
import enApproversRegistration from "./en/approvers-registration.json";
import enGoodsAndGuarantees from "./en/goods-and-guarantees.json";
import enRequisitions from "./en/requisitions.json";
import enReports from "./en/reports.json";
import ptBrContacts from "./pt-BR/contacts.json";

export const defaultNS = "default";
export const resources = {
  "pt-BR": {
    default: ptBrDefault,
    Pagamentos: ptBrPagamentos,
    solicitacaoPagamento: ptBrPaymentRequest,
    pension: ptBrPension,
    provisions: ptBrProvisions,
    confronter: ptBrConfronter,
    approversRegistration: ptBrApproversRegistration,
    calculations: ptBrCaulculations,
    goodsAndGuarantees: ptBrGoodsAndGuarantees,
    settings: ptBrSettings,
    judicialBlocksAndTransfers: ptBrJudicialBlocksAndTransfers,
    requisitions: ptBrRequisitions,
    creditReceipt: ptBrCreditReceipt,
    reports: ptBrReports,
    dataImport: ptBrDataImport,
    provision: ptBrProvision,
    closure: ptBrClosure,
    inspection: ptBrInspection,
    officeManagement: ptBrOfficeManagement,
    legalDocs: ptBrLegalDocs,
	integrations: ptBrIntegrations,
	eSocial: ptBrESocial,
     contacts: ptBrContacts,
  },
  en: {
    default: enDefault,
    Pagamentos: enPagamentos,
    solicitacaoPagamento: enPaymentRequest,
    pension: enPension,
    approversRegistration: enApproversRegistration,
    goodsAndGuarantees: enGoodsAndGuarantees,
    requisitions: enRequisitions,
    reports: enReports,
  },
} as const;

// Inicialização
declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources["pt-BR"];
  }
}

/// Realiza a inicialização do i18next
/// * Verifica se a URL define a linguagem
/// * Verifica se temos uma linguagem salva anteriormente
/// * Aplica as configurações
const initI18n = () => {
  const hasStorage = typeof window.localStorage !== "undefined";
  let lng = "pt-BR";

  // Verificando parâmetro na URL
  const re = /lang=(.+)($|&)/i;
  const m = [window.location.href, window.location.hash].join().match(re);
  if (m) {
    lng = m[1];

    if (hasStorage) window.localStorage.setItem("lang", lng);
  } else if (hasStorage) {
    // Temos um valor anterior?
    const prevLng = window.localStorage.getItem("lang");

    if (prevLng) lng = prevLng;
  }

  i18n.use(initReactI18next).init({
    lng,
    ns: ["default", "Pagamentos"],
    fallbackLng: "pt-BR",
    defaultNS,
    resources,
  });
};
initI18n();

// Exports para typescript
const dictPhrases = resources["pt-BR"];
type DefaultNameType = typeof dictPhrases.default;
type DefaultNamespaceKeys = keyof DefaultNameType;

type TFunc = <S extends string>(
  p: DefaultNSKeyOrNamespace<typeof dictPhrases, S> | DefaultNamespaceKeys,
  params?: { [key: string]: any }
) => string; //GetDictValue<S, typeof dictPhrases>;

//interface UseTranslationRet extends Omit<ReturnType<typeof useTranslationI18n>, 't'> {
interface UseTranslationRet {
  t: TFunc;
  i18n: I18n;
}

const useTranslation = (): UseTranslationRet => {
  const ret = useTranslationI18n();
  return {
    t: ret.t as TFunc,
    i18n: ret.i18n,
  };
};

// type GetDictValue<T extends string, O> =
// 	T extends `${infer A}.${infer B}` ? A extends keyof O ? GetDictValue<B, O[A]> : never
// 	: T extends keyof O ? O[T] :
// 	T extends DefaultNamespaceKeys ? DefaultNameType[T] : never

// T is the dictionary, S ist the next string part of the object property path
// If S does not match dict shape, return its next expected properties
type DeepKeys<T, S extends string> = T extends object
  ? S extends `${infer I1}.${infer I2}`
    ? I1 extends keyof T
      ? `${I1}.${DeepKeys<T[I1], I2>}`
      : keyof T & string
    : S extends keyof T
    ? `${S}`
    : keyof T & string
  : "";

type DefaultNSKeyOrNamespace<T, S extends string> = T extends object
  ? // Se for um namespace
    S extends `${infer NS}:${infer Key}`
    ? // Verificamos se o namespace é válido
      NS extends keyof T
      ? // Namespace válido; continuar com DeepKeys
        `${NS}:${DeepKeys<T[NS], Key>}`
      : // Namespace inválido
        keyof T & string
    : // Não temos um namespace; continuar com DeepKeys
      `${DeepKeys<DefaultNameType, S>}`
  : "";

export type WithTranslation = WithTranslationI18n;
//export type TFunc = ReturnType<typeof useTranslation>["t"];
export type TFuncProps = {
  t: TFunc;
};

const t: TFunc = (s, parms?) => {
  return i18n.t(s, parms);
};

export { i18n, t, useTranslation, withTranslation };
