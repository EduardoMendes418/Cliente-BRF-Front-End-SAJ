import { IconButton } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
import { modal } from "src/components/modals"
import { modals, TYPES_MODALS } from "../constants";
import { useSelector } from 'react-redux';
import { getItemRequestParameters } from 'src/core/store/modules/request-parameters/selectors';
import FieldColumn from 'src/components/FieldColumn';
import { useTranslation } from 'src/locale/i18n';


type TProps = {
	typeModal: TYPES_MODALS,
	style?: object
}

const Help = ({ typeModal, style, ...props }: TProps) => {

	const { requestHelp, requestType } = useSelector(getItemRequestParameters);
	const { t } = useTranslation();

	return (
		<IconButton
			color="primary"
			disabled={requestHelp === undefined}
			style={{ ...style }}
			onClick={() => {

				if (typeModal !== TYPES_MODALS.HELP) return modal(modals[typeModal]);
				return modal({
					title: requestType,
					component: <FieldColumn
						multiline
						label={t('requisitions:form.description')}
						value={requestHelp}
					/> ?? "-"
				});

			}}
			{...props}
		>
			<HelpOutline />
		</IconButton>
	)

}

export default Help