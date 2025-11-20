import { Grid, Typography } from "@material-ui/core";
import { useCallback, useMemo, useState } from "react";
import ContactField from "src/components/ContactField";
import {
	AutocompleteField,
	DateField,
	SelectField,
	TextField,
	TOptionsSelect,
} from "src/components/form";
import Panel from "src/components/Panel";
import UserField from "src/components/UserField";
import { OfficeManagementPaymentReportStatus } from "src/core/models/office-management-payment";
import { CONTACT_SEARCH } from "src/core/utils/constants";
import {
	useOfficeManagementControl,
	useOfficeManagementDocuments,
	useOfficeManagementInvoices,
	useOfficeManagementResponsible,
} from "src/hooks/fetchLists";
import { useSearchUsers } from "src/hooks/users";
import { t } from "src/locale/i18n";
import { Clean } from "src/components/button";

const statusOptions: TOptionsSelect[] = Object.entries(
	OfficeManagementPaymentReportStatus
).map(([key, value]) => ({ label: value, value: Number(key) }));

const ReportFilters: React.FC = () => {
	const [createdBy, setCreatedBy] = useState("");

	const { usersOptions } = useSearchUsers({ name: createdBy });
	const { documentsAsOptions } = useOfficeManagementDocuments();
	const { responsiblesAsOptions } = useOfficeManagementResponsible();
	const { natureInvoicesAsOptions } = useOfficeManagementInvoices();
	const { controlAsOptions } = useOfficeManagementControl();

	const natureOptions = useMemo<TOptionsSelect[]>(
		() =>
			natureInvoicesAsOptions.map((x) => ({ label: x.label, value: x.value })),
		[natureInvoicesAsOptions]
	);

	const handleCreatedByChange = useCallback(
		(value: string) => setCreatedBy(value),
		[]
	);

	return (
		<Panel title={t("dataImport:officeManager.filters.paneTitle")} withPadding>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t(
									"dataImport:officeManager.filters.startSolicitationDate"
								)}
								name="startRequestDate"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField label={t("default:form.to")} name="endRequestDate" />
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<AutocompleteField
						name="createdBy"
						label={t("dataImport:officeManager.filters.createdBy")}
						options={usersOptions}
						onValueChange={handleCreatedByChange}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name="aprovalStatus"
						label={t("dataImport:officeManager.filters.aprovalStatus")}
						options={statusOptions}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<TextField
						name="preInvoiceNumber"
						type="number"
						label={t("dataImport:officeManager.filters.preInvoiceNumber")}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<TextField
						name="invoiceNumber"
						type="number"
						label={t("dataImport:officeManager.filters.invoiceNumber")}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t(
									"dataImport:officeManager.filters.startInvoiceIssuanceDate"
								)}
								name="startInvoiceIssuanceDate"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t("default:form.to")}
								name="endInvoiceIssuanceDate"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name="documentTypeId"
						label={t("dataImport:officeManager.filters.documentTypeId")}
						options={documentsAsOptions}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name="legalResponsibleId"
						label={t("dataImport:officeManager.filters.legalResponsibleId")}
						options={responsiblesAsOptions}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name="natureInvoiceId"
						label={t("dataImport:officeManager.filters.natureInvoiceId")}
						options={natureOptions}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<TextField
						name="contractSap"
						label={t("dataImport:officeManager.filters.contractSap")}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<TextField
						name="approverIdSAP"
						label={t("dataImport:officeManager.filters.approverIdSAP")}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name="legalResponsibleControlId"
						label={t(
							"dataImport:officeManager.filters.legalResponsibleControlId"
						)}
						options={controlAsOptions}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t("dataImport:officeManager.filters.startPaymentDate")}
								name="startPaymentDate"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField label={t("default:form.to")} name="endPaymentDate" />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Typography variant="h3" style={{ marginTop: 20, marginBottom: 20 }}>
				{t("dataImport:officeManager.filters.internalLawyer.groupName")}
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t(
									"dataImport:officeManager.filters.internalLawyer.startAnalysisDate"
								)}
								name="startAnalysisDate"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField label={t("default:form.to")} name="endAnalysisDate" />
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<ContactField
						name="internalLawyerId"
						label={t(
							"dataImport:officeManager.filters.internalLawyer.internalLawyerId"
						)}
						contactSearch={CONTACT_SEARCH.InternalLawyer}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<UserField
						name="externalOfficeId"
						label={t(
							"dataImport:officeManager.filters.internalLawyer.externalOfficeId"
						)}
					/>
				</Grid>
			</Grid>
			<Typography variant="h3" style={{ marginTop: 20, marginBottom: 20 }}>
				{t("dataImport:officeManager.filters.juridicalControl.groupName")}
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<Grid container spacing={3}>
						<Grid item xs={6} md={6}>
							<DateField
								label={t(
									"dataImport:officeManager.filters.juridicalControl.startEvaluationDateLegalControl"
								)}
								name="startEvaluationDateLegalControl"
							/>
						</Grid>
						<Grid item xs={6} md={6}>
							<DateField
								label={t("default:form.to")}
								name="endEvaluationDateLegalControl"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<TextField
						name="approverLegalControl"
						label={t(
							"dataImport:officeManager.filters.juridicalControl.approverLegalControl"
						)}
					/>
				</Grid>
			</Grid>
			<Clean style={{ marginTop: "6%" }} action="provision" />
		</Panel>
	);
};

export default ReportFilters;
