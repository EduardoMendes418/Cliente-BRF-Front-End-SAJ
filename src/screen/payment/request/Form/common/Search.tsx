import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Checkbox, FormControlLabel, Grid } from "@material-ui/core";
import { Clean, Submit } from "src/components/button";
import { Formik, FormikHelpers } from "formik";

import { TextField, SelectField, TOptionsSelect} from "src/components/form";
import Panel from "src/components/Panel";
import SearchInfo from "src/components/SearchInfo";

import { useDispatch, useSelector } from "react-redux";
import { actions } from "src/core/store";
import { useTranslation } from "src/locale/i18n";
import {
	getProcessStatus,
	getProcessError,
} from "src/core/store/modules/process/selectors";
import { fetchProcessFolderPaymentRequest } from "src/core/store/modules/process/thunks";
import { TPayment } from "src/core/models/payment";
import { usePaymentType, usePaymentMethod } from "src/hooks/fetchLists";
import { Modulos } from "src/core/models/modules";
import { fetchPaymentType } from "src/core/store/modules/payment-type/thunks";
import ModalESocialLink from '../../components/modalESocialLink';
import { getListESocialAreas } from "src/core/store/modules/e-social-areas/selectors";
import { confirmEsocial } from "src/components/modals";
import { getPaymentSearch } from "src/core/store/modules/payment/selectors";
import { fetchESocialAreasGridList } from "src/core/store/modules/e-social-areas/thunks";
import api from 'src/core/api/process';

type TSearchForm = {
	folderNumber: string;
	tipoPagamentoId: number | "";
	formaPagamentoId: number | "";
};

type Props = {
	item?: TPayment;
	loading: boolean;
	hasItem: boolean;
	paymentMethodSelectedOptions: TOptionsSelect[];
	verifyPaymentStatus?: any;
	setRenderComponents: any
};

