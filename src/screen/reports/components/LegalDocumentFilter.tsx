import { Grid, Typography, Box } from "@material-ui/core";
import { useCallback, useState } from "react";
import {
	CPFOrCNPJField,
	DateField,
	SelectField,
	TextField,
} from "src/components/form";
import Panel from "src/components/Panel";
import { TReportFilterField } from "src/core/models/report-configuration";
import { TReportComponent } from "src/core/models/reports";
import { useContactByName } from "src/hooks/contacts";
import {
	useCoverage,
	useLegalDocumentRequestStatus,
	useSolicitationType,
} from "src/hooks/legalDocuments";
import { useFolderNumber, useProcessNumber } from "src/hooks/process";
import useProcessFilterOptions from "src/hooks/useProcessFilterOptions";
import { useSearchUsers } from "src/hooks/users";
import { useTranslation } from "src/locale/i18n";
import CheckboxesAutocompleteField from "src/screen/Integrations/components/CheckboxesAutocompleteMaskedField";
import { useGenerateReport } from "../hooks/useGenerateReport";
import ActionsButton from "./ActionButtons";

type Props = {
	hasItem: boolean;
	submitting: boolean;
	customFields: TReportFilterField[];
};

const LegalDocumentFilter = ({ hasItem, submitting, customFields }: Props) => {
	const { t } = useTranslation();

	const [folderNumber, setFolderNumber] = useState<string>("");
	const [processNumber, setProcessNumber] = useState<string>("");
	const [contactName, setContactName] = useState<string>("")
	const [username, setUserName] = useState<string>("")

	const { folderOptions } = useFolderNumber(folderNumber);
	const { processeOptions } = useProcessNumber(processNumber);
	const { conatctOptions } = useContactByName(contactName)
	const { usersOptions } = useSearchUsers({ name: username })

	const handleFolderChange = useCallback((value: string) => {
		setFolderNumber(value);
	}, []);

	const handleProcessChange = useCallback((value: string) => {
		setProcessNumber(value);
	}, []);

	const handleContactChange = useCallback((value: string) => {
		setContactName(value);
	}, []);

	const handleUserChange = useCallback((value: string) => {
		setUserName(value);
	}, []);

	const isNew = !hasItem;
	const { generateReport, isGeneratingReport } = useGenerateReport({
		reportType: TReportComponent.LEGAL_DOCUMENT,
	});

	const { requestStatusOptions } = useLegalDocumentRequestStatus();
	const { solicitationTypeAsOptions } = useSolicitationType();
	const { coveragesAsOptions } = useCoverage();
	const { statusesOptions } = useProcessFilterOptions()

	return (
		<>
			<Panel title={t("reports:legalDocument.main.title")} withPadding>
				<Grid container spacing={3}>
					<Grid item xs={12} md={3}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									label={t("reports:legalDocument.main.dataSolicitacaoInitial")}
									name="requestDateStart"
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									label={t("reports:common.form.until")}
									name="requestDateEnd"
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={3}>
						<CheckboxesAutocompleteField
							label={t("reports:legalDocument.main.requester")}
							name="requestUserIds"
							options={conatctOptions}
							onChange={handleContactChange}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t("reports:legalDocument.main.status")}
							name="status"
							options={requestStatusOptions}
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t("reports:legalDocument.main.type")}
							name="legalDocumentRequestTypeId"
							options={solicitationTypeAsOptions}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t("reports:legalDocument.main.coverages")}
							name="legalDocumentCoverageIds"
							options={coveragesAsOptions}
							multiple
						/>
					</Grid>
				</Grid>
				{/* Compania - Carta Preposição */}
				<Box my={3}>
					<Typography variant="h3">
						{`${t("reports:legalDocument.main.companyData")} - ${t(
							"reports:legalDocument.main.prepositionLetter"
						)}`}
					</Typography>
				</Box>
				<Grid container spacing={3}>
					<Grid item xs={12} md={3}>
						<CPFOrCNPJField
							label={t("reports:legalDocument.main.cnpj")}
							name="registryIdentificationCompanyPrepositionLetter"
							type="cnpj"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.social")}
							name="partyNameCompanyPrepositionLetter"
						/>
					</Grid>
				</Grid>
				{/* Nomeados */}
				<Box my={3}>
					<Typography variant="h3">
						{t("reports:legalDocument.main.nominatedData")}
					</Typography>
				</Box>
				<Grid container spacing={3}>
					<Grid item xs={12} md={3}>
						<CPFOrCNPJField
							label={t("reports:legalDocument.main.cpf")}
							name="identificationNumberNominess"
							type="cpf"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.name")}
							name="partyNameNominess"
						/>
					</Grid>
				</Grid>
				{/* Compania - Carta Preposição */}
				<Box my={3}>
					<Typography variant="h3">
						{`${t("reports:legalDocument.main.companyData")} - ${t(
							"reports:legalDocument.main.replacement"
						)}`}
					</Typography>
				</Box>
				<Grid container spacing={3}>
					<Grid item xs={12} md={3}>
						<CPFOrCNPJField
							label={t("reports:legalDocument.main.cnpj")}
							name="registryIdentificationCompanyReplacement"
							type="cnpj"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.social")}
							name="partyNameCompanyPrepositionLetter"
						/>
					</Grid>
				</Grid>
				{/* Substabelecimentos */}
				<Box my={3}>
					<Typography variant="h3">
						{t("reports:legalDocument.main.replacement")}
					</Typography>
				</Box>
				<Grid container spacing={3}>
					<Grid item xs={12} md={3}>
						<CPFOrCNPJField
							label={t("reports:legalDocument.main.cpf")}
							name="identificationNumberReplacement"
							type="cpf"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.name")}
							name="partyNameReplacement"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.office")}
							name="officeNameReplacement"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.oab")}
							name="officeOABReplacement"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.powers")}
							name="powersReplacement"
						/>
					</Grid>
				</Grid>
				{/* Correspondentes */}
				<Box my={3}>
					<Typography variant="h3">
						{t("reports:legalDocument.main.correspondentsData")}
					</Typography>
				</Box>
				<Grid container spacing={3}>
					<Grid item xs={12} md={3}>
						<CPFOrCNPJField
							label={t("reports:legalDocument.main.cpf")}
							name="identificationNumberCorrespondent"
							type="cpf"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.name")}
							name="partyNameCorrespondent"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.office")}
							name="officeNameCorrespondent"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.oab")}
							name="officeOABCorrespondent"
						/>
					</Grid>
				</Grid>
				{/* Outorgante - Procuração Eletrônica - Jurídica */}
				<Box my={3}>
					<Typography variant="h3">
						{`${t("reports:legalDocument.main.grantor")} - ${t(
							"reports:legalDocument.main.procurationLegal"
						)}`}
					</Typography>
				</Box>
				<Grid container spacing={3}>
					<Grid item xs={12} md={3}>
						<CPFOrCNPJField
							label={t("reports:legalDocument.main.cnpj")}
							name="grantorIdentificationNumberEletronicProcurationLegal"
							type="cnpj"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.grantorName")}
							name="grantorNameEletronicProcurationLegal"
						/>
					</Grid>
				</Grid>
				{/* Outorgado - Procuração Eletrônica - Jurídica */}
				<Box my={3}>
					<Typography variant="h3">
						{`${t("reports:legalDocument.main.bestow")} - ${t(
							"reports:legalDocument.main.procurationLegal"
						)}`}
					</Typography>
				</Box>
				<Grid container spacing={3}>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.publicAgency")}
							name="publicAgencyGrantedEletronicProcurationLegal"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.company")}
							name="companyNameGrantedEletronicProcurationLegal"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.office")}
							name="partnerOfficeNameEletronicProcurationLegal"
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									label={t("reports:legalDocument.main.effectiveDate")}
									name="validityStartEletronicProcurationLegal"
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									label={t("reports:common.form.until")}
									name="validityEndEletronicProcurationLegal"
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.powers")}
							name="powersEletronicProcurationLegal"
						/>
					</Grid>
				</Grid>
				{/* Outorgante - Procuração Eletrônica - Outras Áreas */}
				<Box my={3}>
					<Typography variant="h3">
						{`${t("reports:legalDocument.main.grantor")} - ${t(
							"reports:legalDocument.main.otherAreas"
						)}`}
					</Typography>
				</Box>
				<Grid container spacing={3}>
					<Grid item xs={12} md={3}>
						<CPFOrCNPJField
							label={t("reports:legalDocument.main.cnpj")}
							name="grantorIdentificationNumberEletronicProcurationOtherArea"
							type="cnpj"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.grantorName")}
							name="grantorNameEletronicProcurationOtherArea"
						/>
					</Grid>
				</Grid>
				{/* Outorgado - Procuração Eletrônica - Outras Áreas */}
				<Box my={3}>
					<Typography variant="h3">
						{`${t("reports:legalDocument.main.bestow")} - ${t(
							"reports:legalDocument.main.otherAreas"
						)}`}
					</Typography>
				</Box>
				<Grid container spacing={3}>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.publicAgency")}
							name="publicAgencyEletronicProcurationOtherArea"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.company")}
							name="companyNameGrantedEletronicProcurationOtherArea"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.office")}
							name="partnerOfficeNameEletronicProcurationOtherArea"
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									label={t("reports:legalDocument.main.effectiveDate")}
									name="validityStartEletronicProcurationOtherArea"
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									label={t("reports:common.form.until")}
									name="validityEndEletronicProcurationOtherArea"
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							label={t("reports:legalDocument.main.powers")}
							name="powersEletronicProcurationOtherArea"
						/>
					</Grid>
				</Grid>
			</Panel>
			<Panel title={t("reports:legalDocument.process.title")} withPadding>
				<Grid container spacing={3}>
					<Grid item xs={12} md={3}>
						<CheckboxesAutocompleteField
							label={t("reports:legalDocument.process.folder")}
							name="folderNumbers"
							options={folderOptions}
							onChange={handleFolderChange}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<CheckboxesAutocompleteField
							label={t("reports:legalDocument.process.process")}
							name="processNumbers"
							options={processeOptions}
							onChange={handleProcessChange}
						/>
					</Grid>
				</Grid>
			</Panel>
			<Panel
				title={t("reports:legalDocument.service.title")}
				withPadding
				slotBottomRight={
					<ActionsButton
						isGeneratingReport={isGeneratingReport}
						isSavingConfiguration={submitting}
						generateReport={() => generateReport(customFields)}
					/>
				}
				slotBottonRightPermission={isNew ? "add" : "edit"}
			>
				<Grid container spacing={3}>
					<Grid item xs={12} md={3}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									label={t("reports:legalDocument.service.serviceDateStart")}
									name="conclusionDateStart"
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									label={t("reports:common.form.until")}
									name="conclusionDateEnd"
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={3}>
						<CheckboxesAutocompleteField
							label={t("reports:legalDocument.service.attendant")}
							name="serviceUserIds"
							options={usersOptions}
							onChange={handleUserChange}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
					<SelectField
							label={t("reports:legalDocument.service.status")}
							name="processStatus"
							options={statusesOptions}
							multiple
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<DateField
							label={t("reports:legalDocument.service.deadline")}
							name="expectedServiceDate"
						/>
					</Grid>
				</Grid>
			</Panel>
		</>
	);
};

export default LegalDocumentFilter;
