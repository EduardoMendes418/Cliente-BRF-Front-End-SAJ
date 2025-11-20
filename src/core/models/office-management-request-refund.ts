import { ParamsGet } from ".";
import { STATUS_FLOW } from "src/screen/judicial-blocks-and-transfers/constants";

export type TOfficeManagementRequestRefundParams = ParamsGet & {
	refundSolicitationId?: number | "";
	requestDate?: string | null;
	folderNumber?: string;
	areaDejurId?: number | "";
	processPartiesOtherId?: number | "";
	externalOfficeId?: number;
	requesterId?: number | null;
	officeResponsible?: number | "" 
	stage?: number;
	statusFlowId?: STATUS_FLOW | ""
};

export type TOfficeManagementRequestRefund = {
	id?: number | "",
	refundSolicitationId?: number | "",
	folderNumber?: string | "",
	externalOfficeId?: number | "",
	registrationDate?: string | null,
	pantryValue?: number | "",
	description?: string | "",
	areaDejur?: string,
	areaDejurId?: number | "",
	requesterId?: number | "",
	processPartiesOtherId?: number | "",
	filesSolicitation?: any,
};