import { Grid } from "@material-ui/core";
import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef } from "react";
import { TextField } from "src/components/form";
import Panel from "src/components/Panel";
import { TLegalDocRequestType } from "src/core/models/legal-document-request-types";
import { useTranslation } from "src/locale/i18n";
import { LegalDocFormType } from "src/screen/settings/legal-documents/utils/constants";
import Grantor, { GrantorHandler } from "../../common/Grantor";

export type EletronicSolicitationHandler = {
	updateGrantor: () => void
}

type EletronicProcurationLegalSolicitationProps = {
	solicitation: TLegalDocRequestType
	isFolderNumberSet: boolean
}

const EletronicProcurationLegalSolicitationComponent: ForwardRefRenderFunction<EletronicSolicitationHandler, EletronicProcurationLegalSolicitationProps> = (props, ref) => {
	const { t } = useTranslation();
	const grantor = useRef<GrantorHandler>(null)

	useImperativeHandle(ref, () => ({
		updateGrantor: () => {
			grantor.current?.updateGrantor()
		}
	}), [])

	return (
		<Panel title={t("legalDocs:eletronicProcurationLegal.title")} withPadding>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					<TextField
						label={t("legalDocs:eletronicProcurationLegal.publicAgency")}
						name="eletronicProcurationLegal.publicAgency"
						required
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<TextField
						label={t("legalDocs:eletronicProcurationLegal.processNumber")}
						name="eletronicProcurationLegal.processNumber"
						type="text"
						required={!!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
						readOnly={!!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<TextField
						label={t("legalDocs:eletronicProcurationLegal.folderNumber")}
						name="eletronicProcurationLegal.folderNumber"
						type="text"
						required={!!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
						readOnly={!!props.solicitation.folderNumberRequired || props.isFolderNumberSet}
					/>
				</Grid>
				<Grid item md={12} xs={12}>
					<TextField
						label={t("legalDocs:eletronicProcurationLegal.observation")}
						name="eletronicProcurationLegal.observation"
						type="text"
						multiline
						rows={3}
					/>
				</Grid>
				<Grantor ref={grantor} docType={LegalDocFormType.ELETRONIC_PROCURATION_LEGAL} />
			</Grid>
		</Panel>
	);
};

const EletronicProcurationLegalSolicitation = forwardRef(EletronicProcurationLegalSolicitationComponent)

export default EletronicProcurationLegalSolicitation;
