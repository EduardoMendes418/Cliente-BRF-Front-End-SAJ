import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Panel from "src/components/Panel";
import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";

import { useTranslation } from "src/locale/i18n";
import { usePagination } from "src/hooks/pagination";
import { getFilterContact, getIsFetchingContact, getListContact } from "src/core/store/modules/contact/selectors";
import { fetchContactByFilterList, fetchContactEnums } from "src/core/store/modules/contact/thunks";
import { rejectNoValues } from "src/core/utils/func";
import { useHistory } from "react-router-dom";

const List = ({ pathname}: { pathname: string }) => {

	const { t } = useTranslation();
	const dispatch = useDispatch();
	const history = useHistory();

	const { page, pageSize } = usePagination();
	const items = useSelector(getListContact)
	const loading = useSelector(getIsFetchingContact);
	const savedFilters = useSelector(getFilterContact);

	useEffect(() => {
		const result = rejectNoValues({
			...savedFilters[pathname],
			page,
			pageSize,
		}) as any
		dispatch(fetchContactByFilterList(result))
	}, [dispatch, savedFilters, pathname, page, pageSize]);

	useEffect(() => {
		dispatch(fetchContactEnums());
	}, [])

	const columns: ColumnData[] = [
		
		{ label: t("contacts:search.nameOrCompanyName"), field: "name" },
		{ label:t("contacts:search.cpfCnpj"), field: "identificationNumber" },
		{ label: t("contacts:search.phoneNumber"), field: "phone" },
		{ label: t("contacts:search.email"), field: "email" },
		{
			label: t("contacts:search.contactType"),
			field: "typeDescription",
		},		
	];

	const handleAction = (row: any) => {
		history.push(`${pathname}/${row.id}`);
	};

	const rows = useMemo(
		() =>
			items?.map((item: any) => (item)),
		[items]
	); 

	return (
		<>
			<Panel title={t("contacts:contactsList")}>
				<TableComponent
					columns={columns}
					rows={rows}
					isLoading={loading}
					onEdit={handleAction}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default List;
