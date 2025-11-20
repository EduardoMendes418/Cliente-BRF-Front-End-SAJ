import { TFinanceChartOfAccountsCategories } from './finance-chart-of-accounts-categories';
import { ParamsGet } from '.';
import { Modulos } from './modules';

export type AbaterSaldoProvisao = number;

export type TExceptionRules = {
	id: number;
	paymentTypeId: number;
	areaId: number;
	processType: string;
}

export type TPaymentType = {
	retificacaoESocial: boolean;
	id?: number;
	financeChartOfAccountsCategoryId: number;
	financeChartOfAccountsCategory?: TFinanceChartOfAccountsCategories;
	moduloId: Modulos;
	formasPagamentoIds?: number[];
	status: boolean;
	solicitarPagamentoBaixaProvisoria: boolean;
	cancelamentoAutomatico: boolean;
	abaterSaldoProvisao: AbaterSaldoProvisao;
	gerarBensGarantias: boolean;
	eSocialRestriction: boolean,
	uploadESocialPJC: boolean;
	alterarStatusProcesso: boolean;
	generateGuideFiles: number;
	gerarCalculoPagamento: boolean;
	contabilizarPagamentoSap: boolean;
	contabilizarCreditoSap: boolean;
	importarDados: boolean;
	disponibilizarComprovantePagamento: boolean;
	processType: string;
	resultProcessFolder: number;
	exceptionRules: TExceptionRules[];
	contabilizarCcPorAreaDejur: boolean;
	folderNumberRequired?: boolean | null;
};

export type TPaymentTypeFilters = ParamsGet & {
	desc?: string;
	modulo?: Modulos;
	status?: boolean;
	eSocialRestriction?: boolean;
};

export const renameExceptionsRulesProps: { [key: string]: string } = {
	tipoPagamentoId: 'paymentTypeId',
	tipoProcesso: 'processType',
};

export const renameProps: { [key: string]: string | any[] } = {
	tipoProcesso: 'processType',
	tipoPagamentoTipoProcessos: ['exceptionRules', renameExceptionsRulesProps]
};
