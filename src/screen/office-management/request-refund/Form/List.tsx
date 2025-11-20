import { useDispatch, useSelector } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Panel from "src/components/Panel";
import {
	getListPreRequestRefund,
} from "src/core/store/modules/office-management-request-refund/selectors";

import { IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from "@material-ui/icons/Delete";
import { actions } from 'src/core/store';

const List = ({isReadOnly}: {isReadOnly:boolean}) => {
	const dispatch = useDispatch();

	const list = useSelector(getListPreRequestRefund);

	const columns: ColumnData[] = [
		{
			label: "Ações",
			field: "action",
			component: (row: any, index: number) => {
				return (
					<>
						<IconButton
							aria-label="edit"
							onClick={() => dispatch(actions.officeManagementRequestRefund.setPreRequestRefundItem({value:row, index}))}
						>
							{isReadOnly ? <VisibilityIcon /> : <EditIcon />}
						</IconButton>
						{!isReadOnly && <IconButton
							aria-label="Delete"
							onClick={() => dispatch(actions.officeManagementRequestRefund.removeIndexPreRequestRefund({index}))}
						>
							<DeleteIcon />
						</IconButton>}
					</>
				);
			},
			type: "custom",
		},
		{
			label: "Data da solicitação",
			field: "registrationDate",
			type: "date"
		},
		{
			label: "Pasta CTG",
			field: "folderNumber",
		},
		{
			label: "Área DEJUR",
			field: "areaDejur",
		},
		{
			label: "Parte contrária",
			field: "processPartiesOther",
		},
		{
			label: "Responsável do Escritório",
			field: "externalOffice",
		},
		{
			label: "Advogado interno / aprovador",
			field: "requester",
		},
		{
			label: "Descrição da despesa",
			field: "description",
		},
		{
			label: "Valor da despesa",
			field: "pantryValue",
			type: "currency"
		},
	];

	return (
		<>
			<Panel title={"Listagem de registro de despesas"}>
				<TableComponent
					columns={columns}
					rows={list}
				/>
			</Panel>
		</>
	);
};

export default List;
