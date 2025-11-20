import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';
import Form, { Upload } from 'src/components/form';
import { TextField, CurrencyField } from 'src/components/form';
import Logs from 'src/components/Logs';

import { useTranslation } from 'src/locale/i18n';
import {
	getItemAgreementAuthorization,
	getStatusAgreementAuthorization as getStatus,
	getErrorMessageAgreementAuthorization as getErrorMessage,
} from 'src/core/store/modules/agreement-authorization/selectors';
import { TAgreementAuthorization } from 'src/core/models/agreement-authorization';
import { addAgreementAuthorization } from 'src/core/store/modules/agreement-authorization/thunks';
import { useRegisterDefault } from 'src/hooks'

type Props = {
	hasItem: boolean;
	processNumber: string;
}

const currencyToNumber = (value: number) => parseFloat(
	`${value}`.replace(/(R\$\s)|\./g, '').replace(/,/g, '.')
)

const AgreementForm = ({ hasItem, processNumber }: Props) => {

	const { t } = useTranslation()
	const dispatch = useDispatch()

	const {
		maxAgreementValue,
		observation,
		attachments,
		folderNumber,
		paymentTypeId,
		logs,
		possibleApprovers,
	} = useSelector(getItemAgreementAuthorization)
	const statusSubmit = useSelector(getStatus)

	const onSubmit = (values: TAgreementAuthorization) => {
		const mormalizeValues = {
			...values,
			maxAgreementValue: currencyToNumber(values.maxAgreementValue || 0)
		}
		dispatch(addAgreementAuthorization(mormalizeValues))
	}

	useRegisterDefault({
		action: 'agreementAuthorization',
		getStatus,
		getErrorMessage,
	})

	const initialValues = {
		maxAgreementValue: maxAgreementValue ?? '',
		observation: observation ?? '',
		folderNumber,
		paymentTypeId,
		processId: processNumber,
		processNumber,
		attachments: attachments ?? [],
	}

	return (
		<Form
			initialValues={initialValues}
			onSubmit={onSubmit}
			enableReinitialize
			permission={hasItem ? false : undefined}
		>
			{({ handleSubmit, dirty, isSubmitting, setSubmitting }) => (
				<form noValidate onSubmit={handleSubmit} >
					<Panel title={t('Pagamentos:agreementAuthorization.title2')} withPadding>
						<Grid container spacing={3} direction="column">
							<Grid item md={3}>
								<CurrencyField
									name='maxAgreementValue'
									label={t('Pagamentos:agreementAuthorization.maxAgreementValue')}
									placeholder={t('form.typeHere')}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									name='observation'
									label={t('form.comments')}
									placeholder={t('form.typeHere')}
									multiline
									unlimitedLength
								/>
							</Grid>
						</Grid>
					</Panel>
					{
						(!hasItem || initialValues.attachments.length > 0) && (
							<Panel
								title={t('form.attachments')}
								slotBottomRight={!hasItem &&
									<Submit
										text={t('btnSalvarEdicao')}
										disabled={!dirty}
										submitting={isSubmitting}
									/>
								}
								slotBottonRightPermission='add'
								withPadding
							>
								<Upload
									multiple
									name='attachments'
								/>
							</Panel>
						)
					}
					{hasItem && <Logs logs={logs} possibleApprovers={possibleApprovers} statusOrder={['approvalCenter']} />}
					{statusSubmit === 'failure' && isSubmitting && setSubmitting(false)}
				</form>
			)}
		</Form>
	)
}

export default AgreementForm