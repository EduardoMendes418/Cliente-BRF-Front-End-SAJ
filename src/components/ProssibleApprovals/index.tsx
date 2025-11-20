import { TPossibleApprovals } from "src/core/models";
import { useTranslation } from "src/locale/i18n";
import Table, { ColumnData } from 'src/components/Table';
import Accordion from "../Accordion";
import { approversTextFlow } from "src/core/utils/constants";

type Props = {
	items?: TPossibleApprovals[];
}

const ProssibleApprovals = ({ items = [] }: Props) => {
	const { t } = useTranslation()

	const columns: ColumnData[] = [
		{ 
			label: t('Pagamentos:logs.possibleApproverName'), 
			field: 'approverName' 
		},
		{ 
			label: t('Pagamentos:logs.approvalSequence'), 
			field: 'sequence', 
			type: 'number' },
		{ 
			label: t('approversRegistration:hierarchy'), 
			field: "hierarchy",
			type: "custom", 
			component: (row: TPossibleApprovals) => {
				return `${row.hierarchyCode ?? ""} - ${row.hierarchyDescription ?? ""}`
			} 
		},
		{
			label: t("approversRegistration:status"),
			field: "GoodsGuaranteesRequestStatus",
			type: "custom",
			component: (row: TPossibleApprovals) => {
				return (approversTextFlow as any)[row.goodsGuaranteesRequestStatus]
			}
		},
		{
			label: t("approversRegistration:observation"),
			field: "observation"
		}
	];

	return items.length
		? (
			<div className='margin-top-16 form-accordion'>
				<Accordion title={t('Pagamentos:logs.titlePossibleApprovers')}>
					<Table columns={columns} rows={items} />
				</Accordion>
			</div>
		)
		: null
}

export default ProssibleApprovals;