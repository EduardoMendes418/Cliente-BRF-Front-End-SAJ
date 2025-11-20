export type TState = {
	id: number;
	name: string;
	stateCode: string;
};

export type TCity = {
	id: number;
	stateId: number;
	name: string;
	state: TState;
};

export type TStateESocialTable = {
	id: number;
	code: string;
	description: string;
	status: boolean;
	eSocialTableId: number;
	eSocialTable: any;
};

export type TCityESocialTable = {
	stateId: number;
	id: number;
	code: string;
	description: string;
	eSocialTable: any;
	eSocialTableId: number;
	status: boolean;
};