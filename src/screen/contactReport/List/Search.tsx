import { useSelector, useDispatch } from "react-redux";
import { Grid, Box } from "@material-ui/core";
import { Formik } from "formik";
import { useState } from "react";

import Panel from "src/components/Panel";
import { CPFOrCNPJField, DateField, SelectField, TextField } from "src/components/form";
import { Clean, Submit } from "src/components/button";
import { useTranslation } from "src/locale/i18n";
import { fetchContactByFilterList } from "src/core/store/modules/contact/thunks";
import {
	contactTypeAsOptions,
	getFilterContact,
} from "src/core/store/modules/contact/selectors";
import { rejectNoValues } from "src/core/utils/func";
import { usePagination } from "src/hooks/pagination";
import CustomFieldsButton from "src/screen/reports/components/CustomFieldsButton";
import { useReport } from "src/screen/reports/hooks/useReport";
import { useCustomFieldModal } from "src/screen/reports/hooks/useModal";
import { TReportComponent } from "src/core/models/reports";
import { CONTACT_SEARCH, CONTACT_TYPE } from "src/core/utils/constants";
import ContactField from "src/components/ContactField";

const Search = ({ pathname }: { pathname: string }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const savedFilters = useSelector(getFilterContact);
	const contactTypeOptions = useSelector(contactTypeAsOptions);
	const { pageSize, page } = usePagination();
	const { showModal } = useCustomFieldModal();
	const [eventCode, setEventCode] = useState<number | null>(null);

	const handleCleanAndSearch = (resetForm: any) => {
		resetForm();
		dispatch(fetchContactByFilterList({ pageSize, page }));
	};

	const onSubmit = async (values: any, { setSubmitting }: any) => {
		setSubmitting(true);
		const result = rejectNoValues({ pageSize, page, ...values }) as any;
		await dispatch(fetchContactByFilterList(result) as any);
		setSubmitting(false);
	};

	const initialValues = {
		type: "",
		name: "",
		identificationNumber: "",
		email: "",
		...(savedFilters[pathname] ?? {}),
	} as any;

	const { customFields, setCustomFields, customFieldsDictionary } = useReport({
		initialValues,
		reportComponent:
			eventCode === null || eventCode === 1
				? TReportComponent.S204
				: TReportComponent.S204,
		getReportConfiguration: true,
	});

	const openCustomFieldModal = () => {
		showModal({
			filterTypeName: "Filtro Principal",
			onSubmitModal: setCustomFields,
			options: customFieldsDictionary,
			customFields: customFields,
		});
	};

	return (
		<Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
			{({ handleSubmit, isSubmitting, resetForm }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Panel title={t("contacts:contactReport")} withPadding>
						<Grid container spacing={2}>
							<Grid item md={3} xs={12}>
								<ContactField
									name="type"
									label={t("contacts:search.contactType")}
									contactType={CONTACT_TYPE.COMPANY}
									contactSearch={CONTACT_SEARCH.InternalLawyer}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									name="name"
									label={t("contacts:search.nameOrCompanyName")}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<CPFOrCNPJField
									name="identificationNumber"
									label={t("contacts:search.cpfCnpj")}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									name="email"
									label={t("contacts:search.email")}
									type="email"
								/>
							</Grid>
								<Grid item xs={12} md={6}>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<DateField
											label={t("contacts:search.contactReportDate")}
											name="createdDateBegin"
										/>
									</Grid>
									<Grid item xs={6}>
										<DateField
											label={t("contacts:search.contactReportEndDate")}
											name="createdDateEnd"
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12}>
								<CustomFieldsButton
									marginTop={0}
									onClick={openCustomFieldModal}
								/>
							</Grid>
						</Grid>
					</Panel>

					<Box
						display="flex"
						justifyContent="flex-end"
						alignItems="center"
						mt={2}
					>
						<Clean onClick={() => handleCleanAndSearch(resetForm)} />
						<Submit
							style={{ marginLeft: "30px" }}
							text={"Gerar relatório"}
							submitting={isSubmitting}
						/>
					</Box>
				</form>
			)}
		</Formik>
	);
};

export default Search;
