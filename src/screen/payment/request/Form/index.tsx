import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import ScreenTemplate from "src/components/Screen";
import Search from "./common/Search";
import FormDefault from "./types/default/Form";
import FormGuides from "./types/guides/Form";
import FormFGTS from "./types/FGTS/Form";
import FormGPS from "./types/GPS/Form";
import FormIRRF from "./types/IRRF/Form";
import {
	getProcessFolderData,
	getItemPaymentNew,
	getStatusPayment,
	getHasItem,
	getErrorMessage,
	getPaymentSearch,
	getLoadingPayment,
} from "src/core/store/modules/payment/selectors";
import {
	getProcessFormData,
	getProcessIsFetching,
} from "src/core/store/modules/process/selectors";
import { actions } from "src/core/store/";
import {
	editPaymentRequestSimple,
	getPayment,
	getPaymentAccounting,
	updateStatusPaymentRequest,
} from "src/core/store/modules/payment/thunks";
import { STATUS_APPROVALS_FLOW } from "src/core/utils/constants";
import {
	TPaymentDatasDefault,
	TPaymentDataFGTS,
	TPaymentDataGPS,
	TPaymentDataGuides,
	TPaymentDataIRRF,
	TTypeForm,
} from "src/core/models/payment";
import { TPayment } from "src/core/models/payment";

import { fetchBanks } from "src/core/store/modules/banks/thunks";
import ProcessFormData from "src/components/ProcessFormData";
import ApprovalForm from "src/components/ApprovalForm";
import { t, useTranslation } from "src/locale/i18n";
import { useRegisterDefault } from "src/hooks";
import { usePaymentTypeMethod } from "src/hooks/fetchLists";
import { getListPaymentType } from "src/core/store/modules/payment-type/selectors";
import { WRITE_OFF_PROVISION_BALANCE } from "src/screen/settings/constants";
import confrontersApi from "src/core/api/confronting-orders";
import { TProvisionProcess } from "src/core/models/provision-order";
import { getProvisionsProcess } from "src/core/store/modules/provision-order/selectors";

import api from "src/core/api/process";
import { getListESocialAreas } from "src/core/store/modules/e-social-areas/selectors";

type TForm = {
	typeForm: TTypeForm;
	item: TPayment;
	hasItem: boolean;
	isApprovalLegalControl: boolean;
	isApprovalInternalLawyer: boolean;
	eSocialFormVisibility: boolean;
	uploadESocialPJC: boolean;
};

const getForm = ({ item, typeForm, ...props }: TForm) => {
	switch (item?.form || typeForm) {
		case "default":
			return <FormDefault item={item as TPaymentDatasDefault} {...props} />;
		case "guia":
			return <FormGuides item={item as TPaymentDataGuides} {...props} />;
		case "fgts":
			return <FormFGTS item={item as TPaymentDataFGTS} {...props} />;
		case "gps":
			return <FormGPS item={item as TPaymentDataGPS} {...props} />;
		case "irrf":
			return <FormIRRF item={item as TPaymentDataIRRF} {...props} />;
		default:
			return null;
	}
};

const writeOffProvisionBalanceMessage = {
	[WRITE_OFF_PROVISION_BALANCE.NONE]: "",
	[WRITE_OFF_PROVISION_BALANCE.PARTIAL]: t(
		"solicitacaoPagamento:approval.partialProvisionMessage"
	),
	[WRITE_OFF_PROVISION_BALANCE.TOTAL]: t(
		"solicitacaoPagamento:approval.totalProvisionMessage"
	),
} as any;

