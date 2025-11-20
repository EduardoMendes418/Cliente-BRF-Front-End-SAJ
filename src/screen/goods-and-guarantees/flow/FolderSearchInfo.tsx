import { Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import FieldColumn from "src/components/FieldColumn";
import Panel from "src/components/Panel";
import { STATUS_APPROVALS_FLOW } from "src/core/utils/constants";

import { getStatusTextFromGoodAndGuarantees } from "../statusInfo";
import { TYPE_FLOW } from "../constants";
import { t } from 'src/locale/i18n';


type TFolderSearchInfo = {
	folderNumber: string;
	statusFlowId: number;
	typeFlow: TYPE_FLOW;
	statusApprovalId: STATUS_APPROVALS_FLOW;
	requestId?: number;
	requestDate?:string;
}

const FolderSearchInfo = ({ folderNumber, typeFlow, statusFlowId, statusApprovalId, requestId, requestDate }: TFolderSearchInfo) => {
	const history = useHistory();

	const status = getStatusTextFromGoodAndGuarantees(typeFlow, statusFlowId, statusApprovalId)


	return (
		<Panel title={t('goodsAndGuarantees:form.goodsAndGuaranteesData')} withPadding>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t('form.CTGFolder')}
						value={folderNumber}
						/>
				</Grid>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={t('goodsAndGuarantees:requestNumber')}
						value={requestId}
						handleView={() => history.push(`/bens-e-garantias/solicitacao/${requestId}`)}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<FieldColumn
						label={"Data da solicitação"}
						value={requestDate}
						type='date'
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<FieldColumn
						label={t('status')}
						value={status}
					/>
				</Grid>
			</Grid>
		</Panel>
	)
}

export default FolderSearchInfo;
