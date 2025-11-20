import { useState } from 'react';
import FileSaver from 'file-saver';
import { useDispatch } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';

import Panel from 'src/components/Panel';
import { AppDispatch } from 'src/core/store';

import { deleteInterestUpdate } from 'src/core/store/modules/interest-update/thunks'
import { createInterestUpdateForApproval, getExecutedInterestUpdates, getReportInterestUpdatesAccounting, getExecutedInterestUpdatesWhenPageLoad } from 'src/core/store/modules/goods-guarantee/thunks';
import TableComponent, { ColumnData } from "src/components/Table";
import { useSnackbar } from 'notistack';


type TReport = { 
	executedDate: string;
	executorUser: string;
	competenceDate: string;
	juridicalAreaId: number;
	juridicalArea: string;
	balance: string;
	accountingType: string;
	approvalDate?: null;
	approvalUser?: null;
	accountingDocument: string;
	status: string;
	createdDate: string;
	createdBy: string;
	updatedDate: string;
	updatedBy?: null;
	isDeleted: boolean;
	id: number;
  }

type Props = {
	rows?: any
	setRows: any
}

const ExecutedAccoutingList = ({rows, setRows}: Props) => {
	const [loading, setLoading] = useState<boolean>()

	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();

	const columns: ColumnData[] = [
		{ label: "Fechamento", field: 'closure' },
		{ label: "Área DEJUR", field: "juridicalArea" },
		{ label: "Competência", field: "competenceDate" },
		{ label: "Movimento", field: "accountingType" },
		{ label: "Saldo", field: "balance", type: 'currency' },
		{ label: "Data Hora Aprovação", field: "approvalDate", type: 'dateHour' },
		{ label: "Aprovador", field: "approvalUser" },
		{ label: "Documento contábil", field: "accountingDocument" },
		{ label: "Status", field: "status" },
	];

	const getReport = async (report: TReport) => {

		const referenceMonth = report.competenceDate.split('/')[0]
		const referenceYear = report.competenceDate.split('/')[1]

		const res: PayloadAction<any> = await dispatch(getReportInterestUpdatesAccounting({ id: report.id, judicialAreaIds: [report.juridicalAreaId], referenceYear: referenceYear, referenceMonth: referenceMonth}))

		if (res.type.includes('fulfilled')) {
			FileSaver.saveAs(res.payload.report as Blob, `Contabilizacao Depositos Judiciais`);
		} 
    };

	const createInterestUpdates = async (report: TReport) => {
		  const res: PayloadAction<any> = await dispatch(createInterestUpdateForApproval({ id: report.id }))
		   if(typeof res.payload === 'string'){
			enqueueSnackbar(
				`${res.payload}`,
				{ variant: 'success' }
			);
			const updatedRows: PayloadAction<any> = await dispatch(getExecutedInterestUpdates({}));
			setRows(updatedRows.payload.items)
		}else {
			enqueueSnackbar(
				`${res.payload.detail.split('.')[0]}`,
				{ variant: 'error' }
			);
		}
    };

	const funcDeleteInterestUpdate = async (report: any) => {
		setLoading(true)
		const res = await dispatch(deleteInterestUpdate(report.id))
		if(res.payload.status === 500){
			setLoading(false)
			return enqueueSnackbar(
				`${res.payload.detail}`,
				{ variant: 'error' }
			);
		}
		setLoading(false)
		enqueueSnackbar(
			`Atualização de depósito executada excluída com sucesso `,
			{ variant: 'success' }
		);
		const exe: PayloadAction<any> = await dispatch(getExecutedInterestUpdatesWhenPageLoad())
		setRows(exe.payload.items)
    };
	return (
		<Panel
			withPadding title={"Listagem das Atualizações de Depósitos Executadas"}
			>
			<TableComponent
				rows={rows}
				onDelete={funcDeleteInterestUpdate}
				columns={columns}
				onVisualize={getReport}
				onCheck={createInterestUpdates}
				isLoading={loading}
				isCheck
			/>
		</Panel>
	);
}
export default ExecutedAccoutingList;