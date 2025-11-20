import { Grid } from "@material-ui/core";
import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef } from "react";
import { SelectField, TextField } from "src/components/form";
import Panel from "src/components/Panel";
import { LegalDocumentFormTypeEnum, TLegalDoc } from "src/core/models/legal-document-request";
import { TLegalDocRequestType } from "src/core/models/legal-document-request-types";
import { useGroupedAreas } from "src/hooks/fetchLists";
import { useCoverage, useGrants } from "src/hooks/legalDocuments";
import { useTranslation } from "src/locale/i18n";
import Company, { CompanyHendler } from "../../common/Company";
import Clean from "src/components/button/Clean"; 
import { useFormikContext } from "formik";
import { TLegalDocForm } from "../..";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

export type SolicitationHandler = {
	updateCompany: () => void
}

type ReplacementSolicitationProps = {
	solicitation: TLegalDocRequestType
	isFolderNumberSet: boolean
	values?: TLegalDoc
}

const ReplacementSolicitationComponent: ForwardRefRenderFunction<SolicitationHandler, ReplacementSolicitationProps> = (props, ref) => {
	const { t } = useTranslation();
	const { coveragesAsOptions } = useCoverage();
	const formik = useFormikContext<TLegalDocForm>();
	const { grantsAsOptions } = useGrants();
	const { groupedAreasAsOptions } = useGroupedAreas();
	const company = useRef<CompanyHendler>(null);

	const {
		values,
		setFieldValue
	} = formik;

	const clearFields = () => {
		setFieldValue("prepositionReplacement.coverageId", null);
		setFieldValue("prepositionReplacement.dejurAreaId", null);
		setFieldValue("prepositionReplacement.folderNumber", "");
		setFieldValue("prepositionReplacement.legalDocumentGrantId", null);
		setFieldValue("prepositionReplacement.observation", "");
	}

	useImperativeHandle(ref, () => ({
		updateCompany: () => {
			company.current?.updateCompany()
		}
	}), [])

	return (
		<Panel title={t("legalDocs:replacement.title")} withPadding>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<SelectField
						label={t("legalDocs:replacement.coverage")}
						name="prepositionReplacement.coverageId"
						options={coveragesAsOptions}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<GroupedSelectFiledMultiple
						label={t("legalDocs:replacement.area")}
						name="prepositionReplacement.dejurAreaId"
						options={groupedAreasAsOptions}
						required={!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
						readOnly={!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<TextField
						label={t("legalDocs:replacement.folderNumber")}
						name="prepositionReplacement.folderNumber"
						type="text"
						required={!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
						readOnly={!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
						disabled={props?.values?.prepositionReplacement?.coverageId === 2 ? false : true}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<SelectField
						label={t("legalDocs:replacement.grants")}
						name="prepositionReplacement.legalDocumentGrantId"
						options={grantsAsOptions}
					/>
				</Grid>
				<Grid item md={12} xs={12}>
					<TextField
						label={t("legalDocs:replacement.observation")}
						name="prepositionReplacement.observation"
						type="text"
						multiline
						rows={3}
					/>
				</Grid>
				<Clean noResetForm onClick={clearFields}/>
				<Company ref={company} type={LegalDocumentFormTypeEnum.Replacement} />
			</Grid>
		</Panel>
	);
};

const ReplacementSolicitation = forwardRef(ReplacementSolicitationComponent)

export default ReplacementSolicitation;
