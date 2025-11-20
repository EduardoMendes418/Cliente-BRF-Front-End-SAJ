import {  useCallback, useEffect, useMemo, useState } from "react";
import { useFormikContext } from "formik";
import { useParams } from "react-router-dom";
import { cnpj } from "cpf-cnpj-validator";
import { Grid } from "@material-ui/core";
import moment from "moment";

import {
	TextField,
	DateField,
	SelectField,
	PhoneField,
	MaskField,
	ContactsAutocompleteField,
	TOptionsSelect,
} from "src/components/form";
import Panel from "src/components/Panel";
import FieldColumn from "src/components/FieldColumn";
import { Button } from "src/components/button";
import { useTranslation } from "src/locale/i18n";
import { useBanks, useStatesAndCities } from "src/hooks/fetchLists";
import { TPaymentBank, TPaymentFavoredData } from "src/core/models/payment";
import { TContact } from "src/core/models/contacts";
import { useUpdateSupplierModal } from "../../../hooks/useModal";
import { useDispatch, useSelector } from "react-redux";
import { getIntegrationsResult } from "src/core/store/modules/integrations/selectors";
import { useSnackbar } from "notistack";
import { getItemPaymentNew, listPaymentBanks } from "src/core/store/modules/payment/selectors";
import { getPaymentBanks } from "src/core/store/modules/payment/thunks";
import { TBank } from "src/core/models/banks";
import { stringToCpforCnpj } from "src/core/utils/func";
import { fetchDataSupplier } from "src/core/store/modules/integrations-sap/thunks";
import { getListDataSupplier } from "src/core/store/modules/integrations-sap/selectors";


type FavoredDataProps = {
	editable?: boolean
}

