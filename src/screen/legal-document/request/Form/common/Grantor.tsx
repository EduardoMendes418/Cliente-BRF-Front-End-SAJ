import { Divider, Grid, Typography } from "@material-ui/core";
import { useFormikContext } from "formik";
import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CPFOrCNPJField, TextField } from "src/components/form";
import { getCompanyByCnpj } from "src/core/store/modules/legal-one/selectors";
import { useTranslation } from "src/locale/i18n";
import { LegalDocFormType } from "src/screen/settings/legal-documents/utils/constants";
import { TLegalDocForm } from "..";
import { cnpj as cnpjValidator } from "cpf-cnpj-validator";
import { createOrUpdateCompany, fetchCompanyByCnpj } from "src/core/store/modules/legal-one/thunks";
import { TCompany } from "src/core/models/legal-one";

export type GrantorHandler = {
	updateGrantor: () => void
}

type GrantorProps = {
	docType: LegalDocFormType.ELETRONIC_PROCURATION_LEGAL | LegalDocFormType.ELETRONIC_PROCURATION_OTHER_AREAS
}

const GrantorComponent: ForwardRefRenderFunction<GrantorHandler, GrantorProps> = (props, ref) => {
	const { t } = useTranslation();
	const dispatch = useDispatch()
	const formik = useFormikContext<TLegalDocForm>()
	const [cnpj, setCnpj] = useState<string>()
	const company = useSelector(getCompanyByCnpj(cnpj))

	const {
		values,
		setFieldValue
	} = formik;
	
	const type = props.docType === LegalDocFormType.ELETRONIC_PROCURATION_LEGAL
		? "eletronicProcurationLegal"
		: "eletronicProcurationOtherArea"

	useImperativeHandle(ref, () => ({
		updateGrantor: () => {
			if (company) {
				const data: TCompany = {
					...company,
					name: values[type]?.grantorName ?? ""
				}

				dispatch(createOrUpdateCompany(data))
			} else {
				dispatch(createOrUpdateCompany({
					name: values[type]?.grantorName ?? "",
					identificationNumber: values[type]?.grantorCNPJ
				}))
			}
		}
	}), [company, dispatch, type, values])

	const identificationNumber = values[type]?.grantorCNPJ

	useEffect(() => {
		if (company) {
			setFieldValue(`${type}.grantorName`, company.name)
		}
	}, [company, setFieldValue, type])
	
	useEffect(() => {
		if (cnpjValidator.isValid(identificationNumber ?? "")) {
			setCnpj(identificationNumber)
			dispatch(fetchCompanyByCnpj(identificationNumber ?? ""))
		} else {
			setCnpj(undefined)
		}
	}, [dispatch, identificationNumber])
	
	return (
		<>
			<Grid item md={12}>
				<Typography variant="h2" gutterBottom>
					{t("legalDocs:grantor.title")}
				</Typography>
				<Divider />
			</Grid>
			<Grid item md={3} xs={12}>
				<CPFOrCNPJField
					label={t("legalDocs:grantor.cnpj")}
					name={`${type}.grantorCNPJ`}
					type="cnpj"
					required
				/>
			</Grid>
			<Grid item md={3} xs={12}>
				<TextField
					label={t("legalDocs:grantor.company")}
					name={`${type}.grantorName`}
					required
				/>
			</Grid>
		</>
	);
};

const Grantor = forwardRef(GrantorComponent)

export default Grantor;
