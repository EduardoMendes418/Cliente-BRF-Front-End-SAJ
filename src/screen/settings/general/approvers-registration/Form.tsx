import { useState, useEffect } from 'react';
import { FormikHelpers } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box } from '@material-ui/core';
import { Submit } from 'src/components/button';

import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import Form, { TextField } from 'src/components/form';
import { useTranslation } from 'src/locale/i18n';
import { actions } from 'src/core/store';
import { useGroupedAreas } from 'src/hooks/fetchLists';
import { getSapHierarchyItem, getSapHierarchyIsFailure } from 'src/core/store/modules/hierarchy-sap/selectors';
import { addHierarchy, editHierarchy } from 'src/core/store/modules/hierarchy/thunks';
import { fetchSapHierarchy } from 'src/core/store/modules/hierarchy-sap/thunks';
import { getHierarchyById } from 'src/core/store/modules/hierarchy/thunks';
import { getHierarchyStatus } from 'src/core/store/modules/hierarchy/selectors';
import { useSapHierarchyError } from 'src/hooks/hierarchySap';
import { useActionHierarchy } from 'src/hooks/hierarchy';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';
import { useHistory, useParams } from 'react-router';
import CancelButton from 'src/components/button/Cancel';
import { useSnackbar } from 'notistack';

const ApproversRegistrationForm = () => {

	const [userId, setUserId] = useState(null);
	const [area, setArea] = useState<number[] | null>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<any>({areaId: [], aprovador: ""});
	const [hierarchyData, setHierarchyData] = useState<any>(null);
	const { id } = useParams<{ id: string }>();
	
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory(); 
	
	useSapHierarchyError();
	useActionHierarchy('configuracoes/geral/cadastro-aprovadores');

	const sapHierarchy = useSelector(getSapHierarchyItem);

	const hasFetchSapHierarchyFailed = useSelector(getSapHierarchyIsFailure)
	const addHierarchyStatus = useSelector(getHierarchyStatus)

	const isNew = id === 'novo';

	const initialValues = {
		areaId:  [] ,
		aprovador: "",
	};

	const getHierarchy = async () => {
		const {payload} = await dispatch(getHierarchyById(id)) as any;
	
		setData({
			areaId: payload.hierarquiaAreas.map((area: any) => area.areaId),
			aprovador: payload.aprovador
		});
		setHierarchyData(payload);
	}

	useEffect(() => {
		if (
			hasFetchSapHierarchyFailed ||
			addHierarchyStatus === 'failure'
		) {
			setIsLoading(false)
		}
	}, [hasFetchSapHierarchyFailed, addHierarchyStatus])

	const { groupedAreasAsOptions} = useGroupedAreas();

	useEffect(() => {
		if (Object.keys(sapHierarchy).length > 0 && userId && area) {
			dispatch(
				addHierarchy({
					approver: userId,
					approverName: sapHierarchy.contributorName,
					approverEmail: sapHierarchy.contributorEmail,
					hierarchy: sapHierarchy.hierarchyDescription,
					sequence: sapHierarchy.hierarchySequence,
					hierarchyCode: sapHierarchy.hierarchyCode,
					areaId: area,
				}),
			);

			dispatch(actions.sapHierarchy.clear());
			setUserId(null);
			setArea([]);
		}
	}, [sapHierarchy, userId, area, dispatch]);

	useEffect(() => {
		if(!isNew){
			getHierarchy()
		}
	}, [])

	const handleSubmit = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
		setSubmitting(false)
		setIsLoading(true)
	
		if(isNew === true){
			dispatch(fetchSapHierarchy(values.aprovador));

		} else {
			const filteredHierarchyAreas = hierarchyData.hierarquiaAreas.filter((area: any) =>
				values.areaId.includes(area.areaId)
			);
	
			const updatedHierarchyAreas = [...filteredHierarchyAreas];
			values.areaId.forEach((areaId: number) => {
				if (!filteredHierarchyAreas.some((area: any) => area.areaId === areaId)) {
					updatedHierarchyAreas.push({
						area: null,
						id: 0,
						areaId: areaId,
						hierarquiaId: Number(id)
					});
				}
			});
	
			const updatedHierarchyData = {
				...hierarchyData,
				hierarquiaAreas: updatedHierarchyAreas
			};
			
			const { type } = await dispatch(editHierarchy(updatedHierarchyData)) as any;

			if(type === 'hierarchy/edit/fulfilled'){
				setIsLoading(false)
					enqueueSnackbar("Aprovador editado com sucesso.", {
					variant: "success",
				});

				history.goBack();
			} else {
				setIsLoading(false)
				enqueueSnackbar("Ocorreu um erro.", {
					variant: "error",
				});
			}
		}
		setUserId(values.aprovador);
		setArea(values.areaId);
	};

	return (
		<ScreenTemplate>
		<Panel title={t('approversRegistration:title')}>
			<Form
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validateOnMount
			>
				{({ handleSubmit, isValid, dirty, setFieldValue, values }) => {
					useEffect(() => {
						if (data.areaId.length > 0 || data.aprovador && isNew === false) {
							setFieldValue('areaId', data.areaId);
							setFieldValue('aprovador', data.aprovador);
						}
					}, [data, setFieldValue]);

					return (
						<form noValidate onSubmit={handleSubmit}>
							<div className="panel-content">
								<Grid container spacing={2}>
									<Grid item md={3} xs={12}>
										<GroupedSelectFiledMultiple
											name="areaId"
											label={t('approversRegistration:juridicalArea')}
											options={groupedAreasAsOptions}
											required
											multiple
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<TextField
											name="aprovador"
											label={t('approversRegistration:approverID')}
											onChange={(e) => setFieldValue('aprovador', e.target.value.toLocaleUpperCase())}
											required
											disabled={!isNew}
										/>
									</Grid>
									<Grid item md={1} xs={2}>
										<Submit type= {isNew === true ? "add" : "save"} submitting={isLoading} disabled={!isValid || !dirty} />
									</Grid>
								</Grid>
								<Box mt="20px" textAlign="right">
										<CancelButton />
									</Box>
							</div>
						</form>
					);
				}}
			</Form>
		</Panel>
	</ScreenTemplate>
	);
};

export default ApproversRegistrationForm;
