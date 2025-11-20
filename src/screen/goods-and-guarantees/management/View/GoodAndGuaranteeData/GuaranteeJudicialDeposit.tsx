import { Grid } from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router';

import FieldColumn from "src/components/FieldColumn";

import { TGoodsGuaranteesRequest, TJudicialDepositPayment } from "src/core/models/goods-guarantee";
import { fetchBanks } from "src/core/store/modules/banks/thunks";
import { getJudicialDepositData } from "src/core/store/modules/goods-guarantee/selectors";
import { t } from "src/locale/i18n";
import { useBanks } from "src/hooks/fetchLists";
import { occurrenceTypesOptions } from "src/screen/judicial-blocks-and-transfers/constants";
import { SelectField, TextField, CheckboxField } from "src/components/form";
import { bearishReasonsOptions } from "src/screen/goods-and-guarantees/constants";

type TGuaranteeJudicialDeposit = {
	item: TGoodsGuaranteesRequest
}

const GuaranteeJudicialDeposit = ({ item: {
	updatedValue,
	fromAccountabilityId,
	writeOffDate,
	isDeleted,
	payment,
	amountWrittenOff,
	valueGuarantee,
	origin,
	interestUpdateMethodDescription,
	interestUpdateMethodId,
	guaranteeDate,
	requestDate,
	guaranteeModalityId,
	accountingBalance
} }: TGuaranteeJudicialDeposit) => {

	const dispatch = useDispatch();
	const history = useHistory();
	const { location: { pathname } } = history;
	const { banksAsOptions } = useBanks();

	const editAccData = pathname.includes("gestao") && guaranteeModalityId === 1 && accountingBalance !== 0;

	let judicialDepositData = useSelector(getJudicialDepositData);

	if (judicialDepositData === undefined) judicialDepositData = {...payment, isPayment: true, valueGuarantee};
	if (judicialDepositData.requestDate === undefined) judicialDepositData = {...judicialDepositData, requestDate}


	useEffect(() => {
		dispatch(fetchBanks())
	}, [dispatch])

	if (!judicialDepositData) return null;
	return (
		<>
			{judicialDepositData.isPayment && (
			<>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t('solicitacaoPagamento:dadosPagamento.dataPagamento')}
						value={guaranteeDate}
						type='date'
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t('goodsAndGuarantees:writeOffDate')}
						value={writeOffDate}
						type='date'
					/>
				</Grid>
			</>)}
			{origin && <Grid item xs={12} md={3}>
				<FieldColumn
					label={t('goodsAndGuarantees:management.origin')}
					value={origin}
					type='list'
					options={bearishReasonsOptions}
				/>
			</Grid>}
			<Grid item xs={12} md={3}>
				<SelectField
					name='bankId'
					label={t('solicitacaoPagamento:dadosPagamento.banco')}
					options={banksAsOptions}
					readOnly={!editAccData}
				/>
			</Grid>
			<Grid item xs={12} md={3}>
				<TextField
					label={t('solicitacaoPagamento:dadosPagamento.numeroContaJudicial')}
					name="account"
					readOnly={!editAccData}
				/>
			</Grid>
		
			{judicialDepositData.isPayment && (
				<>
					<Grid item xs={12} md={3}>
						<FieldColumn
							label={t('goodsAndGuarantees:management.interestUpdateMethodDescription')}
							value={interestUpdateMethodDescription}
							handleView={() => history.push(`/configuracoes/geral/formula-regra-correcao/${interestUpdateMethodId}`)}
						/>
					</Grid></>)}
					<Grid item xs={12} md={3}>
						<CheckboxField
							label={t('goodsAndGuarantees:management.automaticUpdateJudicialDeposit')}
							name='automaticUpdateJudicialDeposit'
							hideCheckBoxLable
							readOnly ={!pathname.includes("gestao")}
						/>
					</Grid>
			{judicialDepositData.isPayment && (<>
					<Grid item xs={12} md={3}>
					<FieldColumn
							label={t('goodsAndGuarantees:management.status')}
							value={isDeleted ? t('goodsAndGuarantees:management.dead') : t('enabled')}
						/>
					</Grid>
					{!fromAccountabilityId && (
						<Grid item xs={12} md={3}>
							<FieldColumn
								label={t('solicitacaoPagamento:dadosPagamento.valorPagamentoJudicial')}
								value={(judicialDepositData as TJudicialDepositPayment).legalPaymentValue ?? valueGuarantee}
								type='currency'
							/>
						</Grid>
					)}
				</>
			)}

			{!judicialDepositData.isPayment && (
				<>
					<Grid item xs={12} md={3}>
						<FieldColumn
							label={t('judicialBlocksAndTransfers:form.blockAndTransfersDate')}
							value={judicialDepositData.blockOrTransfDate}
							type='date'
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<FieldColumn
							label={t('judicialBlocksAndTransfers:form.documentNumber')}
							value={judicialDepositData.accountingDocumentNumber}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<FieldColumn
							label={t('judicialBlocksAndTransfers:form.updateMethod')}
							value={judicialDepositData.updateMethodDescription}
							handleView={() => history.push(`/configuracoes/geral/formula-regra-correcao/${judicialDepositData.updateMethodId}`)}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<FieldColumn
							label={t('goodsAndGuarantees:writeOffDate')}
							value={writeOffDate}
							type='date'
						/>
					</Grid>
					<Grid item md={3} xs={12}>
					<FieldColumn
							label={t('goodsAndGuarantees:management.status')}
							value={isDeleted ? t('goodsAndGuarantees:management.dead') : t('enabled')}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<FieldColumn
							label={t('judicialBlocksAndTransfers:form.occurrenceType')}
							value={judicialDepositData.occurrenceType}
							options={occurrenceTypesOptions}
							type='list'
						/>
					</Grid>
					{!fromAccountabilityId && (
						<Grid item xs={12} md={3}>
							<FieldColumn
								label={t('judicialBlocksAndTransfers:form.value')}
								value={judicialDepositData.value}
								type='currency'
							/>
						</Grid>
					)}
				</>
			)}

			{fromAccountabilityId && (
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t('goodsAndGuarantees:form.guaranteeAmount')}
						value={judicialDepositData.valueGuarantee}
						type='currency'
					/>
				</Grid>
			)}
			<Grid item xs={12} md={3}>
				<FieldColumn
					label={"Valor baixado"}
					value={amountWrittenOff}
					type={'currency'}
				/>
			</Grid>

			<Grid item xs={12} md={12}>
				<TextField
					name='description'
					label={t('judicialBlocksAndTransfers:form.description')}
					value={judicialDepositData.description}
					rows={5}
					maxLength={10000}
					readOnly={true}
					multiline
				/>
			</Grid>
		</>
	)
}

export default GuaranteeJudicialDeposit;