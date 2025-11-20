import Panel from "src/components/Panel";
import { Formik } from 'formik';
import { Grid, Box } from '@material-ui/core';
import { DateField, SelectField } from 'src/components/form';
import { useAreasResponsibleByUserIdPath, useGroupedAreas } from "src/hooks/fetchLists";
import { Clean, Submit } from 'src/components/button';
import { exportRequestReportCircularizationExcelFile } from "src/core/store/modules/report/thunks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/core/store";
import { useSnackbar } from "notistack";
import { useCurrentUser } from "src/config/permissions";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";


const CircularizationReport= () => {

	const { groupedAreasAsOptions } = useGroupedAreas();
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();
	const { userId } = useCurrentUser("");
	const { listDEJURbyUserOptions } = useAreasResponsibleByUserIdPath(userId as number);
	
	const initialValues: any = {
		DejurAreaIds: [],
		CircularizationDate: null,
		officeIds: []
	};

	const onSubmit = async (values: any) => {
		const { meta } = await dispatch(exportRequestReportCircularizationExcelFile(values)) as any;
	
		if (meta?.requestStatus === "fulfilled") {
			enqueueSnackbar(`Relatorio gerado com sucesso!`,
			{ variant: "success" })
			window.open("/relatorios/gerados", "_blank")?.focus();
		}
	};
	
	return (
				<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting}) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel title={"Filtros de circularização"} withPadding>
						<Grid container spacing={2}>
							<Grid item xs={12} md={3}>
								<DateField
									label={"Mês da circularização"}
									name="CircularizationDate"
									views={['year', 'month']}
									provisionReport={true}
									format="MM-YYYY"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<GroupedSelectFiledMultiple
									options={groupedAreasAsOptions}
									label={"Área DEJUR"}
									name='DejurAreaIds'
									multiple
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									options={listDEJURbyUserOptions}
									label={"Escritório"}
									name='officeIds'
									multiple
								/>
							</Grid>
							
						</Grid>
						</Panel>
						<Box
							display="flex"
							justifyContent="flex-end"
							alignItems="center"
							mt={2}
						>
							<Clean/>
							<Submit
								style={{ marginLeft: "30px" }}
								text={"Gerar relatório"}
								submitting={isSubmitting}
							/>
						</Box>

					</form>
				)}

			</Formik>
				
			
	);
};

export default CircularizationReport;