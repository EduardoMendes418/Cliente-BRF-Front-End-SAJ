import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import ScreenTemplate from "src/components/Screen";
import Search from "./common/Search";
import FormS2500 from "./types/S2500/Form";
import FormS2501 from "./types/S2501/Form";
import FormS3500 from "./types/S3500/Form";
import {
	getLoadingESocialEventLauch,
	getItemESocialEventLauch,
	getErrorMessage,
	getStatus,
	getHasItemEventLauch,
} from "src/core/store/modules/e-social-event-launch/selectors";
import { getProcessIsFetching } from "src/core/store/modules/process/selectors";

import { useRegisterDefault } from "src/hooks";
import { fetchESocialRegistrationTable } from "src/core/store/modules/e-social-registration-table/thunks";
import { ESocial } from "src/core/models/eSocial";
import { getSearchEventLauch } from "src/core/store/modules/e-social-event-launch/selectors";
import { fetchESocialEventLauchById, fetchESocialEventLauchGovernmentResponsesById } from "src/core/store/modules/e-social-event-launch/thunks";
import { actions } from "src/core/store";
import TableComponent from "src/components/Table";

import { 
	fetchAutocompleteESocialData	
} from "src/core/store/modules/e-social-event-launch/thunks";
import { modal } from "src/components/modals";
import { eSocialLabelsFieldDictionary } from "./common/FieldErrorDictionary";


type TForm = {
	eventCode: ESocial;
};

const getForm = ({ eventCode }: TForm) => {
	switch (Number(eventCode)) {
		case ESocial.S2500:
			return <FormS2500 />;
		case ESocial.S2501:
			return <FormS2501 />;
		case ESocial.S3500:
			return <FormS3500 />;
		default:
		    return null //<FormS2500/>;
	}
};

const eSocialForm = () => {
	const dispatch = useDispatch();
	const { id } = useParams<{ id: string }>();
	const isNew = id === "novo";

	const item = useSelector(getItemESocialEventLauch);
	const loadingItem = useSelector(getLoadingESocialEventLauch);
	const search = useSelector(getSearchEventLauch);
	const loadingFolder = useSelector(getProcessIsFetching);
	const hasItem = useSelector(getHasItemEventLauch);
	const { eventCode } = search;
	const loading = loadingItem || (isNew && loadingFolder);
	const status = useSelector(getStatus);
	const errorMessages = useSelector(getErrorMessage);

	useEffect(() => {
		if (status === "failure") {
			const detail = errorMessages?.detail as string
			const splittedRows = detail?.split(";")?.map((error)=>({error}))

			splittedRows?.forEach((errorObject) => {
				const field = errorObject.error.split("campo")[1]?.trim();
				const replacement = eSocialLabelsFieldDictionary?.find((replacementObject) => replacementObject.value === field);
				if (replacement) {
				errorObject.error = `Valor inválido para o campo "${replacement.label}"`;
				}
			});
			
			modal({
					title: "Erros no preenchimento",
					component:  <TableComponent
						columns={[{ label: "Erros", field: "error" },]} 
						rows={splittedRows}
					/>,
				buttons: [],
				dialogProps: {
					maxWidth: "xl",
					showCloseButton: true,
					fullWidth: true,
				},
			})

		}
	},[status])

	useEffect(() => {
		if (hasItem) {
			const eventLaunchParams = {
				accrualMonth: item.accrualMonth ?? "",
				eventCode: item.eventCode ?? "",
				folderNumber: item.folderNumber ?? "",
				processId: item.processId ?? "",
				cprb: item.cprb === false ? 0 : 1

			};
			dispatch(actions.eSocialEventLauch.setSearch(eventLaunchParams));
		}
		
		
	}, [hasItem, item, dispatch, isNew])
	
	useEffect(() => {
		if (!isNew && typeof id === 'string') {
			const [idPart, eventCodePart] = id.split(":");
			if (idPart && eventCodePart) {
				dispatch(fetchESocialEventLauchGovernmentResponsesById({
					id: Number(idPart),
					eventCode: Number(eventCodePart)
				}));
			}
		}
	}, [isNew, id, dispatch]);
	
	useEffect(() => {
		dispatch(
			fetchESocialRegistrationTable({
				page: 1,
				status: true,
				notPaginate: true,
			})
		);
		return () => {
			dispatch(actions.eSocialEventLauch.clear())
		};
	}, [dispatch]);

	useRegisterDefault({
		action: "eSocialEventLauch",
		getStatus,
		getErrorMessage,
	});

	return (
		<ScreenTemplate>
			<Search item={item} loading={loading} hasItem={hasItem} />
			{eventCode !== "" && (
				<>{ getForm({ eventCode }) }</>
			)}
		</ScreenTemplate>
	);
};

export default eSocialForm;