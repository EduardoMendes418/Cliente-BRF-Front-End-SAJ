import { ParamsGet } from '.';
import { Modulos } from './modules';

export type TOrderConfronting = {
	id?: number,
	confrontingParameterId?: number,
	hierarchyCode?: string,
	hierarchy: string,
	level: number,

	transcienteId?: number,
	flow?: string,
}

export type TOrderConfrontingType = {
	id: number,
	areaDejurId: number,
	areaDejurName: string,
	indDescriptionOrder: boolean;
	indExpectation: boolean;
	indProbability: boolean;
	indStatus: boolean;
	indProbableValue: boolean;
	indPossibleValue: boolean;
	indRemoteValue: boolean;
	indDatabase: boolean;
	indCorrectionIndex: boolean;
	isActive: boolean;
	confrontingParameterHierarchies: TOrderConfronting[];

	moduloId: Modulos;
};

export type TOrderConfrontingTypeFilters = {
	desc?: string;
	modulo: Modulos;
	status?: boolean;
};

export const renameOrderConfrontingProps: { [key: string]: string } = {
	hierarchyCode: 'hierarchyCode',
	hierarchy: 'hierarchy',
}

export const renameProps: { [key: string]: string | any[] } = {
	indStatus: 'status',
	hierarchy: 'hierarchy',
	tipoConfrontingTipoProcessos: ['orderConfronting', renameOrderConfrontingProps]
}

export type TOrderConfrontingFilter = ParamsGet & { idAreaDejur: number }