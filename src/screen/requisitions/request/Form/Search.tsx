import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import Panel from 'src/components/Panel';
import { Grid } from '@material-ui/core';
import { getLoadingRequestParameters, getItemRequestParameters } from 'src/core/store/modules/request-parameters/selectors';
import { t } from 'src/locale/i18n';
import moment from 'moment';

import { fetchRequestParameters, getRequestParameters } from 'src/core/store/modules/request-parameters/thunks';
import { SelectField, TextField } from 'src/components/form';
import { Submit } from 'src/components/button';
import { FolderNumber } from 'src/core/models/requisitions';
import { getDeadlineDateRequisitions } from 'src/core/store/modules/requisitions/thunks';
import { getItemRequisitions } from 'src/core/store/modules/requisitions/selectors';
import { getProcessError, getProcessIsFetching } from 'src/core/store/modules/process/selectors';
import { useSnackbar } from "notistack";

import Help from '../../components/Help';
import { TYPES_MODALS } from "../../constants"
import { AppDispatch, actions } from 'src/core/store';
import { fetchClosuresResultList } from 'src/core/store/modules/closures/thunks';
import { getListClosures } from 'src/core/store/modules/closures/selectors';
import { useEffect, useState } from 'react';
import { RESPONSIBLE_TYPE } from 'src/screen/settings/general/request-parameters/constants';
import api from 'src/core/api/e-social-event-launch'

type Props = {
	setFolderNumber: (folderNumbers: FolderNumber) => void
}

const Search = ({ setFolderNumber }: Props) => {
	const dispatch = useDispatch<AppDispatch>();
	const currentDate = moment().format('YYYY-MM-DD');
	const { enqueueSnackbar } = useSnackbar();

	const requisitionItem = useSelector(getItemRequisitions)
	const loading = useSelector(getLoadingRequestParameters)
	const loadingFolder = useSelector(getProcessIsFetching)
	const error = useSelector(getProcessError)
	const requestParameterItem = useSelector(getItemRequestParameters)
	const closures = useSelector(getListClosures)
	 const [requisitionTypesOptions, setRequisitionTypesOptions] = useState<any[]>([])

	const initialValues = {
		requisitionType: requisitionItem?.requestParameter?.id ?? 0,
		folderNumber: requisitionItem?.folderNumber ?? ''
	}

	const onChangeRequisitionType = async (valueRequisitionType: any) => {
		const requisitionTypeId = valueRequisitionType.target.value
		if (!!requisitionTypesOptions) {
			await dispatch(getRequestParameters(requisitionTypeId))
			await dispatch(getDeadlineDateRequisitions({
				requestParameterId: requisitionTypeId,
				dateTime: currentDate
			}))

			const item = requisitionTypesOptions.filter(x => x.value === requisitionTypeId)?.[0]

			if (item && item.responsibleType === RESPONSIBLE_TYPE.REQUESTER){
				await dispatch(fetchClosuresResultList({
					status: 1
				}));
				dispatch(actions.requestParameters.clearItem())
			} else {
				dispatch(actions.closures.clear())
			}
		}
	}

	useEffect(() => {
		if (closures && closures.length > 0) {
			enqueueSnackbar("Período em fechamento, não permitir incluir esta requisição", {
				variant: "error"
			})
			return;
		}
	}, [closures, enqueueSnackbar])

	const onSubmit = async (values: any) => {
		if (closures && closures.length > 0) {
			enqueueSnackbar("Período em fechamento, não permitir incluir esta requisição", {
				variant: "error"
			})
			dispatch(actions.requestParameters.clearItem())
			return;
		}
		const requisitionType = requisitionTypesOptions.find(({id}) => id === values.requisitionType) as any
		
		if (requisitionType && requisitionType.statusFolderNumber !== 0 ) {
			const {data : {items}} = await api.list({
				page: 1,
				folderNumber: values.folderNumber
			})
			if(items.some((item: any) => item.eventLaunchStatus !== 4 && item.eventLaunchStatus !== 5)) {
				enqueueSnackbar("Pasta/CTG possui um processo e-Social em andamento. Não permitida alteração de status.", {
					variant: "error"
				})
				dispatch(actions.requestParameters.clearItem())
				return;

			}
			
		}
		
		await dispatch(getRequestParameters(values.requisitionType));
		await dispatch(getDeadlineDateRequisitions({
			requestParameterId: values.requisitionType,
			dateTime: currentDate
		}))

		if (values.folderNumber) 
			setFolderNumber({ 
				folderNumber: values.folderNumber.includes('/') 
					? values.folderNumber.replace("/", "-") 
					: values.folderNumber 
			})

		if(error!.length > 0 ){
			enqueueSnackbar(
				"Pasta/CTG é inválida ou não localizada.",
				{ variant: "error" }
			)}
	};

	  const getFilteredRequestParameters = async () => {
		const {data, payload} = await dispatch(fetchRequestParameters({ notPaginate: true, status: true })) as any
		setRequisitionTypesOptions(payload?.items)
	}		

	useEffect(() => {
		getFilteredRequestParameters();
	}, [])	 
	
	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			enableReinitialize
		>
			{({ handleSubmit, dirty }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Panel title={t('requisitions:form.newRequisition')}>
						<div className='panel-content'>
							<Grid container spacing={2}>
								<Grid item xs={12} md={6}>
									<SelectField
										disabled={loading}
										label={t('requisitions:form.requisitionType')}
										name='requisitionType'
										options={requisitionTypesOptions.map((option: any) => ({ label: option.requestType, responsibleType: option.responsibleType, statusFolderNumber: option.statusFolderNumber, value: option.id })) ?? []}
										readOnly={!!requisitionItem?.requestParameter}
										onChange={onChangeRequisitionType}
									/>
								</Grid>
								<Grid item xs={10} md={3}>
									<TextField
										disabled={loading}
										name='folderNumber'
										label={t('form.CTGFolder')}
										placeholder={t('form.typeHere')}
										readOnly={!!requisitionItem?.requestParameter}
										required={!!requestParameterItem?.folderNumberRequired}
									/>
								</Grid>
								<Grid item xs={2}>
									<Grid container spacing={2}>
										<Grid item xs={12} md={12}>
											<Submit type="search" disabled={!dirty} submitting={loading || loadingFolder} />
											<Help style={{ marginLeft: 8, backgroundColor: `${dirty === true ? 'orange' : 'white'}` }} typeModal={TYPES_MODALS.HELP} />
										</Grid>

									</Grid>

								</Grid>
							</Grid>
						</div>
					</Panel>
				</form>
			)}
		</Formik>
	);
};

export default Search;
