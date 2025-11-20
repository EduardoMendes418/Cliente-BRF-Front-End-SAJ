import NominatedPanel, { NominatedPanelHandler } from "./nominated/NominatedPanel";
import ProcessPanel, { ProcessPanelHandler } from "./process/ProcessPanel";
import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef } from "react";
import { LegalDocumentPrepositionLetterParties, LegalDocumentPrepositionLetterProcess } from "src/core/models/legal-document-request";

export type PrepositiontHandler = {
	getParties: () => LegalDocumentPrepositionLetterParties[]
	getProcess: () => LegalDocumentPrepositionLetterProcess[]
}

const PrepositionComponent: ForwardRefRenderFunction<PrepositiontHandler, {}> = (props, ref) => {
	const nominated = useRef<NominatedPanelHandler>(null)
	const process = useRef<ProcessPanelHandler>(null)

	useImperativeHandle(ref, () => ({
		getParties: () => nominated.current?.getList() ?? [],
		getProcess: () => process.current?.getList() ?? [],
	}), [])

	return (
		<>
			<NominatedPanel ref={nominated} />
			<ProcessPanel ref={process} />
		</>
	);
};

const Preposition = forwardRef(PrepositionComponent);

export default Preposition
