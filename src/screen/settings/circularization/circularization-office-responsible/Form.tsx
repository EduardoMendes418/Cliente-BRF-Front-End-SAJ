import ScreenTemplate from 'src/components/Screen';
import { Grid } from '@material-ui/core';
import Form, { SelectField} from 'src/components/form';
import Panel from 'src/components/Panel';
import { Submit } from 'src/components/button';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import UserFieldMultiple from 'src/components/UserFieldMultiple';
import { addCircularizationOfficeResponsibleConfiguration, fetchCircularizationOfficeResponsibleConfiguration, fetchCircularizationOffices } from 'src/core/store/modules/circularizationOfficeResponsibleConfiguration/thunks';
import { getOfficeListPathAsOptions } from 'src/core/store/modules/circularizationOfficeResponsibleConfiguration/selector';
import FieldColumn from 'src/components/FieldColumn';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';
import { useTranslation } from 'src/locale/i18n';

const CircularizationOfficeResponsibleForm = () => {

	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	const isNew = id === 'novo';
	const dispatch = useDispatch();
	const [data, setData] = useState<any>();
	const [dataEdit, setDataEdit] = useState<any>();
	const [officeResponsibleIds, setOfficeResponsibleIds] = useState<any[]>([])
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();
	const officeAsOptions = useSelector(getOfficeListPathAsOptions);
	const { groupedAreasAsOptions} = useGroupedAreas();

	const initialValues = useMemo(() => {
		const initialValues = {
			officeId:  "",
			circularizationOfficeResponsible: [],
			areaId: 0
		} as any;
		return data ? data[0] : initialValues;
	}, [data]);


	const onSubmit = async (values: any) => {
		if(isNew === true){ 
			const valueToSend = {
				...values,
				status: true,
				circularizationOfficeResponsible: values.circularizationOfficeResponsible.map((userId: any) => {
					return {
					userId: userId,
					};
				}),
				dejurAreaId: values.areaId
			}

			const { type, payload } = await dispatch(addCircularizationOfficeResponsibleConfiguration(valueToSend)) as any; 

			if(type !== 'circularizationOfficeResponsibleConfiguration/add/fulfilled' ){
				return enqueueSnackbar(`${payload}`, {
					variant: "error",
				});
			}
			if(type === 'circularizationOfficeResponsibleConfiguration/add/fulfilled'){
				history.goBack();
				return enqueueSnackbar("Responsável escritório criado com sucesso!", {
					variant: "success",
				});
			} 
		} else {
			const officeResponsiblesToCompare = dataEdit?.circularizationOfficeResponsible?.map((x: any) => {
				return x.isDeleted === false ? x.userId : null
			})
			const responsiblesValue = values.circularizationOfficeResponsible;

			const arrayOfNewValues = values.circularizationOfficeResponsible?.map((userId: any) => {
				
				if(officeResponsiblesToCompare?.includes(userId)) return; 
					return {
				circularizationOfficeId: dataEdit.id,
				userId: userId,
					};
			})?.concat(dataEdit.circularizationOfficeResponsible?.map((item: any) => {
				return {
					...item,
					isDeleted: responsiblesValue.includes(item.userId) === false ? true : false
				}
			}))?.filter((x: any) => x !== undefined) 

			const valueToSend = {
				...dataEdit,
				circularizationOfficeResponsible: arrayOfNewValues
			}
			const { type } = await dispatch(addCircularizationOfficeResponsibleConfiguration(valueToSend)) as any; 

			if(type !== 'circularizationOfficeResponsibleConfiguration/add/fulfilled' ){
				return enqueueSnackbar(`Erro na edição`, {
					variant: "error",
				});
			}
			if(type === 'circularizationOfficeResponsibleConfiguration/add/fulfilled'){
				history.goBack();
				return enqueueSnackbar("Responsável escritório editado com sucesso!", {
					variant: "success",
				});
			}}}

			const getData = async () => {
				const { payload } = await dispatch(fetchCircularizationOfficeResponsibleConfiguration({ officeId: id})) as any;
				setDataEdit(payload?.items[0]); 
				setData(payload?.items?.map((x: any) => {
					return {
						circularizationOfficeResponsible: x.circularizationOfficeResponsible
						.map((user: any) => {
							return {
								label: user.userName,
								value: user.userId
							};
						}),
						officeId: x.officeName,
						areaId: x.dejurAreaId

					}
				})); 
				setOfficeResponsibleIds(payload?.items[0].circularizationOfficeResponsible.map((user: any) => {
					return {
						label: user.userName,
						value: user.userId
					};
				}))
			}

	useEffect(() => {
		if(isNew === false){
			getData();
		} 
	}, [])

	useEffect(() => {
		dispatch(fetchCircularizationOffices());
	}, [])

	return (
		<ScreenTemplate>
			<Form
			enableReinitialize
			initialValues={initialValues}
			onSubmit={onSubmit}
			>
				{
					({handleSubmit, isSubmitting, dirty, initialValues}) => (
						<form noValidate onSubmit={handleSubmit}>
							<Panel title={ isNew === true ? "Cadastrar responsável escritório" : "Editar responsável escritório"} 
							withPadding
							slotBottomRight={<Submit isNew={isNew} submitting={isSubmitting} disabled={!dirty} />}
							slotBottonRightPermission={isNew ? 'add' : 'edit'}
							>
							<Grid container spacing={2}>
							<Grid item md={3} spacing={3}> 
							{
								isNew === true ? (
								<SelectField
									options={officeAsOptions}
									label={"Escritório"}
									name='officeId'
									required
								
							/> ) : (
								<FieldColumn 
									label={'Escritório'} 
									value={initialValues?.officeId} />
								)
							}
							</Grid>
							<Grid item md={3} spacing={3}>
								<GroupedSelectFiledMultiple
									label={t('closure:businesCombination.search.dejurArea')}
									name="areaId"
									options={groupedAreasAsOptions}
								/>
							</Grid>
							<Grid item md={3} spacing={3}>
								<UserFieldMultiple
								label={"Responsáveis"}
								name='circularizationOfficeResponsible'
								required
								setInvalidValueWhenTyping
								/> 
							</Grid>
							</Grid>
							</Panel>
						</form>
					)
				}
			</Form>
		</ScreenTemplate>
	);
};

export default CircularizationOfficeResponsibleForm;
