import { Grid } from "@material-ui/core";
import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef } from "react";
import FieldColumn from "src/components/FieldColumn";
import { SelectField, TextField } from "src/components/form";
import Panel from "src/components/Panel";
import { LegalDocumentFormTypeEnum,TLegalDoc } from "src/core/models/legal-document-request";
import { TLegalDocRequestType } from "src/core/models/legal-document-request-types";
import { useGroupedAreas } from "src/hooks/fetchLists";
import { useCoverage } from "src/hooks/legalDocuments";
import { useTranslation } from "src/locale/i18n";
import Company, { CompanyHendler } from "../../common/Company";
import Clean from "src/components/button/Clean";
import { useFormikContext } from "formik";
import { TLegalDocForm } from "../..";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

type SolicitationHandler = {
	updateCompany: () => void
}

type PrepositionSolicitationProps = {
	solicitation: TLegalDocRequestType
	isFolderNumberSet: boolean
	values?: TLegalDoc
}

const PrepositionSolicitationCompanent: ForwardRefRenderFunction<SolicitationHandler, PrepositionSolicitationProps> = (props, ref) => {
	const { t } = useTranslation();
	const { coveragesAsOptions } = useCoverage();
	const { groupedAreasAsOptions } = useGroupedAreas();
	const company = useRef<CompanyHendler>(null);
	const formik = useFormikContext<TLegalDocForm>()

	const {
		setFieldValue,
	} = formik;

	useImperativeHandle(ref, () => ({
		updateCompany: () => {
			company.current?.updateCompany()
		}
	}), [])

	const clearFields = () => {
		setFieldValue("prepositionLetter.coverageId", null);
		setFieldValue("prepositionLetter.dejurAreaId", null);
		setFieldValue("prepositionLetter.folderNumber", "");
		setFieldValue("prepositionLetter.processNumber", "");
		setFieldValue("prepositionLetter.observation", "")
	}

	return (
		<Panel title={t("legalDocs:preposition.title")} withPadding>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<SelectField
						label={t("legalDocs:preposition.coverage")}
						name={"prepositionLetter.coverageId"}
						options={coveragesAsOptions}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<GroupedSelectFiledMultiple
						label={t("legalDocs:preposition.area")}
						name={"prepositionLetter.dejurAreaId"}
						options={groupedAreasAsOptions}
						required={!!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
						readOnly={!!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<TextField
						label={t("legalDocs:preposition.folderNumber")}
						name="prepositionLetter.folderNumber"
						type="text"
						required={!!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
						readOnly={!!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
						disabled={props?.values?.prepositionLetter?.coverageId === 2 ? false : true}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<TextField
						label={t("legalDocs:preposition.processNumber")}
						name="prepositionLetter.processNumber"
						type="text"
						required={!!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
						readOnly={!!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
					/>
				</Grid>
				<Grid item md={12} xs={12}>
					<TextField
						label={t("legalDocs:preposition.observation")}
						name="prepositionLetter.observation"
						type="text"
						multiline
						rows={3}
					/>
				</Grid>
				<Grid item md={12}>
					<FieldColumn
						label={t("legalDocs:noteLabel")}
						value={props.solicitation.informativeNote}
					/>
				</Grid>
				<Clean noResetForm onClick={clearFields}/>
				<Company ref={company} type={LegalDocumentFormTypeEnum.PrepositionLetter} />
			</Grid>
		</Panel>
	);
};

const PrepositionSolicitation = forwardRef(PrepositionSolicitationCompanent)

export default PrepositionSolicitation;

