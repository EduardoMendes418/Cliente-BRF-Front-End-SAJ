import { Box, Grid, IconButton } from "@material-ui/core";
import { Form, FormikProvider, useFormik } from "formik";
import { CPFOrCNPJField, MaskField, SelectField, TextField } from "src/components/form";
import { LegalDocumentPrepositionReplacementParties, LegalDocumentPrepositionReplacementPartyEnum } from "src/core/models/legal-document-request";
import { useStatesAndCities } from "src/hooks/fetchLists";
import { useTranslation } from "src/locale/i18n";
import AddIcon from "@material-ui/icons/Add";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndividualByCpf } from "src/core/store/modules/legal-one/selectors";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { createOrUpdateIndividual, fetchIndividualsByCpf } from "src/core/store/modules/legal-one/thunks";
import { TAddress, TIndividual } from "src/core/models/legal-one";
import { Clean } from "src/components/button";

type CorrespondentsFormProps = {
	onAdd: (data: LegalDocumentPrepositionReplacementParties) => void;
	data?: LegalDocumentPrepositionReplacementParties
}

const CorrespondentsForm = (props: CorrespondentsFormProps) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [cpf, setCpf] = useState<string>()
	const individual = useSelector(getIndividualByCpf(cpf))

	const formik = useFormik<LegalDocumentPrepositionReplacementParties>({
		initialValues: {
			registryIdentification: "",
			addressCityId: 0,
			identificationNumber: "",
			oabState: "",
			name: "",
			officeName: "",
			officeOAB: "",
			addressName: "",
			addressNumber: "",
			addressNeighborhood: "",
			addressPostalCode: "",
			addressStateId: 0,
			partyType: LegalDocumentPrepositionReplacementPartyEnum.Correspondents
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

	const {
		values: {
			addressStateId,
			identificationNumber
		},
		setFieldValue,
		setValues
	} = formik

	const { citiesAsOptions, statesAsOptions } = useStatesAndCities(addressStateId);

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
			
			setFieldValue("officeOAB", individual.user?.usersAdditionalInformation.oab)
			setFieldValue("registryIdentification", individual.user?.usersAdditionalInformation.rg)
			setFieldValue("officeName", individual.user?.usersAdditionalInformation.officeName)
		} else {
			setFieldValue("name", "")
			setFieldValue("addressName", "")
			setFieldValue("addressNumber", "")
			setFieldValue("addressNeighborhood", "")
			setFieldValue("addressPostalCode", "")
			setFieldValue("addressStateId", "")
			setFieldValue("addressCityId", "")
			setFieldValue("officeOAB", "")
			setFieldValue("registryIdentification", "")
			setFieldValue("officeName", "")
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
			<Form noValidate>
				<Box padding={3}>
					<Grid container spacing={3}>
						<Grid item md={3} xs={12}>
							<CPFOrCNPJField
								label={t("legalDocs:substabelecimento.cpf")}
								name="identificationNumber"
								type="cpf"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:substabelecimento.rg")}
								name="registryIdentification"
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:substabelecimento.oab")}
								name="oabState"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:substabelecimento.name")}
								name="name"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:substabelecimento.corporateName")}
								name="officeName"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:substabelecimento.oabNumber")}
								name="officeOAB"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:substabelecimento.address")}
								name="addressName"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:substabelecimento.number")}
								name="addressNumber"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label={t("legalDocs:substabelecimento.district")}
								name="addressNeighborhood"
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<SelectField
								label={t("legalDocs:substabelecimento.state")}
								name="addressStateId"
								options={statesAsOptions}
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<SelectField
								label={t("legalDocs:substabelecimento.city")}
								name="addressCityId"
								options={citiesAsOptions}
								required
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<MaskField
								label={t("legalDocs:substabelecimento.cep")}
								name="addressPostalCode"
								type="cep"
								mask="99999-999"
								minLength={8}
								required
							/>
						</Grid>
						<Grid item md={12} xs={12}>
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

export default CorrespondentsForm;