const Search = ({
	item,
	loading,
	hasItem,
	paymentMethodSelectedOptions,
	verifyPaymentStatus,
	setRenderComponents
}: Props) => {
	const location = useLocation();
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const eSocialTaxRequest = location.pathname.includes("/pagamentos/solicitacao-imposto");

	const closed = useSelector(getProcessStatus);
	const error = useSelector(getProcessError);

	const { paymentTypeAsOptions } = usePaymentType(Modulos.Pagamento, eSocialTaxRequest);
	const [verifyStatusId, setVerifyStatusId] = useState<boolean>(false);
	const [paymentTypeStatus, setPaymentTypeStatus] = useState<boolean>(true);
	const [eSocialRestriction, setESocialRestriction] = useState<boolean>(false);
	const [checkbox, setCheckbox] = useState(false);
	const [originAreaId, setOriginAreaId] = useState<number>();
	const [folderNumberToSend, setFolderNumberToSend] = useState<string>('')

	const initialValues: TSearchForm = {
		folderNumber: "",
		tipoPagamentoId: "",
		formaPagamentoId: "",
		...item,
	};

	const { allPaymentMethodAsOptions } = usePaymentMethod(Modulos.Pagamento);
	const {  tipoPagamentoId } = useSelector(getPaymentSearch);

	const { paymentType } = usePaymentType(Modulos.Pagamento);
	const listESocialAreas = useSelector(getListESocialAreas);
	const tipoPagamento = paymentType.find(({ id }) => id === tipoPagamentoId);

	useEffect(() => {
		item?.tipoPagamentoId &&
			dispatch(actions.paymentRequest.setPaymentTypeId(item.tipoPagamentoId));
		item?.formaPagamentoId &&
			dispatch(
				actions.paymentRequest.setPaymentMethodId(item.formaPagamentoId)
			);
	}, [dispatch, item]);

	const onChangePaymentType = (e: any, setFieldValue: Function) => {		
		dispatch(actions.paymentRequest.setPaymentTypeId(Number(e.target.value)));
		dispatch(actions.paymentRequest.setPaymentMethodId(""));

		setFieldValue("formaPagamentoId", "");
	};

	const onChangePaymentMethod = (e: any) =>
		dispatch(actions.paymentRequest.setPaymentMethodId(Number(e.target.value)));

	const checkPaymentType = async (id: number,  setSubmitting: any) => {
		setSubmitting(true)
			
	const { payload } = await dispatch(fetchPaymentType({ id })) as any;
		setESocialRestriction(payload?.eSocialRestriction)	
		setPaymentTypeStatus(payload?.solicitarPagamentoBaixaProvisoria);
		verifyPaymentStatus(payload?.solicitarPagamentoBaixaProvisoria);
	}	

	useEffect(() => {
		dispatch(fetchESocialAreasGridList({}))
	}, [])

	const getFolderData = async () => {
		if(folderNumberToSend !== ""){
		const { data } = await api.getFolder(folderNumberToSend);
		setOriginAreaId(data?.originAreaId)
		}
	} 

	useEffect(() => {
		getFolderData();
	}, [folderNumberToSend])


	const onSubmit = async (
		{ folderNumber, tipoPagamentoId }: TSearchForm,
		{ setSubmitting }: FormikHelpers<TSearchForm>
	) => {
		const { payload } = await dispatch(fetchProcessFolderPaymentRequest({ folderNumber, tipoPagamentoId })) as any;
	
		const isDejurAreaPaymentListed = await listESocialAreas?.find(area => area.areaId ===  originAreaId); 

		if(isDejurAreaPaymentListed !== undefined){
			if(tipoPagamento?.gerarBensGarantias === true || tipoPagamento?.generateGuideFiles === 4 && tipoPagamento?.eSocialRestriction === false){ 
			setRenderComponents(false)
			const isConfirmed = await confirmEsocial("Antes de solicitar um novo pagamento de acordo/condenação, verifique se já houve algum pagamento/liberação de garantia anterior e que tenha incidido e recolhido tributo, contribuição previdenciária e FGTS.",
				
				"Avalie e disponibilize o arquivo base (PJeCalc ou Excel) que contemple exclusivamente as informações necessárias para esse novo pagamento e transmissão do E-Social RT.", "Atenção", '', true)
				setRenderComponents(isConfirmed)
				if (!isConfirmed) return;
			}
		}  

			if(payload?.statusId === 3){
				setVerifyStatusId(true)
			}

		await dispatch(actions.paymentRequest.setFolderNumber(folderNumber));
		
		await checkPaymentType(+tipoPagamentoId, setSubmitting)

		setSubmitting(false);
	};
	
	const paymentRequestPermission = verifyStatusId && paymentTypeStatus === false ? false : true;

	return (
		<Panel title={t("solicitacaoPagamento:title")} withPadding>
			<Formik
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, dirty, submitCount, isSubmitting, setFieldValue, values }) => (					
					<>
					{setFolderNumberToSend(values.folderNumber)}
						{
							checkbox === false ? 
								<ModalESocialLink 
									eSocialRestriction={eSocialRestriction}
									folderNumber={values.folderNumber} 
									isSubmitting={isSubmitting} 
								/>	: null
							
						}						
						<form noValidate onSubmit={handleSubmit}>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<TextField
										required
										name="folderNumber"
										label={t("form.CTG")}
										readOnly={hasItem}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										required
										name="tipoPagamentoId"
										label={t("Pagamentos:tipoPagamento")}
										options={paymentTypeAsOptions}
										onChange={(e: any) => onChangePaymentType(e, setFieldValue)}
										readOnly={hasItem}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<SelectField
										required
										name="formaPagamentoId"
										label={t("Pagamentos:formaPagamento")}
										options={!dirty ? allPaymentMethodAsOptions : paymentMethodSelectedOptions}
										onChange={onChangePaymentMethod}
										readOnly={hasItem}
									/>
								</Grid>
								{
									eSocialTaxRequest === true ?
										<Grid item md={3} xs={12}>
											<FormControlLabel
											labelPlacement={"end"} 
											control={
												<Checkbox
													color="primary"
													checked={checkbox}
													onChange={() => {
													setCheckbox((state) => !state);
												}}
											/>} 
											label="DARF sem pagamento referência" 
									/>									
									</Grid> : null
								}
								{!hasItem && (
									<Grid item md={11} xs={6} style={{ textAlign: "right" }}>
										<Submit
											type="search"
											submitting={loading}
											disabled={!dirty}
										/>
									</Grid>
								)}
							</Grid>
							{!hasItem && (
								<Clean
									action="paymentRequest"
									disabled={!submitCount || loading}
								/>
							)}
						</form>
					</>
				)}
			</Formik>
			{!loading && <SearchInfo closed={paymentRequestPermission === true ? false : closed} error={error} />}
		</Panel>
	);
};

export default Search;
