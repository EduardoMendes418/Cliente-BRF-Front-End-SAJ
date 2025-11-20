import { Grid } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";


import AccordionPanel from "src/components/AccordionPanel";
import FieldColumn from "src/components/FieldColumn";
import SkeletonFieldColumn from "src/components/Skeletons/FieldColumn";
import { optionsFolderStatus } from "src/screen/settings/constants";
import { TProvisionProcess } from "src/core/models/provision-order";
import { t } from "src/locale/i18n";
import { Alert } from "@mui/material";
import confrontersApi from "src/core/api/confronting-orders";

type Info = Pick<TProvisionProcess,
	'id'
	| 'processNumber'
	| 'oldNumber'
	| 'legalDepartmentArea'
	| 'internalLawyer'
	| 'agent'
	| 'sphere'
	| 'locationName'
	| 'provisionClass'
	| 'statusId'
	| 'processParty'
	| 'office'
	| 'officeManager'
	| 'closure'
	| 'groupingCostCenter'
	| 'contingency'
	| 'hasConfronter'
	| 'folderNumber'
	| 'processParty'
	| 'otherPartName'
	| 'originArea'
	| 'speciesCategory'
	| 'folderNumber'
	| 'actionType'
	| 'responsibleLegal'
	| 'lawyerOppositeParty'
	| 'terminationDate'
	| 'closingDate'
	| 'result'
	| 'registrationCompletionDate'
	| 'companyName'
	| 'courtPanelNumber'
	| 'courtPanelDescription'
	| 'jurisdictionDescription'
>

type Props = {
	process: Info | null;
	loading?: boolean;
	startExpanded?: boolean;
};

const SkeletonProcessFormData = () => {
	return (
		<Grid container spacing={3}>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item md={3} xs={12} sm={6}>
				<SkeletonFieldColumn />
			</Grid>
		</Grid>
	);
};

const ProcessFormData = ({ process, loading, startExpanded }: Props) => {
	const [hasConfronter, setHasConfronter] = useState(false);
	const filtredProcessParty = process?.processParty.filter((item) => item.situation === "Responsável")
	const [{name}] = (filtredProcessParty && filtredProcessParty.length !== 0) ? filtredProcessParty : [{name: ""}]
	const processNumber = process?.processNumber ?? process?.oldNumber;

	const company = process?.companyName;

	const getPendingConfronters = useCallback(async (folderNumber: string) => {
		const { data } = await confrontersApi.getPendings(folderNumber);
		setHasConfronter(!!data.pending);
	}, []);

	useEffect(() => {
		if (process && process.folderNumber !== undefined) {
			getPendingConfronters(process.folderNumber);
		}
	}, [getPendingConfronters, process]);

	return (
		<AccordionPanel
			title={t("provisions:request.processDataSheet")}
			startExpanded={startExpanded}
		>
			{(loading || process === null) && <SkeletonProcessFormData />}
			{!loading && (
				<Grid container spacing={3}>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("provisions:fields.processKey")}
							value={process?.id}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={"Nº. da pasta/CTG"}
							value={process?.folderNumber}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("provisions:fields.originArea")}
							value={process?.originArea}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("provisions:fields.areaDejur")}
							value={process?.legalDepartmentArea}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("status")}
							value={process?.statusId}
							options={optionsFolderStatus}
							type="list"
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("provisions:fields.company")}
							value={company}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("provisions:fields.oposingPart")}
							value={process?.otherPartName}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("provisions:fields.processN")}
							value={processNumber}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={"Número do antigo"}
							value={process?.oldNumber}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={"Classe da ação"}
							value={process?.actionType}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("provisions:fields.contingencyType")}
							value={process?.contingency}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("provisions:fields.sphere")}
							value={process?.sphere}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("location")}
							value={process?.locationName}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={"Preposto"}
							value={process?.agent}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("provisions:fields.internalLawyer")}
							value={process?.internalLawyer}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={"Responsável jurídico"}
							value={process?.responsibleLegal}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("provisions:fields.office")}
							value={process?.office}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("provisions:fields.officeResponsible")}
							value={process?.officeManager}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("closure")}
							value={process?.closure}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("provisions:fields.provisionClass")}
							value={process?.provisionClass}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("provisions:fields.costCenterAggr")}
							value={process?.groupingCostCenter}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={t("provisions:fields.speciesCategory")}
							value={process?.speciesCategory}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={"Advogado parte contrária"}
							value={process?.lawyerOppositeParty}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={"Data baixa provisória"}
							value={process?.terminationDate}
							type='date' 
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={"Data morto"}
							value={process?.closingDate}
							type='date' 
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={"Resultado"}
							value={process?.result}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn
							label={"Data complemento do cadastro"}
							value={process?.registrationCompletionDate}
							type='date' 
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
                    <FieldColumn
                        label={t("provisions:fields.courtPanel")}
                        value={`${process?.courtPanelNumber}ª ${process?.courtPanelDescription}`}
                    />
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                    <FieldColumn
                        label={t("provisions:fields.jurisdiction")}
                        value={process?.jurisdictionDescription}
                    />
                </Grid>
					{hasConfronter &&
						<Grid container spacing={3}>
							<Grid item md={12} xs={10} sm={12} >
								<Alert severity="warning">Existe confrontador pendente para esta pasta/CTG.</Alert>
							</Grid>
						</Grid>
					}
				</Grid>
			)}
		</AccordionPanel>
	);
};

export default ProcessFormData;
