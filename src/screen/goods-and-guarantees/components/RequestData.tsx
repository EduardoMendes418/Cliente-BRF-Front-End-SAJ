import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import { useHistory, useParams } from 'react-router';

import AccordionPanel from 'src/components/AccordionPanel';
import FieldColumn from 'src/components/FieldColumn';

import { TGoodsGuaranteesRequest } from 'src/core/models/goods-guarantee';
import { Modulos } from 'src/core/models/modules';
import { fetchPaymentType } from 'src/core/store/modules/payment-type/thunks';
import { useGuaranteeModality, useGuaranteeType } from 'src/hooks/fetchLists';
import { t } from 'src/locale/i18n';
import { actions } from "src/core/store";

import { TYPE_FLOW } from '../constants';

type TRequestData = { item: TGoodsGuaranteesRequest, goTo?: string, title?: string, startExpanded?: boolean, parentAccountabilityId?: number | null }

const RequestData = ({ item, goTo = 'fluxo', title = t('goodsAndGuarantees:management.requestData'), startExpanded = true, parentAccountabilityId }: TRequestData) => {
	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch();
	const history = useHistory();
	const { guaranteeModality } = useGuaranteeModality();
	const { guaranteeTypeAsOptions } = useGuaranteeType();

	const typeFlow = guaranteeModality.find(({ id }) => id === item.guaranteeModalityId)?.typeFlow;
	const isJudicialDeposit = typeFlow === TYPE_FLOW.JUDICIAL_DEPOSIT;

	useEffect(() => {
		if (isJudicialDeposit && item.payment?.paymentTypeId) {
			dispatch(fetchPaymentType({ id: Number(item.payment?.paymentTypeId), modulo: Modulos.Pagamento }));
		}
	}, [dispatch, isJudicialDeposit, item.payment?.paymentTypeId])

	let goodGuaranteeLinkedText = ""
	goodGuaranteeLinkedText = guaranteeTypeAsOptions.find((itemOp) => itemOp.value === item.guaranteeTypeId)?.label ?? ""
	
	if(goodGuaranteeLinkedText === ""){
		if(item.payment !== null)
			goodGuaranteeLinkedText = item.payment?.financeChartOfAccountsCategoryName ?? ""
		else if (item.judicialBlocksAndTransfer !== null)
				goodGuaranteeLinkedText = item.judicialBlocksAndTransfer?.financeChartOfAccountsCategoryName ?? ""
	}

	return (
		<AccordionPanel title={title} startExpanded={startExpanded}>
			<Grid container spacing={2} alignItems='flex-start'>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t('goodsAndGuarantees:management.ctgFolder')}
						value={item.folderNumber}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t('goodsAndGuarantees:requestNumber')}
						value={item.id}
						handleView={
							!item.paymentId && !item.judicialBlocksAndTransferId && !item.fromAccountabilityId && item.id !== parseInt(id)
								? async() => {
									await dispatch(actions.goodsGuaranteesRequest.clear());
									await dispatch(actions.process.clear());
									history.push(`/bens-e-garantias/${goTo}/${item.id}`)
								}
								: undefined
						}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={"Data da solicitação"}
						value={item.requestDate}
						type='date'
					/>
				</Grid>
				{isJudicialDeposit && item.origin && (
					<>

						{item.fromAccountabilityIds !== null && <Grid item xs={12} md={3}>
							<FieldColumn
								label={t('goodsAndGuarantees:accountability.id')}
								value={item.fromAccountabilityIds?.join(", ")}
							/>
						</Grid>}
					
						{item.fromAccountabilityIds === null && <Grid item xs={12} md={3}>
							<FieldColumn
								label={t('goodsAndGuarantees:accountability.id')}
								value={item.fromAccountabilityId}
								handleView={() => history.push(`/bens-e-garantias/prestacao-de-contas-solicitacao/${item.fromAccountabilityId}`)}
							/>
						</Grid>}
					</>
				)}
				{item.paymentId && (
					<Grid item xs={12} md={3}>
						<FieldColumn
							label={t('goodsAndGuarantees:management.paymentId')}
							value={item.paymentId}
							handleView={() => history.push(`/pagamentos/solicitacao/${item.paymentId}`)}
						/>
					</Grid>
				)}
				{item.goodGuaranteeLinked && (
					<Grid item xs={12} md={3}>
						<FieldColumn
							label={t('goodsAndGuarantees:management.mainGoodAndGuarantee')}
							value={item.goodGuaranteeLinked}
							handleView={async () => {
								await dispatch(actions.goodsGuaranteesRequest.clear());
								await dispatch(actions.process.clear());
								history.push(`/bens-e-garantias/gestao/${item.goodGuaranteeLinked}`)
							}}
						/>
					</Grid>
				)}
						<Grid item xs={12} md={3}>
						<FieldColumn
							label={t('goodsAndGuarantees:management.replacementGoodGuarantee')}
							value={item.replacementGoodGuarantee === true ? 'Sim' : 'Não'}
							
						/>
					</Grid>
				{item.judicialBlocksAndTransferId && (
					<Grid item xs={12} md={3}>
						<FieldColumn
							label={t('goodsAndGuarantees:management.judicialBlockAndTransferId')}
							value={item.judicialBlocksAndTransferId}
							handleView={() => history.push(`/bloqueios-e-transferencias/solicitacao/${item.judicialBlocksAndTransferId}`)}
						/>
					</Grid>
				)}

				{
					parentAccountabilityId && (
						<Grid item xs={12} md={3}>
						<FieldColumn
							label={t("goodsAndGuarantees:accountability.parentAccountabilityId")}
							value={parentAccountabilityId}	
						/>
					</Grid>
					)
				}
			</Grid>
		</AccordionPanel>
	);
}

export default RequestData;