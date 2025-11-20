import { STATUS_FLOW } from "src/screen/judicial-blocks-and-transfers/constants";

export const isEditable = (
	occurrenceReasonType?: any,
	isSolicitacao?: boolean,
	statusFlowId?: STATUS_FLOW,
	permitionEdit?: boolean,
	goodsGuaranteesRequestIsNull?: boolean,
	statusApprovalId?: number | string
) => {
	if (statusApprovalId === -1) return false;
	if (!permitionEdit) return false;

	if (
		statusApprovalId === 1 &&
		occurrenceReasonType === 2 && 
		isSolicitacao &&
		statusFlowId === STATUS_FLOW.IN_UNLOCK
	)
		return true;
	if (statusFlowId === 6 && isSolicitacao && !goodsGuaranteesRequestIsNull)
		return false;
	if (isSolicitacao) {
		switch (statusFlowId) {
			case STATUS_FLOW.IN_VALIDATION:
			case STATUS_FLOW.IN_UNLOCK:
				return true;
			default:
				return false;
		}
	}

	switch (statusFlowId) {
		case STATUS_FLOW.PENDING_CCJ:
		case STATUS_FLOW.RETURNED:
			return true;

		default:
			return false;
	}
};

export const isEditable2 = (
	isSolicitacao?: boolean,
	statusFlowId?: STATUS_FLOW,
	permitionEdit?: boolean,
	goodsGuaranteesRequestIsNull?: boolean,
	statusApprovalId?: number | string
) => {
	if (statusApprovalId === -1) return false;
	if (!permitionEdit) return false;
	if (statusFlowId === 6 && isSolicitacao && !goodsGuaranteesRequestIsNull)
		return false;
	if (isSolicitacao) {
		switch (statusFlowId) {
			case STATUS_FLOW.IN_VALIDATION:
			case STATUS_FLOW.IN_UNLOCK:
				return true;
			default:
				return false;
		}
	}

	switch (statusFlowId) {
		case STATUS_FLOW.PENDING_CCJ:
		case STATUS_FLOW.RETURNED:
			return true;

		default:
			return false;
	}
};
