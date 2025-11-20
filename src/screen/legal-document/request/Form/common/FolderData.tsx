import { Grid } from "@material-ui/core";

import AccordionPanel from "src/components/AccordionPanel";
import FieldColumn from "src/components/FieldColumn";
import SkeletonFieldColumn from "src/components/Skeletons/FieldColumn";
import { optionsFolderStatus } from "src/screen/settings/constants";
import { TProvisionProcess } from "src/core/models/provision-order";
import { t } from "src/locale/i18n";

type Props = {
	process: TProvisionProcess;
	loading?: boolean;
	startExpanded?: boolean;
};

const SkeletonFolderData = () => {
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
		</Grid>
	);
};

const FolderData = ({ process, loading, startExpanded }: Props) => {
	const processNumber = process.processNumber ?? process.oldNumber;

	const opposingPart = process.processParty?.find(
		(item) => item.situation === "Outra parte"
	)?.name;
	const company = process.processParty?.find(
		(item) => item.situation === "Cliente"
	)?.name;

	return (
		<AccordionPanel
			title={t("provisions:request.processDataSheet")}
			startExpanded={startExpanded}
		>
			{loading ? (
				<SkeletonFolderData />
			) : (
				<Grid container spacing={3}>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("legalDocs:request.process.area")}
							value={process.legalDepartmentArea}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("status")}
							value={process.statusId}
							options={optionsFolderStatus}
							type="list"
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("legalDocs:request.process.contingency")}
							value={process.contingency}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("legalDocs:request.process.folderNumber")}
							value={process.folderNumber}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("legalDocs:request.process.processNumber")}
							value={processNumber}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("legalDocs:request.process.sphere")}
							value={process.sphere}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("legalDocs:request.process.opposingPart")}
							value={opposingPart}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("legalDocs:request.process.company")}
							value={company}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("legalDocs:request.process.internalLawyer")}
							value={process.internalLawyer}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("legalDocs:request.process.agent")}
							value={process.agent}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("legalDocs:request.process.responsibleInternalLawyer")}
							value={process.internalLawyer}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("legalDocs:request.process.office")}
							value={process.office}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("legalDocs:request.process.responsibleOoffice")}
							value={process.requesterName}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("legalDocs:request.process.courtPanelDescription")}
							value={`${process.courtPanelNumber}ª ${process.courtPanelDescription}`}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("legalDocs:request.process.comarca")}
							value={process.jurisdictionName}
						/>
					</Grid>
					<Grid item md={3} xs={12} sm={6}>
						<FieldColumn 
							label={t("legalDocs:request.process.actionType")}
							value={process.type}
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
				</Grid>
			)}
		</AccordionPanel>
	);
};

export default FolderData;
