import { Form, FormikProvider, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Attachments from "src/components/Attachments";
import JustificationModal, { TForm as JustificationForm } from "src/components/JustificationModal";
import { modal } from "src/components/modals";
import ScreenTemplate from "src/components/Screen";
import { LegalDocumentPrepositionLetterPartyEnum, LegalDocumentPrepositionReplacementPartyEnum, LegalDocumentRequestStatusEnum, TLegalDoc, TLegalDocumentInput } from "src/core/models/legal-document-request";
import { TLegalDocRequestType } from "src/core/models/legal-document-request-types";
import { AppDispatch } from "src/core/store";
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import { fetchLegalDocReqTypes } from "src/core/store/modules/legal-document-request-types/thunks";
import { getItemLegalDocRequest } from "src/core/store/modules/legal-document-request/selectors";
import { addLegalDocRequest, editLegalDocRequest, getLegalDocRequest, setStatusDocRequest } from "src/core/store/modules/legal-document-request/thunks";
import { useSolicitationType } from "src/hooks/legalDocuments";
import { useTranslation } from "src/locale/i18n";
import { LegalDocFormType } from "src/screen/settings/legal-documents/utils/constants";
import { useInitialValues } from "../hooks/initial-values";
import Buttons from "./common/Buttons";
import Search, { TLegalDocFormSearch } from "./common/Search";
import EletronicProcurationLegal, { EletronicProcurationLegalHandler } from "./types/eletronic-procuration-legal";
import EletronicProcurationLegalSolicitation, { EletronicSolicitationHandler } from "./types/eletronic-procuration-legal/EletronicProcurationLegalSolicitation";
import EletronicProcurationOtherAreas, { EletronicProcurationOtherAreasHandler } from "./types/eletronic-procuration-other-areas";
import EletronicProcurationOtherAreasSolicitation from "./types/eletronic-procuration-other-areas/EletronicProcurationOtherAreasSolicitation";
import Preposition, { PrepositiontHandler } from "./types/preposition";
import PrepositionSolicitation from "./types/preposition/PrepositionSolicitation";
import Replacement, { ReplacementHandler } from "./types/replacement";
import ReplacementSolicitation, { SolicitationHandler } from "./types/replacement/ReplacementSolicitation";
import { confirm } from 'src/components/modals';

export type TLegalDocForm = TLegalDoc & TLegalDocFormSearch & TLegalDocumentInput

const LegalDocumentForm = () => {
	const { t } = useTranslation()
	const [docType, setDocType] = useState<LegalDocFormType | undefined>()
	const [solicitation, setSolicitation] = useState<TLegalDocRequestType | undefined>();
	const dispatch = useDispatch<AppDispatch>()
	const { id } = useParams<{ id: string }>()
	const isNew = id === "novo"
	const { enqueueSnackbar } = useSnackbar()
	const history = useHistory()
	const user = useSelector(getDataCurrentUser)
	const item = useSelector(getItemLegalDocRequest)

	const initialValues = useInitialValues()
	const replacement = useRef<ReplacementHandler>(null)
	const preposition = useRef<PrepositiontHandler>(null)
	const eletronicLegal = useRef<EletronicProcurationLegalHandler>(null)
	const eletronicOtherAreas = useRef<EletronicProcurationOtherAreasHandler>(null)
	const solicitations = useRef<SolicitationHandler>(null)
	const eletronicSolicitations = useRef<EletronicSolicitationHandler>(null)

	useEffect(() => {
		if (!isNew) {
			dispatch(getLegalDocRequest(Number(id)))
			dispatch(fetchLegalDocReqTypes({
				notPaginate: true
			}))
		}
	}, [dispatch, id, isNew])

	const files = useFormik<{
		files?: FileList
	}>({
		initialValues: {
			files: isNew ? [] as unknown as FileList : item?.files,
		},
		enableReinitialize: true,
		onSubmit: () => {
		}
	})

	const formik = useFormik<TLegalDocForm>({
		initialValues,
		enableReinitialize: true,
		onSubmit: async (values, { setSubmitting }) => {
			if (values.prepositionReplacement && docType === LegalDocFormType.REPLACEMENT) {
				const company = values.inputs?.company
				const extraData = replacement.current?.getExtraData()
				const parties = replacement.current?.getParties()
				const process = replacement.current?.getProcess()

				if (!company || !extraData || !parties || !process) {
					return
				}

				if (!values.prepositionReplacement) {
					return
				}

				solicitations.current?.updateCompany()

				values.prepositionReplacement = {
					...values.prepositionReplacement,
					...extraData,
					parties: [
						{
							...company,
							partyType: LegalDocumentPrepositionReplacementPartyEnum.Company
						},
						...parties,
					],
					processes: process,
				}
			}

			if (values.prepositionLetter && docType === LegalDocFormType.PREPOSITION_LETTER) {
				const company = values.inputs.company
				const parties = preposition.current?.getParties()
				const process = preposition.current?.getProcess()

				if (!company || !parties || !process) {
					return
				}

				if (!values.prepositionLetter) {
					return
				}

				solicitations.current?.updateCompany()

				values.prepositionLetter = {
					...values.prepositionLetter,
					parties: [
						{
							...company,
							partyType: LegalDocumentPrepositionLetterPartyEnum.Company
						},
						...parties
					],
					processes: process
				}
			}

			if (values.eletronicProcurationLegal && docType === LegalDocFormType.ELETRONIC_PROCURATION_LEGAL) {
				const granteds = eletronicLegal.current?.getGranteds();
				const extraData = eletronicLegal.current?.getExtraData();

				if (!granteds) {
					return
				}

				eletronicSolicitations.current?.updateGrantor()

				values.eletronicProcurationLegal = {
					...values.eletronicProcurationLegal,
					...extraData,
					granteds: granteds
				}
			}

			if (values.eletronicProcurationOtherArea && docType === LegalDocFormType.ELETRONIC_PROCURATION_OTHER_AREAS) {
				const granteds = eletronicOtherAreas.current?.getGranteds();
				const extraData = eletronicOtherAreas.current?.getExtraData();

				if (!granteds) {
					return
				}
				
				eletronicSolicitations.current?.updateGrantor()

				values.eletronicProcurationOtherArea = {
					...values.eletronicProcurationOtherArea,
					...extraData,
					granteds: granteds
				}
			}

			const form: TLegalDoc = {
				...values,
				...files.values
			}

			if (solicitation?.folderNumberRequired && form.folderNumbers?.length === 0) {
				enqueueSnackbar("Insira pelo menos uma Pasta/CTG", { variant: "error" })
			}

			if (isNew) {
				const { meta, payload } = await dispatch(addLegalDocRequest(form))

				if (meta.requestStatus === "rejected") {
					const details = JSON.parse(payload.detail)
					enqueueSnackbar(details.logs[0].message, { variant: "error" })
				}
			} else {

				const { meta, payload } = await dispatch(editLegalDocRequest(form))

				if (meta.requestStatus === "rejected") {
					const details = JSON.parse(payload.detail)
					enqueueSnackbar(details.logs[0].message, { variant: "error" })
				}
			}

			setSubmitting(false)
		},
	})

	const { legalDocumentRequestTypeId, folderNumbers, folderNumber } = formik.values;

	const { solicitationType } = useSolicitationType()

	useEffect(() => {
		const solicitationFind = solicitationType.find(x => x.id === legalDocumentRequestTypeId)

		if (solicitationFind?.formType !== docType && solicitationFind?.formType !== "") {
			setDocType(solicitationFind?.formType)
			setSolicitation(solicitationFind)
		}

		if (solicitationFind?.id !== solicitation?.id) {
			setSolicitation(solicitationFind)
		}
	}, [docType, legalDocumentRequestTypeId, solicitation?.id, solicitationType])

	const onSave = () => {
		formik.submitForm()
	}

	const onSend = () => {
		dispatch(setStatusDocRequest({
			id: Number(id),
			status: LegalDocumentRequestStatusEnum.InTreatment,
			observation: "",
			responsibleUserId: Number(user.id)
		}))
	}

	const onBack = async () => {
		const isConfirmed = await confirm('Você voltará a página anterior e suas alterações serão perdidas. Tem certeza que deseja continuar?', 'Atenção:')
		if(isConfirmed)
		history.goBack()
	}

	const onJustify = () => {
		const component = (
			<JustificationModal
				onSubmitJustification={(justification: JustificationForm) => onCancel(justification)}
				moduloId={11}
			/>
		)

		modal({
			title: t("legalDocs:cancel"),
			component,
			buttons: [],
			dialogProps: { maxWidth: 'md', showCloseButton: true, fullWidth: true },
		})
	}

	const onCancel = (justification: JustificationForm) => {
		dispatch(setStatusDocRequest({
			id: Number(id),
			status: LegalDocumentRequestStatusEnum.Cancelled,
			observation: justification.justification,
			responsibleUserId: Number(user.id)
		}))
	}

	const isFolderNumberSet = (folderNumbers && folderNumbers?.length > 0) || !!folderNumber

	return (
		<ScreenTemplate>
			<FormikProvider
				value={formik}
			>
				<Form noValidate>
					<Search solicitation={solicitation} />
					{
						solicitation && (
							<>
								{
									docType === LegalDocFormType.REPLACEMENT && (
										<ReplacementSolicitation
											ref={solicitations}
											solicitation={solicitation}
											isFolderNumberSet={isFolderNumberSet}
											values={formik.values}
										/>
									)
								}
								{
									docType === LegalDocFormType.PREPOSITION_LETTER && (
										<PrepositionSolicitation
											ref={solicitations}
											solicitation={solicitation}
											isFolderNumberSet={isFolderNumberSet}
											values={formik.values}
										/>
									)
								}
								{
									docType === LegalDocFormType.ELETRONIC_PROCURATION_LEGAL && (
										<EletronicProcurationLegalSolicitation
											ref={eletronicSolicitations}
											solicitation={solicitation}
											isFolderNumberSet={isFolderNumberSet}
										/>
									)
								}
								{
									docType === LegalDocFormType.ELETRONIC_PROCURATION_OTHER_AREAS && (
										<EletronicProcurationOtherAreasSolicitation
											ref={eletronicSolicitations}
											solicitation={solicitation}
											isFolderNumberSet={isFolderNumberSet}
										/>
									)
								}
							</>
						)
					}
				</Form>
			</FormikProvider>
			{
				solicitation && (
					<>
						{
							docType === LegalDocFormType.REPLACEMENT && (
								<Replacement
									ref={replacement}
									solicitation={solicitation}
								/>
							)
						}
						{
							docType === LegalDocFormType.PREPOSITION_LETTER && (
								<Preposition ref={preposition} />
							)
						}
						{
							docType === LegalDocFormType.ELETRONIC_PROCURATION_LEGAL && (
								<EletronicProcurationLegal
									ref={eletronicLegal}
									solicitation={solicitation}
								/>
							)
						}
						{
							docType === LegalDocFormType.ELETRONIC_PROCURATION_OTHER_AREAS && (
								<EletronicProcurationOtherAreas
									ref={eletronicOtherAreas}
									solicitation={solicitation}
								/>
							)
						}
					</>
				)
			}
			{
				solicitation && (
					<FormikProvider value={files}>
						<Form noValidate>
							<Attachments name="files" multiple />
						</Form>
					</FormikProvider>
				)
			}
			<Buttons onSave={onSave} onSend={onSend} onBack={onBack} onCancel={onJustify} />
		</ScreenTemplate>
	);
};

export default LegalDocumentForm;