const PaymentForm = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { pathname } = useLocation();
	let { id } = useParams<{ id: string }>();
	const isNew = id === "novo";
	let isReversal = false;
	if (id.includes(";")) {
		id = id.split(";")[0];
		isReversal = true;
	}

	const [hasConfronter, setHasConfronter] = useState(false);
	const [paymentTypeStatus, setPaymentTypeStatus] = useState<boolean>(true);
	const [renderComponents, setRenderComponents] = useState<boolean>(true);

	const dejurAreaName = useSelector(getListESocialAreas);

	const areaName = dejurAreaName[0]?.areaName;

	const [process, setProcess] = useState<TProvisionProcess | null>(null);

	const hasItem = useSelector(getHasItem);
	const item = useSelector(getItemPaymentNew);
	const statusSave = useSelector(getStatusPayment);
	const loadingItem = useSelector(getLoadingPayment);
	const paymentTypes = useSelector(getListPaymentType);
	const processFolderDataItem = useSelector(getProcessFolderData);

	const { formaPagamentoId, tipoPagamentoId } = useSelector(getPaymentSearch);

	const interProcess = useSelector(getProvisionsProcess);

	const loadingFolder = useSelector(getProcessIsFetching);
	const processFolderDataFolder = useSelector(getProcessFormData);

	const loading = loadingItem || (isNew && loadingFolder);
	const isSaving = statusSave === "saving";

	const hasFolder =
		!!processFolderDataFolder.processKey && !processFolderDataFolder.closed;

	const processFolderData = isNew
		? processFolderDataFolder
		: processFolderDataItem;

	const writeOffProvisionBalance =
		paymentTypes?.find(({ id }) => id === tipoPagamentoId)
			?.abaterSaldoProvisao ?? 0;
	const paymentType = paymentTypes?.find(({ id }) => id === tipoPagamentoId);

	const eSocialFormVisibility =
		process?.actionType !== "Acao Regressiva" &&
		dejurAreaName?.some(item => item.areaId ===  process?.legalDepartmentAreaId) &&
		process?.actionType !== "INSS - Ações Regressivas" &&
		paymentType?.generateGuideFiles === 4 &&
		!paymentType?.eSocialRestriction;


	const uploadESocialPJC = paymentTypes?.find(
		({ id }) => id === tipoPagamentoId
	)?.uploadESocialPJC;

	const { typeForm, paymentMethodSelectedAsOptions } = usePaymentTypeMethod(
		tipoPagamentoId,
		formaPagamentoId
	);

	const doRequest = useCallback(async (folderNumber: string) => {
		// setIsLoading(true);
		const processApi = await api.getFolderSheetComponentFolderNumber(
			folderNumber
		);
		setProcess(processApi.data);
		// setIsLoading(false);
	}, []);

	const getPendingConfronters = useCallback(async (folderNumber: string) => {
		const { data } = await confrontersApi.getPendings(folderNumber);
		setHasConfronter(!!data.pending);
	}, []);

	useEffect(() => {
		if (
			processFolderData?.folderNumber !== undefined &&
			processFolderData?.processKey.toString() !== interProcess.processNumber
		) {
			doRequest(processFolderData?.folderNumber);
		}
		if (processFolderData.folderNumber !== undefined)
			doRequest(processFolderData.folderNumber);
	}, [
		// dispatch,
		interProcess.folderNumber,
		interProcess.processNumber,
		processFolderData?.folderNumber,
		processFolderData?.processKey,
	]);

	useEffect(() => {
		if (processFolderData.folderNumber !== undefined) {
			getPendingConfronters(processFolderData.folderNumber);
		}
	}, [getPendingConfronters, processFolderData.folderNumber]);

	useEffect(() => {
		if (!isNew && item.paymentOrders) {
			dispatch(
				actions.provisionOrder.setAllPaymentOrders(item.paymentOrders ?? [])
			);
		}
	}, [item, isNew, dispatch]);

	useEffect(() => {
		return () => {
			dispatch(actions.parameterization.clear());
			dispatch(actions.paymentRequest.clear());
			dispatch(actions.process.clear());
		};
	}, [dispatch, getPendingConfronters]);

	useEffect(() => {
		if (isNew) dispatch(actions.process.clear());
		else if (id) {
			dispatch(fetchBanks());
			dispatch(getPayment(Number(id)));
			dispatch(getPaymentAccounting(Number(id)));
		}
	}, [dispatch, isNew, id]);

	useRegisterDefault({
		action: "paymentRequest",
		getStatus: getStatusPayment,
		getErrorMessage,
	});

	const isApprovalLegalControl = pathname.startsWith("/pagamentos/aprovacao-controle-juridico");

	const isApprovalInternalLawyer = pathname.startsWith("/pagamentos/aprovacao-advogado-interno");

	return (
		<ScreenTemplate>
			<Search
				verifyPaymentStatus={setPaymentTypeStatus}
				item={item}
				loading={loading}
				hasItem={hasItem}
				paymentMethodSelectedOptions={paymentMethodSelectedAsOptions}
				setRenderComponents={setRenderComponents}
			/>
			{((isNew && hasFolder && renderComponents) ||
				hasItem ||
				processFolderData?.statusId === 3) && (
				<>
					<ProcessFormData
						processData={{
							...processFolderData,
							hasConfronter,
							nomeReclamante: item?.processPartiesOther?.name
								? item?.processPartiesOther?.name
								: processFolderData?.processParties
										?.filter((item: any) => item.situation === "Outra parte")
										.map((item: any) => item.name)[0],
							empresa: item?.empresa
								? item?.empresa
								: processFolderData?.processParties
										?.filter((item: any) => item.situation === "Cliente")
										.map((item: any) => item.name)[0],
						}}
					/>
					{(paymentTypeStatus || processFolderData?.statusId === 1) &&
						getForm({
							typeForm,
							item,
							hasItem,
							isApprovalLegalControl,
							isApprovalInternalLawyer,
							eSocialFormVisibility,
							uploadESocialPJC: uploadESocialPJC ?? false,
						})}
					{(isApprovalLegalControl ||
						isApprovalInternalLawyer ||
						[
							STATUS_APPROVALS_FLOW.APPROVED,
							STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE,
							STATUS_APPROVALS_FLOW.RECEIPT_AVALIABLE,
						].includes(item.statusFlowId ?? -1)) && (
						<ApprovalForm
							isReversal={isReversal}
							item={item}
							isInternalLawyer
							typeForm={item?.form || typeForm}
							isApprovalLegalControl={isApprovalLegalControl}
							isApprovalInternalLawyer={isApprovalInternalLawyer}
							page={t("Pagamentos:page")}
							updateStatus={(value) => {
								const validsForms = ["fgts", "gps", "irrf"];
								if (
									value.statusFlowId === 2 &&
									(validsForms.includes(item?.form) ||
										validsForms.includes(typeForm))
								) {
									dispatch(
										editPaymentRequestSimple({
											...item,
											...value,
											valorPrincipal:
												Number(item.valorPrincipal) +
												Number(item.valorJurosHistorico),
											statusFlowId: 2,
										})
									);
								} else
									dispatch(
										updateStatusPaymentRequest({ ...value, id: Number(id) })
									);
							}}
							approvalConfirmationMessage={
								isApprovalInternalLawyer
									? writeOffProvisionBalanceMessage[writeOffProvisionBalance]
									: undefined
							}
							moduloId={6}
							isSubmitting={isSaving}
							overrideIsInternal={isApprovalInternalLawyer}
						/>
					)}
				</>
			)}
		</ScreenTemplate>
	);
};

export default PaymentForm;
