import { Divider, Grid, Typography } from "@material-ui/core";
import { useFormikContext } from "formik";
import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useState } from "react";
import { CPFOrCNPJField, MaskField, SelectField, TextField } from "src/components/form";
import { LegalDocumentFormTypeEnum } from "src/core/models/legal-document-request";
import { useStatesAndCities } from "src/hooks/fetchLists";
import { useTranslation } from "src/locale/i18n";
import { TLegalDocForm } from "..";
import { cnpj as cnpjValidator } from "cpf-cnpj-validator";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyByCnpj } from "src/core/store/modules/legal-one/selectors";
import { createOrUpdateCompany, fetchCompanyByCnpj } from "src/core/store/modules/legal-one/thunks";
import { TAddress, TCompany } from "src/core/models/legal-one";
import Clean from "src/components/button/Clean";

export type CompanyHendler = {
	updateCompany: () => void;
}

type CompanyProps = {
	type: LegalDocumentFormTypeEnum.PrepositionLetter | LegalDocumentFormTypeEnum.Replacement
}

const CompanyComponent: ForwardRefRenderFunction<CompanyHendler, CompanyProps> = (props, ref) => {
	const { t } = useTranslation();
	const dispatch = useDispatch()
	const formik = useFormikContext<TLegalDocForm>()
	const [cnpj, setCnpj] = useState<string>()
	const company = useSelector(getCompanyByCnpj(cnpj))

	const {
		values
	} = formik

	useImperativeHandle(ref, () => ({
		updateCompany: () => {
			if (company) {
				const data: TCompany = {
					...company,
					name: values.inputs.company.name,
					addresses: company.addresses?.map(x => {
						const result: TAddress = {
							...x
						}

						if (x.isMainAddress) {
							result.addressLine1 = values.inputs.company.addressName
							result.addressNumber = values.inputs.company.addressNumber
							result.neighborhood = values.inputs.company.addressNeighborhood
							result.areaCode = values.inputs.company.addressPostalCode
							result.cityId = values.inputs.company.addressCityId
						}

						return result
					})
				}

				dispatch(createOrUpdateCompany(data))
			} else {
				dispatch(createOrUpdateCompany({
					name: values.inputs.company.name,
					identificationNumber: values.inputs.company.identificationNumber,
					addresses: [
						{
							addressLine1: values.inputs.company.addressName,
							addressNumber: values.inputs.company.addressNumber,
							neighborhood: values.inputs.company.addressNeighborhood,
							areaCode: values.inputs.company.addressPostalCode,
							cityId: values.inputs.company.addressCityId,
							isMainAddress: true
						}
					]
				}))
			}
		}
	}), [company, dispatch, values])

	const {
		values: {
			inputs: {
				company: {
					addressStateId,
					identificationNumber
				}
			}
		},
		setFieldValue
	} = formik;

	useEffect(() => {
		if (company) {
			setFieldValue("inputs.company.name", company.name)

			const address = company?.addresses?.find(x => x.isMainAddress)

			setFieldValue("inputs.company.addressName", address?.addressLine1)
			setFieldValue("inputs.company.addressNumber", address?.addressNumber)
			setFieldValue("inputs.company.addressNeighborhood", address?.neighborhood)
			setFieldValue("inputs.company.addressPostalCode", address?.areaCode)
			setFieldValue("inputs.company.addressStateId", address?.city?.stateId)
			setFieldValue("inputs.company.addressCityId", address?.city?.id)
		}
	}, [company, setFieldValue])

	const clearFields = () => {
			setFieldValue("inputs.company.addressName", "")
			setFieldValue("inputs.company.addressNumber", "")
			setFieldValue("inputs.company.addressNeighborhood", "")
			setFieldValue("inputs.company.addressPostalCode", "")
			setFieldValue("inputs.company.addressStateId", 0)
			setFieldValue("inputs.company.addressCityId", 0)
			setFieldValue("inputs.company.name", "")
			setFieldValue("inputs.company.identificationNumber", "")
	}
	
	useEffect(() => {
		if (cnpjValidator.isValid(identificationNumber)) {
			setCnpj(identificationNumber)
			dispatch(fetchCompanyByCnpj(identificationNumber))
		} else {
			setCnpj(undefined)
		}
	}, [dispatch, identificationNumber])

	const { citiesAsOptions, statesAsOptions } = useStatesAndCities(addressStateId);

	return (
		<>
			<Grid item md={12}>
				<Typography variant="h2" gutterBottom>
					{t("legalDocs:company.title")}
				</Typography>
				<Divider />
			</Grid>
			<Grid item md={3} xs={12}>
				<CPFOrCNPJField 
					label={t("legalDocs:company.cnpj")}
					name="inputs.company.identificationNumber"
					type="cnpj"
					required
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<TextField
					label={t("legalDocs:company.corporateName")}
					name="inputs.company.name"
					required
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<TextField
					label={t("legalDocs:company.address")}
					name="inputs.company.addressName"
					required
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<TextField
					label={t("legalDocs:company.number")}
					name="inputs.company.addressNumber"
					required
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<TextField
					label={t("legalDocs:company.district")}
					name="inputs.company.addressNeighborhood"
					required
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<SelectField
					label={t("legalDocs:company.state")}
					name="inputs.company.addressStateId"
					options={statesAsOptions}
					required
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<SelectField
					label={t("legalDocs:company.city")}
					name="inputs.company.addressCityId"
					options={citiesAsOptions}
					required
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<MaskField 
					label={t("legalDocs:company.cep")}
					name="inputs.company.addressPostalCode"
					type="cep"
					mask="99999-999"
					placeholder="Digite aqui"
					minLength={8}
					required
				/>
			</Grid>
			<Clean noResetForm onClick={clearFields}/>
		</>
	);
};

const Company = forwardRef(CompanyComponent)

export default Company;
