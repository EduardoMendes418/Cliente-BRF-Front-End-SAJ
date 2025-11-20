import { Box, Grid } from "@material-ui/core";
import { IconButton } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { CPFOrCNPJField, RadioGroup, SelectField, TextField } from "src/components/form";
import { LegalDocumentEletronicProcurationLegalGranteds, PersonTypeEnum } from "src/core/models/legal-document-request";
import { useTranslation } from "src/locale/i18n";
import AddIcon from "@material-ui/icons/Add";
import { usePersonTypes } from "src/screen/legal-document/request/hooks/personType";
import { useEffect, useState } from "react";
import { cpf as cpfValidator, cnpj as cnpjValidator } from "cpf-cnpj-validator";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyByCnpj, getIndividualByCpf } from "src/core/store/modules/legal-one/selectors";
import { createOrUpdateCompany, createOrUpdateIndividual, fetchCompanyByCnpj, fetchIndividualsByCpf } from "src/core/store/modules/legal-one/thunks";
import { TCompany, TIndividual } from "src/core/models/legal-one";

type BestowedFormProps = {
	onAdd: (data: LegalDocumentEletronicProcurationLegalGranteds) => void;
	data?: LegalDocumentEletronicProcurationLegalGranteds
}

const BestowedForm = (props: BestowedFormProps) => {
	const { t } = useTranslation()
	const dispatch = useDispatch();
	const [cpf, setCpf] = useState<string>()
	const [cnpj, setCnpj] = useState<string>()
	const individual = useSelector(getIndividualByCpf(cpf))
	const company = useSelector(getCompanyByCnpj(cnpj))

	const { personsAsOption } = usePersonTypes()

	const formik = useFormik<LegalDocumentEletronicProcurationLegalGranteds>({
		initialValues: {
			employeeBRF: true,
			identificationNumber: "",
			name: "",
			partnerOfficeName: "",
			personType: PersonTypeEnum.Legal
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
			setSubmitting(false)
			props.onAdd(values)
			
			if (values.personType === PersonTypeEnum.Legal) {
				if (company) {
					const data: TCompany = {
						...company,
						name: values.name
					}

					dispatch(createOrUpdateCompany(data))
				} else {
					dispatch(createOrUpdateCompany({
						name: values.name,
						identificationNumber: values.identificationNumber
					}))
				}
			} else if (values.personType === PersonTypeEnum.Phisical) {
				if (individual) {
					const data: TIndividual = {
						...individual,
						name: values.name
					}

					dispatch(createOrUpdateIndividual(data))
				} else {
					dispatch(createOrUpdateIndividual({
						name: values.name,
						identificationNumber: values.identificationNumber
					}))
				}
			}

			resetForm()
		}
	})

	const {
		values: {
			identificationNumber,
			personType
		},
		setFieldValue,
		setValues
	} = formik

	useEffect(() => {
		if (personType === PersonTypeEnum.Phisical && individual) {
			setFieldValue("name", individual.name)
		} else if (personType === PersonTypeEnum.Legal && company) {
			setFieldValue("name", company.name)
		} else {
			setFieldValue("name", "")
		}
	}, [company, individual, personType, setFieldValue])

	useEffect(() => {
		if (personType === PersonTypeEnum.Phisical && cpfValidator.isValid(identificationNumber)) {
			setCpf(identificationNumber)
			dispatch(fetchIndividualsByCpf(identificationNumber))
			setCnpj(undefined)
		} else if (personType === PersonTypeEnum.Legal && cnpjValidator.isValid(identificationNumber)) {
			setCnpj(identificationNumber)
			dispatch(fetchCompanyByCnpj(identificationNumber))
			setCpf(undefined)
		} else {
			setCpf(undefined)
			setCnpj(undefined)
		}
	}, [dispatch, identificationNumber, personType])

	useEffect(() => {
		if (props.data) {
			setValues(props.data)
		}
	}, [props.data, setValues])

	return (
		<FormikProvider value={formik}>
			<Form noValidate>
				<Box padding={3}>
					<Grid container spacing={3}>
						<Grid item md={3} xs={12}>
							<SelectField
								label={t("legalDocs:bestowed.kindOfPerson.title")}
								options={personsAsOption}
								name="personType"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<CPFOrCNPJField
								label={t("legalDocs:bestowed.cpfCnpj")}
								name="identificationNumber"
								type={personType === PersonTypeEnum.Phisical ? "cpf" : "cnpj"}
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:bestowed.name")}
								name="name"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<RadioGroup
								label={t("legalDocs:bestowed.brfEmployee")}
								name="employeeBRF"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:bestowed.nameOffice")}
								name="partnerOfficeName"
							/>
						</Grid>
						<Grid item md={9} xs={12}>
							<Box display="flex" justifyContent="flex-end">
								<IconButton
									color="primary"
									type="submit"
								>
									<AddIcon />
								</IconButton>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Form>
		</FormikProvider>
	)
}

export default BestowedForm;