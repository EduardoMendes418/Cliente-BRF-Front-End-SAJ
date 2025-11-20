import { useEffect, useState } from "react";
import { useSnackbar } from 'notistack';
import { useHistory, useParams } from 'react-router-dom';
import { Formik, FormikHelpers } from "formik";
import { useDispatch, useSelector } from "react-redux";

import { Grid } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';

import api from "src/core/api/process";
import { actions } from "src/core/store";
import Panel from "src/components/Panel";
import { useTranslation } from "src/locale/i18n";
import SearchInfo from "src/components/SearchInfo";
import { Clean, Submit } from "src/components/button";

import {
	getProcessStatus,
	getProcessError,
} from "src/core/store/modules/process/selectors";
import {
	ESocial,
	TSearchESocial
} from "src/core/models/eSocial";
import {
	TextField,
	SelectField,
	DateFieldYearMonth
} from "src/components/form";
import { fetchAutocompleteESocialData } from "src/core/store/modules/e-social-event-launch/thunks";
import eSocialEventAPI from "src/core/api/e-social-event-launch"
import { fetchESocialEvent } from "src/core/store/modules/e-social-event/thunks";
import { getListESocialEvent } from "src/core/store/modules/e-social-event/selectors";
import { fetchESocialAreasGridList } from "src/core/store/modules/e-social-areas/thunks";
import { getListESocialAreas } from "src/core/store/modules/e-social-areas/selectors";

type Props = {
	item?: any;
	loading: boolean;
	hasItem: boolean;
};

const Search = ({ item, loading, hasItem }: Props) => {
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { id } = useParams<{ id: string }>();
	const isNew = id === "novo";
	const history = useHistory();
	const dispatch = useDispatch();
	const areas = useSelector(getListESocialAreas);

	const { enqueueSnackbar } = useSnackbar()
	const listESocialEvent = useSelector(getListESocialEvent);
	const options = [
		{ value: ESocial.S2500, label: "S-2500" },
		{ value: ESocial.S2501, label: "S-2501" },
		{ value: ESocial.S3500, label: "S-3500" },
		// { value: ESocial.S5501, label: "S-5501" },
	]
	const codeSet = new Set(listESocialEvent?.map((item:any) => item.code));
	const filteredOptions = options.filter(option => codeSet.has(option.label));

	const closed = useSelector(getProcessStatus);
	const error = useSelector(getProcessError);

	const initialValues: TSearchESocial = {
		accrualMonth: item?.accrualMonth ?? null,
		eventCode: item?.eventCode ?? "",
		folderNumber: item?.folderNumber ?? "",
		processId: item?.processId ?? undefined,
		paymentId: item?.paymentId ?? "",
		eventLaunchBaseId: item?.eventLaunchBaseId ?? "",
	};

	const onSubmit = async (
		values: TSearchESocial,
		{ setSubmitting }: FormikHelpers<TSearchESocial>
	) => {
		try {
			setIsLoading(true)
			if (values.eventCode === ESocial.S2501) {
				try {
					await eSocialEventAPI.listById({
						eSocialEventCodeEnum: ESocial.S2500,
						id: values.eventLaunchBaseId
					})
				} catch (error) {
					enqueueSnackbar("O ID do S-2500 não foi encontrado", { variant: 'error' })
					setIsLoading(false)
					return
				}

			}
			if (values.eventCode === ESocial.S3500) {
				try {
					const {data} = await eSocialEventAPI.list({
						id: Number(values.eventLaunchBaseId),
						page:1
					})
					if (!data.items.length) throw "not found"
				} catch (error) {
					enqueueSnackbar("O ID do S-2500 ou S-2501 não foi encontrado", { variant: 'error' })
					setIsLoading(false)
					return
				}

			}
			const folder = await api.getProvisionsProcessByFolderNumber(values.folderNumber)
			if (!areas?.map(({areaId})=>areaId).includes(folder?.data?.originAreaId)){
				enqueueSnackbar("Área Dejur da Pasta/CTG informada não é permitida para o eSocial.", { variant: 'error' })
					setIsLoading(false)
					return
			}
			const processApi = await api.getFolderSheetComponentFolderNumber(values.folderNumber)
			dispatch(actions.eSocialEventLauch.setSearch({ ...values, processId: processApi.data.id }));
			setIsLoading(false)
			setSubmitting(false);
			if (isNew) {
				const autoCompleteParams = {
					processId: Number(processApi.data.id),
					paymentId: Number(values?.paymentId),
				};

				dispatch(fetchAutocompleteESocialData(autoCompleteParams));
			}
		} catch (error) {
			setIsLoading(false)
			enqueueSnackbar(t('anErrorHasOcurred'), { variant: 'error' })
		}
	};

	const redirectToPaymentRequest = (id: number | undefined) => {
		const page = "/pagamentos/solicitacao";

		dispatch(
			actions.paymentRequest.setFilters({
				filters: {
					id: id?.toString(),
					page: 1,
					pageSize: 20,
				},
				internalLawyer: "",
				page,
			})
		);
		history.push(page);
	};

	useEffect(() => {
		dispatch(fetchESocialEvent({notPaginate: true, status: true}))
		dispatch(fetchESocialAreasGridList({}));
	}, []);

	return (
		<Panel title={"eSocial"} withPadding>
			<Formik
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, dirty, submitCount, values, isSubmitting }) => {
					return (
						<form noValidate onSubmit={handleSubmit}>
							<Grid container spacing={3}>
								<Grid item xs={6} md={3} >
									<DateFieldYearMonth
										name="accrualMonth"
										label={"Mês competência"}
										views={["year", "month"]}
										monthYear={true}
										format="MM-YYYY"
										readOnly={hasItem}
									/>
								</Grid>
								<Grid item xs={6} md={3}>
									<SelectField
										name="eventCode"
										label={"Evento"}
										required
										options={filteredOptions}
										readOnly={hasItem}
									/>
								</Grid>
								<Grid item xs={6} md={3}>
									<TextField
										required
										name="folderNumber"
										label={"Pasta/CTG"}
										readOnly={hasItem}
									/>
								</Grid>
								<Grid item xs={4} md={3}>
									<Grid container spacing={3}>
										{
											hasItem && (
												<Grid item xs={4} md={3}>
													<IconButton aria-label='edit' onClick={() => redirectToPaymentRequest(values.paymentId)}>
														<VisibilityIcon />
													</IconButton>
												</Grid>
											)
										}
										<Grid item xs={8} md={9}>
											<TextField
												type="number"
												name="paymentId"
												label="Pagamento referencia"
												readOnly={hasItem}
											/>
										</Grid>
									</Grid>
								</Grid>
								{(values.eventCode === ESocial.S2501 || values.eventCode === ESocial.S3500) && <Grid item xs={6} md={3}>
									<TextField
										required
										type="number"
										name="eventLaunchBaseId"
										label="Id evento referência"
										readOnly={hasItem}
									/>
								</Grid>}
								<Grid item xs={2} md={1}>
									<Submit type="search" submitting={loading || isLoading} disabled={!dirty} />
								</Grid>
								{
									!hasItem && <Clean action="eSocialEventLauch" disabled={!submitCount || loading} />
								}
							</Grid>
						</form>
					);
				}}
			</Formik>
			{!loading && <SearchInfo error={error} closed={closed} />}
		</Panel>
	);
};

export default Search;