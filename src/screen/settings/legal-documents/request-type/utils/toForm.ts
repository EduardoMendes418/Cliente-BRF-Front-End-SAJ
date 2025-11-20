import { TLegalDocRequestType } from "src/core/models/legal-document-request-types";

export function toForm(item: TLegalDocRequestType) {
	return {
		...item,
		hoursDeadline: item.hoursDeadline === null ? '' : item.hoursDeadline,
		administrativeControlResponsiblesIds: item.administrativeControlResponsiblesIds || [],
	}
}
