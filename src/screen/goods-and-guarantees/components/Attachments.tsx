import UploadCard from "src/components/form/Upload/UploadCard";
import { t } from "src/locale/i18n";
import AccordionPanel from "src/components/AccordionPanel";

type TAttachments = {
	attachments: any[];
}

const Attachments = ({ attachments }: TAttachments) => {

	if (!attachments || attachments.length === 0) return null;

	return (
		<AccordionPanel title={t('form.attachments')}>
			<div className='row'>
				{attachments.map((file, index) => (
					<UploadCard file={file} key={`uploadcard_${index}`} disabled />
				))}
			</div>
		</AccordionPanel>
	)
}

export default Attachments;
