import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import FileSaver from 'file-saver';

import Form, { CurrencyField, DateField, SelectField, TextField } from 'src/components/form';
import { Clean, Submit } from 'src/components/button';
import Attachments from 'src/components/Attachments';

import { convertToBlob, convertToBlobCSV, valuesToNumber } from 'src/core/utils/func';

import { useTranslation } from 'src/locale/i18n';
import { getDataImportStatus } from 'src/core/store/modules/data-import/selectors';
import { generatePaymentSheetsCsv } from 'src/core/store/modules/data-import/thunk';
import { AppDispatch } from 'src/core/store';
import { Props } from './types';
import Panel from 'src/components/Panel';
import { useBanks, useGroupedAreas, usePaymentMethod } from 'src/hooks/fetchLists';
import { useStatusProcessOptions } from 'src/hooks/useProcessFilterOptions';
import { getListAsOptionPaymentType } from 'src/core/store/modules/payment-type/selectors';
import { fetchPaymentType } from 'src/core/store/modules/payment-type/thunks';
import { Modulos } from 'src/core/models/modules';
import { fetchPaymentMethod } from 'src/core/store/modules/payment-method/thunks';
import GroupedSelectFiledMultiple from 'src/components/GroupedSelectMultiple';
import { useHistory } from 'react-router-dom';
import { statusTextFilter } from 'src/screen/payment/request/List/Search';

const useStyles = makeStyles((theme) => ({
	button: {
		marginLeft: theme.spacing(2),
	},
}));

const validate = ({ ids }: any) => {
			if (ids === "" || !!ids.match(/^\d+(?:;?\d+)*$/))
			return {};
			return { ids: "A pesquisa deve seguir o padrão de ID's separados por ponto-e-vírgula"};
		};
		

