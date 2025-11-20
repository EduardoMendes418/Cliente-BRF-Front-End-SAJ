import { Box, Grid } from "@material-ui/core";
import { IconButton } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { CPFOrCNPJField, MaskField, SelectField, TextField } from "src/components/form";
import { LegalDocumentPrepositionLetterParties, LegalDocumentPrepositionLetterPartyEnum } from "src/core/models/legal-document-request";
import { useStatesAndCities } from "src/hooks/fetchLists";
import { useTranslation } from "src/locale/i18n";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from "react-redux";
import { getIndividualByCpf } from "src/core/store/modules/legal-one/selectors";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { createOrUpdateIndividual, fetchIndividualsByCpf } from "src/core/store/modules/legal-one/thunks";
import { TAddress, TIndividual } from "src/core/models/legal-one";
import Clean from "src/components/button/Clean";

type NominatedFormProps = {
	onAdd: (data: LegalDocumentPrepositionLetterParties) => void;
	data?: LegalDocumentPrepositionLetterParties
}

const NominatedForm = (props: NominatedFormProps) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [cpf, setCpf] = useState<string>()
	const individual = useSelector(getIndividualByCpf(cpf))

	const formik = useFormik<LegalDocumentPrepositionLetterParties>({
		initialValues: {
			name: "",
			identificationNumber: "",
			addressName: "",
			addressNumber: "",
			addressNeighborhood: "",
			addressCityId: 0,
			addressStateId: 0,
			addressPostalCode: "",
			registryIdentification: "",
			identifier: "",
			role: "",
			partyType: LegalDocumentPrepositionLetterPartyEnum.Individual
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
			setSubmitting(false)
			props.onAdd(values)

			if (individual) {
				const data: TIndividual = {
					...individual,
					name: values.name,
					addresses: individual.addresses?.map(x => {
						const result: TAddress = {
							...x
						}

						if (x.isMainAddress) {
							result.addressLine1 = values.addressName
							result.addressNumber = values.addressNumber
							result.neighborhood = values.addressNeighborhood
							result.areaCode = values.addressPostalCode
							result.cityId = values.addressCityId
						}

						return result
					})
				}

				dispatch(createOrUpdateIndividual(data))
			} else {
				dispatch(createOrUpdateIndividual({
					name: values.name,
					identificationNumber: values.identificationNumber,
					addresses: [
						{
							addressLine1: values.addressName,
							addressNumber: values.addressNumber,
							neighborhood: values.addressNeighborhood,
							areaCode: values.addressPostalCode,
							cityId: values.addressCityId,
							isMainAddress: true
						}
					]
				}))
			}

			resetForm()
		}
	})

	const { addressStateId } = formik.values

	const { citiesAsOptions, statesAsOptions } = useStatesAndCities(addressStateId);

	const { setFieldValue, setValues } = formik

	const { identificationNumber } = formik.values

	useEffect(() => {
		if (individual) {
			setFieldValue("name", individual.name)

			const address = individual?.addresses?.find(x => x.isMainAddress)

			setFieldValue("addressName", address?.addressLine1)
			setFieldValue("addressNumber", address?.addressNumber)
			setFieldValue("addressNeighborhood", address?.neighborhood)
			setFieldValue("addressPostalCode", address?.areaCode)
			setFieldValue("addressStateId", address?.city?.stateId)
			setFieldValue("addressCityId", address?.city?.id)

			setFieldValue("registryIdentification", individual.user?.usersAdditionalInformation.rg)
			setFieldValue("identifier", individual.contact?.contributorId)
			setFieldValue("role", individual.user?.usersAdditionalInformation.office)
		} else {
			setFieldValue("name", "")
			setFieldValue("addressName", "")
			setFieldValue("addressNumber", "")
			setFieldValue("addressNeighborhood", "")
			setFieldValue("addressPostalCode", "")
			setFieldValue("addressStateId", "")
			setFieldValue("addressCityId", "")
			setFieldValue("registryIdentification", "")
			setFieldValue("identifier", "")
			setFieldValue("role", "")
		}
	}, [individual, setFieldValue])
	

	useEffect(() => {
		if (cpfValidator.isValid(identificationNumber)) {
			setCpf(identificationNumber)
			dispatch(fetchIndividualsByCpf(identificationNumber))
		} else {
			setCpf(undefined)
		}
	}, [dispatch, identificationNumber])


	useEffect(() => {
		if (props.data) {
			setValues(props.data)
		}
	}, [props.data, setValues])

	return (
		<FormikProvider value={formik}>
			<Form>
				<Box padding={3}>
					<Grid container spacing={3}>
						<Grid item md={3} xs={12}>
							<CPFOrCNPJField
								label={t("legalDocs:nominated.cpf")}
								name="identificationNumber"
								type="cpf"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:nominated.rg")}
								name="registryIdentification"
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:nominated.name")}
								name="name"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:nominated.initials")}
								name="identifier"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:nominated.office")}
								name="role"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:nominated.address")}
								name="addressName"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:nominated.number")}
								name="addressNumber"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:nominated.district")}
								name="addressNeighborhood"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<SelectField
								label={t("legalDocs:nominated.state")}
								name="addressStateId"
								options={statesAsOptions}
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<SelectField
								label={t("legalDocs:nominated.city")}
								name="addressCityId"
								options={citiesAsOptions}
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<MaskField
								label={t("legalDocs:nominated.cep")}
								name="addressPostalCode"
								type="cep"
								mask="99999-999"
								minLength={9}
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
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
				<Clean/>
				</Box>
			</Form>
		</FormikProvider>
	)
}

export default NominatedForm;