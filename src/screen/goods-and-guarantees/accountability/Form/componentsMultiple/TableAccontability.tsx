import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";

import Table, { ColumnData } from 'src/components/Table';
import { useTranslation } from 'src/locale/i18n';
import { removeAccontabilityArray } from 'src/core/store/modules/guarantee-accountability';
import { getAccountabilityArray } from 'src/core/store/modules/guarantee-accountability/selectors';
import AccordionPanel from "src/components/AccordionPanel";
import { numberToCurrency } from 'src/core/utils/func'


const TableAccontability = ({isReverse}:{isReverse:boolean}) => {
	const dispatch = useDispatch()
	const accontabilityArray = useSelector(getAccountabilityArray);
	const { t } = useTranslation();

	const columns: ColumnData[] = [
		{
			label: "Ações",
			field: "action",
			component: (row: any, index:number) => {
				if (isReverse) return null;
				return (
					<>
						<IconButton
							aria-label="edit"
							onClick={() => dispatch(removeAccontabilityArray(index))}
						>
							<Delete style={{color:"red"}}/>
						</IconButton>
					</>
				);
			},
			type: "custom",
		},
		{
			label: t('goodsAndGuarantees:requestNumber'),
			field: 'id',
		},
		{
			label: "Data solicitação",
			field: 'accountabilityDate',
			type: "date"
		},
		{
			label: t('form.CTGFolder'),
			field: 'folderNumber',
		},
		{
			label: t('goodsAndGuarantees:management.goodDate'),
			field: 'guaranteeDate',
			type: 'date'
		},
		{
			label: t('goodsAndGuarantees:form.guaranteeModality'),
			field: 'guaranteeModality',
		},
		{ label: "Motivo da baixa", field: 'bearishReasonsText'},
		{
			label:"Total baixado",
			field: 'amountWrittenOff',
			type: 'currency'
		},
		{
			label: t('goodsAndGuarantees:accountability.situation'),
			field: 'situationToShow',
		},
		{
			label: t('goodsAndGuarantees:accountability.accountabilityStatus'),
			field: 'accountabilityStatusToShow',
		},
	];
	return (
		<AccordionPanel title={`Prestações de contas - Quantidade ${accontabilityArray.length} - Total ${
				numberToCurrency(accontabilityArray.reduce((soma, {totalAmountWrittenOff}) => totalAmountWrittenOff + soma, 0))
			}`} startExpanded>
			<Table
				rows={accontabilityArray}
				columns={columns}
			/>
		</AccordionPanel>
	)
}

export default TableAccontability;
