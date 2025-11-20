import { useEffect } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import List from "./List";
import Search from "./Search";
import ScreenTemplate from "src/components/Screen";

import { usePagination } from "src/hooks/pagination";
import { fetchRequisitions } from "src/core/store/modules/requisitions/thunks";
import { getFiltersRequisitions, getRollbackStatusIfCancelRequisitions } from "src/core/store/modules/requisitions/selectors";
import { rejectNoValues } from "src/core/utils/func";
import { useCurrentUser } from "src/config/permissions";
import AddNewButton from "src/components/button/AddNew";
import { actions } from "../../../core/store";
import { ButtonDiv } from "./styled";

const Requisitions = () => {
	const dispatch = useDispatch();
	const {
		location: { pathname },
	} = useHistory();

	const requisitionFilters = useSelector(getFiltersRequisitions);

	const { page, pageSize } = usePagination();
	const { userId = 0, isAdmin } = useCurrentUser("");

	const isService = pathname.startsWith("/requisicoes/atendimento");
	const isRequest = pathname.startsWith("/requisicoes/requisicoes");
	const isRollbackingStatus = useSelector(
		getRollbackStatusIfCancelRequisitions
	);

	useEffect(() => {
		if (isRollbackingStatus) {
			return;
		}
		const filters = requisitionFilters[pathname] ?? {};
		const result = rejectNoValues({
			...filters,
			page,
			responsibleUserId: filters.responsibleUserId,
		});
		
		dispatch(
			fetchRequisitions({
				page,
				pageSize,
				...result,
				serviceRequisition: isService,
				responsibleUserId: result.responsibleUserId as number[],
				status:
					filters.status === undefined && isService ? [3, 4] : filters.status,
			})
		)
	}, [
		dispatch,
		page,
		pageSize,
		requisitionFilters,
		isService,
		userId,
		pathname,
		isAdmin,
		isRollbackingStatus
	]);

	useEffect(() => {
		return () => {
			dispatch(actions.requisitions.cleanFilter());
			dispatch(actions.requisitions.clear());
		};
	}, [dispatch]);

	return (
		<ScreenTemplate
			slotTopRight={
				!isService && !pathname.startsWith("/carga-de-dados/requisicoes")
			}
		>
			{pathname.startsWith("/carga-de-dados/requisicoes") && (
				<ButtonDiv>
					<AddNewButton to={"/carga-de-dados/requisicoes/new"}>
						Importar/exportar
					</AddNewButton>
				</ButtonDiv>
			)}

			<Search isService={isService} />

			<List isRequest={isRequest} isService={isService} />
		</ScreenTemplate>
	);
};

export default Requisitions;
