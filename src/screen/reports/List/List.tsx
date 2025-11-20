import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import List from "src/components/List";
import { ColumnData } from "src/components/Table";
import { useTranslation } from "src/locale/i18n";
import {
	editReportConfiguration,
	fetchReportConfiguration,
	deleteReportConfiguration
} from "src/core/store/modules/report-configuration/thunks";
import {
	getListReportConfiguration,
	getListFiltersReportConfiguration,
} from "src/core/store/modules/report-configuration/selectors";
import { usePagination } from "src/hooks/pagination";
import { rejectNoValues } from "src/core/utils/func";
import { TReportComponent } from "src/core/models/reports";
import { TReportConfiguration } from "src/core/models/report-configuration";
import { AppDispatch } from "src/core/store";
import DeleteIcon from "@material-ui/icons/Delete";
import { IconButton } from "@material-ui/core";
import { actions } from 'src/core/store';
import { getPermissionsCurrentUser } from "src/core/store/modules/currentUser/selectors";


const REPORT_COMPONENT = {
	pagamentos: TReportComponent.PAYMENTS,
	pensoes: TReportComponent.PENSIONS,
	"bens-e-garantias": TReportComponent.GOODS_GUARANTEES,
	"accountability": TReportComponent.ACCOUNTABILITYR,
	"bloqueios-e-transferencias": TReportComponent.JUDICIAL_BLOCKS_AND_TRANSFERS,
	"pedido-estatistico": TReportComponent.STATISTICAL_ORDER,
	"pagamento-de-fiscalizacao": TReportComponent.NOTICE_INSPECTION_PAYMENT,
	"recebimento-de-credito": TReportComponent.CREDIT_RECEIPT,
	"legal-document": TReportComponent.LEGAL_DOCUMENT,
} as any;

const ReportConfigurationList = ({
	loading,
	pathname,
}: {
	loading: boolean;
	pathname: string;
}) => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch<AppDispatch>();

	const routeName = pathname.split("/")[2];
	const permissions = useSelector(getPermissionsCurrentUser);
	const permition = useMemo(() => permissions.find(
		({ name }) => `/${name}` === pathname
	),[permissions, pathname]);
	const list = useSelector(getListReportConfiguration).map((item) => {
		return {
			...item,
			visibility: item.isPublic ? "Público" : "Privado",
			isButtonHidden: true,
			showSwitchHidden: true,
		};
	});
	
	const reportFilters = useSelector(getListFiltersReportConfiguration);

	const { page, pageSize } = usePagination();

	const fetch = useCallback(() => {
		const filters = reportFilters[pathname] ?? {};
		const result = rejectNoValues({
			...filters,
			page,
			pageSize,
			reportComponent: REPORT_COMPONENT[routeName],
		});
		dispatch(fetchReportConfiguration(result));
	}, [dispatch, page, pageSize, pathname, reportFilters, routeName]);

	useEffect(() => {
		const filters = reportFilters[pathname] ?? {};
		const result = rejectNoValues({
			...filters,
			page,
			pageSize,
			reportComponent: REPORT_COMPONENT[routeName],
		});
		dispatch(fetchReportConfiguration(result));
	}, [dispatch, page, pageSize, reportFilters, pathname, routeName]);

	const onVisualize = ({ id }: any) => {
		history.push(`/relatorios/${routeName}/${id}`);
	};

	const onSwitch = async ({ isActive, ...row }: TReportConfiguration) => {
		await dispatch(
			editReportConfiguration({
				...row,
				isActive: !isActive,
				reportFilterFields: row.reportFilterFields.map((item) => ({...item, value: typeof item.value === 'object' ? `${item.value}` : item.value})),
			})
		);
		fetch();
	};

	const onDelete = async (row: TReportConfiguration) => {
		await dispatch(
			deleteReportConfiguration(row)
		);
		fetch();
	};
	useEffect(() => () => dispatch(actions.reportConfiguration.clear()), [dispatch]);

	const columns: ColumnData[] = [
		{
			label: t("reports:actions"),
			field: "actions",
			type: "custom",
			component: (row: TReportConfiguration) => {
				return (
					<>
						{row.isActive && (
							<IconButton onClick={() => onVisualize(row)}>
								<VisibilityIcon color="primary" />
							</IconButton>
						)}
						{permition?.del && <IconButton onClick={() => onDelete(row)}>
							<DeleteIcon color="error" />
						</IconButton>}
					</>
				);
			},
		},
		{ label: t("reports:filterName"), field: "filterName" },
		{ label: t("reports:userName"), field: "userName" },
		{ label: t("reports:isPublic"), field: "visibility" },
		{
			label: t("reports:isActive"),
			field: "isActive",
			type: "switch-button",
			onChange: onSwitch,
		},
	];

	return (
		<List
			title={t("reports:titleList")}
			columns={columns}
			items={list}
			loading={loading}
		/>
	);
};

export default ReportConfigurationList;
