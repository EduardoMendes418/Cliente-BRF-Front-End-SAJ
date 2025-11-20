import { Grid } from "@material-ui/core";
import { useFormikContext } from "formik";
import { ChangeEvent, useEffect, useMemo } from "react";

import { CheckboxesAutocompleteField, DateHourField, FormikContext, RadioGroup, SelectField, TextField, CostCenterField,
	CPFOrCNPJField,
	CurrencyField,
	DateField, } from "src/components/form";
import FieldColumn from "src/components/FieldColumn";
import Panel from "src/components/Panel";

import { TRequisitionService } from "src/core/models/requisitions";
import { useTranslation } from "src/locale/i18n";

import { STATUS, statusTextAsOptionsTreatment } from "../constants";

import uniqBy from "lodash/uniqBy";
import { useUsersActives } from "src/hooks/fetchLists";
import { fetchGrouperCostCenters } from "src/core/store/modules/report-options/thunks";
import { useDispatch, useSelector } from "react-redux";
import { getGrouperCostCenters } from "src/core/store/modules/report-options/selectors";

const ServiceRequestForm = ({ item, readOnly = false, serviceName, 	editOrCreate,
}: { item: TRequisitionService, readOnly?: boolean, serviceName?: string, hasSaved?: boolean, 	editOrCreate?:any
 }) => {

	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { setFieldValue, status, initialValues, values } = useFormikContext<FormikContext>();
	const grouperCostCenters = useSelector(getGrouperCostCenters);
	const isValid =
		item.logs?.filter((x: { statusFlowId: number }) => x.statusFlowId === 3)[0]
			?.observation === item.observation;

	const {
		usersActivesAsOptionsByEmail
	} = useUsersActives();

	const onChangeStatus = (event: ChangeEvent<HTMLInputElement>) => {
		const finished = [
			STATUS.APPROVED_DEFINITIVE,
			STATUS.REJECTED_DEFINITIVE,
			STATUS.CANCELLED
		].includes(Number(event.target.value))

		setFieldValue('conclusionDate', finished ? new Date() : null)
	}

	const emailOptions = useMemo(
		() => uniqBy(usersActivesAsOptionsByEmail, "value"),
		[usersActivesAsOptionsByEmail]
	);

	useEffect(() => {
		dispatch(fetchGrouperCostCenters());
	}, [])

	useEffect(() => {
		if(typeof item?.sapActiveCostCenter  === "number"){
			setFieldValue("sapActiveCostCenter", item?.sapActiveCostCenter);
		} 
		if(item?.complainant === true){
			setFieldValue("complainant", item?.complainant);
			setFieldValue("cpf", item?.cpf);
			setFieldValue("dateOfBirth", item?.dateOfBirth);
			setFieldValue("dateOfAdmission", item?.dateOfAdmission);
			setFieldValue("dateOfDismissal", item?.dateOfDismissal);
			setFieldValue("position", item?.position);
			setFieldValue("salary", item?.salary);
			setFieldValue("ctpsNumber", item?.ctpsNumber);
			setFieldValue("seriesNumber", item?.seriesNumber);
			setFieldValue("pisPasep", item?.pisPasep);
		}
	}, []) 

	useEffect(() => {
		if(status !== 'readOnly' && item.complainant !== true){
			setFieldValue("complainant", false );
		}
		if(status !== 'readOnly' && item.requestParameter.processComplement === true){
			setFieldValue("isAttachmentLegalOne", true);
		}
	}, [])

	return (
		<Panel title={t('requisitions:service.title')} withPadding>
			<Grid container spacing={3}>
				<Grid item md={3} xs={12}>
					{serviceName !== undefined ? (
						<FieldColumn
							label={t('requisitions:form.responsibleName')}
							value={serviceName}
						/>) : (
						<TextField
							label={t('requisitions:form.responsibleName')}
							name='serviceUserName'
							readOnly />)}
				</Grid>
				<Grid item md={3} xs={12}>
					<DateHourField
						label={t('requisitions:service.conclusionDate')}
						name='conclusionDate'
						noSecond
						readOnly
					/>
				</Grid>
				<Grid item md={3} xs={12}>
					<SelectField
						name='status'
						label={t('status')}
						options={statusTextAsOptionsTreatment}
						onChange={onChangeStatus}
						readOnly={readOnly || status === "readOnly" || editOrCreate}
					/>
				</Grid>
				{item.requestParameter.processComplement && (
					<>
						<Grid item xs={6} md={6}>
							<SelectField
								label={t("requisitions:service.sapActiveCostCenter")}
								name="sapActiveCostCenter"
								options={grouperCostCenters.map(item => ({ label: item.name, value: item.id }))}
								required={values?.complainant}
								readOnly={editOrCreate}
							/>
							{	editOrCreate === false ?
								<p style={{ marginTop: "8px", color: 'red' }}>
								{t("requisitions:service.sapActiveCostCenterDescription")}
							</p> : null
							}
							
						</Grid>

						<Grid item md={12} xs={3}>
							<RadioGroup
								label={t("requisitions:service.complainant")}
								name="complainant"
								required
								readOnly={editOrCreate}
							/>
						</Grid>
						{values.complainant && (
							<>
								<Grid item xs={6} md={6}>
									<CPFOrCNPJField 
										label={t("integrations:request.form.cpf")}
										name="cpf"
										type="cpf"
										/* required */
										readOnly={editOrCreate}
									/>
								</Grid>
								<Grid item md={3} xs={3}>
									<DateField
										label={t("requisitions:service.dateOfBirth")}
										name="dateOfBirth"
										format="DD/MM/YYYY"
										placeholder="Selecione a data"
										/* required */
										readOnly={editOrCreate}
										// readOnly
									/>
								</Grid>
								<Grid item md={3} xs={3}>
									<DateField
										label={t("requisitions:service.dateOfAdmission")}
										name="dateOfAdmission"
										format="DD/MM/YYYY"
										placeholder="Selecione a data"
										/* required */
										readOnly={editOrCreate}
										// readOnly
									/>
								</Grid>
								<Grid item md={3} xs={3}>
									<DateField
										label={t("requisitions:service.dateOfDismissal")}
										name="dateOfDismissal"
										format="DD/MM/YYYY"
										placeholder="Selecione a data"
										/* required */
										readOnly={editOrCreate}
										// readOnly
									/>
								</Grid>
								<Grid item md={3} xs={3}>
									<TextField
										label={t("requisitions:service.position")}
										name="position"
										type="text"
										maxLength={200}
										/* required */
										readOnly={editOrCreate}
										// readOnly
									/>
								</Grid>
								<Grid item md={3} xs={3}>
									<CurrencyField
										label={t("requisitions:service.salary")}
										name="salary"
										/* required */
										readOnly={editOrCreate}
										min={values.complainant === true ? 0.01 : 0.00}
										// readOnly
									/>
								</Grid>
								<Grid item md={3} xs={3}>
									<TextField
										label={t("requisitions:service.ctpsNumber")}
										name="ctpsNumber"
										maxLength={10}
										/* required */
										readOnly={editOrCreate}
										// readOnly
									/>
								</Grid>
								<Grid item md={3} xs={3}>
									<TextField
										label={t("requisitions:service.seriesNumber")}
										name="seriesNumber"
										type="text"
										maxLength={6}
										/* required */
										readOnly={editOrCreate}
										// readOnly
									/>
								</Grid>
								<Grid item md={3} xs={3}>
									<TextField
										label={t("requisitions:service.pisPasep")}
										name="pisPasep"
										type="text"
										maxLength={20}
										/* required */
										readOnly={editOrCreate}
										// readOnly
									/>
								</Grid>
							</>
						)}
						
					</>
					
				)}
				<Grid item md={12} xs={12} />
				<Grid item md={6} xs={6}>
					<TextField
						name={`${isValid === true ? 'sigthObservation' : 'observation'}`}
						label={t('requisitions:service.observation')}
						placeholder={t('form.typeHere')}
						rows={3}
						maxLength={1000}
						readOnly={readOnly || status === "readOnly" || editOrCreate}
						multiline
					/>
				</Grid>
				<Grid item md={6} xs={12} />
				<Grid item md={12} xs={12}>
					<RadioGroup
						name='isAttachmentLegalOne'
						label={t('requisitions:service.isAttachmentLegalOne')}
						readOnly={readOnly || status === "readOnly" || editOrCreate || (status !== 'readOnly' && item.requestParameter.processComplement === true)}
					/>
				</Grid>
				<Grid item md={6} xs={12}>
					{
						readOnly || status === 'readOnly' === true ?
							<FieldColumn
								label={t("requisitions:form.emailsWithInternalCopies")}
								value={item?.emailsWithInternalCopies?.replaceAll(
									";",
									", "
								)}
											
							/>
						:	
							<CheckboxesAutocompleteField
								options={emailOptions}
								label={t("requisitions:form.emailsWithInternalCopies")}
								name="emailsWithInternalCopiesMultiple"
								readOnly={editOrCreate}
							/>			
					}
				</Grid>
			</Grid>
		</Panel>
	)
}

export default ServiceRequestForm;