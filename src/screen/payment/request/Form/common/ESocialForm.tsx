import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Grid, IconButton } from "@material-ui/core";
import Panel from "src/components/Panel";
import { useTranslation } from "src/locale/i18n";
import QuestionAnswerRounded from "@material-ui/icons/HelpOutlineOutlined";
import { TextField, CurrencyField, DateField, SelectField, FormikContext } from "src/components/form";
import { fetchESocialRegistrationTable } from 'src/core/store/modules/e-social-registration-table/thunks';
import AccordionPanel from 'src/components/AccordionPanel';
import FileBase64Uploader from './FileBase64Uploader';
import FileListESocial from './FileListESocial';
import { useParams } from 'react-router-dom';
import { useFormikContext } from 'formik';
import { fetchESocialAreasGridList } from 'src/core/store/modules/e-social-areas/thunks';
import { modal } from 'src/components/modals';
import { getListESocialAreas } from 'src/core/store/modules/e-social-areas/selectors';
import FileSaver from 'file-saver';
import api from 'src/core/api/process';
import moment from 'moment';
import { Button } from 'src/components/button';
import ESocialExtractModal from './ESocialExtractModal';
import { fetchHelpFiles } from 'src/core/store/modules/HelpFiles/thunks';
import { useSnackbar } from 'notistack';
import Attachments from 'src/components/Attachments';
import { getPaymentSearch } from 'src/core/store/modules/payment/selectors';
import { usePaymentType } from 'src/hooks/fetchLists';
import { Modulos } from 'src/core/models/modules';
import { deletePaymentRequestFile } from 'src/core/store/modules/payment/thunks';

interface ESocialFormProps {
	uploadESocialPJC: boolean;
	setEnableButton: Function;
	attachEditable: boolean;
}

