import {forwardRef, ForwardRefRenderFunction, useCallback, useEffect, useImperativeHandle, useRef} from 'react';
import { FormikProps } from "formik";
import Panel from 'src/components/Panel';
import { Formik } from 'formik';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'src/locale/i18n';
import UserField from 'src/components/form/UserField';
import { useDispatch } from "react-redux";

import { TextField, DateField, SelectField } from 'src/components/form';
import { Submit, Clean } from 'src/components/button';
import { AppDispatch } from 'src/core/store';
import { rejectNoValues } from 'src/core/utils/func';
import { actions } from 'src/core/store';
import moment from 'moment';
export const dictionaryStatus = {
	executed: {
		isCompleted: true,
		isError: false
	},
	error: {
		isError: true
	},
	queueRunning: {
		isCompleted: false
	}

}
const initialValues: any = {
	folderNumber: '',
	createdDateStart: null,
	createdDateEnd: null,
	status: '',
	requesterId: ''
}

export type RefType = {
	getValues: () => object | undefined; 
}

const Search: ForwardRefRenderFunction<RefType> = (props, ref) => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const formRef = useRef<FormikProps<any>>(null);
	
	useImperativeHandle(ref, () => ({
		getValues: () => {
			return formRef.current?.values
		}
	
	}), [formRef.current?.values])

	useEffect(() => {
		setTimeout(() => {
			const date = moment().add({
				days: -1
			}).format("YYYY-MM-DD")

			formRef.current?.setFieldValue("createdDateStart", date)
			dispatch(actions.provisionAccounting.setFilters({createdDateStart: date}));
		}, 1000)
	
	}, [])
	
	
	const onSubmit = useCallback((values: any, {setSubmitting}) => {
		let result = rejectNoValues({ ...values }) as any;
		if (result.status) {
			result= {...result, ...(dictionaryStatus as any)[result.status]}
			delete result.status
		}
		dispatch(actions.provisionAccounting.setFilters({...result}));
		setSubmitting(false)
	}, [dispatch])

	return (
		<Panel title='Filtro baixa definitiva' withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
				innerRef={formRef}
			>
				{({ handleSubmit, isSubmitting }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<TextField
									name="folderNumber"
									label={t("legalDocs:smartSwap.folderNumber")}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={"Data execução"}
											name="createdDateStart"
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											label={t("provisions:fields.to")}
											name="createdDateEnd"
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<UserField
									label={"Solicitante"}
									name='requesterId'
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={"Status"}
									name='status'
									options={[
										{value: "executed", label: "Executado"},
										{value: "error", label: "Erro"},
										{value: "queueRunning", label: "Fila/executando"},
									]}
								/>
							</Grid>

							<Grid item md={12} xs={12}>
								<Clean action='provisionAccounting' style={{marginTop: 8}}/>
								<Submit
									type="search"
									style={{float: "right"}}
									submitting={isSubmitting}
								/>
							</Grid>
							
						</Grid>
					</form>
				)
				}
			</Formik>
		</Panel>
	)
};

export default forwardRef(Search);
