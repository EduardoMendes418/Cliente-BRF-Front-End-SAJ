import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TOptionsSelect } from "src/components/form";
import { LegalDocumentRequestStatusEnum } from "src/core/models/legal-document-request";
import { getListLegalDocGrants } from "src/core/store/modules/legal-cocument-grants/selectors";
import { fetchLegalDocGrants } from "src/core/store/modules/legal-cocument-grants/thunks";
import { getListLegalDocCoverage } from "src/core/store/modules/legal-document-coverages/selectors";
import { fetchLegalDocCoverage } from "src/core/store/modules/legal-document-coverages/thunks";
import { getListLegalDocReqTypes } from "src/core/store/modules/legal-document-request-types/selectors";
import { fetchLegalDocReqTypes } from "src/core/store/modules/legal-document-request-types/thunks";
import { useTranslation } from "src/locale/i18n";

export function useCoverage() {
	const dispatch = useDispatch();
	const coverages = useSelector(getListLegalDocCoverage);

	useEffect(() => {
		dispatch(
			fetchLegalDocCoverage({
				notPaginate: true,
			})
		);
	}, [dispatch]);

	const coveragesAsOptions = useMemo(
		() =>
			coverages.map<TOptionsSelect>((x) => ({
				label: x.name,
				value: x.id ?? "",
			})),
		[coverages]
	);

	return {
		coverages,
		coveragesAsOptions,
	};
}

export function useGrants() {
	const dispatch = useDispatch();
	const grants = useSelector(getListLegalDocGrants);

	useEffect(() => {
		dispatch(
			fetchLegalDocGrants({
				notPaginate: true,
			})
		);
	}, [dispatch]);

	const grantsAsOptions = useMemo(
		() =>
			grants.map<TOptionsSelect>((x) => ({
				label: x.name,
				value: x.id ?? "",
			})),
		[grants]
	);

	return {
		grants,
		grantsAsOptions,
	};
}

export function useSolicitationType() {
	const dispatch = useDispatch();
	const solicitationType = useSelector(getListLegalDocReqTypes);

	useEffect(() => {
		dispatch(
			fetchLegalDocReqTypes({
				notPaginate: true,
			})
		);
	}, [dispatch]);

	const solicitationTypeAsOptions = useMemo(
		() =>
			solicitationType.map<TOptionsSelect>((x) => ({
				label: x.name,
				value: x.id ?? "",
			})),
		[solicitationType]
	);

	return {
		solicitationType,
		solicitationTypeAsOptions,
	};
}

export function useLegalDocumentRequestStatus() {
	const { t } = useTranslation();

	const requestStatusText = {
		[LegalDocumentRequestStatusEnum.ReturnedService]: t("legalDocs:requestStatus.returnedService"),
		[LegalDocumentRequestStatusEnum.InSignature]: t("legalDocs:requestStatus.inSignature"),
		[LegalDocumentRequestStatusEnum.InTreatment]: t("legalDocs:requestStatus.inTreatment"),
		[LegalDocumentRequestStatusEnum.InformationPending]: t("legalDocs:requestStatus.informationPending"),
		[LegalDocumentRequestStatusEnum.Requested]: t("legalDocs:requestStatus.requested"),
		[LegalDocumentRequestStatusEnum.LegalValidation]: t("legalDocs:requestStatus.legalValidation"),
		[LegalDocumentRequestStatusEnum.Cancelled]: t("legalDocs:requestStatus.cancelled"),
		[LegalDocumentRequestStatusEnum.Disapproved]: t("legalDocs:requestStatus.disapproved"),
		[LegalDocumentRequestStatusEnum.Finished]: t("legalDocs:requestStatus.finished"),
	};

	const requestStatusOptions = useMemo<TOptionsSelect[]>(
		() => [
			{
				label: t("legalDocs:requestStatus.returnedService"),
				value: LegalDocumentRequestStatusEnum.ReturnedService,
			},
			{
				label: t("legalDocs:requestStatus.inSignature"),
				value: LegalDocumentRequestStatusEnum.InSignature,
			},
			{
				label: t("legalDocs:requestStatus.inTreatment"),
				value: LegalDocumentRequestStatusEnum.InTreatment,
			},
			{
				label: t("legalDocs:requestStatus.informationPending"),
				value: LegalDocumentRequestStatusEnum.InformationPending,
			},
			{
				label: t("legalDocs:requestStatus.requested"),
				value: LegalDocumentRequestStatusEnum.Requested,
			},
			{
				label: t("legalDocs:requestStatus.legalValidation"),
				value: LegalDocumentRequestStatusEnum.LegalValidation,
			},
			{
				label: t("legalDocs:requestStatus.cancelled"),
				value: LegalDocumentRequestStatusEnum.Cancelled,
			},
			{
				label: t("legalDocs:requestStatus.disapproved"),
				value: LegalDocumentRequestStatusEnum.Disapproved,
			},
			{
				label: t("legalDocs:requestStatus.finished"),
				value: LegalDocumentRequestStatusEnum.Finished,
			},
		],
		[t]
	);

	return {
		requestStatusOptions,
		requestStatusText,
	};
}
