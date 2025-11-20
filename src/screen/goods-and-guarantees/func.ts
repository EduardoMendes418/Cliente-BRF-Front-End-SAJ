import { pathOr } from "ramda";
import { statusTextApprovalsFlow, STATUS_APPROVALS_FLOW } from "src/core/utils/constants";
import {
	statusTextInsurance,
	statusTextLetter,
	statusTextProperty,
	STATUS_FLOW,
	TYPE_FLOW,
} from "./constants";

const getTextStatusFlow = (typeFlow: TYPE_FLOW, idx: STATUS_FLOW) =>
	pathOr(statusTextApprovalsFlow[STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE], [typeFlow > 0 ? typeFlow - 1 : '', idx], [
		statusTextInsurance,
		statusTextProperty,
		statusTextLetter
	])

export const statusAsOptions = (typeFlow: TYPE_FLOW) => [
	{
		label: getTextStatusFlow(typeFlow, STATUS_FLOW.NONE),
		value: STATUS_FLOW.NONE
	},
	{
		label: getTextStatusFlow(typeFlow, STATUS_FLOW.REJECTED_DEFINITIVE),
		value: STATUS_FLOW.REJECTED_DEFINITIVE
	},
	{
		label: getTextStatusFlow(typeFlow, STATUS_FLOW.APPROVED_DEFINITIVE),
		value: STATUS_FLOW.APPROVED_DEFINITIVE
	},
	{
		label: getTextStatusFlow(typeFlow, STATUS_FLOW.RETURNED),
		value: STATUS_FLOW.RETURNED
	},
	{
		label: getTextStatusFlow(typeFlow, STATUS_FLOW.REQUESTED),
		value: STATUS_FLOW.REQUESTED
	},
	{
		label: getTextStatusFlow(typeFlow, STATUS_FLOW.IN_REVIEW),
		value: STATUS_FLOW.IN_REVIEW
	},
	{
		label: getTextStatusFlow(typeFlow, STATUS_FLOW.APPROVED_DRAFT),
		value: STATUS_FLOW.APPROVED_DRAFT
	},
	{
		label: getTextStatusFlow(typeFlow, STATUS_FLOW.RETURNED_DRAFT),
		value: STATUS_FLOW.RETURNED_DRAFT
	},
	{
		label: getTextStatusFlow(typeFlow, STATUS_FLOW.IN_REVIEW_DRAFT),
		value: STATUS_FLOW.IN_REVIEW_DRAFT
	},
];

export const requesterScope = (statusFlowId: STATUS_FLOW) => [
	STATUS_FLOW.NONE,
	STATUS_FLOW.REQUESTED,
	STATUS_FLOW.RETURNED,
	STATUS_FLOW.APPROVED_DRAFT,
	STATUS_FLOW.RETURNED_DRAFT,
].includes(statusFlowId)

export const approverScope = (statusFlowId: STATUS_FLOW) => [
	STATUS_FLOW.IN_REVIEW,
	STATUS_FLOW.IN_REVIEW_DRAFT,
].includes(statusFlowId)
