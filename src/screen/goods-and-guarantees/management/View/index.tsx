import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { useSnackbar } from "notistack";
import { Button, CircularProgress, Grid } from "@material-ui/core";
import Attachments from "src/components/Attachments";


import ScreenTemplate from "src/components/Screen";
import ProcessFormData from "src/components/ProcessFormData";
import Form from "src/components/form";
import
	FullLogs//,
	// { removeDuplicatedLogsAndSortByDate }
from "src/components/Logs/FullLogs";
import { Submit } from "src/components/button";

import {
	getHasItemGoodsGuaranteesRequest,
	getLoadingGoodsGuaranteesRequest,
	getItemGoodsGuaranteesRequest,
	getSavingGoodsGuaranteesRequest,
} from "src/core/store/modules/goods-guarantee/selectors";
import { TGoodsGuaranteesRequest } from "src/core/models/goods-guarantee";
import { getProcessFormData } from "src/core/store/modules/process/selectors";
import { getLoadingGuaranteeAccountability } from "src/core/store/modules/guarantee-accountability/selectors";
import { fetchGuaranteeAccountabilityGrid } from "src/core/store/modules/guarantee-accountability/thunks";
import { deleteGoodsGuaranteesRequestFile, editGoodsGuaranteesRequest } from "src/core/store/modules/goods-guarantee/thunks";
import { usePagination } from "src/hooks/pagination";
import { useFetchGoodsAndGuaranteesItem, useGoodsAndGuarantees } from "src/hooks/goodsAndGuarantees";
import { useGuaranteeModality } from "src/hooks/fetchLists";
import { useCurrentUser } from "src/config/permissions";
import { t } from "src/locale/i18n";

import RequestData from "../../components/RequestData";
import GoodAndGuaranteeData from "./GoodAndGuaranteeData";
import { RECORD_TYPE, REQUEST_TYPE, TYPE_FLOW } from "../../constants";
import UpdateEndorsementList from "./UpdateEndorsementList";
import { getLogFromGoodsAndGuaranteesForLogs } from "../../statusInfo";
import AccountabilityList from "./AccountabilityList";
import { deleteGoodsGuaranteesEstimatesFile } from "src/core/store/modules/goods-guarantee-estimates/thunks";

type TGoodAndGuaranteeDataForm = {
	description: string,
	observation: string,
	conciliationKey: string,
	automaticUpdateJudicialDeposit: boolean
	bankId?: number | ""
	account?: string
	files?: any;
}

const breadcrumbs = (id: number | undefined) => [
	{ label: t('dashboard'), url: '/' },
	{ label: t('goodsAndGuaranteesManagement'), url: '/bens-e-garantias/gestao' },
	{ label: t('goodsAndGuarantees:management.request', { id: id ?? '' }) },
];

const getAttachments = (/* typeFlow: TYPE_FLOW */ item: TGoodsGuaranteesRequest) => {
	const files: any[] = []; 

	if(item.guaranteeModalityId !== 1){
		item?.files?.forEach( x => {
			files.push(x)
		})
		const filteredEstimates =  item?.estimates?.find(({ isApproved }) => isApproved)?.files?.map((item) => item?.file)

		const filesToReturn = files.concat(filteredEstimates)

	return filesToReturn ?? [] 
	}  else {    
		return item?.files ?? [];
	}   

	/* if (typeFlow === TYPE_FLOW.JUDICIAL_DEPOSIT) */ 
	
	/* const isInsurance = typeFlow === TYPE_FLOW.INSURANCE;

	let attachments = isInsurance
		? item?.estimates?.find(({ isApproved }) => isApproved)?.files
		: item?.files;

	attachments = (attachments ?? []).filter(({ isMainFile }: any) => !isMainFile);

	if (isInsurance)
		attachments = attachments.map(({ file }) => file);

	return attachments; */
}

