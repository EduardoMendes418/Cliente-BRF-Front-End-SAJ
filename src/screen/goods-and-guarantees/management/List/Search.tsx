import { useEffect, useMemo } from 'react';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

import Panel from 'src/components/Panel';
import { NumericField, SelectField, DateField } from 'src/components/form';
import ContactFieldMultiple from "src/components/ContactFieldMultiple";

import { useTranslation } from 'src/locale/i18n';
import { TGoodsGuaranteesRequestFilters } from 'src/core/models/goods-guarantee';
import { actions } from 'src/core/store';
import { getListAsOptionPaymentType } from 'src/core/store/modules/payment-type/selectors';
import { useGuaranteeModality } from 'src/hooks/fetchLists';
import { rejectNoValues } from 'src/core/utils/func';
import { Clean, Submit } from 'src/components/button';
import { usePagination } from 'src/hooks/pagination';
import { getFiltersGoodsGuaranteesRequest } from 'src/core/store/modules/goods-guarantee/selectors';
import { fetchPaymentType } from 'src/core/store/modules/payment-type/thunks';
import { Modulos } from 'src/core/models/modules';
import { TYPE_LINK_WITH_PROCESS } from 'src/core/utils/constants';

const requestTypesOptions = [
	{ label: 'Nova garantia', value: `RequestTypeId-1` },
	{ label: 'Endosso de atualização', value: `RequestTypeId-2` },
	{ label: 'Renovação de prazo', value: `RequestTypeId-3` },

	{ label: 'Bloqueio judicial', value: `occurrenceType-1` },
	{ label: 'Transferência judicial', value: `occurrenceType-2` },

	{ label: 'Transferência entre contas', value: `origin-4` },
	{ label: 'Transferência entre processos', value: `origin-8` },
];
const Search = ({ loading, pathname }: { loading: boolean, pathname: string }) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const savedFilters = useSelector(getFiltersGoodsGuaranteesRequest);

	const { guaranteeModalityAsOptionsAll } = useGuaranteeModality();
	const paymentTypeOptions = useSelector(getListAsOptionPaymentType);

	const { pageSize } = usePagination();

	useEffect(()=> {
		dispatch(fetchPaymentType({ modulo: Modulos.Pagamento, notPaginate: true }));
	}, [dispatch])

	const onSubmit = (values: TGoodsGuaranteesRequestFilters, { setSubmitting }: any) => {
		const result = { ...rejectNoValues({ ...values, page: 1, pageSize }), page: 1, pageSize } as TGoodsGuaranteesRequestFilters;
		if (values.isActive !== '') result.isActive = !!result.isActive
		dispatch(actions.goodsGuaranteesRequest.setFilters({ filters: result, page: pathname }));
		setSubmitting(false);
	}

	const initialValues: TGoodsGuaranteesRequestFilters = useMemo(() => {
		const initialV = {
			id: '',
			folderNumber: '',
			guaranteeModalityId: '',
			isActive: '',
			guaranteeDateStart: null,
			guaranteeDateEnd: null,
			requestTypeIdGeneral: '',
			paymentTypeIds: [],
			internalLawyerIds: [],
			...(savedFilters[pathname] ?? {})
		} as TGoodsGuaranteesRequestFilters
		if (initialV.isActive !== '') initialV.isActive = initialV.isActive ? 1 : 0
		return(initialV)
	}, [pathname])

	return (
		<Panel title={t('goodsAndGuarantees:searchTitle')} withPadding>
			<Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
				{({ handleSubmit, isValid, dirty }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3} alignItems='flex-start'>
							<Grid item xs={12} md={3}>
								<NumericField
									name='id'
									label={t('goodsAndGuarantees:management.goodAndGuaranteeId')}
									placeholder={t('form.typeHere')}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<NumericField
									name='folderNumber'
									label={t('form.CTGFolder')}
									placeholder={t('form.typeHere')}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t('goodsAndGuarantees:form.guaranteeModality')}
									name='guaranteeModalityId'
									options={guaranteeModalityAsOptionsAll}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											name='guaranteeDateStart'
											label={t('dataImport:goodsAndGuarantees.search.startGuaranteeDate')}
										/>

									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											name='guaranteeDateEnd'
											label={t('dataImport:goodsAndGuarantees.search.endGuaranteeDate')}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={3}>
							<SelectField
									label={"Status do bem"}
									name='isActive'
									options={[
										{value: 1, label:t('enabled')},
										{value: 0, label:t('goodsAndGuarantees:management.dead')},
									]}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t("goodsAndGuarantees:form.guaranteesType")}
									name='paymentTypeIds'
									options={paymentTypeOptions}
									multiple
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<SelectField
									label={t("goodsAndGuarantees:form.solicitationType")}
									name='requestTypeIdGeneral'
									options={requestTypesOptions}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
									<ContactFieldMultiple
										label={t("provisions:fields.internalLawyer")}
										name="internalLawyerIds"
										getOptionsTypeLinkWithTheProcess={true}
										typeOfLinkWithTheProcess={TYPE_LINK_WITH_PROCESS.INTERNAL_LAWYER}
									/>
								</Grid>
							<Grid item xs={2}>
								<Submit type="search" disabled={!dirty || !isValid} submitting={loading} />
							</Grid>
						</Grid>
						<Clean action='goodsGuaranteesRequest' page={pathname} />
					</form>
				)}
			</Formik>
		</Panel>
	)
}

export default Search;