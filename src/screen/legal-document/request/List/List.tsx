import { useEffect, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import TableComponent, { ColumnData } from "src/components/Table";
import Pagination from "src/components/Pagination";
import Panel from "src/components/Panel";
import { usePagination } from "src/hooks/pagination";
import { getErrorMessageLegalDocRequest, getListFiltersLegalDocRequest, getListLegalDocRequest, getLoadingLegalDocRequest, getStatusLegalDocRequest } from "src/core/store/modules/legal-document-request/selectors";
import { fetchLegalDocRequest } from "src/core/store/modules/legal-document-request/thunks";

import { useTranslation } from "src/locale/i18n";
import { LegalDocumentFormTypeEnum, LegalDocumentFormTypeFieldTranslation, LegalDocumentRequestStatusTranslation, TLegalDoc } from "src/core/models/legal-document-request";
import { useRegisterDefault } from "src/hooks";
import { useAreasWitchGroups } from "src/hooks/fetchLists";
import { useCoverage } from "src/hooks/legalDocuments";

const List = ({ pathname }: { pathname: string }) => {
	const { t } = useTranslation();
	const history = useHistory();
	const loaded = useRef({ status: false });

	const dispatch = useDispatch();
	const { page, pageSize } = usePagination();

	const list = useSelector(getListLegalDocRequest);
	const filters = useSelector(getListFiltersLegalDocRequest);
	const loading = useSelector(getLoadingLegalDocRequest);

	useRegisterDefault({
		action: "legalDocRequest",
		getStatus: getStatusLegalDocRequest,
		getErrorMessage: getErrorMessageLegalDocRequest,
		updateInListCallback: () => {
			return dispatch(
				fetchLegalDocRequest({
					...filters,
					page,
					pageSize,
				})
			);
		},
	});

	useEffect(() => {
		if (loaded.current.status) {
			dispatch(
				fetchLegalDocRequest({ ...filters, page, pageSize })
			);
		}
		if (!loaded.current.status) {
			loaded.current.status = true;
		}
	}, [dispatch, page, pageSize, filters]);

	const { areasDEJUROptions } = useAreasWitchGroups();
	const { coveragesAsOptions } = useCoverage();

	const columns: ColumnData[] = [
		{
			label: t("legalDocs:request.requestNumber"),
			field: 'id',
		},
		{
			label: t("legalDocs:request.date"),
			field: 'createdDate',
			type: 'date'
		},
		{
			label: t("legalDocs:request.requestType"),
			field: 'custom',
			type: 'custom',
			component: (row: TLegalDoc) => {
				const translation = LegalDocumentFormTypeFieldTranslation[(row.legalDocumentRequestType?.formType ?? 0) - 1];
				return t(translation as 'legalDocs:requestTypesList');
			}
		},
		{
			label: t("legalDocs:request.dejurArea"),
			field: "legalDocumentRequestType.dejurAreaId",
			type: "custom",
			component: (row: TLegalDoc) => {
				return areasDEJUROptions.find(i => i.value === row?.process?.legalDepartmentAreaId)?.label;
			}
		},
		{
			label: t("legalDocs:request.coverage"),
			field: "prepositionLetter.coverage",
			type: 'custom',
			component: (row: TLegalDoc) => {
				if (row.legalDocumentRequestType?.formType === LegalDocumentFormTypeEnum.PrepositionLetter) {
					return coveragesAsOptions.find(i => i.value === row.prepositionLetter?.coverageId)?.label
				} else if (row.legalDocumentRequestType?.formType === LegalDocumentFormTypeEnum.Replacement) {
					return coveragesAsOptions.find(i => i.value === row.prepositionReplacement?.coverageId)?.label
				} else {
					return "-"
				}
			}
		},
		{
			label: t("legalDocs:request.CTGFolder"),
			field: "folderNumber",
		},
		{
			label: t("legalDocs:request.status"),
			field: "status",
			type: 'custom',
			component: (row: TLegalDoc) => {
				const translation = (LegalDocumentRequestStatusTranslation as any)[row.status ?? ''];
				return t(translation as 'legalDocs:requestStatus');
			}
		},
	];

	const rows = useMemo(
		() =>
			list.slice().sort((x, y) => (y.id ?? 0) - (x.id ?? 0)),
		[list]
	);

	const onEdit = ({ id }: TLegalDoc) => {
		history.push(`${pathname}/${id}`, {
			onEdit: true,
		});
	};
	const onVisualize = ({ id }: TLegalDoc) => {
		history.push(`${pathname}/${id}`, {
			onEdit: false,
		});
	};

	return (
		<>
			<Panel title={t("legalDocs:list")}>
				<TableComponent
					onEdit={onEdit}
					onVisualize={onVisualize}
					columns={columns}
					rows={rows}
					isLoading={loading}
				/>
			</Panel>
			<Pagination />
		</>
	);
};

export default List;
