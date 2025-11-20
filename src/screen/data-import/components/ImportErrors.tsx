/* eslint-disable array-callback-return */
import { useSelector } from "react-redux";

import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import { useTranslation } from "src/locale/i18n";
import {
	getDataImportStatus,
	getDataImportFeedbackErrors,
} from "src/core/store/modules/data-import/selectors";
import { useMemo } from "react";
import { Box } from "@material-ui/core";
import { TDataImportFeedbackLineError } from "../../../core/models/data-import";
import { omit } from "ramda";

interface IProps {
	response?: any;
	isDefinitiveLow?: boolean;
}

const ImportErrors = ({ response, isDefinitiveLow }: IProps) => {
	const { t } = useTranslation();

	const status = useSelector(getDataImportStatus);
	const lineErrorsFeedback = useSelector(getDataImportFeedbackErrors);
	
	const lineErrors = (
		isDefinitiveLow === true ? response?.payload?.logs :
		lineErrorsFeedback !== undefined
			? lineErrorsFeedback?.hasOwnProperty("logs") === true
				? lineErrorsFeedback.logs
				: lineErrorsFeedback
			: response?.payload?.hasOwnProperty("logs") === true
			?  response?.payload.logs 
			: response?.payload
	) as TDataImportFeedbackLineError[];

	const uniqueRows = useMemo(() => {
		if (!lineErrors) return null;

		const uniqueIndex = new Array<
			Omit<TDataImportFeedbackLineError, "message">
		>();
		for (const lineError of lineErrors) {
			const item = omit(["message"], lineError);
			if (uniqueIndex.findIndex((x) => x.rowIndex === item.rowIndex) === -1)
				uniqueIndex.push(item);
		}

		return uniqueIndex;
	}, [lineErrors]);

	const rows = useMemo(
		() => typeof lineErrors !== "string" ? 
			lineErrors
				?.slice()?.sort(
					(x: { rowIndex: any }, y: { rowIndex: any }) =>
						x.rowIndex - y.rowIndex
				) : [],
		[lineErrors]
	);

	const successTotal = useMemo(() => {
		return uniqueRows?.reduce((acc, cur) => {
			if (cur.success) acc++;
			return acc;
		}, 0);
	}, [uniqueRows]);

	const columns: ColumnData[] = [
		{
			label: t("dataImport:importErrors.line"),
			field: "rowIndex",
		},
		{
			label: t("dataImport:importErrors.error"),
			field: "message",
		},
	];

	return (
		<Panel title={isDefinitiveLow === true ? "Informações da baixa definitiva" : t("dataImport:importErrors.importErrors")}>
			{(lineErrorsFeedback || response) && (
				<Box p={2}>
					{`${t("dataImport:importErrors.feedback-1")} ${successTotal ?? 0} ${t(
						"dataImport:importErrors.feedback-2"
					)} ${(uniqueRows?.length ?? 0) - (successTotal ?? 0)} ${t(
						"dataImport:importErrors.feedback-3"
					)}`}
				</Box>
			)}
			<TableComponent
				rows={rows
				}
				columns={columns ?? []}
				isLoading={status === "saving"}
			/>
		</Panel>
	);
};

export default ImportErrors;
