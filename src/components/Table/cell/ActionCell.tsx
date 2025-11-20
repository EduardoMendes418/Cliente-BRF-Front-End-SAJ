import { ChangeEvent } from 'react';
import { TableCell } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import VisibilityIcon from '@material-ui/icons/Visibility';
import HistoryIcon from '@material-ui/icons/History';
import UploadFileButton from 'src/components/form/Upload/UploadButton';
import AddIcon from '@material-ui/icons/Add';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { AttachFile as AttachFileIcon } from '@material-ui/icons';

type Props = {
	row: any;
	isPendingProp?: string;
	isMultipleAttach?: boolean;
	onVisualize?: (row: any, index?: number) => void;
	isCheck?: boolean | undefined;
	onEdit?: (row: any, index?: number) => void;
	onSaveRow?: (row: any, index?: number) => void;
	onDelete?: (row: any, index?: number) => void;
	onAttach?: (event: ChangeEvent, row: any) => void;
	onCheck?: (row: any, index?: number) => void;
	index?: number
};

const ActionCell = ({ row, onVisualize, onEdit, onSaveRow, onDelete, onAttach, onCheck, isPendingProp, index, isCheck, isMultipleAttach }: Props) => (
	<TableCell component='td'>
		{onAttach && (
			<UploadFileButton
				variant='outlined'
				color='secondary'
				onChange={(event) => onAttach(event, row)}
				id={`contained-button-file-${row.id}`}
				isIconButton
				startIcon={<AddIcon />}
			/>
		)}
		{onVisualize && !row.isViewButtonHidden && (
			<IconButton
				aria-label='view'
				onClick={(event) => {
					event.stopPropagation();
					if (!isPendingProp || !row[isPendingProp]) onVisualize(row, index);
				}}
			>
				{isPendingProp && row[isPendingProp]
					? <HistoryIcon style={{ color: '#FEBA0F' }} />
					: ( isMultipleAttach === true ? <AttachFileIcon color="primary" /> : <VisibilityIcon color="primary" />)
				}
			</IconButton>
		)}
		{onEdit && !row.isEditButtonHidden && (
			!!row?.openToEdit ? 
				<>
					<IconButton aria-label='edit' onClick={() => onEdit(row, index)}>
						<RevertIcon />
					</IconButton> 
					<IconButton aria-label='edit' onClick={() => {
							if (onSaveRow){
								return onSaveRow(row, index)
							}
					}}>
						<DoneIcon />
					</IconButton>
				</> 
				:
				<IconButton aria-label='edit' onClick={() => onEdit(row, index)}>
					<EditIcon />
				</IconButton>
		)}
		{onDelete && !row.isDeleteButtonHidden && (
			  isCheck && row.statusApprovalId !== 20 ? null : 
			<IconButton aria-label='delete' onClick={() => onDelete(row, index)}>
				<DeleteIcon color="error" />
			</IconButton>
		)}
		{onCheck && row.statusApprovalId === 20 && (
				<IconButton aria-label='check' onClick={()=> onCheck(row, index)}>
					 <CheckCircleIcon style={{color: 'green'}} /> 
				</IconButton>
			)
		}
	</TableCell>
);

export default ActionCell;