const ESocialForm = ({ uploadESocialPJC, setEnableButton, attachEditable}: ESocialFormProps) => {

	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { values, setFieldValue } = useFormikContext<FormikContext>();
	const { tipoPagamentoId } = useSelector(getPaymentSearch);
	const { paymentType } = usePaymentType(Modulos.Pagamento);
	const eSocialAreasList = useSelector(getListESocialAreas);
	const { id } = useParams<{ id: string }>();
	const [originAreaId, setOriginAreaId] = useState<number>();
	const isNew = id === "novo";
	const [typeOfContractList, setTypeOfContractList] = useState([]);
	const { enqueueSnackbar } = useSnackbar();

	const tipoPagamento = paymentType.find(({ id }) => id === tipoPagamentoId);

	const handleContractList = async () => {
		const params = {
			page:1,
			pageSize: 999,
			tableNumber: 505,
			tableIdToRemove:[142],
			notPaginate: false
		}
		
		const { payload } = await dispatch(fetchESocialRegistrationTable(params)) as any;

		const newList = payload?.items?.map(({ code, description }: any) => ({ value: code, label: description }));
		setTypeOfContractList(newList);
	}

	const getFolderData = async () => {
		const folderNumber = values?.folderNumber
		const { data } = await api.getFolder(folderNumber);
		setOriginAreaId(data?.originAreaId)
	} 

	const isDejurAreaPaymentListed = eSocialAreasList?.find(area => area.areaId ===  originAreaId);

	const handleDelete = async (file: any) => {
		if (file && file.id ) {
			dispatch(deletePaymentRequestFile(file.id));
	} 
	};

	const mustBeFilled = (type: "compensationAmount" | "remunerationAmount"): any => {
		const getOderType = (type: "compensationAmount" | "remunerationAmount"): "compensationAmount" | "remunerationAmount" => type === "compensationAmount" ? "compensationAmount": "remunerationAmount"
		try {
			if (values?.pagamentosESocial?.compensationAmount  === "R$ 0,00" && values?.pagamentosESocial?.remunerationAmount  === "R$ 0,00") return 0.01
			if ((values?.pagamentosESocial[getOderType(type)] || values?.pagamentosESocial[getOderType(type)] === "R$ 0,00") &&
				(!values?.pagamentosESocial[type] || values?.pagamentosESocial[type] !== "R$ 0,00")) return 0.01
			return undefined;
		} catch (error) {
			return 0.01;
		}
	}

	const enableExtractButton = values?.pagamentosESocial?.agreementApprovalDate !== null && values?.pagamentosESocial?.compensationAmount !== "R$ 0,00" && values?.pagamentosESocial?.endDateForESocialCalculation !== null && values?.pagamentosESocial?.remunerationAmount !== "R$ 0,00" && values.pagamentosESocial?.startDateForESocialCalculation !== null && values.pagamentosESocial?.typeOfEmploymentContract !==  "";

	const downloadEsocialManual = async () => {
		const {payload, meta} = await dispatch(fetchHelpFiles({ page: 1, pageSize: 30, search: 'Manual_eSocial'})) as any;

		if(payload?.items.length === 0){
			return enqueueSnackbar("Arquivo não disponibilizado", {
				variant: "error",
			});
		}

		if(meta?.requestStatus === 'fulfilled'){
			FileSaver.saveAs(payload?.items[0]?.pathPublish as Blob, `${payload?.items[0]?.documentName}.${payload?.items[0]?.extensionFilePublish
			}`)
		}
	}

	useEffect(() => {
		handleContractList();
		getFolderData();  
		dispatch(fetchESocialAreasGridList({}));

	},[]);

	return (
			isDejurAreaPaymentListed !== undefined ? <>   
			<Panel title={t("eSocial:eSocialFormData.title")} withPadding slotTopRightPermission="add" slotTopRight={
				<IconButton
				onClick={() => downloadEsocialManual()}
				
				>
					<QuestionAnswerRounded style={{ color: "primary", transform: "scale(1.3)" }} />
				</IconButton>
			}>
			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<SelectField 
						options={[
							{value: 1, label: "Do trânsito em julgado da decisão líquida proferida no processo trabalhista"},
							{value: 2, label: "Da homologação de acordo judicial"},
							{value: 3, label: "Do trânsito em julgado da decisão homologatória dos cálculos de liquidação da sentença"},
							{value: 4, label: "Da celebração do acordo celebrado perante CCP ou Ninte"},
							{value: 5, label: "Da determinação judicial para cumprimento antecipado da decisão, ainda que parcial"},
						]}
						label={"Tipo de decisão/acordo"}
						name="pagamentosESocial.decisionType"
						required
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<DateField
						maxDate={moment()}
						required
						name="pagamentosESocial.agreementApprovalDate"
						label={t("eSocial:eSocialFormData.agreementApprovalDate")}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CurrencyField
						name="pagamentosESocial.remunerationAmount"
						label={t("eSocial:eSocialFormData.remunerationAmount")}
						min={mustBeFilled("remunerationAmount")}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<CurrencyField
						name="pagamentosESocial.compensationAmount"
						label={t("eSocial:eSocialFormData.compensationAmount")}
						min={mustBeFilled("compensationAmount")}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<TextField
						type="number"
						name="pagamentosESocial.fgtsReflexes"
						maxLength={4}
						label={t("eSocial:eSocialFormData.FGTS")}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						name="pagamentosESocial.cprb"
						label={t("eSocial:eSocialFormData.CPRB")}
						options={[{label: "Sim", value: 1},
								{label: "Não", value: 0}
								]}
						required		
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<DateField
						required
						name="pagamentosESocial.startDateForESocialCalculation"
						label={t("eSocial:eSocialFormData.eSocialStartDate")}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<DateField
						required
						name="pagamentosESocial.endDateForESocialCalculation"
						label={t("eSocial:eSocialFormData.eSocialEndDate")}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						required
						name="pagamentosESocial.typeOfEmploymentContract"
						label={t("eSocial:eSocialFormData.employmentContractType")}
						options={typeOfContractList}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					<SelectField
						required
						name="pagamentosESocial.ESocialEvent"
						label={t("eSocial:eSocialFormData.eSocialEvent")}
						options={[
							{value: 1, label: "Principal"},
							{value: 2, label: "Liberação depósito em pagamento do líquido ao reclamante"},
							{value: 5, label: "Pagamento através depósito judicial com DARF 6092 quitado via alvará"},
							{value: 3, label: "Valor remanescente"},
							{value: 4, label: "Retificação da obrigação transmitida"},
						]}
					/>
				</Grid>
				<Grid item xs={12} md={3}>
					
					<Button
						text="Extrato"
						disabled={!enableExtractButton}
						onClick={() => modal({
							title: "Extrato de valores por Cod. Receita",
							component: <ESocialExtractModal setEnableButton={setEnableButton} isNew ={isNew} files={values?.filesEsocial} values={values?.pagamentosESocial} folderNumber={values?.folderNumber}/>,
							buttons: [],
							dialogProps: {
								maxWidth: "xl",
								showCloseButton: true,
								fullWidth: false,

							},
						})}
						/> 
					</Grid>
					<Grid item md={12} xs={12}>
						<TextField
							unlimitedLength 
							label={t("eSocial:eSocialFormData.observation")}
							name="pagamentosESocial.Observation" 
							multiline
							rows={5}
						/>
					</Grid>
					</Grid> 
					<Attachments
						name="eSocialCalcFile"
						label={t("eSocial:eSocialFormData.complianceAttachment")}
						onDelete={handleDelete}
						id="eSocialCalcFile"
					/>
					{isNew === false && tipoPagamento?.generateGuideFiles === 4 ? 
							<Attachments
									name="filesEsocial"
									accept=".pjc, .xlsx"
									label={"Anexos eSocial (Arquivo PJE-CALC/ Planilha de cálculo)"}
									multiple={false}
									onDelete={handleDelete}
									disabled={attachEditable}
									id="filesEsocial"
									/> : null}
			
			{uploadESocialPJC && isNew && <AccordionPanel title={"Anexos eSocial (Arquivo PJE-CALC / Planilha de cálculo)"} startExpanded >
				<FileBase64Uploader />
				<FileListESocial />
			</AccordionPanel>}
		</Panel>
			</> : null 
	);
};

export default ESocialForm;