import { useEffect, useCallback, useState, useMemo, useRef } from "react";
import { useLocation, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as queryString from "query-string";

import ScreenTemplate from "src/components/Screen";

import {
	getItemGuaranteeAccountability,
	getHasItemGuaranteeAccountability,
	getLoadingGuaranteeAccountability,
} from "src/core/store/modules/guarantee-accountability/selectors";
import {
	getHasItemGoodsGuaranteesRequest,
	getLoadingGoodsGuaranteesRequest,
	getItemGoodsGuaranteesRequest,
} from "src/core/store/modules/goods-guarantee/selectors";

import ProcessFormData from "src/components/ProcessFormData";
import { getGuaranteeAccountability } from "src/core/store/modules/guarantee-accountability/thunks";
import { actions } from "src/core/store";
import { useGuaranteeModality } from "src/hooks/fetchLists";
import { t } from "src/locale/i18n";
import { fetchProcessFolder } from "src/core/store/modules/process/thunks";

import GoodsAndGuaranteesData from "src/screen/goods-and-guarantees/management/View/GoodAndGuaranteeData";
import Attachments from "../../components/Attachments";
import RequestData from "../../components/RequestData";
import { TYPE_FLOW, BEARISH_REASONS } from "../../constants";
import Search from "./Search";
import CommonForm from "./CommonForm";
import JudicialDepositForm from "./JudicialDepositForm";
import AccordionPanel from "src/components/AccordionPanel";
import AccountabilityModal from "src/components/AccountabilityModal";
import useFormPermission from "src/screen/goods-and-guarantees/accountability/Form/hooks/useFormPermission";
import { getOrders, getProvisionsProcessRequestScreenLoading } from "src/core/store/modules/provision-order/selectors";
import { fetchProvisionsProcess } from "src/core/store/modules/provision-order/thunks";
import api from "src/core/api/guarantee-accountability";
import { useSnackbar } from "notistack";
import ListAccountsPendingApproval from "./ListAccountsPendingApproval";
import { TGuaranteeAccountability } from "src/core/models/guarantee-accountability";
import { guaranteeAccountabilityAccounting } from "src/core/store/modules/guarantee-accountability/thunks";
import { Formik } from "formik";
import { getProcessFormData } from "src/core/store/modules/process/selectors";
import { getPendingConfrontOrders } from "src/core/store/modules/confronting-orders/thunks";
import { checkHasPaymentPending } from "src/core/store/modules/provision-order/thunks";
import { AppDispatch } from "src/core/store";
import apiInterestUpdate from "src/core/api/interest-update";
import { fetchGoodsGuaranteesRequestById } from 'src/core/store/modules/goods-guarantee/thunks';
import { FormikProps } from "formik";
import { CircularProgress } from "@material-ui/core";
import { IconDiv } from "./styled";

type TGoodAndGuaranteeDataForm = {
	description: string;
	observation: string;
	automaticUpdateJudicialDeposit: boolean;
	bankId?: number | "";
	account?: string;
};

const GuaranteeAccountabilityForm = () => {
	
	const form = useRef<FormikProps<any>>(null);
	const location = useLocation();
	const dispatch = useDispatch<AppDispatch>();
	let { id } = useParams<{ id: string }>();
	const { enqueueSnackbar } = useSnackbar();

	const [accountability, setAccountability] = useState<TGuaranteeAccountability[]>([]);
	const [folderNumberState, setFolderNumberState] = useState<string>("");
	const [sap, setSap] = useState<any>({});
	const [bearishReason, setBearishReason] = useState<BEARISH_REASONS | "">("");
	const hasProvisionsProcessRequestScreenLoading = useSelector(getProvisionsProcessRequestScreenLoading)
	
	let isReversal = false
	if (id.includes(";")) {
		id = id.split(";")[0];
		isReversal = true
	}
	const isNew = id === "novo";
	const { guaranteeModality } = useGuaranteeModality();

	const isSolicitacao = location.pathname.includes("prestacao-de-contas-solicitacao");

	const { bemId: goodId } = queryString.parse(location.search) as { bemId: string;};

	const loadingAccountability = useSelector(getLoadingGuaranteeAccountability);
	const loadingRequest = useSelector(getLoadingGoodsGuaranteesRequest);

	const hasItem = useSelector(getHasItemGuaranteeAccountability);
	const hasItemRequest = useSelector(getHasItemGoodsGuaranteesRequest);
	const itemAccountability = useSelector(getItemGuaranteeAccountability);
	const itemRequest = useSelector(getItemGoodsGuaranteesRequest);

	const processForm = useSelector(getProcessFormData);
	const orders = useSelector(getOrders);
	
	const filtredOrders = useMemo(() => orders && orders.filter(({isActive, orderRatings, orderExpectationId}) => {
		if (!isActive) return false
		if (orderExpectationId !== 1) return false
		const orderRatingProbabability = orderRatings.filter(({orderRatingProbababilityId, value}) => orderRatingProbababilityId === 1 && value !== 0 && value !== null).pop()
	
		if (orderRatingProbabability?.value === undefined) return false
		return true
	}), [orders]);

	const { canEdit } = useFormPermission();

	const loading = loadingRequest || loadingAccountability;
	const goodsData = itemAccountability.goodsGuaranteesRequest || itemRequest;
	const goodsGuaranteesRequestId = itemAccountability.goodsGuaranteesRequestId || itemRequest.id || Number(goodId);
	const notFound = !!id && !isNew && !hasItem && !loading;
	const notValidStatus = hasItemRequest && itemRequest.isDeleted && !hasItem;
	
	let isFormEditable = false;
	if (isNew) isFormEditable = true;
	else if (itemAccountability.folderNumber) {
		const { status, statusFlowId } = itemAccountability;
		isFormEditable = canEdit(statusFlowId, status);
	};

	const getAccountability = useCallback(
		async (folderNumber: string) => {
			try {
				const response = await api.list({ folderNumber, pageSize: 100 });
				setAccountability(response.data?.items ?? []);
			} catch (error) {
				enqueueSnackbar(t("anErrorHasOcurred"), { variant: "error" });
			}
		},
		[enqueueSnackbar, setAccountability]
	);

	let customError;
	const itemRequestHasUpdate = itemRequest.updateTypeId && itemRequest.updateTypeId !== 4;
	
	if (notValidStatus ||(itemRequest && itemRequestHasUpdate))
		customError =
			itemRequest.updateTypeId !== 4
				? "Não é possível criar uma prestação de contas para endosso de atualização"
				: t("goodsAndGuarantees:accountability.notValidStatus");

	const { typeFlow } =
		guaranteeModality.find(({ id }) => id === goodsData.guaranteeModalityId) ??
		{};

	useEffect(() => {

		if (isNew) 
			dispatch(actions.goodsGuaranteesRequest.clear()); 
		else if (id) 
			dispatch(getGuaranteeAccountability(Number(id)));

		return () => {
			dispatch(actions.guaranteeAccountability.clear());
			dispatch(actions.goodsGuaranteesRequest.clear());
			dispatch(actions.provisionOrder.clearProvisionProcess());
		};
	}, [dispatch, id, isNew]);

	useEffect(() => {
		
		if (id && !isNew) 
			dispatch(guaranteeAccountabilityAccounting(Number(id)));
	}, [dispatch, id, isNew]);

	const getPendingConfrontOrdersAndcheckHasPaymentPending = useCallback(
		async (folderNumber: string) => {
			try {
				const {
					meta: metaConfrontOrders,
					payload: { pending: pendingConfrontOrders },
				} = await dispatch(getPendingConfrontOrders(folderNumber));
				if (
					metaConfrontOrders.requestStatus === "rejected" ||
					pendingConfrontOrders
				) {
					enqueueSnackbar("Existe confrontador pendente para esta pasta/CTG", {
						variant: "error",
					});
				}

				const { meta: metaPayment, payload: pendingPayment } = await dispatch(
					checkHasPaymentPending(folderNumber)
				);

				if (metaPayment.requestStatus === "rejected" || pendingPayment) {
					enqueueSnackbar("Existe pagamento pendente para esta pasta/CTG", {
						variant: "error",
					});
				}
			} catch (error) {
				console.error(error)
			}
		},
		[dispatch, enqueueSnackbar]
	);

	const getSapId = useCallback(async (id: number) => {
		const {
			data: { items },
		} = await apiInterestUpdate.getSap(id);
		if (items && items.length) setSap(items.pop());
	}, []);

	const itemtypeFlow = useMemo(
		() =>
			guaranteeModality.find(({ id }) => id === itemRequest.guaranteeModalityId)
				?.typeFlow ?? TYPE_FLOW.NONE,
		[guaranteeModality, itemRequest.guaranteeModalityId]
	);

	const initialValues: TGoodAndGuaranteeDataForm = {
		description: itemRequest.description ?? "",
		observation: itemRequest.observation ?? "",
		automaticUpdateJudicialDeposit: itemRequest.automaticUpdateJudicialDeposit ?? true,
	};

	if (itemtypeFlow === TYPE_FLOW.JUDICIAL_DEPOSIT) {
		initialValues.bankId =
			itemRequest.bankId ?? itemRequest.judicialBlocksAndTransfer?.bankId;
		initialValues.account =
			itemRequest.account ?? itemRequest.judicialBlocksAndTransfer?.judicialAccountNumber;
	};

	useEffect(() => {
		if (goodsGuaranteesRequestId){
			dispatch(fetchGoodsGuaranteesRequestById(goodsGuaranteesRequestId));}
	}, [goodsGuaranteesRequestId, dispatch]);	

	useEffect(() => {

		const hasItemAccountabilityFN = itemAccountability.folderNumber && !itemRequest.folderNumber;
		const hasItemRequestFN = !itemAccountability.folderNumber && itemRequest.folderNumber;

		if (!loading && hasItemAccountabilityFN)
			getPendingConfrontOrdersAndcheckHasPaymentPending(itemAccountability.folderNumber);

		if (!loading && hasItemRequestFN)
			getPendingConfrontOrdersAndcheckHasPaymentPending(itemRequest.folderNumber);
	}, [itemAccountability.folderNumber, itemRequest.folderNumber, getPendingConfrontOrdersAndcheckHasPaymentPending]);

	useEffect(() => {
		if (itemAccountability.id) getSapId(Number(itemAccountability.id));
	}, [itemAccountability.id, getSapId]);

	useEffect(() => {

		if (filtredOrders.length > 1) {
			if (
				itemRequest.folderNumber &&
				folderNumberState !== itemRequest.folderNumber
			) {
				getAccountability(itemRequest.folderNumber);
			} else if (
				itemAccountability.folderNumber &&
				folderNumberState !== itemAccountability.folderNumber
			) {
				getAccountability(itemAccountability.folderNumber);
			}
		}
	}, [itemRequest.folderNumber, folderNumberState, getAccountability, itemAccountability.folderNumber, filtredOrders.length]);

 	useEffect(() => {

		 if (
			itemRequest.folderNumber &&
			folderNumberState !== itemRequest.folderNumber
		) {
			setFolderNumberState(itemRequest.folderNumber);
			dispatch(fetchProvisionsProcess(itemRequest.folderNumber));
			dispatch(fetchProcessFolder({ folderNumber: itemRequest.folderNumber }));
		} else if (
			itemAccountability.folderNumber &&
			folderNumberState !== itemAccountability.folderNumber
		) {
			setFolderNumberState(itemAccountability.folderNumber);
			dispatch(
				actions.provisionOrder.setAllPaymentOrders(
					itemAccountability.accountabilityOrders
				)
			);
			dispatch(fetchProvisionsProcess(itemAccountability.folderNumber));
			dispatch(
				fetchProcessFolder({ folderNumber: itemAccountability.folderNumber })
			);
		}
	 }, [
		dispatch,
		itemRequest,
		itemAccountability,
		folderNumberState,
		getSapId,
		hasProvisionsProcessRequestScreenLoading
	]);

	return (
		<ScreenTemplate>
			<Search
				error={customError}
				loading={loading}
				hasItem={hasItem}
				notFound={notFound}
				hasItemRequest={hasItemRequest}
				goodsGuaranteesRequestId={goodsGuaranteesRequestId ?? ""}
				id={id}
			/>
			{loading  && <IconDiv>
				<CircularProgress style={{marginTop: 28, marginLeft: "auto", marginRight: "auto"}} />
			</IconDiv>}
			{!loading && (hasItem || hasItemRequest) && !customError && (
				<>
					<ProcessFormData processData={processForm} />
					<RequestData
						parentAccountabilityId={itemAccountability?.parentAccountabilityId}
						item={goodsData}
						goTo="gestao"
						title="Dados da solicitação"
					/>
					<Formik
						initialValues={initialValues}
						onSubmit={() => {}}
						status={"readOnly"}
					>
						<GoodsAndGuaranteesData
							item={itemRequest}
							typeFlow={itemtypeFlow}
							startExpanded={false}
						/>
					</Formik>

					{filtredOrders.length > 1 &&
						[
							BEARISH_REASONS.CONVERTED_TO_PAYMENT,
							BEARISH_REASONS.LOW_FOR_LOSS,
						].findIndex((item) => item === bearishReason) !== -1 && (
							<AccordionPanel title={"Pedidos de provisão"}>
								<ListAccountsPendingApproval list={accountability} />
								<AccountabilityModal
									folderNumber={itemRequest.folderNumber}
									isEditable={isSolicitacao && isFormEditable}
									form={form}
									isSpecialSetFormValues={true}
									dictionary={{
										1: "amountWrittenOff",
										2: "fine",
										3: "historicalInterest",
										4: "charge",
										5: "succumbence"
									}}
								/>
							</AccordionPanel>
						)}
						
					<Attachments attachments={goodsData.files} />
					
					{typeFlow === TYPE_FLOW.JUDICIAL_DEPOSIT ? (
						<JudicialDepositForm
							hasItem={hasItem}
							itemRequest={goodsData}
							itemAccountability={itemAccountability}
							isSolicitacao={isSolicitacao}
							bearishReason={bearishReason}
							setBearishReason={setBearishReason}
							reversalJudicialDepositSap={sap}
							form={form}

						/>
					) : (
						<CommonForm
							hasItem={hasItem}
							itemRequest={goodsData}
							itemAccountability={itemAccountability}
							isSolicitacao={isSolicitacao}
							isReversal={isReversal}
						/>
					)}

				</>
			)}
		</ScreenTemplate>
	);
};

export default GuaranteeAccountabilityForm;
