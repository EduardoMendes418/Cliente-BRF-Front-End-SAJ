import {useCallback, useEffect, useRef, useMemo, useState, ChangeEvent} from "react";
import {useDispatch} from "react-redux";
import {Box, Button, CircularProgress, Grid} from "@material-ui/core";

import UploadFileButton from "src/components/form/Upload/UploadButton";
import {Clean, Submit} from "src/components/button";
import {useTranslation} from "src/locale/i18n";

import {TGetContacts} from "src/core/models/data-import";
import {getContacts, getContactsCsv, importContacts} from "src/core/store/modules/data-import/thunk";
import {actions} from "src/core/store";


import {Formik, useFormikContext} from "formik";
import { DateField, PhoneField, SelectField, TOptionsSelect} from "src/components/form";
import {TextField} from "src/components/form";
import Panel from "src/components/Panel";
import FileSaver from "file-saver";
import {convertToBlob, convertToBlobCSV} from "src/core/utils/func";
import TableComponent, {ColumnData} from "src/components/Table";
import {FormLabel} from "@mui/material";
import Pagination from "src/components/Pagination";
import useEmitSnackbarStatus from "../../hooks/useEmitSnackbarStatus";
import {TDataImportContact} from "../../../../core/models/contacts";
import ImportErrors from "../../components/ImportErrors";
import {TLitigationParticipantSituationEnum} from "../../../../core/models/litigation-participant-positions";
import {useLitigationParticipantPosition} from "../../../../hooks/litigation-participant-positions";
import {situationToArray} from "../utils";
import { CONTACT_TYPE } from "src/core/utils/constants";
import ContactMultipleSelectField from "src/components/form/ContactMultipleSelectField";

