import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Form from 'src/components/form';
import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';

import { useTranslation } from 'src/locale/i18n';
import {
	getRequestParameters,
	addRequestParameters,
	editRequestParameters,
} from 'src/core/store/modules/request-parameters/thunks';
import {
	getItemRequestParameters,
	getLoadingRequestParameters,
	getStatusRequestParameters as getStatus,
	getErrorMessageRequestParameters as getErrorMessage,
	getHasItemRequestParameters,
} from 'src/core/store/modules/request-parameters/selectors';
import { TRequestParameters } from 'src/core/models/request-parameters';
import { useRegisterDefault } from 'src/hooks';
import { actions } from 'src/core/store';
import { useEffect, useMemo } from 'react';
import { fillIfValue } from 'src/core/utils/func';


const RequestLogsConfiguration = () => {

	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const loading = useSelector(getLoadingRequestParameters);
	const statusSubmit = useSelector(getStatus);
	const item = useSelector(getItemRequestParameters);
	const hasItem = useSelector(getHasItemRequestParameters);


	const isNew = id === 'novo';

	useEffect(() => {
		if (id && !isNew) dispatch(getRequestParameters(id));
		return () => { dispatch(actions.requestParameters.clear()) };
	}, [dispatch, id, isNew]);

	useRegisterDefault({
		action: 'requestParameters',
		getStatus,
		getErrorMessage,
	})

	const onSubmit = (values: TRequestParameters) => {
		if (isNew) dispatch(addRequestParameters(values));
		else dispatch(editRequestParameters({ ...values, id: Number(id) }));
	};

	const initialValues: TRequestParameters = useMemo(() => {
		const initialValues: TRequestParameters = {
			requestType: '',
			description: '',
			statusFolderNumber: 0,
			requestHelp: '',
			responsibleType: '',
			responsibleUserId: '',
			hoursDeadline: 0,
			countDeadline: '',
			hasDeadline: '',
			resultReport: '',
			attachmentRequired: '',
			processComplement: '',
			folderNumberRequired: '',
			status: true,
			administrativeControlResponsiblesIds: hasItem ? item.administrativeControlResponsiblesIds : []
		}
		return {
			...fillIfValue<TRequestParameters>(item, initialValues),
			countDeadline: item.hasDeadline ? item.countDeadline : '',
		}
	}, [item, hasItem])

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty, setSubmitting, values }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							slotBottonRightPermission="add"
							title={t('settings:titles.requestParameters')}
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting || loading} disabled={!dirty} />}
							withPadding
						>
							<></>
						</Panel>
						{statusSubmit === 'failure' && isSubmitting && setSubmitting(false)}
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default RequestLogsConfiguration;
