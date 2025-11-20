import Table, { ColumnData } from 'src/components/Table';
import { useTranslation } from 'src/locale/i18n';
import { approversTextFlow } from 'src/core/utils/constants';

export type Props = {
	onSubmitModal?: any,
	approvers?: any[],
	relist?: any
}

const ApproversModal = ({ approvers = [] }: Props) => {
	
	const { t } = useTranslation();


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
			field: "hierarchyDescription",
		},
		{
			label: t("approversRegistration:status"),
			field: "approvalStatus",
			type: "custom",
			component: (row: any) => {
				return approversTextFlow[row.approvalStatus]
			}
		},
		{
			label: t("approversRegistration:observation"),
			field: "observation"
		}
	]

	return approvers?.length
		? (
			<div className='margin-top-16 form-accordion'>
					<Table columns={columns} rows={approvers} />
			</div>
		)
		: null
}

export default ApproversModal;