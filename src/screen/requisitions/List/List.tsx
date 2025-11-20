import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import Table, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";

import {
	getListRequisitions,
	getLoadingRequisitions,
} from "src/core/store/modules/requisitions/selectors";
import { useTranslation } from "src/locale/i18n";
import { TRequisition } from "src/core/models/requisitions";
import { STATUS, statusText } from "../constants";
import { RESPONSIBLE_TYPE } from "src/screen/settings/general/request-parameters/constants";
import { useUsersActives } from "src/hooks/fetchLists";
import { FormLabel } from "@material-ui/core";
import { usePagination } from "src/hooks/pagination";
import { handleAdministrativeControl } from "../utils";
import { overFlowArrayText } from "src/core/utils/array";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";

const Requisitions = ({ isService, isRequest }: { isService: boolean, isRequest: boolean }) => {
	
	const { t } = useTranslation();
	const history = useHistory();

	const list = useSelector(getListRequisitions);
	const loading = useSelector(getLoadingRequisitions);

	const {usersActivesAsOptionsById} = useUsersActives();
	const user = useSelector(getDataCurrentUser);

	const pagination = usePagination();

	const rows = list.map(({ status, requestParameter, ...item }) => {
		
		const isEditButtonHidden = [
			STATUS.APPROVED_DEFINITIVE,
			STATUS.REJECTED_DEFINITIVE, 
			STATUS.CANCELLED,
			STATUS.RETURNED, 
		].includes(status);

		const isEditButtonHiddenRequest = [
			STATUS.NONE,
			STATUS.REJECTED_DEFINITIVE,
			STATUS.APPROVED_DEFINITIVE,
			STATUS.REQUESTED,
			STATUS.IN_REVIEW,
			STATUS.CANCELLED
		].includes(status);


		let responsible = item.responsibleName;
		const requester = item?.createdBy;
		
		const administrativeControlResponsiblesIds =
			item.administrativeControlResponsiblesIds;

		if (!responsible) {
			if (
				requestParameter.responsibleType ===
				RESPONSIBLE_TYPE.ADMINISTRATIVE_CONTROL
			){
				responsible = t("requisitions:list.team");
			}else if (
				administrativeControlResponsiblesIds !== undefined &&
				administrativeControlResponsiblesIds.length
			){
				responsible =
					usersActivesAsOptionsById.find(
						({ value }) => value === administrativeControlResponsiblesIds[0]
					)?.label ?? "";}
		}
		const finalResponsible = item.administrativeControlResponsiblesNames && item.administrativeControlResponsiblesNames.length > 0
		? handleAdministrativeControl(
				status, 
				item.administrativeControlResponsiblesIds,
				item.responsiblesInService,
				usersActivesAsOptionsById, 
				","
			)
		: responsible

		const isRequester = requester === user?.name;
		const isReturned = statusText[status] === "Devolvido";
		const allowEdit = !isRequester && isRequest && isReturned;
	
		return {
			...item,
			serviceUserName: item?.serviceUser?.name,
			requestType: requestParameter.requestType,
			status: statusText[status],
			isViewButtonHidden: isService === true ? !isEditButtonHidden : allowEdit && isRequest  === true  ? !isEditButtonHidden: !isEditButtonHiddenRequest,
			isEditButtonHidden: isService === true ? isEditButtonHidden : allowEdit && isRequest  === true  ? isEditButtonHidden : isEditButtonHiddenRequest,
			responsible:  isRequest && requestParameter.responsibleType ===
			RESPONSIBLE_TYPE.ADMINISTRATIVE_CONTROL ? 'Equipe de Atendimento' : overFlowArrayText(finalResponsible?.split(" , ") ?? [], 2) ,
		} 
	});
	
	const columns: ColumnData[] = [
		{ label: t("requisitions:list.id"), field: "id" },
		{
			label: t("requisitions:requestDate"),
			field: "requestDate",
			type: "date",
		},
		{ label: t("requisitions:list.requestType"), field: "requestType" },
		{ label: t("requisitions:list.CTGFolder"), field: "folderNumber" },
		{ label: "Nome responsável atendimento", field: "responsible" },
		{ label: t("requisitions:list.serviceUserName"), field: "serviceUserName" },
		{
			label: t("requisitions:list.expectedServiceDate"),
			field: "expectedServiceDate",
			type: "date",
		},
		{
			label: t("requisitions:list.endDate"),
			field: "conclusionDate",
			type: "dateHour",
		},
		{ label: t("requisitions:list.requester"), field: "createdBy" },
		{ label: t("status"), field: "status" },
	];

	const onEdit = ({ id }: TRequisition) => {
		window.open(`${history.location.pathname}/${id}`, '_blank')
	};

	return (
		<>
			<Panel title={t("requisitions:title")}>
				{history.location.pathname.startsWith(
					"/carga-de-dados/requisicoes"
				) && (
					<FormLabel
						style={{ fontWeight: "bold", display: "flex", margin: "1rem" }}
					>
						{t("dataImport:common.itemListCount")} {pagination.itemCount}
					</FormLabel>
				)}
	
				<Table
					onVisualize={onEdit}
					onEdit={onEdit}
					columns={columns}
					rows={rows}
					isLoading={loading}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default Requisitions;
