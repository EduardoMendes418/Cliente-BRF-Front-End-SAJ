import { Formik, FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";

import Panel from "src/components/Panel";
import { Submit } from "src/components/button";
import { NumericField } from "src/components/form";
import FieldColumn from "src/components/FieldColumn";
import { actions } from "src/core/store";

import { useTranslation } from "src/locale/i18n";
import { fetchGoodsGuaranteesRequestById } from "src/core/store/modules/goods-guarantee/thunks";
import { checkHasJudicialDepositPending } from "src/core/store/modules/provision-order/thunks";
import { getItemGoodsGuaranteesRequest } from "src/core/store/modules/goods-guarantee/selectors";
import { useEffect } from "react";

type TSearch = {
	error?: string;
	loading: boolean;
	hasItem: boolean;
	notFound: boolean;
	hasItemRequest: boolean;
	goodsGuaranteesRequestId: number | "";
	id: string;
};

type TSearchForm = { goodsGuaranteesRequestId: number | "" };

const Search = ({
	error,
	loading,
	hasItem,
	notFound,
	hasItemRequest,
	goodsGuaranteesRequestId = "",
	id,
}: TSearch) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const history = useHistory();
	const item = useSelector(getItemGoodsGuaranteesRequest);

	const handleView = async () => {
		await dispatch(actions.goodsGuaranteesRequest.clear());
		await dispatch(actions.process.clear());
		history.push(`/bens-e-garantias/gestao/${goodsGuaranteesRequestId}`);
	}
	useEffect(() => {
		dispatch(checkHasJudicialDepositPending(item.folderNumber));
	}, [item.folderNumber, dispatch]);
	const onSubmit = (
		{ goodsGuaranteesRequestId }: TSearchForm,
		{ setSubmitting }: FormikHelpers<TSearchForm>
	) => {
		dispatch(fetchGoodsGuaranteesRequestById(Number(goodsGuaranteesRequestId)));
		setSubmitting(false);
	};

	const initialValues: TSearchForm = { goodsGuaranteesRequestId };

	return (
		<Panel title={t("goodsAndGuarantees:searchTitle")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit, dirty, submitCount }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							{hasItem ? (
								<>
									<Grid item md={3}>
										<FieldColumn
											label={t("goodsAndGuarantees:management.requestNumber")}
											value={id}
										/>
									</Grid>
									<Grid item md={3}>
										<FieldColumn
											label={t(
												"goodsAndGuarantees:management.goodAndGuaranteeId"
											)}
											value={goodsGuaranteesRequestId}
											handleView={handleView}
										/>
									</Grid>
								</>
							) : (
								<Grid item md={3}>
									<NumericField
										required
										name="goodsGuaranteesRequestId"
										label={t(
											"goodsAndGuarantees:management.goodAndGuaranteeId"
										)}
										placeholder={t("form.typeHere")}
										readOnly={hasItem}
										disabled={loading || (hasItemRequest && !error)}
									/>
								</Grid>
							)}
							{!hasItem && (
								<Grid item xs={2}>
									<Submit
										type="search"
										disabled={!dirty}
										submitting={loading}
									/>
								</Grid>
							)}
						</Grid>
						{!loading && (!!submitCount && !hasItemRequest) && (
							<Typography className="margin-top-16">{t("notFound")}</Typography>
						)}
						{!loading && error && (
							<Typography className="margin-top-16">{error}</Typography>
						)}
					</form>
				)}
			</Formik>
		</Panel>
	);
};

export default Search;
