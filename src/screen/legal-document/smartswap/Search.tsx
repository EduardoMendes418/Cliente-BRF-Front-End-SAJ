import { Box, Grid } from "@mui/material"
import { Clean, Submit } from "src/components/button"
import ContactField from "src/components/ContactField"
import { DateField, SelectField, TextField } from "src/components/form"
import Panel from "src/components/Panel"
import { CONTACT_SEARCH } from "src/core/utils/constants"
import { useGroupedAreas } from "src/hooks/fetchLists"
import { useCoverage, useSolicitationType } from "src/hooks/legalDocuments"
import { useTranslation } from "src/locale/i18n"
import useRequestStatus from "./hooks/requestStatus"
import { Formik } from "formik"
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple"

type SearchProps = {
	fetching: boolean;
	submitForm: any;
}

const Search = (props: SearchProps) => {
	const { t } = useTranslation();

	const { groupedAreasAsOptions} = useGroupedAreas();
	const { coveragesAsOptions } = useCoverage();
	const { solicitationTypeAsOptions } = useSolicitationType()

	const { requestStatusOptions } = useRequestStatus()

	const initialValues: any = {
		requestDateStart: null,
		requestDateEnd: null,
		id: "",
		requestUserName: "",
		dejurAreaId: null,
		folderNumber: "",
		processNumber: "",
		legalDocumentRequestTypeId: null,
		coverageId: null,
		requestStatus: [],
		internalLawyerId: null,
		legalResponsibleId: null,
		office: "",
		serviceUserId: null,
		expectedServiceDateStart: null,
		expectedServiceDateEnd: null
	}

	return (
		<>
			<Panel title={t("legalDocs:smartSwap.filter")} withPadding>
				<Formik
				initialValues={initialValues}
				onSubmit={props.submitForm}
				enableReinitialize
			>
				<Grid container spacing={2}>
					<Grid item md={3} xs={12}>
						<Grid container spacing={2}>
							<Grid item md={6} xs={6}>
								<DateField
									name="requestDateStart"
									label={t("legalDocs:smartSwap.requestDateStart")}
									placeholder={t("select")}
								/>
							</Grid>
							<Grid item md={6} xs={6}>
								<DateField
									name="requestDateEnd"
									label={t("legalDocs:smartSwap.ate")}
									placeholder={t("select")}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							name="id"
							label={t("legalDocs:smartSwap.id")}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<ContactField
							name="requestUserName"
							labelValueTarget
							label={t("legalDocs:smartSwap.requestUserName")}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<GroupedSelectFiledMultiple
							name="dejurAreaId"
							label={t("legalDocs:smartSwap.dejurAreaId")}
							options={groupedAreasAsOptions}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							name="folderNumber"
							label={t("legalDocs:smartSwap.folderNumber")}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							name="processNumber"
							label={t("legalDocs:smartSwap.processNumber")}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
							<SelectField
								name="legalDocumentRequestTypeId"
								label={t("legalDocs:smartSwap.legalDocumentRequestTypeId")}
								options={solicitationTypeAsOptions}
							/>
						</Grid>
					<Grid item md={3} xs={12}>
						<SelectField
							name="coverageId"
							label={t("legalDocs:smartSwap.coverageId")}
							options={coveragesAsOptions}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<SelectField
							name="requestStatus"
							label={t("legalDocs:smartSwap.requestStatus")}
							options={requestStatusOptions}
							multiple
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<ContactField
							name="internalLawyerId"
							label={t("legalDocs:smartSwap.internalLawyerId")}
							contactSearch={CONTACT_SEARCH.InternalLawyer}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<ContactField
							name="legalResponsibleId"
							label={t("legalDocs:smartSwap.legalResponsibleId")}
							contactSearch={CONTACT_SEARCH.LegalResponsible}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							name="office"
							label={t("legalDocs:smartSwap.office")}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<ContactField
							name="serviceUserId"
							label={t("legalDocs:smartSwap.serviceUserId")}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<Grid container spacing={2}>
							<Grid item md={6} xs={6}>
								<DateField
									name="expectedServiceDateStart"
									label={t("legalDocs:smartSwap.expectedServiceDateStart")}
									placeholder={t("select")}
								/>
							</Grid>
							<Grid item md={6} xs={6}>
								<DateField
									name="expectedServiceDateEnd"
									label={t("legalDocs:smartSwap.ate")}
									placeholder={t("select")}
								/>
							</Grid>
						</Grid>
					</Grid>
						<Clean action="legalDocSwap" />
				</Grid>
			</Formik>
			</Panel>
			
			<Box mt="20px" textAlign="right">
				<Submit
					text={t("legalDocs:smartSwap.generateList")}
					submitting={props.fetching}
				/>
			</Box>
		</>
	)
}

export default Search