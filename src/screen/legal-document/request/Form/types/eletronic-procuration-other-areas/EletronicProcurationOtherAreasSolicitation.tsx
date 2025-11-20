import { Grid } from "@material-ui/core";
import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef } from "react";
import { RadioGroup, TextField } from "src/components/form";
import Panel from "src/components/Panel";
import { TLegalDocRequestType } from "src/core/models/legal-document-request-types";
import { useTranslation } from "src/locale/i18n";
import { LegalDocFormType } from "src/screen/settings/legal-documents/utils/constants";
import Grantor, { GrantorHandler } from "../../common/Grantor";

type EletronicSolicitationHandler = {
	updateGrantor: () => void
}

type EletronicProcurationOtherAreasSolicitationProps = {
	solicitation: TLegalDocRequestType
	isFolderNumberSet: boolean
}

const EletronicProcurationOtherAreasSolicitationComponent: ForwardRefRenderFunction<EletronicSolicitationHandler, EletronicProcurationOtherAreasSolicitationProps> = (props, ref) => {
	const { t } = useTranslation();
	const grantor = useRef<GrantorHandler>(null)

	useImperativeHandle(ref, () => ({
		updateGrantor: () => {
			grantor.current?.updateGrantor()
		}
	}), [])

	return (
		<Panel title={t("legalDocs:eletronicProcurationOtherAreas.title")} withPadding>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<TextField
						label={t("legalDocs:eletronicProcurationOtherAreas.orgao")}
						name="eletronicProcurationOtherArea.publicAgency"
						required
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<TextField
						label={t("legalDocs:eletronicProcurationOtherAreas.processNumber")}
						name="eletronicProcurationOtherArea.processNumber"
						type="text"
						required={!!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
						readOnly={!!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<RadioGroup
						label={t("legalDocs:eletronicProcurationOtherAreas.letterOfAttorney")}
						name="eletronicProcurationOtherArea.physicalProcuration"
						required
					/>
				</Grid>
				<Grid item md={12} xs={12}>
					<TextField
						label={t("legalDocs:eletronicProcurationOtherAreas.observation")}
						name="eletronicProcurationOtherArea.observation"
						type="text"
						multiline
						rows={3}
					/>
				</Grid>
				<Grantor ref={grantor} docType={LegalDocFormType.ELETRONIC_PROCURATION_OTHER_AREAS} />
			</Grid>
		</Panel>
	);
};

const EletronicProcurationOtherAreasSolicitation = forwardRef(EletronicProcurationOtherAreasSolicitationComponent)

export default EletronicProcurationOtherAreasSolicitation;
