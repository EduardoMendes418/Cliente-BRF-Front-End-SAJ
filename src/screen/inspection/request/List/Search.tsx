import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { Formik } from "formik";

import Panel from "src/components/Panel";
import {
    ContactsAutocompleteField,
    CurrencyField,
    DateField,
    NumericField,
    SelectField,
} from "src/components/form";
import { Clean, Submit } from "src/components/button";
import ContactField from "src/components/ContactField";
import { TPaymentInspectionRequestFilters } from "src/core/models/inspection";

import { useTranslation } from "src/locale/i18n";
import { usePagination } from "src/hooks/pagination";
import { rejectNoValues, stringToCpforCnpj, valuesToNumber } from "src/core/utils/func";
import { actions } from "src/core/store";
import { getFiltersPayment } from "src/core/store/modules/inspection/selectors";
import {
    useAreasDEJUR,
    useAreasWitchGroups,
    useGroupedAreas,
} from "src/hooks/fetchLists";
import { CONTACT_SEARCH, CONTACT_TYPE, statusTextFilter } from "src/core/utils/constants";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

const Search = ({ pathname }: { pathname: string }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { pageSize } = usePagination();
    const { areas } = useAreasDEJUR();
    const { groupedAreasAsOptions} = useGroupedAreas();

    const savedFilters = useSelector(getFiltersPayment);

    const onSubmit = async (
        values: TPaymentInspectionRequestFilters & {
            legalDepartmentAreaId: string;
            cnpj: string
        },
        { setSubmitting }: any
    ) => {

        values.cnpj.trim();

        const filters = {
			...(valuesToNumber(
				[
					"valorTotalGuia",
                    "id"
				],
				values
			) as TPaymentInspectionRequestFilters)}  

        const cpfCnpj = await stringToCpforCnpj(values.cnpj.trim())


        if (values.legalDepartmentAreaId) {
            filters.legalDepartmentArea =
                areas.find(
                    ({ id }) => id === Number(values.legalDepartmentAreaId)
                )?.path ?? "";
        }

        if(filters.valorTotalGuia === 0){
            filters.valorTotalGuia = null;
        }
        if(filters.id === 0){
            filters.id = null;
        }
    
        const result = rejectNoValues({ ...filters, cnpj: cpfCnpj, page: 1, pageSize });

        dispatch(
            actions.inspection.setFilters({ filters: result, page: pathname })
        );
        setSubmitting(false);
    };

    const initialValues = {
		id: null,
		folderNumber: "",
		status: "",
		dataSolicitacao: null,
		legalDepartmentAreaId: "",
		processNumber: "",
		oppositeParty: "",
		paymentDate: null,
		advogadoInternoId: "",
		legalDepartmentArea: "",
		statusApprovalId: null,
		formaPagamentoId: null,
        valorTotalGuia: null,
        cnpj: "",
		...(savedFilters[pathname] ?? {}),
	} as unknown as TPaymentInspectionRequestFilters & { legalDepartmentAreaId: string, cnpj: string };

    return (
        <Panel title={t("inspection:resquest.filter")} withPadding>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {({ handleSubmit, dirty }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12}>
                                <NumericField
                                    name="id"
                                    label={t("solicitacaoPagamento:numeroSolicitacao")}
                                />
                            </Grid>
                            <Grid item md={3} xs={12}>
                                <NumericField
                                    name="folderNumber"
                                    label={t("solicitacaoPagamento:pastaCTG")}
                                />
                            </Grid>
                            <Grid item md={3} xs={12}>
                                <DateField
                                    name="dataSolicitacao"
                                    label={t("solicitacaoPagamento:dataSolicitacao")}
                                />
                            </Grid>
                            <Grid item md={3} xs={12}>
                            <GroupedSelectFiledMultiple
                                    name="legalDepartmentAreaId"
                                    label={t("solicitacaoPagamento:processFormData.DEJURArea")}
                                    options={groupedAreasAsOptions}
                                />
                            </Grid>
                            <Grid item md={3} xs={12}>
                                <DateField
                                    name="paymentDate"
                                    label={t("solicitacaoPagamento:dadosPagamento.dataPagamento")}
                                />
                            </Grid>
                            <Grid item md={3} xs={12}>
                                <ContactField
                                    name="advogadoInternoId"
                                    label={t("solicitacaoPagamento:dadosPagamento.advogadoInterno")}
                                    contactType={CONTACT_TYPE.PERSON}
                                    setInvalidValueWhenTyping
									contactSearch={CONTACT_SEARCH.InternalLawyer}
                                />
                            </Grid>
                            <Grid item md={3} xs={12}>
                                <SelectField
                                    name="status"
                                    label={t("status")}
                                    options={statusTextFilter}
                                />
                            </Grid>
                            <Grid item md={3} xs={12}>
                                <CurrencyField
                                    label={t("inspection:resquest.valorTotalGuia")}
									name="valorTotalGuia"
                                    />
                            </Grid>
                            <Grid item md={3} xs={12}>
                                <ContactsAutocompleteField
						            filter="fragment"
						            name="cnpj"
						            label={t("solicitacaoPagamento:dadosFavorecido.cpfcnpj")}
						            optionWithSupplierCode
						            onSelectContact={()=> console.log}       
					            /> 
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item md={6} xs={6}>
                                <Clean action="inspection" />
                            </Grid>
                            <Grid
                                item
                                md={6}
                                xs={6}
                                style={{ textAlign: "right" }}
                            >
                                <Submit type="search" disabled={!dirty} />
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </Panel>
    );
};

export default Search;
