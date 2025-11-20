import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import Export from "./components/Export";
import ScreenTemplate from "src/components/Screen";

import useEmitSnackbarStatus from 'src/screen/data-import/hooks/useEmitSnackbarStatus';
import { TDataImport, TDataImportDocuments } from 'src/core/models/data-import';
import { importDocuments } from 'src/core/store/modules/data-import/thunk';
import { actions } from 'src/core/store';
import Import from './components/Import';

const Documents = () => {
	const dispatch = useDispatch();
	const formTypeRef = useRef<{ values: Record<string, any> }>(null);
	const [isImportScreen, setIsImportScreen] = useState(false);

	useEmitSnackbarStatus();

	const onImportSubmit = (values: TDataImport) => {
		const valueType = formTypeRef.current?.values as TDataImportDocuments;
		
		dispatch(importDocuments({ type: valueType.type, ...values }));
	};

	useEffect(() => dispatch(actions.dataImport.clear()), [dispatch]);

	return (
		<ScreenTemplate>
			<Export
				formRef={formTypeRef}
				setIsImportScreen={setIsImportScreen}
				isImportScreen={isImportScreen}
			/>
			{isImportScreen && (
				<Import
					onImportSubmit={onImportSubmit}
					setIsImportScreen={setIsImportScreen}
				/>
			)}
		</ScreenTemplate>
	);
}
export default Documents;