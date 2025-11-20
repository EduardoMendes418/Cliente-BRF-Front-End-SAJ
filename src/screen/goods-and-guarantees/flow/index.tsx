import { useEffect, useMemo } from "react";
import { useHistory, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@material-ui/core";

import ProcessFormData from "src/components/ProcessFormData";
import ScreenTemplate from "src/components/Screen";
import { t } from "src/locale/i18n";

import {
	getHasItemGoodsGuaranteesRequest,
	getLoadingGoodsGuaranteesRequest,
	getItemGoodsGuaranteesRequest,
} from "src/core/store/modules/goods-guarantee/selectors";
import { actions } from "src/core/store";
import { STATUS_APPROVALS_FLOW } from "src/core/utils/constants";
import { getProcessFormData } from "src/core/store/modules/process/selectors";
import {
	useFetchGoodsAndGuaranteesItem,
	useGoodsAndGuarantees,
} from "src/hooks/goodsAndGuarantees";
import { useGuaranteeModality } from "src/hooks/fetchLists";
import { useCurrentUser } from "src/config/permissions";
import {
	TGoodsGuaranteesRequest,
	TGuaranteeFlowInsurance,
	TGuaranteeFlowLetter,
	TGuaranteeFlowProperty,
} from "src/core/models/goods-guarantee";

import FolderSearchInfo from "./FolderSearchInfo";
import GuaranteeInsuranceBudgets from "./GuaranteeInsuranceBudgets";
import GuaranteeProperty from "./GuaranteeProperty";
import GuaranteeLetter from "./GuaranteeLetter";
import FlowAttachments from "../components/FlowAttachments";
import GoodsAndGuaranteesData from "../components/GoodsAndGuaranteesData";
import { TYPE_FLOW } from "../constants";

const GoodsAndGuaranteesFlowForm = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const { id } = useParams<{ id: string }>();

	useGoodsAndGuarantees("/bens-e-garantias/fluxo");
	useFetchGoodsAndGuaranteesItem(Number(id));

	const processForm = useSelector(getProcessFormData);
	const item = useSelector(getItemGoodsGuaranteesRequest);
	const isFetching = useSelector(getLoadingGoodsGuaranteesRequest);
	const hasItem = useSelector(getHasItemGoodsGuaranteesRequest);
	const { guaranteeModality } = useGuaranteeModality();
	const { currentScreenPermissions } = useCurrentUser(id);

	const typeFlow = useMemo(() => {
		return (
			guaranteeModality.find(({ id }) => id === item.guaranteeModalityId)
				?.typeFlow ?? TYPE_FLOW.NONE
		);
	}, [item.guaranteeModalityId, guaranteeModality]);

	if (
		hasItem &&
		item.statusApprovalId !== STATUS_APPROVALS_FLOW.APPROVED_DEFINITIVE
	) {
		enqueueSnackbar(t("goodsAndGuarantees:tasks.requestNotApproved"), {
			variant: "error",
		});
		history.replace("/bens-e-garantias/fluxo");
	}

	useEffect(() => {
		return () => {
			dispatch(actions.goodsGuaranteesRequest.clear());
			dispatch(actions.goodsGuaranteesEstimates.clear());
		};
	}, [dispatch]);

	delete item.isDeleted;
	return (
		<ScreenTemplate>
			{isFetching && (
				<CircularProgress className="margin-top-16 align-center" />
			)}
			{hasItem && (
				<>
					<FolderSearchInfo
						folderNumber={item.folderNumber}
						typeFlow={typeFlow}
						statusFlowId={item.statusFlowId}
						statusApprovalId={item.statusApprovalId}
						requestId={item.id}
						requestDate={item?.requestDate}
					/>
					<ProcessFormData processData={processForm} />
					<GoodsAndGuaranteesData item={item} />
					<FlowAttachments typeFlow={typeFlow} />
					{typeFlow === TYPE_FLOW.INSURANCE && (
						<GuaranteeInsuranceBudgets
							item={
								{ ...item } as TGoodsGuaranteesRequest &
									TGuaranteeFlowInsurance
							}
							isRequester={currentScreenPermissions.add}
							isApprover={currentScreenPermissions.edit}
						/>
					)}
					{typeFlow === TYPE_FLOW.PROPERTY && (
						<GuaranteeProperty
							item={
								{ ...item } as TGoodsGuaranteesRequest &
									TGuaranteeFlowProperty
							}
							isRequester={currentScreenPermissions.add}
							isApprover={currentScreenPermissions.edit}
						/>
					)}
					{typeFlow === TYPE_FLOW.LETTER && (
						<GuaranteeLetter
							item={
								{ ...item } as TGoodsGuaranteesRequest &
									TGuaranteeFlowLetter
							}
							isRequester={currentScreenPermissions.add}
							isApprover={currentScreenPermissions.edit}
						/>
					)}
				</>
			)}
		</ScreenTemplate>
	);
};

export default GoodsAndGuaranteesFlowForm;
