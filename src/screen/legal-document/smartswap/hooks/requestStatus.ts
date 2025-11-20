import { useMemo } from "react";
import { TOptionsSelect } from "src/components/form";
import { LegalDocumentSwapStatusEnum } from "src/core/models/legal-document-swap";
import { useTranslation } from "src/locale/i18n";

const useRequestStatus = () => {
	const { t } = useTranslation();

	const requestStatusText = {
		[LegalDocumentSwapStatusEnum.ReturnedService]: t("legalDocs:requestStatus.returnedService"),
		[LegalDocumentSwapStatusEnum.InSignature]: t("legalDocs:requestStatus.inSignature"),
		[LegalDocumentSwapStatusEnum.InTreatment]: t("legalDocs:requestStatus.inTreatment"),
		[LegalDocumentSwapStatusEnum.InformationPending]: t("legalDocs:requestStatus.informationPending"),
		[LegalDocumentSwapStatusEnum.Requested]: t("legalDocs:requestStatus.requested"),
		[LegalDocumentSwapStatusEnum.LegalValidation]: t("legalDocs:requestStatus.legalValidation"),
	};

	const requestStatusOptions = useMemo<TOptionsSelect[]>(
		() => [
			{
				label: t("legalDocs:requestStatus.returnedService"),
				value: LegalDocumentSwapStatusEnum.ReturnedService,
			},
			{
				label: t("legalDocs:requestStatus.inSignature"),
				value: LegalDocumentSwapStatusEnum.InSignature,
			},
			{
				label: t("legalDocs:requestStatus.inTreatment"),
				value: LegalDocumentSwapStatusEnum.InTreatment,
			},
			{
				label: t("legalDocs:requestStatus.informationPending"),
				value: LegalDocumentSwapStatusEnum.InformationPending,
			},
			{
				label: t("legalDocs:requestStatus.requested"),
				value: LegalDocumentSwapStatusEnum.Requested,
			},
			{
				label: t("legalDocs:requestStatus.legalValidation"),
				value: LegalDocumentSwapStatusEnum.LegalValidation,
			},
		],
		[t]
	);

	return {
		requestStatusOptions,
		requestStatusText,
	};
};

export default useRequestStatus;
