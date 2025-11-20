import { debounce, Grid, styled } from "@material-ui/core";
import { Chip, IconButton, Paper, Typography } from "@mui/material";
import { useFormikContext } from "formik";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DateField, DateHourField, SelectField, TextField } from "src/components/form";
import Panel from "src/components/Panel";
import SearchInfo from "src/components/SearchInfo";
import { LegalDocumentRequestSignatureEnum } from "src/core/models/legal-document-request";
import { AppDispatch } from "src/core/store";
import { getProvisionsProcess, getProvisionsProcesses, getProvisionsProcessRequestScreenLoading } from "src/core/store/modules/provision-order/selectors";
import { fetchProvisionsProcess, fetchProvisionsProcessByProcessNumber } from "src/core/store/modules/provision-order/thunks";
import { useSolicitationType } from "src/hooks/legalDocuments";
import { useTranslation } from "src/locale/i18n";
import { TLegalDocForm } from "..";
import FolderData from "./FolderData";
import AddIcon from "@material-ui/icons/Add";
import { TProvisionProcess } from "src/core/models/provision-order";
import { TLegalDocRequestType } from "src/core/models/legal-document-request-types";
import { LegalDocFormType } from "src/screen/settings/legal-documents/utils/constants";
import { useParams } from "react-router-dom";
import Popup from "src/components/Popup";
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import RequestUserInfo from "./RequestUserInfo";
import { Clean } from "src/components/button";

export type TLegalDocFormSearch = {
	requestTime: Date,
	requestUserName?: string,
}

const ListItem = styled('li')(({ theme }) => ({
	margin: theme.spacing(0.5),
}));

type SearchProps = {
	solicitation?: TLegalDocRequestType
}

