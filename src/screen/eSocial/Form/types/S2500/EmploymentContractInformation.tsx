import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import {
	TextField,
	SelectField,
	DateFieldYearMonth,
	DateField,
	FormikContext,
} from "src/components/form";
import FormArray from "src/components/FormArray";
import { InfoContrType } from "src/core/models/eSocial";
import AccordionPanel from "src/components/AccordionPanel";
import { getListESocialWorkerCategory } from "src/core/store/modules/e-social-worker-category/selectors";
import { getListESocialRegistrationTable } from "src/core/store/modules/e-social-registration-table/selector";

import EmploymentRelationshipSuccessionInformationGroup from "./EmploymentRelationshipSuccessionInformationGroup";
import IdentificationPeriodCalculationBasesRefer from "./IdentificationPeriodCalculationBasesRefer";
import RemunerationInformationPaymentFrequency from "./RemunerationInformationPaymentFrequency";
import IdentificationEstablishmentResponsible from "./IdentificationEstablishmentResponsible";
import RelatedObservationsEmploymentContract from "./RelatedObservationsEmploymentContract";
import InformationPeriodsSmountsResulting from "./InformationPeriodsSmountsResulting";
import InformationEmploymentRelationship from "./InformationEmploymentRelationship";
import TsveTerminationInformation from "./TsveTerminationInformation";
import DurationEmploymentContract from "./DurationEmploymentContract";
import TerminationInformation from "./TerminationInformation";
import MudCategAtiv from "./MudCategAtiv";
import InfoCompl from "./InfoCompl";
import UnicContr from "./UnicContr";
import Abono from "./Abono";
import { MainDiv } from "../styled";
import { useFormikContext } from "formik";
import FileUploader from "../../common/FileUploader";

const yesNoOption = [
	{ value: "S", label: "Sim" },
	{ value: "N", label: "Não" },
];

