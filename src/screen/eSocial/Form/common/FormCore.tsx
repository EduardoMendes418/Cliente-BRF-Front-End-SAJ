import { ReactNode, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
	CircularProgress,
	Grid
} from "@material-ui/core";
import Form from "src/components/form";
import CancelButton from "src/components/button/Cancel";
import { Submit, SapButton, Button } from "src/components/button";
import { getStatusPayment } from "src/core/store/modules/inspection/selectors";
import { addFirstDayToDate, deepCopy, formatDate, modifyProperty } from "src/core/utils/func";
import { getLoadingParameterization } from "src/core/store/modules/parameterization/selectors";
import { getAutocompleteESocialData } from "src/core/store/modules/e-social-event-launch/selectors";
import TableComponent, { ColumnData } from "src/components/Table";

import {
	getHasItemEventLauch,
	getItemESocialEventLauch,
} from "src/core/store/modules/e-social-event-launch/selectors";
import { useParams } from "react-router-dom";
import EsocialLogAccordionPanel from "src/components/EsocialLogAccordionPanel";
import { modal } from 'src/components/modals';
import CancelEventModal from "./CancelEventModal";
import Logs from "src/components/Logs";


type Props = {
	onSubmit: any;
	children: ReactNode;
	customInitialValues: any;
	editable: boolean;
	isSapButtonVisible?: boolean
};

export const eSocialStatus = {
	6: "Cancelado"
};

const FormCore = ({
	onSubmit,
	children,
	customInitialValues,
	isSapButtonVisible,
}: Props) => {

	const { id } = useParams<{ id: string }>();
	const isNew = id === "novo";
	const status = useSelector(getStatusPayment);
	const isLoadingParametrization = useSelector(getLoadingParameterization);
	const item = useSelector(getItemESocialEventLauch) as any;
	const hasItem = useSelector(getHasItemEventLauch);
	const autoComplete = deepCopy(useSelector(getAutocompleteESocialData));
	const isSaving = status === "saving";
	const editable = item?.eventLaunchStatus !== 4;
	const [submitAction, setSubmitAction] = useState<null | string>(null);
	const [governmentResponses, setGovernmentResponses] = useState([]);

	const columns: ColumnData[] = [
		{ label: "Data", field: "createdDate", type: "dateHour" },
        {
			label: "Nº recibo",
			field: "receiptNumber",
		},
		{ label: "Mensagem de retorno", field: "errorMessage", type: "array" },
		{ 
			label: "Deleção via SAP", 
			field: "sapDelete", 
			type:"custom",
			component: (row: any) => row.sapDelete ? "Sim": "Não"
		},
	];


	const initialValues = useMemo(() => {
		let normalizeValues = null
		if (isNew) {
			normalizeValues = deepCopy(customInitialValues)
		} else {
			normalizeValues = deepCopy({
				...customInitialValues,
				...item,
				cprb: item.cprb === false ? 0 : 1 
			});

			modifyProperty(normalizeValues, [
				'dtAdmOrig',
			], formatDate);
			modifyProperty(normalizeValues, [
				'compFim',
				'compIni',
			], addFirstDayToDate);
		}

		return normalizeValues;
	}, [hasItem, customInitialValues, item, autoComplete, isNew]);

	if (isLoadingParametrization)
		return <CircularProgress className="margin-top-16 align-center" />;

	const getLogs = () => {
			return governmentResponses.map((item: any) => ({
				...item, 
				errorMessage: item?.errorMessages?.map((errorMessage:any) => errorMessage.errorMessage)
			}))
	} 

	const cancelEvent = async () => {
		modal({
			title: "Cancelar evento",
			component: <CancelEventModal id={item?.id}/>,
			buttons: [],
			dialogProps: {
				showCloseButton: true,
				fullWidth: true,
				maxWidth: "md",
				
			},
		})
	}

	return (
		<Form
			enableReinitialize
			onSubmit={(arg1, arg2) => onSubmit({...arg1, submitAction}, arg2)}
			initialValues={initialValues}
			permission={editable ? undefined : false}
		>
			{({ handleSubmit }) => (
				<form onSubmit={handleSubmit} noValidate>
					{children}
					{
						id !== "novo" ? 
						<EsocialLogAccordionPanel 
						title="Logs Resposta Governo" 
						ativateBorder
						functionCall={setGovernmentResponses}
						>
						<TableComponent
							columns={columns}
							rows={getLogs()}
						/>  
					</EsocialLogAccordionPanel> : null
					}
					{
						id !== "novo" && item?.logs && item?.logs.length > 0 ?
						<Logs
                            logs={item?.logs}
                            statuses={eSocialStatus}
                           	statusOrder={["flow"]}
                        /> : null
					}
					{editable && (
						<Grid
							container
							justifyContent="flex-end"
							className="margin-top-16"
							spacing={2}

						>
							{[2,3,5].includes(item?.eventLaunchStatus) && <Grid item>
								<Submit 
									click={() => setSubmitAction("delete")}
									submitting={isSaving} 
									text={"Excluir Evento"}
								/>
							</Grid>}
							<Grid item>
								<CancelButton
								label="Voltar"
								/>
							</Grid>
							{
								item.eventLaunchStatus === 1 ? 
								<Grid item>
									<Button
									text="Cancelar"
									onClick={() => cancelEvent()}
										/>
								</Grid> : null
							}
							{
								isSapButtonVisible && [1, 5].includes(item?.eventLaunchStatus) &&
								<Grid item>
									<SapButton />
								</Grid>
							}
							<Grid item>
								<Submit 
									click={() => setSubmitAction("save")}
									submitting={isSaving} 
								/>
							</Grid>
						</Grid>
					)}
				</form>
			)}
		</Form>
	);
};

export default FormCore;
