import Clean from "src/components/button/Clean";
import {
	TLegalDocReportParams,
	TReportComponent,
} from "src/core/models/reports";
import LegalDocumentFilter from "src/screen/reports/components/LegalDocumentFilter";
import { useReport } from "src/screen/reports/hooks/useReport";
import FormCore from "../../commom/FormCore";

const initialValues: TLegalDocReportParams = {
	requestDateStart: "",
	requestDateEnd: "",
	status: [],
	legalDocumentRequestTypeId: "",
	legalDocumentCoverageIds: [],
	requestUserIds: [],
	registryIdentificationCompanyPrepositionLetter: "",
	partyNameCompanyPrepositionLetter: "",
	identificationNumberNominess: "",
	partyNameNominess: "",
	registryIdentificationCompanyReplacement: "",
	partyNameCompanyReplacement: "",
	identificationNumberReplacement: "",
	partyNameReplacement: "",
	officeNameReplacement: "",
	officeOABReplacement: "",
	powersReplacement: "",
	identificationNumberCorrespondent: "",
	partyNameCorrespondent: "",
	officeNameCorrespondent: "",
	officeOABCorrespondent: "",
	grantorIdentificationNumberEletronicProcurationLegal: "",
	grantorNameEletronicProcurationLegal: "",
	publicAgencyGrantedEletronicProcurationLegal: "",
	companyNameGrantedEletronicProcurationLegal: "",
	partnerOfficeNameEletronicProcurationLegal: "",
	validityStartEletronicProcurationLegal: "",
	validityEndEletronicProcurationLegal: "",
	powersEletronicProcurationLegal: "",
	grantorIdentificationNumberEletronicProcurationOtherArea: "",
	grantorNameEletronicProcurationOtherArea: "",
	publicAgencyEletronicProcurationOtherArea: "",
	companyNameGrantedEletronicProcurationOtherArea: "",
	partnerOfficeNameEletronicProcurationOtherArea: "",
	validityStartEletronicProcurationOtherArea: "",
	validityEndEletronicProcurationOtherArea: "",
	powersEletronicProcurationOtherArea: "",
	dejurAreaIds: [],
	folderNumbers: [],
	processStatus: [],
	processNumbers: [],
	otherPartyContactId: [],
	legalCourt: "",
	district: "",
	serviceUserIds: [],
	expectedServiceDate: "",
	conclusionDateEnd: "",
	conclusionDateStart: ""
};

const FormLegalDocument = () => {
	const {
		item,
		hasItem,
		isSaving,
		customFields,
		setCustomFields,
		initialFormValues,
		customFieldsDictionary,
	} = useReport({
		initialValues,
		reportComponent: TReportComponent.LEGAL_DOCUMENT,
	});

	return (
		<FormCore
			item={item}
			hasItem={hasItem}
			reportComponent={TReportComponent.LEGAL_DOCUMENT}
			initialValues={initialFormValues}
			setCustomFields={setCustomFields}
			customFields={customFields}
			customFieldsDictionary={customFieldsDictionary}
		>
			<LegalDocumentFilter
				hasItem={hasItem}
				submitting={isSaving}
				customFields={customFields}
			/>
			<Clean action="reportConfiguration" style={{ marginTop: "-35px" }} />
		</FormCore>
	);
};

export default FormLegalDocument;
