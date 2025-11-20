import Table, { ColumnData } from 'src/components/Table';
import Accordion from 'src/components/Accordion';
import { useTranslation } from 'src/locale/i18n';
import { TPossibleApprovers } from 'src/core/models';

type Props = {
	items?: TPossibleApprovers[];
}

const ProssibleApprovers = ({ items = [] }: Props) => {

	const { t } = useTranslation()

	const columns: ColumnData[] = [
		{ label: t('Pagamentos:logs.possibleApproverName'), field: 'approverName' },
		{ label: t('Pagamentos:logs.approvalSequence'), field: 'sequence', type: 'number' },
		{ label: t('approversRegistration:hierarchy'), field: 'hierarchyDescription' },
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

export default ProssibleApprovers;
