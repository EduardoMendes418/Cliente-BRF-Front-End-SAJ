import { MULTIPLE_FILES_TYPE } from 'src/core/models/data-import';

export type Props = {
	onSubmit: any;
	fileName?: string;
	filters?: any;
	labelFormFile: string;
	labelFormFileText?: string;
	labelFileAttachments: string;
	labelFileAttachmentsText?: string;
	setIsImportScreen?: any;
	button?: any;
	accept?: string;
}

export type TProps = {
	type: MULTIPLE_FILES_TYPE;
	fileName: string;
	labelFormFile: string;
	labelFileAttachments: string;
}