import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef } from "react";
import { LegalDocumentPrepositionLetterProcess, LegalDocumentPrepositionReplacementExtraData, LegalDocumentPrepositionReplacementParties } from "src/core/models/legal-document-request";
import { TLegalDocRequestType } from "src/core/models/legal-document-request-types";
import CorrespondentsPanel, { CorrespondentsPanelHandler } from "./correspondents/CorrespondentsPanel";
import ProcessPanel, { ProcessPanelHandler } from "./process/ProcessPanel";
import ReplacementPanel, { ReplacementPanelHandler } from "./replacement/ReplacementPanel";

type ReplacementProps = {
	solicitation: TLegalDocRequestType
}

export type ReplacementHandler = {
	getParties: () => LegalDocumentPrepositionReplacementParties[]
	getProcess: () => LegalDocumentPrepositionLetterProcess[]
	getExtraData: () => LegalDocumentPrepositionReplacementExtraData | undefined
}

const ReplacementComponent: ForwardRefRenderFunction<ReplacementHandler, ReplacementProps> = (props, ref) => {
	const process = useRef<ProcessPanelHandler>(null)
	const correspondents = useRef<CorrespondentsPanelHandler>(null)
	const replacement = useRef<ReplacementPanelHandler>(null)

	useImperativeHandle(ref, () => ({
		getParties: () => [...correspondents.current?.getList() ?? [], ...replacement.current?.getList() ?? []],
		getProcess: () => process.current?.getList() ?? [],
		getExtraData: () => process.current?.getExtraData(),
	}), [])

	return (
		<>
			<ReplacementPanel ref={replacement} />
			<CorrespondentsPanel ref={correspondents} />
			<ProcessPanel ref={process} note={props.solicitation.informativeNote} />
		</>
	);
};

const Replacement = forwardRef(ReplacementComponent);

export default Replacement