const EmploymentContractInformation = () => {

	const { values, status } = useFormikContext<FormikContext>();
	const list = useSelector(getListESocialRegistrationTable);
	const worker = useSelector(getListESocialWorkerCategory);
	const initialValues: InfoContrType = {
		id: 0,
		infoContrTpContr: "",
		indContr: "S",
		dtAdmOrig: null,
		indReint: "N",
		indCateg: "N",
		indNatAtiv: "N",
		indMotDeslig: "N",
		matricula: "",
		codCateg: "",
		hrsTrab:"",
		dia: "",
		dtInicio: null,
		codCBO: "",
		natAtividade: "",
		remuneracao: [],
		tpRegTrab: "",
		tpRegPrev: "",
		dtAdm: null,
		tmpParc: "",
		duracaoTpContr: "",
		duracaoDtTerm: null,
		clauAssec: "",
		objDet: "",
		observacoes: [],
		sucessaoVincTpInsc: "",
		sucessaoVincNrInsc: "",
		matricAnt: "",
		dtTransf: null,
		dtDeslig: null,
		mtvDeslig: "",
		dtProjFimAPI: null,
		pensAlim: "",
		percAliment: "",
		vrAlim: "",
		infoTermDtTerm: null,
		mtvDesligTSV: "",
		mudCategAtiv: [],
		unicContr: [],
		ideEstabTpInsc: "",
		ideEstabNrInsc: "",
		compIni: null,
		compFim: null,
		indReperc: 0,
		indenSD: "",
		indenAbono: "",
		abono: [],
		idePeriodo: []
	};

	return (
		<FormArray
			name="infoContr"
			lable="Contratos de trabalhos"
			lableChild="Contrato de trabalho"
			initialValues={{ 
				infoContrTpContr: "", 
				indContr: "", 
				dtAdmOrig: "2004-12-06", 
				// dtAdmOrig: null, 
				indReint: "",
				indCateg: "",
				indNatAtiv: "",
				indMotDeslig: "",
				indUnic: "",
				matricula: "",
				codCateg: "",
				codCBO: "",
				natAtividade: "",
				remuneracao: [],
				tpRegTrab: "",
				dtAdm: null,
				tpRegPrev: "",
				tmpParc: "",
				clauAssec: "",
				objDet: "",
				tpContr: "",
				dtTerm: null,
				duracaoTpContr: "",
				duracaoDtTerm: "",
				observacoes: [],
				sucessaoVincTpInsc: "",
				sucessaoVincNrInsc: "",
				matricAnt: "",
				dtTransf: null,
				dtDeslig: null,
				dtDesmtvDesliglig: "",
				dtProjFimAPI: null,
				mtvDesligTSV: "",
				infoTermDtTerm: null,
				ideEstabTpInsc: "",
				ideEstabNrInsc: "",
				compIni: null,
				compFim: null,
				pagDiretoResc: "",
				repercProc: "",
				idePeriodo: [],
				unicContr: [],
				mudCategAtiv: [],
				id: 0, 
				eventLaunchId: null
			}}
			renderChildren={(index: number) => {
				return (
					<>
						<MainDiv>
							<AccordionPanel title={"Informações do contrato de trabalho"} startExpanded ativateBorder >
								<Grid container spacing={3}>

									<Grid item md={3} xs={12}>
										<SelectField
											name={`infoContr.${index}.infoContrTpContr`}
											label={
												"Tipo de contrato a que se refere o processo judicial ou a demanda submetida à CCP ou ao NINTER"
											}
											options={list
												.filter(
													({ eSocialTableNumber }: any) => eSocialTableNumber === 505
												)
												?.map(({ description, code }) => ({
													label: description,
													value: code,
												}))}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											name={`infoContr.${index}.indContr`}
											label={
												"Indicativo se o contrato possui informação no evento S-2190, S-2200 ou S-2300 no declarante"
											}
											options={yesNoOption}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<DateFieldYearMonth
											name={`infoContr.${index}.dtAdmOrig`}
											label={
												"Data de admissão original do vínculo (data de admissão antes da alteração)"
											}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											name={`infoContr.${index}.indReint`}
											label={"Reintegração do empregado"}
											options={yesNoOption}
										/>
									</Grid>

									<Grid item md={6} xs={12}>
										<SelectField
											name={`infoContr.${index}.indCateg`}
											label={
												"Indicativo se houve reconhecimento de categoria do trabalhador diferente da cadastrada (no eSocial ou na GFIP) pelo declarante"
											}
											options={yesNoOption}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											name={`infoContr.${index}.indNatAtiv`}
											label={
												"Indicativo se houve reconhecimento de natureza da atividade diferente da cadastrada pelo declarante"
											}
											options={yesNoOption}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											name={`infoContr.${index}.indMotDeslig`}
											label={
												"Indicativo se houve reconhecimento de motivo de desligamento diferente do informado pelo declarante"
											}
											options={yesNoOption}
										/>
									</Grid>
									{/* 
										// Removido do formulário na feature/158812
										<Grid item md={6} xs={12}>
											<SelectField
												name={`infoContr.${index}.indUnic`}
												label={
													"Indicativo se houve reconhecimento de unicidade contratual (declaração da continuidade do contrato de trabalho, considerando como único dois ou mais vínculos sucessivos informados no eSocial)."
												}
												options={yesNoOption}
											/>
										</Grid>  
									*/}
									{/* <Grid item md={6} xs={12}>
										<SelectField
											name={`infoContr.${index}.indUnic`}
											label={
												"Indicativo se houve reconhecimento de unicidade contratual (declaração da continuidade do contrato de trabalho, considerando como único dois ou mais vínculos sucessivos informados no eSocial)."
											}
											options={yesNoOption}
										/>
									</Grid> */}
									<Grid item md={6} xs={12}>
										<TextField
											name={`infoContr.${index}.matricula`}
											label={
												"Matrícula atribuída ao trabalhador pela empresa ou, no caso de servidor público, a matrícula constante no Sistema de Administração de Recursos Humanos do órgão"
											}
											maxLength={30}
										/>
									</Grid>

									<Grid item md={3} xs={12}>
										<SelectField
											label={"Código da categoria do trabalhador"}
											name={`infoContr.${index}.codCateg`}
											options={worker?.map((item: any) => ({value: item.code, label: item.description}))}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<DateFieldYearMonth
											name={`infoContr.${index}.dtInicio`}
											label={"Data de início da TSVE"}
										/>
									</Grid>
									
								</Grid>
							</AccordionPanel>
							<InfoCompl index={index} />
							<RemunerationInformationPaymentFrequency index={index} />
							<InformationEmploymentRelationship index={index} />
							<DurationEmploymentContract index={index} />
							<RelatedObservationsEmploymentContract index={index} />
							<EmploymentRelationshipSuccessionInformationGroup index={index}/>
							<TerminationInformation index={index} />
							<TsveTerminationInformation index={index} />
							<MudCategAtiv index={index} />
							<UnicContr index={index} />

							<IdentificationEstablishmentResponsible index={index} />
							<InformationPeriodsSmountsResulting index={index} />
							
							<AccordionPanel title={"Abono"} startExpanded ativateBorder >
								<Grid container spacing={3}>
									<Grid item md={6} xs={12}>
										<SelectField
											name={`infoContr.${index}.indenAbono`}
											label={"Informar se houve decisão para pagamento da indenização substitutiva de abono salarial"}
											options={yesNoOption}
										/>
									</Grid>
									<Abono index={index} />
								</Grid>
							</AccordionPanel>
							
							<IdentificationPeriodCalculationBasesRefer index={index} />
						</MainDiv>

					</>
				);
			}}
		/>
	);
};

export default EmploymentContractInformation;

