import { useMemo } from "react";
import { TOptionsSelect } from "src/components/form";
import { TReportComponent } from "src/core/models/reports";
import { useTranslation } from "src/locale/i18n";

const useReportTypes = () => {
	const { t } = useTranslation();

	const reportTypeOptions = useMemo<TOptionsSelect[]>(
		() =>
			[
				{
					label: t("settings:report.types.payment"),
					value: TReportComponent.PAYMENTS,
				},
				{
					label: t("settings:report.types.goodsAndGuarantees"),
					value: TReportComponent.GOODS_GUARANTEES,
				},
				{
					label: "Prestação de contas",
					value: TReportComponent.ACCOUNTABILITYR,
				},
				{
					label: t("settings:report.types.blockAndTransfer"),
					value: TReportComponent.JUDICIAL_BLOCKS_AND_TRANSFERS,
				},
				{
					label: t("settings:report.types.pensions"),
					value: TReportComponent.PENSIONS,
				},
				{
					label: t("settings:report.types.statisticalRequest"),
					value: TReportComponent.STATISTICAL_ORDER,
				},
				{
					label: t("settings:report.types.creditReceipt"),
					value: TReportComponent.CREDIT_RECEIPT
				},
				{
					label: t("settings:report.types.inspectionPayment"),
					value: TReportComponent.NOTICE_INSPECTION_PAYMENT,
				},
				{
					label: t("settings:report.types.legalDocuments"),
					value: TReportComponent.LEGAL_DOCUMENT,
				},
				{	
					label: t("settings:report.types.circularization"),
					value: TReportComponent.CIRCULARIZATION_BASE_GENERATION
				},
				{	
					label: t("settings:report.types.circularization"),
					value: TReportComponent.CIRCULARIZATION_REPORT
				},
				{
					label: t("settings:report.types.accounting"),
					value: TReportComponent.ACCOUNTING_REPORT
				},
				{
					label: "Equalização",
					value: TReportComponent.EQUALIZATION
				},
				{
					label: "Esocial S-2500",
					value: TReportComponent.S2500
				},
				{
					label: "Esocial S-2501",
					value: TReportComponent.S2501
				},
				{
					label: "logs",
					value: TReportComponent.LOGS
				}
			].sort((x, y) => x.label.localeCompare(y.label)),
		[t]
	);

	return {
		reportTypeOptions,
	};
};

export default useReportTypes;