const ImportContactForm = () => {

	const {t} = useTranslation();
	const dispatch = useDispatch();
	const inputFileRef = useRef<HTMLInputElement>(null);
	
	const [EntityType, setEntityType] = useState<number>(1);
	const [data, setData] = useState<any>()
	const [itemCount, setItemCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [pageCount, setPageCount] = useState<number>(1);
	const [parameters, setParameters] = useState<object>();
	const [situation, setSituation] = useState<TLitigationParticipantSituationEnum | null>(null)
	const {litigationParticipantPositionsOptions} = useLitigationParticipantPosition(situation)

	const onPageChange = useCallback((page: number) => setPage(page), [])
	const onPageSizeChange = useCallback((pageSize: number) => setPageSize(pageSize), [])

	const getData = async () => {
		const {payload} = await dispatch(getContacts({...parameters, Page: page, PageSize: pageSize})) as any;
		setData(payload.items)
	}

	const situationOptions: TOptionsSelect[] = useMemo(() => [
		{ label: t("dataImport:contacts.search.situations.responsible"), value: 1 },
		{ label: t("dataImport:contacts.search.situations.company"), value: 2 },
		{ label: t("dataImport:contacts.search.situations.otherParty"), value: 6 },
		{ label: t("dataImport:contacts.search.situations.part"), value: 5 },
		{ label: t("dataImport:contacts.search.situations.others"), value: 4 },
		{ label: t("dataImport:contacts.search.situations.otherPartyLawyer"), value: 7 },
		{ label: t("dataImport:contacts.search.situations.corresponding"), value: 8 },
	], [t])


	useEffect(() => {
		if (data !== undefined)
			getData()
		
	}, [page, pageSize])

	const personsAsOption = [
		{label: 'Juridica', value: 1},
		{label: 'Física', value: 0}
	];

	useEmitSnackbarStatus();

	const handleChangeSituation = (event: ChangeEvent<HTMLInputElement>) => {
		let value = Number(event.target.value)
		value = value >= 4 ? 4 : value
		setSituation(value as TLitigationParticipantSituationEnum)
	}

	const handleImport = useCallback(async () => {
		const file = inputFileRef.current?.files;
		if (file) {
			const {type} = await dispatch(importContacts({file})) as any;
			inputFileRef.current.value = "";
			if(type === 'dataImport/importContacts/fulfilled'){
				window.open("/carga-de-dados/monitor-de-execucao", "_blank");
			}
		}
	}, [dispatch]);

	useEffect(() => dispatch(actions.dataImport.clear()), [dispatch]);

	const initialValues: TDataImportContact = useMemo(
		() => ({
			ContactIds: [],
			CreatedAtStart: null,
			CreatedAtEnd: null,
			EntityType: "",
			email: "",
			phoneNumber: "",
			positionIds: [],
			situationFilterType: ""
		}),
		[]
	);

	const FormObserver: React.FC = () => {
		const {values}: any = useFormikContext();

		useEffect(() => {
			setEntityType(values?.EntityType);
			setParameters(values);
		}, [values]);

		return null;
	};

	const onSubmit = async (values: any) => {
		const situation = values.situationFilterType >= 4 ? 4 : values.situationFilterType
		const {payload} = await dispatch(getContacts({...values, PageSize: pageSize, situationFilterType: situation})) as any

		setItemCount(payload.itemCount)
		setPageCount(payload.pageCount)
		setData(payload.items)
	};

	const onGenerateCsv = async (values: TGetContacts) => {
		setIsLoading(true);
		const {payload} = await dispatch(getContactsCsv(values)) as any;
		const fileName = values.EntityType === 1 ? "Contato_pessoa_juridica" : "Contato_pessoa_fisica"

		FileSaver.saveAs(
			convertToBlob(payload) as Blob,
			`${fileName}.xlsx`
		);
		setIsLoading(false);
	};

	const handleClearImportFile = useCallback(() => {
		if (inputFileRef.current) inputFileRef.current.value = "";
		setData([]);
		setItemCount(0);
		setPageCount(0);
		setPage(1);
	}, []);

	const columns: ColumnData[] = [
		{label: t("dataImport:contacts.list.type"), field: 'entityType'},
		{label: t("dataImport:contacts.list.identificationNumber"), field: 'identificationNumber'},
		{label: t("dataImport:contacts.list.name"), field: 'tradeName'},
		{label: t("dataImport:contacts.list.sapCodeCliFor"), field: 'sapCodeCliFor'},
		{label: t("dataImport:contacts.list.birthDate"), field: 'birthDate', type: 'date'},
		{label: t("dataImport:contacts.list.phoneNumber"), field: 'phoneNumber'},
		{label: t("dataImport:contacts.list.email"), field: 'email'},
		{label: t("dataImport:contacts.list.creationDate"), field: 'creationDate', type: 'date'},
		{label: t("dataImport:contacts.list.situationId"), field: 'situation'},
		{label: t("dataImport:contacts.list.positionName"), field: 'positionName'},	
	];

	const rows = useMemo(
		() =>
			data?.map((item: any) => {
				return {
					entityType: item?.type === 2 ? "Pessoa jurídica" : "Pessoa física",
					identificationNumber: item?.identificationNumber,
					tradeName: item?.name !== null ? item?.name: '',
					phoneNumber: item?.phones?.length > 0 ? item?.phones[0]?.number : '',
					email: item?.emails.length > 0 ? item?.emails[0]?.email : '',
					sapCodeCliFor: item?.sapCodeCliFor,
					creationDate: item?.creationDate,
					situation: situationToArray(item?.situationId).map(x =>  situationOptions.find(y => y.value === x.valueOf())?.label).join(", "),
					positionName: item?.positionName,
					birthDate: item?.individual?.birthDate
				};
			}),
		
		[data]
	);

	return (
		<Panel title={t("dataImport:contacts.filter")} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({handleSubmit, values, dirty, isSubmitting}) => (
					<form noValidate onSubmit={handleSubmit} autoComplete="off">
						<FormObserver/>
						<Grid container spacing={3}>
							<Grid item md={3} xs={12}>
								<SelectField
									id="EntityType"
									label={t("legalDocs:bestowed.kindOfPerson.title")}
									options={personsAsOption}
									name="EntityType"
									required
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								{
									values.EntityType === "" || values.EntityType === 1 ? 
									<ContactMultipleSelectField 
									name="ContactIds" 
									label={t("officeManagement:requestPayment.socialReason")}
									contactType={CONTACT_TYPE.COMPANY}
									/>
									:
									<ContactMultipleSelectField 
									name="ContactIds" 
									label={t("officeManagement:requestPayment.socialReason")}
									contactType={CONTACT_TYPE.PERSON}
									/>
								}
							</Grid>
							<Grid item xs={12} md={3}>
								<Grid container spacing={3}>
									<Grid item xs={6} md={6}>
										<DateField
											name="CreatedAtStart"
											label={t("reports:main.form.creationDateInitial")}
										/>
									</Grid>
									<Grid item xs={6} md={6}>
										<DateField
											name="CreatedAtEnd"
											label={t("reports:common.form.until")}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item md={3} xs={12}>
								<TextField
									label={t("dataImport:contacts.search.email")}
									name="email"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<PhoneField
									label={t("dataImport:contacts.search.phoneNumber")}
									name="phoneNumber"
									type="phone"
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("dataImport:contacts.search.situationFilterType")}
									options={situationOptions}
									name="situationFilterType"
									onChange={handleChangeSituation}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<SelectField
									label={t("dataImport:contacts.search.positionId")}
									options={litigationParticipantPositionsOptions}
									name="positionIds"
									disabled={situation === 0 || situation === null}
									multiple
								/>
							</Grid>
						</Grid>
						<Grid container spacing={2} alignItems='center'>
							<Grid item md={6} xs={6}>
								<Clean action="dataImport" onClick={handleClearImportFile}/>
							</Grid>
							<Grid item md={6} xs={6} style={{textAlign: 'right'}}>
								<Submit
									type="search"
									disabled={!dirty || isSubmitting}
									submitting={isLoading}
								/>
							</Grid>
						</Grid>
						<Box display="flex" justifyContent="flex-end" mt={3} gridGap={16}>
							<UploadFileButton
								variant="contained"
								color="primary"
								text={t("dataImport:common.importSpreadsheet")}
								onChange={handleImport}
								inputRef={inputFileRef}
								accept=".csv"
							/>
							{
							
							isLoading === true ? <CircularProgress /> :
							<Button
								color='primary'
								variant='contained'
								disabled={isSubmitting}
								onClick={() => onGenerateCsv({
									...values,
									EntityType: values.EntityType ? values.EntityType as number : undefined,
									CreatedAtEnd: values.CreatedAtEnd ? values.CreatedAtEnd as string : undefined,
									CreatedAtStart: values.CreatedAtStart ? values.CreatedAtStart as string : undefined
								})}
							>{t("dataImport:common.generateSpreadsheet")}</Button> 
							}
						</Box>
					</form>
				)}
			</Formik>
			<Panel title="Listagem de resultados gerados pelo filtro">
				<FormLabel style={{fontWeight: 'bold', display: 'flex', margin: '3% 3% 0 1.5%'}}>
					{"Contatos encontrados:"} {itemCount}
				</FormLabel>
				<TableComponent
					rows={rows}
					columns={columns}
				/>
				<Pagination
					page={page}
					pageSize={pageSize}
					pageCount={pageCount}
					onChangePage={onPageChange}
					onChangePageSize={onPageSizeChange}
				/>
			</Panel>
			<ImportErrors/>
		</Panel>
	);
};

export default ImportContactForm;