const FavoredData = (props: FavoredDataProps) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const { values, setFieldValue, setValues, resetForm } = useFormikContext<TPaymentFavoredData>();
	const [isCNPJ, setIsCNPJ] = useState(false);
	const resutlIntegration = useSelector(getIntegrationsResult);
	const [contact, setContact] = useState<TContact | null>(null);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
	const { enqueueSnackbar } = useSnackbar();
	const paymentBanks = useSelector(listPaymentBanks);
	const dataSupplierList = useSelector(getListDataSupplier);
	const item = useSelector(getItemPaymentNew) as any;

	const { statesAsOptions, citiesAsOptions } = useStatesAndCities(values.estadoId || 0);
	const { banks } = useBanks();
	const { showModal } = useUpdateSupplierModal();

	const isNew = id === "novo";

	useEffect(() => {
		setIsCNPJ(cnpj.isValid(values.cpf));
	}, [values.cpf]);

	useEffect(() => {
		if (isCNPJ) setFieldValue("dataNascimento", null);
	}, [setFieldValue, isCNPJ]);

	useEffect(() => {
		if (contact || dataSupplierList) {
			setValues({
				...values,
				nomeReclamante: isNew 
                ? (dataSupplierList.length !== 0 ? dataSupplierList[0]?.name : " ") : item?.nomeReclamante,
				cpf: isNew ? (dataSupplierList.length !== 0 ? dataSupplierList[0]?.cpfCnpj : " ") : item?.cpf,
				email: isNew ? (dataSupplierList.length !== 0 ? dataSupplierList[0]?.email : " ") : item?.email,	
				telefone: isNew ? (dataSupplierList.length !== 0 ? dataSupplierList[0]?.phone : " ") : item?.telefone,
				dataNascimento: isNew ? (dataSupplierList.length !== 0 ? dataSupplierList[0]?.birthDate : null) : item?.dataNascimento,
				endereco: isNew ? (dataSupplierList.length !== 0 ? dataSupplierList[0]?.address : " ") : item?.endereco,
				numero: isNew ? (dataSupplierList.length !== 0 ? dataSupplierList[0]?.addressNumber : " ") : item?.numero,				
				bairro: isNew ? (dataSupplierList.length !== 0 ? dataSupplierList[0]?.neighborhood : " ") : item?.bairro,				
				cep: isNew ? (dataSupplierList.length !== 0 ? dataSupplierList[0]?.areaCode : " ") : item?.cep,	
				cidadeId: isNew ? (dataSupplierList.length !== 0 ? dataSupplierList[0]?.cityId : null) : item?.cidadeId,
            	estadoId: isNew ? (dataSupplierList.length !== 0 ? dataSupplierList[0]?.stateId : null) : item?.estadoId,
           		fornecedor: isNew ? (dataSupplierList.length !== 0 ? dataSupplierList[0]?.name : " ") : item?.fornecedor,
            	fornecedorId: isNew ? (dataSupplierList.length !== 0 ? dataSupplierList[0]?.sapCodeCliFor : " ") : item?.fornecedorId
			});
		}
		
	}, [contact, setValues]);

	useEffect(() => {
		if (
			resutlIntegration &&
			resutlIntegration.findIndex((x) => x.status === "Erro") !== -1
		) {
			enqueueSnackbar(t("solicitacaoPagamento:dadosFavorecido.error"), {
				variant: "error",
			});
		}
	}, [enqueueSnackbar, resutlIntegration, t]);

	useEffect(() => {
		if (isNew) {
			resetForm();
		}
	}, [])

	const onSelectContact = async (contact: any ) => {
		await dispatch(getPaymentBanks(contact?.identificationNumber));
		const cpfCnpj = await stringToCpforCnpj(contact?.identificationNumber)
	
		const {payload} = await dispatch(fetchDataSupplier({ cpfCnpj: cpfCnpj })) as any;
	
		if(payload.status === 500){
			return enqueueSnackbar(`${payload.detail}`, {
				variant: "error",
			});
		}
		setContact(contact)
		setFieldValue('nomeReclamante', dataSupplierList[0]?.name)	
	};

	const openUpdateSupplierModal = useCallback(() => {
		setIsUpdateModalOpen(true)
		showModal({
			data: values,
			callback: (data) => {
				setValues({
					...values,
					...data,
				});
			},
		});
	}, [showModal, values, setValues]);

	useEffect(() => {
		if(isUpdateModalOpen === true) return;
		if (paymentBanks && paymentBanks.length > 0) {
			const paymentBank = paymentBanks[0];

			if (paymentBanks.length !== 0) {
				const bank = banks.find((x) => x.code === paymentBank.codBanco);
				setFieldValue("bancoId", bank?.id);
			}

			setFieldValue("agencia", paymentBank.codAgencia);
			setFieldValue("agenciaDv", paymentBank.digAgencia === null ? 0 : paymentBank.digAgencia);
			setFieldValue("conta", paymentBank.codConta);
			setFieldValue("contaDv", paymentBank.digConta);

			if (values.fornecedorId === "") {
				setFieldValue("fornecedorId", paymentBank.codsapFornTransp)
			}
		}
	}, [banks, paymentBanks, setFieldValue, values.fornecedorId]);

	const mapBanksToOptions = (banks: TBank[]): TOptionsSelect[] => banks.map((x) => ({
		label: x.name,
		value: x.id,
	}));
	
	const filterAndMapBanks = (banks: TBank[], paymentBanks: TPaymentBank[]): TOptionsSelect[] => {
		const filteredBanks = banks.filter((b) => paymentBanks?.find((x) => x.codBanco === b.code));
		return mapBanksToOptions(filteredBanks);
	};
	
	const bankOption = useMemo<TOptionsSelect[]>(
		() => {
			const options = paymentBanks ? filterAndMapBanks(banks, paymentBanks) : mapBanksToOptions(banks);
			return options.sort((a, b) => a.label.localeCompare(b.label));
		},
		[banks, paymentBanks]
	);

	return (
		<Panel
			title={t("solicitacaoPagamento:dadosFavorecido.title")}
			withPadding
			slotTopRight={ isNew && (
					<Button
						text={t("solicitacaoPagamento:dadosFavorecido.supplierChangeButton")}
						onClick={openUpdateSupplierModal}
					/>)}
			slotTopRightPermission="add"
		>
			<Grid container spacing={3}>
				<Grid item xs={12} md={4}>
					 <ContactsAutocompleteField
						filter="fragment"
						name="cpf"
						label={t("solicitacaoPagamento:dadosFavorecido.cpfcnpj")}
						optionWithSupplierCode
						onSelectContact={onSelectContact}
						readOnly={!props.editable}
					/> 
					
				</Grid>
				 <Grid item xs={12} md={8}>
					<FieldColumn
						label={t("solicitacaoPagamento:dadosFavorecido.favorecido")}
						value={values.nomeReclamante}
					/>
				</Grid> 
			</Grid>
			<Grid container spacing={3}>
				<Grid item xs={12} md={4}>
					<SelectField
						required
						name="bancoId"
						label={t("solicitacaoPagamento:dadosFavorecido.banco")}
						options={bankOption}
						readOnly={paymentBanks?.length === 1 || props.editable}
						onChange={(event: any)=> {
							const bank = banks.find(({id})=> id === event.target.value) as TBank
							const paymentBank = paymentBanks?.find(({codBanco}) => codBanco === bank?.code) as TPaymentBank
							setFieldValue("bancoId", bank?.id);
							setFieldValue("agencia", paymentBank.codAgencia);
							setFieldValue("agenciaDv", paymentBank.digAgencia === null ? 0 : paymentBank.digAgencia);
							setFieldValue("conta", paymentBank.codConta);
							setFieldValue("contaDv", paymentBank.digConta);
				
							if (values.fornecedorId === "") {
								setFieldValue("fornecedorId", paymentBank.codsapFornTransp)
							}
						}}
					/>
				</Grid>
				<Grid
					item
					xs={isNew ? 10 : 5}
					sm={isNew ? 9 : 5}
					md={isNew ? 3 : 1}
					xl={isNew ? 2 : 1}
				>
					<TextField
						label={t("solicitacaoPagamento:dadosFavorecido.agencia")}
						name="agencia"
						required
						readOnly
					/>
				</Grid>
				<Grid
					item
					xs={isNew ? 2 : 1}
					sm={isNew ? 3 : 1}
					md={isNew ? 1 : 3}
					xl={isNew ? 1 : 2}
				>
					<TextField
						label="DV"
						name="agenciaDv"
						required
						maxLength={4}
						readOnly
					/>
				</Grid>
				<Grid
					item
					xs={isNew ? 10 : 5}
					sm={isNew ? 9 : 5}
					md={isNew ? 3 : 2}
					xl={isNew ? 2 : 1}
				>
					<TextField
						required
						label={t("solicitacaoPagamento:dadosFavorecido.conta")}
						name="conta"
						readOnly
					/>
				</Grid>
				<Grid
					item
					xs={isNew ? 2 : 1}
					sm={isNew ? 3 : 1}
					md={isNew ? 1 : 2}
					xl={isNew ? 1 : 2}
				>
					<TextField
						required
						label="DV"
						name="contaDv"
						maxLength={4}
						readOnly
					/>
				</Grid>
			</Grid>
			<Grid container spacing={3}>
				<Grid
					item
					xs={isNew ? 12 : 6}
					sm={isNew ? 5 : 6}
					md={isNew ? 3 : 4}
					xl={isNew ? 2 : 3}
				>
					<DateField
						/* required={!isCNPJ} */
						name="dataNascimento"
						label={t("solicitacaoPagamento:dadosFavorecido.dataNascimento")}
						maxDate={moment()}
						disabled={contact?.birthDate !== null}
					/>
				</Grid>
				<Grid
					item
					xs={isNew ? 12 : 6}
					sm={isNew ? 7 : 6}
					md={isNew ? 5 : 4}
					xl={isNew ? 4 : 3}
				>
					<TextField
						/* required */
						name="email"
						label={t("solicitacaoPagamento:dadosFavorecido.email")}
						disabled
					/>
				</Grid>
				<Grid
					item
					xs={isNew ? 12 : 6}
					sm={isNew ? 5 : 6}
					md={4}
					xl={isNew ? 2 : 3}
				>
					<PhoneField
						/* required */
						name="telefone"
						label={t("solicitacaoPagamento:dadosFavorecido.telefone")}
						type="phone"
						disabled
					/>
				</Grid>
			</Grid>
			<Grid container spacing={3}>
				<Grid
					item
					xs={isNew ? 12 : 6}
					sm={isNew ? 7 : 6}
					md={isNew ? 3 : 4}
					xl={isNew ? 2 : 3}
				>
					<MaskField
						/* required */
						name="cep"
						mask="99.999-999"
						label={t("solicitacaoPagamento:dadosFavorecido.cep")}
						disabled
					/>
				</Grid>
				<Grid
					item
					xs={isNew ? 12 : 6}
					sm={isNew ? 8 : 6}
					md={isNew ? 7 : 4}
					xl={isNew ? 4 : 3}
				>
					<TextField
						/* required */
						name="endereco"
						label={t("solicitacaoPagamento:dadosFavorecido.endereco")}
						disabled
					/>
				</Grid>
				<Grid
					item
					xs={isNew ? 12 : 6}
					sm={isNew ? 4 : 6}
					md={isNew ? 2 : 4}
					xl={3}
				>
					<TextField
						/* required */
						name="numero"
						label={t("solicitacaoPagamento:dadosFavorecido.numero")}
						disabled
					/>
				</Grid>
			</Grid>
			<Grid container spacing={3}>
				<Grid item xs={isNew ? 12 : 6} sm={isNew ? 12 : 6} md={4} xl={3}>
					<TextField
						/* required */
						name="bairro"
						label={t("solicitacaoPagamento:dadosFavorecido.bairro")}
						disabled
					/>
				</Grid>
				<Grid item xs={isNew ? 12 : 6} sm={isNew ? 12 : 6} md={4} xl={3}>
					<SelectField
						/* required */
						name="estadoId"
						label={t("solicitacaoPagamento:dadosFavorecido.estado")}
						disabled
						options={statesAsOptions}
					/>
				</Grid>
				<Grid item xs={isNew ? 12 : 6} sm={isNew ? 12 : 6} md={4} xl={3}>
					<SelectField
						/* required */
						name="cidadeId"
						label={t("solicitacaoPagamento:dadosFavorecido.cidade")}
						disabled
						options={citiesAsOptions}
					/>
				</Grid>
			</Grid>
		</Panel>
	);
};

export default FavoredData;
