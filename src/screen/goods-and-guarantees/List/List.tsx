import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';

import { useTranslation } from 'src/locale/i18n';
import { getListGoodsGuaranteesRequest } from 'src/core/store/modules/goods-guarantee/selectors';
import { STATUS_APPROVALS_FLOW } from 'src/core/utils/constants';
import { useGuaranteeModality, useGuaranteeType } from 'src/hooks/fetchLists';
import { useCurrentUser } from 'src/config/permissions';
import { getOptionsAsObject } from 'src/core/utils/func';

import { requestTypesOptionsAll, TYPE_FLOW } from '../constants';
import { approverScope, requesterScope } from '../func';
import { getStatusTextFromGoodAndGuarantees } from '../statusInfo';
import {getPagination} from 'src/core/store/modules/pagination/selectors';
import {
	FormLabel,
} from '@material-ui/core';

const requestTypesOptionsAsObject = getOptionsAsObject(requestTypesOptionsAll);

type TList = {
	loading: boolean;
	inFlow: boolean;
	isApprovalLegalControl: boolean;
	isApprovalInternalLawyer: boolean;
}

const List = ({ loading, inFlow, isApprovalLegalControl, isApprovalInternalLawyer }: TList) => {

	const { t } = useTranslation();
	const history = useHistory();

	const { guaranteeModality } = useGuaranteeModality();
	const list = useSelector(getListGoodsGuaranteesRequest);
	const {itemCount} = useSelector(getPagination);

	const { currentScreenPermissions } = useCurrentUser('')
	const { guaranteeTypeAsOptions } = useGuaranteeType()

	const addPermission = currentScreenPermissions.add
	const editPermission = currentScreenPermissions.edit

	const isRequest = history.location.pathname.startsWith('/bens-e-garantias/solicitacao')
	
	const rows = useMemo(() => list.map(({ statusApprovalId, statusFlowId, guaranteeModalityId, guaranteeTypeId, ...item }) => {

		const { typeFlow = TYPE_FLOW.NONE, description } = guaranteeModality.find(({ id }) => id === guaranteeModalityId) ?? {}

		const status = getStatusTextFromGoodAndGuarantees(typeFlow, statusFlowId, statusApprovalId)

		const requesterEditRule = isRequest && (statusApprovalId === STATUS_APPROVALS_FLOW.RETURNED || statusFlowId === STATUS_APPROVALS_FLOW.RETURNED);

		const legalControlEditRule = isApprovalLegalControl && [STATUS_APPROVALS_FLOW.NONE, STATUS_APPROVALS_FLOW.REQUESTED].includes(statusFlowId);

		const approvalInternalLawyerEditRule = isApprovalInternalLawyer && STATUS_APPROVALS_FLOW.APPROVED === statusFlowId;

		const commonEditRule = editPermission && ![STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE, STATUS_APPROVALS_FLOW.REJECTED_DEFINITIVE].includes(statusApprovalId);

		let isEditButtonVisible = inFlow
			? (addPermission && requesterScope(statusFlowId)) || (editPermission && approverScope(statusFlowId))
			: commonEditRule && (requesterEditRule || legalControlEditRule || approvalInternalLawyerEditRule)

		if (typeFlow === 2 && statusFlowId === STATUS_APPROVALS_FLOW.RETURNED_DRAFT) isEditButtonVisible = false
		
		return {
			...item,
			status,
			guaranteeModality: description,
			requestType: (requestTypesOptionsAsObject as any)[item.requestTypeId] ?? '',
			guaranteeType: guaranteeTypeAsOptions.find((item) => item.value === guaranteeTypeId)?.label ?? "",
			isViewButtonHidden: isRequest === true && status === "Solicitação devolvida" ? true : isEditButtonVisible,
			isEditButtonHidden: isRequest === true && status === "Solicitação devolvida" ? false : !isEditButtonVisible,
		}
	}), [list, inFlow, guaranteeModality, addPermission, editPermission, isRequest, isApprovalLegalControl, isApprovalInternalLawyer, guaranteeTypeAsOptions])

	const columns: ColumnData[] = [
		{
			label: t('goodsAndGuarantees:requestNumber'),
			field: 'id',
		},
		{
			label: t('form.CTGFolder'),
			field: 'folderNumber',
		},
		{
			label: t('form.legalDepartmentArea'),
			field: 'legalDepartmentArea',
		},
		{
			label: t('goodsAndGuarantees:list.applicantName'),
			field: 'applicantName',
		},
		{
			label: t('goodsAndGuarantees:form.requestDate'),
			field: 'requestDate',
			type: 'date'
		},
		{
			label: t('goodsAndGuarantees:form.guaranteeModality'),
			field: 'guaranteeModality'
		},
		{
			label: t('goodsAndGuarantees:form.requestType'),
			field: 'requestType',
		},
		{
			label: "Tipo de garantia",
			field: 'guaranteeType',
		},
		{
			label: t('goodsAndGuarantees:form.guaranteeAmount'),
			field: 'valueGuarantee',
			type: 'currency'
		},
		{
			label: t('status'),
			field: 'status',
		},
	];

	const handleAction = ({ id }: any) => {
		const basePath = window.location.pathname;
		history.push(`${basePath}/${id}`);
	};

	return (
		<>
			<Panel title={t('requestList')}>
				<FormLabel style={{fontWeight: 'bold', display: 'flex', margin: '3% 3% 0 1.5%'}}>
					{`Listagem de solicitar bens e garantia totais encontradas ${itemCount}`}
				</FormLabel>
				<Table
					rows={rows}
					columns={columns}
					onEdit={handleAction}
					onVisualize={handleAction}
					isLoading={loading}
					permissionEdit={inFlow && addPermission && 'add'}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default List;
