import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Formik } from 'formik'
import { Box, Grid, ListSubheader, MenuItem, Select, TextField } from '@material-ui/core'
import { useSnackbar } from 'notistack';
import FileSaver from 'file-saver';

import ScreenTemplate from 'src/components/Screen'
import Panel from 'src/components/Panel'
import { DateField } from 'src/components/form'
import { Clean, Submit } from 'src/components/button'
import { useTranslation } from 'src/locale/i18n'
import { generateReport, getReportExecutionManagerGridList } from 'src/core/store/modules/provision/thunks'
import { useGroupedAreas } from "src/hooks/fetchLists"
import { TProvisionReportPost } from 'src/core/models/provision'
import { AppDispatch } from 'src/core/store';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';
import { IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Button } from '@material-ui/core';
import { ButtonDiv } from './styled';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';

const initialValues: TProvisionReportPost = {
	dejurAreas: [],
	competence: null,
	competenceOne: null,
	competenceTwo: null,

}

const ProvisionReport = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>()
	const { enqueueSnackbar } = useSnackbar()
	const [isLoading, setIsLoading] = useState(false);
	const [gridList, setGridList] = useState<any[]>([]);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [pageCount, setPageCount] = useState(1);

	const { groupedAreasAsOptions} = useGroupedAreas();

	const onPageChange = useCallback((page: number) => setPage(page), [])
	const onPageSizeChange = useCallback((pageSize: number) => setPageSize(pageSize), [])

	const getData = useCallback(async () => {
		const {payload} = await dispatch(getReportExecutionManagerGridList({page: page, pageSize: pageSize})) as any;
		setGridList(payload?.items)	
		setPageCount(payload?.pageCount)
	}, [dispatch, page, pageSize])


	useEffect(() => {
		getData()
	}, [getData])

	const onSubmit = useCallback(async (values: TProvisionReportPost) => {
	setIsLoading(true);
		const { payload, type } = await dispatch(generateReport(values))
		getData()
		setIsLoading(false);

		if (type === 'provision/generateProvisionReport/rejected') {
			const hasErrorMessage = typeof payload === 'string'
			enqueueSnackbar(hasErrorMessage ? payload : t('anErrorHasOcurred'), { variant: 'error' })
			return
		}
		if (type === 'provision/generateProvisionReport/fulfilled') {
            enqueueSnackbar(t("successfulOperation"), { variant: "success" });
		}
	
	}, [dispatch, enqueueSnackbar, t])

	const donwloadExcelFile = (row: any) => {
		FileSaver.saveAs(row.reportUrl as Blob)
	}

	const columns: ColumnData[] = [
		{
			label: t("reports:actions"),
			field: "actions",
			type: "custom",
			component: (row: any) => {
				return (
					<>
						 {row.statusExecution === 2 && ( 
							<IconButton onClick={() => donwloadExcelFile(row)}>
								<VisibilityIcon color="primary" />
							</IconButton>
						 )} 
						
					</>
				);
			},
		},
		{ label: t('closure:provisionReport.filter.requester'), field: 'userName' },
		{ label: t('closure:provisionReport.filter.createdDate'), field: 'createdDate', type: 'dateHour' },
		{ label: t('closure:provisionReport.filter.dejurArea'), field: 'areaDejurNames'},
		{ label: t('closure:provisionReport.filter.periodOne'), field: 'accruralMonthOne', type: 'dateMonthYear'},
		{ label: t('closure:provisionReport.filter.periodTwo'), field: 'accruralMonthTwo', type: 'dateMonthYear'}

	];


	const rows: any = gridList?.map((report: any) => {
		return {
			...report,
			areaDejurNames: report?.areas?.map((area: any) =>  area.areaName).join('; ')
		}
	});

	return (
		<ScreenTemplate>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting, isValid, resetForm, dirty }) => (
					<form noValidate onSubmit={handleSubmit} autoComplete="off">
						<Panel withPadding title={t("closure:provisionReport.filter.title")}>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<GroupedSelectFiledMultiple
										multiple 
										options={groupedAreasAsOptions} 
										name={"dejurAreas"} 
										label={t('closure:provisionReport.filter.dejurArea')}
									/> 
								</Grid>
								<Grid item md={3} xs={12}>
									<DateField
										required
										label={t('closure:provisionReport.filter.periodOne')}
										views={['year', 'month']}
										format="MM-YYYY"
										provisionReport={true}
										name="competenceOne"
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<DateField
										required
										label={t('closure:provisionReport.filter.periodTwo')}
										views={['year', 'month']} 
										format="MM-YYYY"
										provisionReport={true}
										name="competenceTwo"
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<Clean onClick={resetForm} />
								</Grid>
							</Grid>
						</Panel>
						<Box mt="20px" textAlign="right">
							<Submit
								disabled={isLoading || !isValid || !dirty}
								submitting={isLoading || isSubmitting}
								text={t('dataImport:smartswap.filter.generateList')}
							/>
						</Box>
					</form>
				)}
			</Formik>
			<>
			 <ButtonDiv>
				<Button
					onClick={() => getData()}
					variant="contained"
					color='primary'
				>
					Atualizar a Lista
				</Button>
			</ButtonDiv> 
			<Panel title={t('closure:provisionReport.gridListTitle')}>
				<Table
					columns={columns}
					rows={rows}
					isLoading={isLoading}
				/>
			</Panel>
			<Pagination 
				page={page}
				pageSize={pageSize}
				onChangePage={onPageChange}
				onChangePageSize={onPageSizeChange}
				pageCount={pageCount}
			/>
		</>
		</ScreenTemplate>
	)
}

export default ProvisionReport
