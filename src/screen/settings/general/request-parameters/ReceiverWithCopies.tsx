import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, CircularProgress, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Formik, useFormikContext } from 'formik';
import { set, lensIndex } from 'ramda';

import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import { SelectField } from 'src/components/form'
import { Submit } from 'src/components/button'

import { t, useTranslation } from 'src/locale/i18n';

import { useUsersActives } from 'src/hooks/fetchLists';
import { getLoadingAreasDEJUR } from 'src/core/store/modules/areas/selectors';
import {
	resposibleAsOptions,
} from './constants';
import { TRequestParameters } from 'src/core/models/request-parameters';
import { v4 } from 'uuid'
import { getHasItemRequestParameters, getItemRequestParameters } from 'src/core/store/modules/request-parameters/selectors';


const LIMIT_PAGE = 10
type Props = {
	title: string;
	isNew: boolean;
	disabled: boolean;
	submitting: boolean;
}

type TRows = {
	id: any;
	responsibleType: any;
	responsibleUserId: any;
	status: boolean;
}

const ReceiverWithCopiesForm = ({ title, isNew }: Props) => {

	const { t } = useTranslation();
	const { values, setFieldValue, status } = useFormikContext<TRequestParameters>()
	const { usersActivesAsOptionsById } = useUsersActives();
	
	const [list, setList] = useState<TRows[]>([])

	const [pageCurrent, setPageCurrent] = useState(1)
	const [pageCount, setPageCount] = useState(0)

	const isFetching = useSelector(getLoadingAreasDEJUR);

	const item = useSelector(getItemRequestParameters);
	const hasItem = useSelector(getHasItemRequestParameters);

const setRequestParametersEmailsWhenHasItem = async () => {
	
		if(hasItem === true){
			const modifiedRequestParametersEmails = await hasItem ? item?.requestParameterEmailsIds?.map((obj: { id: number, responsibleType: string, responsibleUserId: string, userName: string, status: boolean }) => ({
				id: obj.id,
				responsibleUserId: usersActivesAsOptionsById.find(({ value }: { value: any }) => value === obj.responsibleUserId)?.label ?? obj.userName,
				responsibleType: resposibleAsOptions.find(({ value }: { value: any }) => value === obj.responsibleType)?.label ?? '',
				status: obj.status
			})) : [];


			setList(modifiedRequestParametersEmails)  

			return
		}
	}

	useEffect(() => {

		setRequestParametersEmailsWhenHasItem()

	}, [hasItem]) 


	useEffect(() => {
		setPageCount(Math.ceil(values.requestParameterEmailsIds?.length / LIMIT_PAGE))
	}, [values.requestParameterEmailsIds?.length]); 

	useEffect(() => {
		const newRows = values.requestParameterEmailsIds.map(({ id, responsibleType, responsibleUserId, status }: { id: number, responsibleType: number, responsibleUserId: number, status: boolean }) => ({
			id,
			responsibleUserId: usersActivesAsOptionsById.find(({ value }: { value: number }) => value === responsibleUserId)?.label ?? '',
			responsibleType: resposibleAsOptions.find(({ value }: { value: number }) => value === responsibleType)?.label ?? '',
			status
		})) 

		const initial = (pageCurrent - 1) * LIMIT_PAGE
		const list = newRows.slice(initial, initial + LIMIT_PAGE);
	
		setList(list)

	}, [values.requestParameterEmailsIds, pageCurrent, item]); 

	const handleChangeStatus = async ({ id, ...row }: any) => {
			const updatedList = list.map(item => {
				if (item.id === id) {
					return { ...item, status: !item.status };
				}
				return item;
			});

		await setList(updatedList); 

		const updatedValue = values?.requestParameterEmailsIds.map((item: { id: any; status: any; }) => {
			if (item.id === id) {
				return { ...item, status: !item.status };
			}
			return item;
		});
		
		await setFieldValue('requestParameterEmailsIds', updatedValue)
		
		}; 

	const columns: ColumnData[] = [
		{
			label: 'Responsável',
			field: 'responsibleType',
		},
		{
			label: 'Nome do responsável',
			field: 'responsibleUserId',
		},
		{
			label: 'Status',
			field: 'status',
			type: 'switch-button',
			onChange: handleChangeStatus,
		},
	];


	const onSubmitAdd = useCallback(
		({ responsibleType, responsibleUserId }, { resetForm }) => {
			
			setFieldValue('requestParameterEmailsIds', [
				{ responsibleType: responsibleType, responsibleUserId: responsibleUserId, id: v4(), status: true },
				...values.requestParameterEmailsIds,
			]) 
			
			resetForm()
		},
		[values.requestParameterEmailsIds, setFieldValue]
	);

	return (
		<Panel
			title={title}
			withPadding
		>
			{
				isFetching
					? <CircularProgress className='margin-top-16' />
					: status === 'readOnly' ? null : (
						<>
							<Formik
								onSubmit={onSubmitAdd}
								initialValues={{ responsibleType: null, responsibleUserId: null }}
								
							>
								{({ handleSubmit, dirty, values }) => (
									<Grid container spacing={3}>
										<Grid item md={3} xs={12}>
											<SelectField
													label={t('settings:requestParameters.responsible')}
													name='responsibleType'
													options={resposibleAsOptions.filter((item: any) => item.value !== 0 && item.value !== 5)}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<SelectField
												label={t('settings:requestParameters.form.responsibleName')}
												name='responsibleUserId'
												options={usersActivesAsOptionsById}
												required={values.responsibleType === 6}
												disabled={values.responsibleType !== 6}
											/>
										</Grid>
										<Grid item>
											<IconButton
												color="primary"
												aria-label="submit"
												onClick={() => handleSubmit()}
												disabled={!dirty}
											>
												<AddIcon />
											</IconButton>
										</Grid>
									</Grid>
								)}
							</Formik>
							<br />
							<br />
							<br />
						</>
					)
			}
			<Table
				columns={columns}
				rows={list}
				isLoading={isFetching}
			/>

			<Pagination
				page={pageCurrent}
				pageCount={pageCount}
				onChangePage={setPageCurrent}
				pageSize={LIMIT_PAGE}
			/>
		</Panel>
	)
}

export default ReceiverWithCopiesForm