const GoodsAndGuaranteesManagementView = () => {
	const { id } = useParams<{ id: string }>();
	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();
	const { location: { key }, ...history } = useHistory();

	useGoodsAndGuarantees('/bens-e-garantias/gestao');
	useFetchGoodsAndGuaranteesItem(Number(id));

	const { guaranteeModality } = useGuaranteeModality();

	const { getScreenPermissions } = useCurrentUser(id)
	const requesterAccountabilityPermission = getScreenPermissions('bens-e-garantias/prestacao-de-contas-solicitacao')
	const evaluatorAccountabilityPermission = getScreenPermissions('bens-e-garantias/prestacao-de-contas-avaliacao')

	const isLoadingAccountabilityList = useSelector(getLoadingGuaranteeAccountability);
	const { page, pageSize } = usePagination()

	const isFetchingItem = useSelector(getLoadingGoodsGuaranteesRequest);
	const item = useSelector(getItemGoodsGuaranteesRequest);
	const hasItem = useSelector(getHasItemGoodsGuaranteesRequest);
	const processForm = useSelector(getProcessFormData);
	const isSaving = useSelector(getSavingGoodsGuaranteesRequest)

	const typeFlow = useMemo(() =>
		guaranteeModality.find(({ id }) => id === item.guaranteeModalityId)?.typeFlow ?? TYPE_FLOW.NONE
	, [guaranteeModality, item.guaranteeModalityId])
	const isNewGuarantee = hasItem
	const isUpdateEndorsementListVisible = isNewGuarantee && typeFlow === TYPE_FLOW.INSURANCE;

	const ruleProps = useMemo(() => ({ typeFlow }), [typeFlow])
	const logs = item.logs;
	
	const goBack = () => {
		if (key) history.goBack();
		else history.replace('/bens-e-garantias/gestao');
	};

	const attachments = getAttachments(item);

	const path = !requesterAccountabilityPermission.add && evaluatorAccountabilityPermission.add
		? 'avaliacao' : 'solicitacao'

	const slotTopRight = {
		title: t('goodsAndGuarantees:management.buttonNew'),
		to: `/bens-e-garantias/prestacao-de-contas-${path}/novo?bemId=${item.id}`
	};

	if (item && item.recordType === RECORD_TYPE.REQUEST) {
		enqueueSnackbar(t('goodsAndGuarantees:form.noGoodsAndGuaranteesFound'), { variant: 'error' });
		goBack();
	}

	useEffect(() => {
		if (!item.id) return;
		dispatch(fetchGuaranteeAccountabilityGrid({
			page,
			pageSize,
			goodId: item.id,
		}));
	}, [dispatch, page, pageSize, item.id]);

	const isNewAccountabilityButtonVisible =
		!item.isDeleted
		&& item.accountingBalance && item.accountingBalance > 0 
		&& item.legalBalance && item.legalBalance > 0 
		&& (item.requestTypeId === REQUEST_TYPE.NEW_GUARANTEE || item.requestTypeId === REQUEST_TYPE.TERM_RENEWAL || item.requestTypeId === REQUEST_TYPE.TEDESCO_MIGRATION )
		&& !isFetchingItem;
	
	const initialValues: TGoodAndGuaranteeDataForm = {
		description: item?.description ?? '',
		observation: item?.observation ?? '',
		conciliationKey: item?.conciliationKey ?? "",
		automaticUpdateJudicialDeposit: item?.automaticUpdateJudicialDeposit ?? true,
	}

	if (typeFlow === TYPE_FLOW.JUDICIAL_DEPOSIT) {
		initialValues.bankId = item.bankId ?? item.judicialBlocksAndTransfer?.bankId
		initialValues.account = item.account ?? item.judicialBlocksAndTransfer?.judicialAccountNumber
	}

	const onSubmit = (values: TGoodAndGuaranteeDataForm) => {
		dispatch(editGoodsGuaranteesRequest({ ...item, ...values } as TGoodsGuaranteesRequest & { id: number }));
	}

	const handleDelete = async (file: any) => {
		if (file && file.id ) {
			if ('goodsGuaranteesRequestId' in file) {
				dispatch(deleteGoodsGuaranteesRequestFile(file.id)); 
			} else {
					dispatch(deleteGoodsGuaranteesEstimatesFile(file.id));
			}
		}
	};

	const tempAttachments = [] as any[]

	if (attachments.length && attachments.some(item => item === undefined) === false){
		tempAttachments.push(attachments);
}

	initialValues.files = tempAttachments.flat(1);

	return (
		<ScreenTemplate
			breadcrumbsPath={breadcrumbs(item.id)}
			slotTopRight={isNewAccountabilityButtonVisible ? slotTopRight : undefined}
			slotTopRithtPermission={requesterAccountabilityPermission.add || evaluatorAccountabilityPermission.add}
		>
			{isFetchingItem && <CircularProgress className='margin-top-16 align-center' />}
			{hasItem && (
				<Form initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
					{({ handleSubmit, status }) => (
						<form onSubmit={handleSubmit}>
							<ProcessFormData processData={processForm} doViaFolderNumber folderNumber={item.folderNumber}/>
							<RequestData item={item} title="Dados da solicitação"/>
							<Attachments name="files" confirmDeletionGoodsAndGuarantees onDelete={handleDelete} />
							<GoodAndGuaranteeData item={item} typeFlow={typeFlow} />
							{isUpdateEndorsementListVisible && (
								<UpdateEndorsementList goodsAndGuaranteesId={Number(id)} />
							)}
							{isNewGuarantee && (
								<AccountabilityList loading={isLoadingAccountabilityList} />
							)}
							<FullLogs
								logs={logs}
								rule={getLogFromGoodsAndGuaranteesForLogs}
								ruleProps={ruleProps}
							/>
							<Grid
								container
								direction='row'
								justifyContent='flex-end'
								className='margin-top-24'
								spacing={2}
							>
								<Grid item>
									<Button color='primary' variant='contained' type='button' onClick={goBack}>
										{t('goodsAndGuarantees:management.goBack')}
									</Button>
								</Grid>
								{status !== 'readOnly' && (
									<Grid item>
										<Submit submitting={isSaving} />
									</Grid>
								)}
							</Grid>
						</form>
					)}
				</Form>
			)}
		</ScreenTemplate>
	);
}

export default GoodsAndGuaranteesManagementView;