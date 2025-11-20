import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef } from "react";
import { LegalDocumentEletronicProcurationLegalExtraData, LegalDocumentEletronicProcurationLegalGranteds } from "src/core/models/legal-document-request";
import { TLegalDocRequestType } from "src/core/models/legal-document-request-types";
import BestowedPanel, { BestowedPanelHandler } from "./bestowed/BestowedPanel";

type EletronicProcurationLegalProps = {
	solicitation: TLegalDocRequestType
}

export type EletronicProcurationLegalHandler = {
	getGranteds: () => LegalDocumentEletronicProcurationLegalGranteds[]
	getExtraData: () => LegalDocumentEletronicProcurationLegalExtraData | undefined
}

const EletronicProcurationLegalComponent: ForwardRefRenderFunction<EletronicProcurationLegalHandler, EletronicProcurationLegalProps> = (props, ref) => {
	const bestowed = useRef<BestowedPanelHandler>(null)
	
	useImperativeHandle(ref, () => ({
		getGranteds: () => bestowed.current?.getList() ?? [],
		getExtraData: () => bestowed.current?.getExtraData(),
	}), [])

	return (
		<>
			<BestowedPanel note={props.solicitation.informativeNote} />
		</>
	);
};

const EletronicProcurationLegal = forwardRef(EletronicProcurationLegalComponent);

export default EletronicProcurationLegal
