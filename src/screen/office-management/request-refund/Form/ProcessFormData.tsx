import { useMemo } from "react";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { t } from "src/locale/i18n";

import { TProcess } from "src/core/models/process";
import Form, { DateField, CurrencyField, TextField } from "src/components/form";
import { Submit } from "src/components/button";
import { TOfficeManagementRequestRefund } from "src/core/models/office-management-request-refund";

import AccordionPanel from "src/components/AccordionPanel";
import Attachments from "src/components/Attachments";
import { actions } from "src/core/store";
import {
	getListPreRequestRefundItem,
	getPreRequestRefundIndex,
} from "src/core/store/modules/office-management-request-refund/selectors";
import { valuesToNumber } from "src/core/utils/func";
import { useSnackbar } from "notistack";
import moment from "moment";

type Props = {
	processData: TProcess;
	isReadOnly: boolean;
};

const ProcessFormData = ({ processData, isReadOnly }: Props) => {
	const dispatch = useDispatch();
	const item = useSelector(getListPreRequestRefundItem);
	const index = useSelector(getPreRequestRefundIndex);
	const { enqueueSnackbar } = useSnackbar();

	const initialValues: TOfficeManagementRequestRefund = useMemo(() => {
		const initialValues = {
			id: 0,
			refundSolicitationId: 0,
			folderNumber: processData?.folderNumber ?? "",
			externalOfficeId: processData?.officeResponsibleId ?? 0,
			externalOffice: processData?.officeManager ?? "",
			registrationDate: processData?.registrationCompletionDate ?? null,
			pantryValue: null,
			description: "",
			areaDejurId: processData?.legalDepartmentAreaId ?? "",
			areaDejur: processData?.legalDepartmentArea ?? "",
			requesterId: Number(processData?.internalLawyerId) ?? 0,
			requester: processData?.internalLawyer ?? "",
			processPartiesOtherId: processData?.idReclamante ?? 0,
			processPartiesOther: processData?.otherPartName ?? "",
			filesSolicitation: [],
			courtPanelDescription: `${processData?.courtPanelNumber}ª ${processData?.courtPanelDescription}`,
			jurisdictionDescription: processData?.jurisdictionDescription,
			...item,
		} as TOfficeManagementRequestRefund;
		return initialValues;
	}, [processData, item]);

	const onSubmit = (
		values: TOfficeManagementRequestRefund,
		{ setSubmitting }: any
	) => {
		setSubmitting(false);
		if (values?.pantryValue?.toString() !== "R$ 0,00") {
			const normalizedValues = {
				...(valuesToNumber(
					["pantryValue"],
					{...values, registrationDate: moment().format()}
				) as TOfficeManagementRequestRefund),
			};

			if (index === -1)
				return dispatch(actions.officeManagementRequestRefund.addPreRequestRefund(normalizedValues));
			dispatch(actions.officeManagementRequestRefund.editPreRequestRefund({
					value: normalizedValues,
					index,
				}));
			dispatch(actions.officeManagementRequestRefund.setPreRequestRefundItem({
					value: {},
					index: -1,
				}));
		} else {
			enqueueSnackbar("Valor da despesa não pode ser R$0,00", {variant: "error",});
		}
	};

	if (Object.keys(processData).length === 0) return null;

	return (
		<Form enableReinitialize initialValues={initialValues} onSubmit={onSubmit}>
			{({
				handleSubmit,
				isSubmitting,
				dirty,
			}) => (
				<form noValidate onSubmit={handleSubmit}>
					<AccordionPanel title={"Dados da ficha do processo"} startExpanded>
						<Grid container spacing={3}>
							<Grid item md={3} xs={12} sm={6}>
								<TextField
									label={t("solicitacaoPagamento:processFormData.DEJURArea")}
									name={"areaDejur"}
									readOnly
								/>
							</Grid>
							<Grid item md={3} xs={12} sm={6}>
								<TextField
									label={t("solicitacaoPagamento:processFormData.oppositeParty")}
									name={"processPartiesOther"}
									readOnly
								/>
							</Grid>
							<Grid item md={3} xs={12} sm={6}>
								<TextField
									label={t("processInformation.officeResponsible")}
									name={"externalOffice"}
									readOnly
								/>
							</Grid>
							<Grid item md={3} xs={12} sm={6}>
								<DateField
									label={"Data do cadastro"}
									name={"registrationDate"}
									readOnly
								/>
							</Grid>
							<Grid item md={3} xs={12} sm={6}>
								<TextField
									label={"Solicitante"}
									name={"processPartiesOther"}
									readOnly
								/>
							</Grid>
							<Grid item md={3} xs={12} sm={6}>
								<TextField
									label={t("solicitacaoPagamento:dadosPagamento.advogadoInterno")}
									name={"requester"}
									readOnly
								/>
							</Grid>
							<Grid item md={3} xs={12} sm={6}>
								<CurrencyField
									label={"Valor da despesa"}
									name={"pantryValue"}
									required
									readOnly={isReadOnly}
								/>
							</Grid>
							<Grid item md={3} xs={12} sm={6} />
							<Grid item md={12} xs={12} sm={6}>
								<TextField
									label={"Descrição"}
									name={"description"}
									readOnly={isReadOnly}
								/>
							</Grid>
							<Grid item md={3} xs={12} sm={6}>
                    <TextField
                        label={t("provisions:fields.courtPanel")}
                        name={"courtPanelDescription"}
						readOnly={isReadOnly}
                    />
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                    <TextField
                        label={t("provisions:fields.jurisdiction")}
                        name={"jurisdictionDescription"}
						readOnly={isReadOnly}
                    />
                </Grid>
						</Grid>
					</AccordionPanel>
					<Attachments name="filesSolicitation" disabled={isReadOnly} />
					{!isReadOnly && (
						<Grid
							container
							direction="row"
							justifyContent="flex-end"
							className="margin-top-24"
						>
							<Submit
								text="incluir"
								isNew
								submitting={isSubmitting}
								disabled={!dirty}
							/>
						</Grid>
					)}
				</form>
			)}
		</Form>
	);
};

export default ProcessFormData;
