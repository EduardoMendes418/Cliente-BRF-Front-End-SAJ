import { TYPE_FLOW } from "src/screen/goods-and-guarantees/constants";

export type TGuaranteeModality = {
	id?: number | string;
	description: string;
	status?: boolean;
	processType: string;
	guaranteeMethodIds: number[];
	typeFlow: TYPE_FLOW;
};

export const renameProps: { [key: string]: string } = {
	goodsGuaranteesModalityMethods: 'guaranteeMethodIds'
}
