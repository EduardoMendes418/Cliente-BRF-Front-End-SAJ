import { ChangeEvent, useEffect, useState } from "react";
import { Formik, FormikHelpers } from "formik";
import { Grid, InputLabel } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import api from "src/core/api/requestLog";

import Panel from "src/components/Panel";
import { DateField } from "src/components/form";

import { Clean, Submit } from "src/components/button";
import { actions } from "src/core/store";
import { TRequestParametersFilters } from "src/core/models/request-parameters";
import { getLoadingRequestLog } from "src/core/store/modules/request-log/selector";
import { usePagination } from "src/hooks/pagination";
import { fetchRequestLog } from "src/core/store/modules/request-log/thunk";
import ListSubheader from '@mui/material/ListSubheader';
import {  FormControl, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
	formControl: {
		minWidth: 120,
	},
}));

const Search = () => {
	const dispatch = useDispatch();

	const loading = useSelector(getLoadingRequestLog);
	const { page, pageSize } = usePagination();

	const classes = useStyles();
	const [options, setOptions] = useState<any>([]);
	const [logId, setLogId] = useState<string | number>("");

	const onSubmit = (
		values: any,
		{ setSubmitting }: FormikHelpers<TRequestParametersFilters | any>
	) => {
		if(Number(logId) > 0){
			values.logDataFromId.push(logId)
		}
		dispatch(actions.requestLog.setFilters(values))
		setSubmitting(false);
	};

	const initialValues: any = {
		logDataFromId: [],
		begin: null,
		end: null,
	};

	 useEffect(() => {
		const response = api.listMenus();
		 response.then((item: any) => {
			item.data.bloco.forEach((reg: any) => {
				setOptions((oldArray: any) => [
					...oldArray,
					{id: reg.descricao,
					 title: reg.descricao, matters: reg?.itens?.map((x: any) => {
						return {
							title: x.descricao,
							id: x.logDataFromId
						}
					})}
				])
			})
		}); 
	}, []); 

	const newArr: any[] = [];
	options.forEach((log: { title: string; id: string; matters: any[]; }) => {
	  newArr.push({
		showTitle: log.title,
		value: log.id,
		label: log.title
	  });
  
	  log.matters.forEach((matter) => {
		newArr.push({
		  value: matter.id,
		  label: matter.title
		});
	  });
	});
  
	const handleChange = (e: ChangeEvent<{ value: any }>) => {
	  setLogId(e.target.value);
	};
  
	const renderListSubHeader = (item: any, indexItem: number) => {
	  return (
		item.showTitle && (
		  <ListSubheader sx={{fontWeight: 'bold'}} key={indexItem}>
			{item.showTitle}
		  </ListSubheader>
		)
	  );
	};
  
	const renderMenuItem = () => {
	  return newArr.map(
		(item, indexItem) =>
		  renderListSubHeader(item, indexItem) || (
			<MenuItem key={indexItem} value={item.value}>
			  {item.label}
			</MenuItem>
		  )
	  );
	};

	return (
		<Panel title={"Consulta LOGs configuração"} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, isSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={12} md={5}>
							<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel shrink >{"Menu Configuração"}</InputLabel>
        							<Select
									labelWidth={100}
									labelId='labelId' 
          							value={logId || ""}
          							onChange={handleChange}
          							id="logDataFromId"
       								>
          							{renderMenuItem()}
        							</Select>
      							</FormControl>
							</Grid>
							<Grid item xs={12} md={3}>
								<DateField label={"Data cadastro (de)"} name="begin" />
							</Grid>
							<Grid item xs={12} md={3}>
								<DateField label={"Até"} name="end" />
							</Grid>

							<Grid item md={1} xs={2}>
								<Submit type="search" submitting={loading || isSubmitting} />
							</Grid>
						</Grid>
						<Clean onClick={() => {dispatch(fetchRequestLog({ page, pageSize})) 
						setLogId('')}} action="requestLog" />
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