const Search = (props: SearchProps) => {
	const { t } = useTranslation()
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();
	const formik = useFormikContext<TLegalDocForm>();
	const [folder, setFolder] = useState<TProvisionProcess>()
	const { id } = useParams<{ id: string }>()
	const isNew = id === "novo"

	const process = useSelector(getProvisionsProcess);
	const processes = useSelector(getProvisionsProcesses)
	const processIsLoading = useSelector(
		getProvisionsProcessRequestScreenLoading
	);
	const { solicitationTypeAsOptions } = useSolicitationType()

	const {
		values: {
			folderNumbers, folderNumber, processNumber, 
		},
		setFieldValue
	} = formik;

	useEffect(() => {
		if (folderNumbers && folderNumbers.length !== 0 && Object.keys(process).length > 0) {
			setFolder(process)
		}
	}, [folderNumbers, process])

	useEffect(() => {
		if (processNumber && processes?.length > 0) {
			setFolder(processes[0])
			setFieldValue("folderNumbers", processes.map(x => x.folderNumber))
		}
	}, [processNumber, processes, setFieldValue])

	useEffect(() => {
		if (props.solicitation && folder) {
			if (props.solicitation.formType === LegalDocFormType.REPLACEMENT) {
				setFieldValue('prepositionReplacement.dejurAreaId', folder?.legalDepartmentAreaId)
				setFieldValue('prepositionReplacement.folderNumber', folder?.folderNumber)
			} else if (props.solicitation.formType === LegalDocFormType.PREPOSITION_LETTER) {
				setFieldValue('prepositionLetter.dejurAreaId', folder?.legalDepartmentAreaId)
				setFieldValue('prepositionLetter.folderNumber', folder?.folderNumber)
				setFieldValue('prepositionLetter.processNumber', folder?.processNumber)
			} else if (props.solicitation.formType === LegalDocFormType.ELETRONIC_PROCURATION_LEGAL) {
				setFieldValue('eletronicProcurationLegal.folderNumber', folder?.folderNumber)
				setFieldValue('eletronicProcurationLegal.processNumber', folder?.processNumber)
			} else if (props.solicitation.formType === LegalDocFormType.ELETRONIC_PROCURATION_OTHER_AREAS) {
				setFieldValue('eletronicProcurationOtherArea.processNumber', folder?.processNumber)
			}
		}
	}, [folder, props.solicitation, setFieldValue])

	useEffect(() => {
		if (!isNew) {
			dispatch(fetchProvisionsProcess(folderNumber))
		}
	}, [dispatch, folderNumber, isNew])

	const addFolderNumber = () => {
		if (folderNumbers?.includes(folderNumber)) return

		setFieldValue('folderNumbers', [...folderNumbers ?? [], folderNumber])
		setFieldValue('folderNumber', "")
	}

	const deleteFolderNumber = (folder: string) => {
		setFieldValue('folderNumbers', folderNumbers?.filter((x) => x !== folder))
	}

	const delayedFetchProcess = debounce(async (folder: string) => {
		if(folder.length === 0) return
		const { meta, payload } = await dispatch(
			fetchProvisionsProcess(folder)
		);
		if (meta.requestStatus === "rejected") {
			enqueueSnackbar(payload.title, { variant: "error" });
		}
	}, 1000);

	const delayedFetchProcessByIdentifierNumbe = debounce(async (processNumber: string) => {
		if(processNumber.length === 0) return
		const { meta, payload } = await dispatch(
			fetchProvisionsProcessByProcessNumber(processNumber)
		);
		if (meta.requestStatus === "rejected") {
			enqueueSnackbar(payload.title, { variant: "error" });
		}
	}, 1000);

	const legalDocsSignatureTypesOptions = useMemo(() => {
		return [
			{
				label: t('legalDocs:request.signatureType.eletronic'),
				value: LegalDocumentRequestSignatureEnum.Electronic,
			},
			{
				label: t('legalDocs:request.signatureType.manual'),
				value: LegalDocumentRequestSignatureEnum.Manual,
			},
		]
	}, [t])

	return (
		<>
			<Panel title={t("legalDocs:buttonNew")} withPadding>
				<Grid container spacing={3}>
					<Grid item md={3} xs={12}>
						<DateField
							name="requestDate"
							label={t("legalDocs:request.search.dateRequest")}
							readOnly
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<DateHourField
							name="requestTime"
							label={t("legalDocs:request.search.hourRequest")}
							format="HH:mm"
							views={["hours", "minutes"]}
							readOnly
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							type="text"
							label={t("legalDocs:request.search.requester")}
							name="requestUserName"
							readOnly
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<Popup
							icon={<HelpOutlineOutlinedIcon />}
							title={t("legalDocs:userInfo.title")}
						>
							<RequestUserInfo />
						</Popup>
						<Popup
							icon={<InfoOutlinedIcon />}
							title={t("legalDocs:information")}
						>
							{props.solicitation?.userInformation ?? "-"}
						</Popup>
					</Grid>
					<Grid item md={3} xs={12}>
						<SelectField
							label={t("legalDocs:request.search.requestType")}
							name="legalDocumentRequestTypeId"
							options={solicitationTypeAsOptions}
							readOnly={!isNew}
							required
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<SelectField
							label={t("legalDocs:request.signatureType.title")}
							name="signatureType"
							options={legalDocsSignatureTypesOptions}
							readOnly={!isNew}
							required
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							type="text"
							label={t("legalDocs:request.search.processNumber")}
							name="processNumber"
							onChange={(e) => {
								delayedFetchProcessByIdentifierNumbe(e.target.value)
								formik.handleChange(e)
							}}
							readOnly={!isNew}
						/>
					</Grid>
					<Grid item md={2} xs={12}>
						<TextField
							type="text"
							label={t("legalDocs:request.search.CTGFolder")}
							name="folderNumber"
							onChange={(e) => {
								delayedFetchProcess(e.target.value)
								formik.handleChange(e)
							}}
							readOnly={!isNew}
						/>
					</Grid>
					 <Clean/>
					{
						isNew && (
							<>
								<Grid item md={1} xs={12}>
									<IconButton
										color="primary"
										onClick={() => addFolderNumber()}
									>
										<AddIcon />
									</IconButton>
								</Grid>
								<Grid item md={12} xs={12}>
									<Grid container direction="column">
										<Grid item>
											<Typography variant='body2' data-testid='field-label'>
												{t("legalDocs:request.search.CTGFolders")}
											</Typography>
										</Grid>
										<Grid item>
											<Paper
												elevation={0}
												sx={{
													display: 'flex',
													flexWrap: 'wrap',
													listStyle: 'none',
													p: 0.5,
													m: 0,
												}}
												component="ul"
											>
												{
													folderNumbers?.map((folder, i) =>
														<ListItem key={i}>
															<Chip
																label={folder}
																onDelete={() => deleteFolderNumber(folder)}
															/>
														</ListItem>
													)
												}
											</Paper>
										</Grid>
									</Grid>
								</Grid>
							</>
						)
					}
				</Grid>
				<SearchInfo />
			</Panel>
			{
				folder && Object.keys(folder).length > 0 && (
					<FolderData
						process={folder}
						startExpanded
						loading={processIsLoading}
					/>
				)
			}
		</>
	)
}

export default Search;