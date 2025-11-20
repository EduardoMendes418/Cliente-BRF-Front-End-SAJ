import { ChangeEvent, useState } from 'react';

import Table, { ColumnData } from 'src/components/Table';
import { t } from 'src/locale/i18n';

import { TBudget } from 'src/core/models/goods-guarantee-estimates';
import TextField from '@material-ui/core/TextField';
import { IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { MainDiv } from './styled';

type TList = {
	budgetList: TBudget[];
	onEdit?: (row: any) => void;
	onDelete?: (row: any) => void | undefined;
	onAttach?: (event: ChangeEvent, row: any) => void;
	onSelectRadio?: (row: any) => void;
	statusFlowId: number;
	editDescription: (id: number, field:string, value: string) => void
}
type editDescription = {
	whichDescription?: string, 
	value?: string, 
	id?: number, 
	lable?: string
} 

const statusFlowIdWhichDescription = {
	2: "description",
	3: "description",
	4: "description02",
	5: "description03",
	6: "description03",
	7: "description04",

}
const List = ({ budgetList, onEdit, onDelete, onAttach, onSelectRadio, statusFlowId, editDescription }: TList) => {
	const [description, setDescription] = useState<editDescription>({})
	if (!budgetList || budgetList.length === 0) return null;

	const handleDescripiton = (whichDescription: string, value: string, id: number, lable: string) => {
		if (whichDescription === (statusFlowIdWhichDescription as any)[statusFlowId]) return <p>
			{value}

			<IconButton
				aria-label="edit"
				onClick={() => setDescription({whichDescription, value, id, lable})}
			>
				<EditIcon />
			</IconButton>
		</p>
		return <p>{value}</p>
	}
	const columns: ColumnData[] = [
		{
			label: t('goodsAndGuarantees:tasks.favorite'),
			field: 'isApproved',
			type: 'favorite',
		},
		{
			label: t('goodsAndGuarantees:tasks.brokerageName'),
			field: 'insuranceCompanyName',
		},
		{
			label: t('goodsAndGuarantees:tasks.date'),
			field: 'requestDate',
			type: 'date'
		},
		{
			label: t('form.comments'),
			field: 'observation',
		},
		{
			label: "Minuta disponibilizada",
			field: 'description',
			type: "custom",
			component: (row: TBudget) => handleDescripiton("description", row.description, row.id, "Minuta disponibilizada")

		},
		{
			label: "Validação da minuta",
			field: 'description02',
			type: "custom",
			component: (row: TBudget) => handleDescripiton("description02", row.description02, row.id, "Validação da minuta")
		},
		{
			label: "Apolice definitiva disponibilizada",
			field: 'description03',
			type: "custom",
			component: (row: TBudget) => handleDescripiton("description03", row.description03, row.id, "Apolice definitiva disponibilizada")
		},
		{
			label: "Validação apolice definitiva",
			field: 'description04',
			type: "custom",
			component: (row: TBudget) => handleDescripiton("description04", row.description04, row.id, "Validação apolice definitiva")
		},
	];
	const {id, whichDescription, lable} = description

	const index = budgetList.findIndex(item => item.id === id) as any
	let value = "";
	if (index !== -1) value = (budgetList as any)[index][`${whichDescription}`]
	return (
		<MainDiv>

			{index !== -1 && <TextField 
				label={lable}
				value={value ?? ""}
				style={{marginTop: 16, marginBottom:16}}
				onChange={(e) => editDescription(id ?? 0, whichDescription ?? "", e.target.value)}
			/>}
			
			<Table
				rows={budgetList}
				columns={columns}
				onAttach={onAttach}
				onEdit={onEdit}
				onDelete={onDelete}
				permissionEdit='add'
				permissionDelete='add'
				permissionAttach='add'
				onSelectRadio={onSelectRadio}
			/>
		</MainDiv>
	)
}

export default List;