const FormImportPaymentAttachments = ({ onSubmit, fileName, labelFormFile, labelFileAttachments, setIsImportScreen }: Props) => {
	const classes = useStyles();
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation();
	const history = useHistory();

	const [loading, setLoading] = useState(false);
	const status = useSelector(getDataImportStatus);
	const { groupedAreasAsOptions } = useGroupedAreas();
	const statusOptions = useStatusProcessOptions();
	const { banksAsOptions } = useBanks();
	const paymentTypeOptions = useSelector(getListAsOptionPaymentType);
	const { paymentMethodAsOptions } = usePaymentMethod(Modulos.Pagamento);

	const initialValues: any = {
		formFile: [],
		formFileAnexos: [],
		OriginAreaIds: [],
		LegalDepartmentAreas: [],
		FolderNumber: '',
		FolderStatusIds: [],
		SolicitationDateStart: null,
		SolicitationDateEnd: null,
		DueDateStart: null,
		DueDateEnd: null,
		ReceiptDateStart: null,
		ReceiptDateEnd: null,
		SapEntryDateStart: null,
		SapEntryDateEnd: null,
		CalculationPeriodStart: null,
		CalculationPeriodEnd: null,
		PaymentTypeIds: [],
		PaymentMethodIds: [],
		BankIds: [],
		JudicialPaymentValueStart: '',
		JudicialPaymentValueEnd: '',
		statusFlowId: [],
		statusApprovalId: [],
		ids: ""
	} 

	useEffect(() => {
		dispatch(fetchPaymentType({ modulo: Modulos.Pagamento }));
		dispatch(fetchPaymentMethod({ moduloId: Modulos.Pagamento }))
	}, [dispatch]);

	const generateTemplateFile = useCallback(async (values: any) => {
		setLoading(true);
		const filters = valuesToNumber<any>(
            ["JudicialPaymentValueStart", "JudicialPaymentValueEnd"],
            values
        );
		
		if(values.JudicialPaymentValueEnd === "") delete filters.JudicialPaymentValueEnd
		if(values.JudicialPaymentValueStart === "") delete filters.JudicialPaymentValueStart
		const { payload } = await dispatch(generatePaymentSheetsCsv(filters));
		FileSaver.saveAs(convertToBlob(payload), 'ficha_de_pagamentos_template.xlsx')

		setLoading(false);

	}, [dispatch])

	return (
		<Form
			initialValues={initialValues}
			onSubmit={onSubmit}
			permission
			validate={validate}
		>
			{({ handleSubmit, values }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Panel title={"Filtros de pagamentos"} withPadding>
					<Grid container spacing={3}>
					<Grid item xs={12} md={3}>
						<GroupedSelectFiledMultiple
							multiple
							label={t("provisions:fields.originArea")}
							name="OriginAreaIds"
							options={groupedAreasAsOptions}
						/>
						</Grid>
						<Grid item xs={12} md={3}>
							<GroupedSelectFiledMultiple
								multiple
								label={t("provisions:fields.areaDejur")}
								name="LegalDepartmentAreas"
								options={groupedAreasAsOptions}
							/>
						</Grid>
							<Grid item xs={12} md={3}>
								<TextField
									name="FolderNumber"
									label={t('field.ctgFolder')}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									options={statusOptions}
									label={t('dataImport:documents.form.folderStatus')}
									name='FolderStatusIds'
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={"Data solicitação (de)"}
											name="SolicitationDateStart"
										/>
								</Grid>
								<Grid item xs={6} md={6}>
										<DateField
											label={"Até"}
											name="SolicitationDateEnd"
										/>
								</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={"Data do pagamento (de)"}
											name="DueDateStart"
										/>
								</Grid>
								<Grid item xs={6} md={6}>
										<DateField
											label={"Até"}
											name="DueDateEnd"
										/>
								</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={"Data comprovante (de)"}
											name="ReceiptDateStart"
										/>
								</Grid>
								<Grid item xs={6} md={6}>
										<DateField
											label={"Até"}
											name="ReceiptDateEnd"
										/>
								</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={"Data lançamento SAP (de)"}
											name="SapEntryDateStart"
										/>
								</Grid>
								<Grid item xs={6} md={6}>
										<DateField
											label={"Até"}
											name="SapEntryDateEnd"
										/>
								</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											label={"Período de apuração (de)"}
											name="CalculationPeriodStart"
											views={['year', 'month']}
											provisionReport={true}
											format="MM-YYYY"
										/>
								</Grid>
								<Grid item xs={6} md={6}>
										<DateField
											label={"Até"}
											name="CalculationPeriodEnd"
											views={['year', 'month']}
											provisionReport={true}
											format="MM-YYYY"
										/>
								</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									multiple
									label={"Tipo de pagamento"}
									name="PaymentTypeIds"
									options={paymentTypeOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									multiple
									label={"Forma de pagamento"}
									name="PaymentMethodIds"
									options={paymentMethodAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									multiple
									label={"Banco"}
									name="BankIds"
									options={banksAsOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<CurrencyField
											label={"Valor pagto. judicial (de)"}
											name="JudicialPaymentValueStart"
										/>
								</Grid>
								<Grid item xs={6} md={6}>
										<CurrencyField
											label={"Até"}
											name="JudicialPaymentValueEnd"
										/>
								</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={"Status da solicitação"}
									name="statusFlowId"
									options={statusTextFilter}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									name='statusApprovalId'
									label={t('creditReceipt:form.statusApprovalId')}
									options={[
										{ label: "Aprovado", value: 1 },
										{ label: "Reprovado", value: 0 },
										{ label: "Pendente", value: -1 },
									]}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<TextField
									name="ids"
									label={"Id"}
									helperText={t("dataImport:goodsAndGuarantees.search.idHelperText")}
								/>
							</Grid>
							<Grid item md={6} xs={6}>
								<Clean/>
							</Grid>
					</Grid>
					</Panel>
					<Attachments
						name='formFile'
						id='formFile'
						multiple={false}
						accept='.xlsx'
						label={labelFormFile}
					/>
					<Attachments
						name='formFileAnexos'
						id='formFileAnexos'
						label={labelFileAttachments}
					/>
					<Box display='flex' justifyContent='flex-end' className='margin-top-16'>
						{setIsImportScreen !== undefined && <Button
							variant='outlined'
							style={{ marginRight: "16px" }}
							onClick={() => setIsImportScreen(false)}
						>
							{t("dataImport:goBack")}
						</Button>}
						<Submit
							text={t('dataImport:common.importSpreadsheet')}
							disabled={!values.formFile.length}
							submitting={status === 'saving'}
						/>
						{fileName !== undefined && (
							<Button
								disabled={loading}
								className={classes.button}
								color='primary'
								variant='contained'
								onClick={() => generateTemplateFile(values)}
							>
								{t('dataImport:common.generateSpreadsheet')}
							</Button>
						)}
					</Box>
				</form>
			)}
		</Form>
	);
};

export default FormImportPaymentAttachments;