import { useMemo, useState } from 'react';
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import Panel from "src/components/Panel";
import {
	DateField,
	NumericField,
	SelectField,
	UserField,
} from "src/components/form";

import { useTranslation } from "src/locale/i18n";
import { TGoodsGuaranteesRequestFilters } from "src/core/models/goods-guarantee";
import { actions } from "src/core/store";
import { rejectNoValues } from "src/core/utils/func";
import { Clean, Submit } from "src/components/button";
import { getFiltersGoodsGuaranteesRequest } from "src/core/store/modules/goods-guarantee/selectors";
import { useGuaranteeModality } from "src/hooks/fetchLists";
import { statusFlowIdListAsOptionNoGuaranteeModeId, statusFlowIdListAsOptionGuaranteeModeIdTwo, statusFlowIdListAsOptionGuaranteeModeIdThree, statusFlowIdListAsOptionGuaranteeModeIdFourOrFive } from "src/screen/goods-and-guarantees/statusInfo";
import ContactField from "src/components/ContactField";
import { CONTACT_SEARCH, CONTACT_TYPE, accountabilityStatusOptions as asOptions } from "src/core/utils/constants";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";

const Search = ({
	loading,
	pathname,
}: {
	loading: boolean;
	pathname: string;
}) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { idBrf } = useSelector(getDataCurrentUser);

	const filters = useSelector(getFiltersGoodsGuaranteesRequest);
	const { guaranteeModalityAsOptionsAllNoJudicialDeposit } = useGuaranteeModality(true);
	const [statusFlowIdListAsOption, setStatusFlowListAsOptions] = useState<any>(statusFlowIdListAsOptionNoGuaranteeModeId);
	const isApprovalInternalLawyer = pathname.startsWith('/bens-e-garantias/avaliacao-advogado-interno');

	const onSubmit = (
		values: TGoodsGuaranteesRequestFilters,
		{ setSubmitting }: any
	) => {
		const result = rejectNoValues(values);
		dispatch(
			actions.goodsGuaranteesRequest.setFilters({
				filters: result,
				internalLawyer: values.internalLawyer ?? "",
				page: pathname,
			})
		);
		setSubmitting(false);
	};

	const changeStatusFlowOption = (guaranteeModeId: any) => {
		switch (guaranteeModeId){
			case 2: setStatusFlowListAsOptions(statusFlowIdListAsOptionGuaranteeModeIdTwo);
			break;
			case 3: setStatusFlowListAsOptions(statusFlowIdListAsOptionGuaranteeModeIdThree);
			break;
			case 4: setStatusFlowListAsOptions(statusFlowIdListAsOptionGuaranteeModeIdFourOrFive);
			break;
			case 5: setStatusFlowListAsOptions(statusFlowIdListAsOptionGuaranteeModeIdFourOrFive);
			break
			default: setStatusFlowListAsOptions(statusFlowIdListAsOptionNoGuaranteeModeId);
		}
	}
	
	const initialValues: TGoodsGuaranteesRequestFilters = useMemo(() => ({
		id: "",
		requestDate: null,
		folderNumber: "",
		guaranteeModeId: "",
		guaranteeDateStart: null,
		guaranteeDateEnd: null,
		requestDateStart: null,
		requestDateEnd: null,
		statusFlowId: "",
		requesterId: "",
		internalLawyer: isApprovalInternalLawyer ? idBrf : '',
		statusApprovalId: null,
		...(filters[pathname] ?? {}),
	}),[isApprovalInternalLawyer, idBrf, filters, pathname]);

	return (
		<Panel title={t("goodsAndGuarantees:searchTitle")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3} alignItems="flex-start">
							<Grid item xs={12} md={3}>
								<NumericField
									name="id"
									label={t("goodsAndGuarantees:requestNumber")}
									placeholder={t("form.typeHere")}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<NumericField
									name="folderNumber"
									label={t("form.CTGFolder")}
									placeholder={t("form.typeHere")}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											name="requestDateStart"
											label={"Data da solicitação de"}
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											name="requestDateEnd"
											label={"Data solicitação até"}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item md={3} xs={12}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											name="guaranteeDateStart"
											label={"Data da Garantia"}
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField name="guaranteeDateEnd" label={"até"} />
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={"Modalidade da garantia"}
									name="guaranteeModeId"
									options={guaranteeModalityAsOptionsAllNoJudicialDeposit}
									onChange={(e: any) => changeStatusFlowOption(e.target.value)}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={"Status da solicitação"}
									name="statusFlowId"
									options={statusFlowIdListAsOption}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={"Status da contabilização"}
									name="statusApprovalId"
									options={asOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<UserField label={"Solicitante"} name="requesterId" />
							</Grid>
							<Grid item md={3} xs={12}>
								<ContactField
									name="internalLawyer"
									label={t("solicitacaoPagamento:dadosPagamento.advogadoInterno")}
									contactType={CONTACT_TYPE.PERSON}
									setInvalidValueWhenTyping
									contactSearch={CONTACT_SEARCH.InternalLawyer}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2} alignItems="center">
							<Grid item md={6} xs={6}>
								<Clean 
									action="goodsGuaranteesRequest" 
									page={pathname}
									onClick={() => {
										dispatch(
											actions.goodsGuaranteesRequest.setFilters({
												filters: { internalLawyer: isApprovalInternalLawyer ? idBrf : '' },
												page: pathname,
											})
										);
									}}
								/>
							</Grid>
							<Grid item md={6} xs={6} style={{ textAlign: "right" }}>
								<Submit type="search" submitting={loading} />
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
