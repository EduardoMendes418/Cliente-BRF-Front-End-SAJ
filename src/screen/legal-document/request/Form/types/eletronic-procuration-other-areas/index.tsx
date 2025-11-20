import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef } from "react";
import { LegalDocumentEletronicProcurationLegalGranteds, LegalDocumentEletronicProcurationOtherAreaExtraData } from "src/core/models/legal-document-request";
import { TLegalDocRequestType } from "src/core/models/legal-document-request-types";
import BestowedPanel, { BestowedPanelHandler } from "./bestowed/BestowedPanel";

type EletronicProcurationOtherAreasProps = {
	solicitation: TLegalDocRequestType
}

export type EletronicProcurationOtherAreasHandler = {
	getGranteds: () => LegalDocumentEletronicProcurationLegalGranteds[]
	getExtraData: () => LegalDocumentEletronicProcurationOtherAreaExtraData | undefined
}

const EletronicProcurationOtherAreasComponent: ForwardRefRenderFunction<EletronicProcurationOtherAreasHandler, EletronicProcurationOtherAreasProps> = (props, ref) => {
	const bestowed = useRef<BestowedPanelHandler>(null)
	
	useImperativeHandle(ref, () => ({
		getGranteds: () => bestowed.current?.getList() ?? [],
		getExtraData: () => bestowed.current?.getExtraData(),
	}), [])

	return (
		<>
			<BestowedPanel ref={bestowed} note={props.solicitation.informativeNote} />
		</>
	);
};

const EletronicProcurationOtherAreas = forwardRef(EletronicProcurationOtherAreasComponent);

export default EletronicProcurationOtherAreas
