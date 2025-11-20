import { Grid, IconButton } from "@material-ui/core";
import { useMemo } from "react";
import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import { TReportDictionary } from "src/core/models/reports";
import { useTranslation } from "src/locale/i18n";
import { Edit, Delete, ArrowUpward, ArrowDownward } from "@material-ui/icons";
import { Submit } from "src/components/button";

interface ListProps {
	items: TReportDictionary[];
	onEdit: (row: TReportDictionary, index: number) => void;
	onDelete: (index: number) => void;
	onUp: (index: number) => void;
	onDown: (index: number) => void;
	onSave: () => void;
	onSwitch: (index: number) => void;
}

const List = (props: ListProps) => {
	const { t } = useTranslation();

	const columns = useMemo<ColumnData[]>(
		() => [
			{
				label: t("settings:report.table.actions"),
				field: "actions",
				type: "custom",
				component: (row: TReportDictionary, index: number) => {
					return (
						<Grid container direction="row" wrap="nowrap">
							<IconButton onClick={() => props.onEdit(row, index)}>
								<Edit color="primary" />
							</IconButton>
							<IconButton onClick={() => props.onDelete(index)}>
								<Delete color="error" />
							</IconButton>
							{index > 0 && (
								<IconButton onClick={() => props.onUp(index)}>
									<ArrowUpward color="secondary" />
								</IconButton>
							)}
							{index < props.items.length - 1 && (
								<IconButton onClick={() => props.onDown(index)}>
									<ArrowDownward color="secondary" />
								</IconButton>
							)}
						</Grid>
					);
				},
			},
			{
				label: t("settings:report.table.displayName"),
				field: "displayName",
			},
			{
				label: t("settings:report.table.fieldName"),
				field: "fieldName",
			},
			{
				label: t("settings:report.table.fixedField"),
				field: "fixedField",
				type: "switch-button-yn",
				onChange: (_, index?: number) => {
					if (index) {
						props.onSwitch(index)
					}
				},
			},
		],
		[props, t]
	);

	return (
		<Panel
			title={t("settings:report.table.title")}
			slotBottomRight={<Submit type="button" click={() => props.onSave()} />}
			slotBottonRightPermission={true}
		>
			<TableComponent columns={columns} rows={props.items} />
		</Panel>
	);
};

export default List;
