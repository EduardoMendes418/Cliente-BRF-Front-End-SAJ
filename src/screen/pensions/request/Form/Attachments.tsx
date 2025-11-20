import { useDispatch } from 'react-redux';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';
import { Upload } from 'src/components/form';
import { deletePensionRequestFile } from 'src/core/store/modules/pensions/request-pensions/thunks';
import { useTranslation } from 'src/locale/i18n';

type Props = { isNew: boolean };

const Attachments = ({ isNew }: Props) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const handleDelete = (file: any) => {
		dispatch(deletePensionRequestFile(file.id));
	};

	return (
		<Panel
			title={t('solicitacaoPagamento:attachments.title')}
			slotBottomRight={isNew && <Submit />}
			slotBottonRightPermission='add'
			withPadding>
			<Upload
				multiple
				name="attachments"
				onDelete={handleDelete}
			/>
		</Panel>
	);
};

export default Attachments;
