import {  Grid } from "@material-ui/core"
import { Formik, useFormikContext } from "formik"
import moment from "moment"
import { useCallback, useEffect, useState } from "react"
import FieldColumn from "src/components/FieldColumn"
import { ContactsAutocompleteField, DateField, MaskField, PhoneField, SelectField, TextField } from "src/components/form"
import { TContact } from "src/core/models/contacts"
import { SupplierUpdateRequestData, TPaymentFavoredData } from "src/core/models/payment"
import { useBanks, useStatesAndCities } from "src/hooks/fetchLists"
import { t } from "src/locale/i18n"
import { cnpj } from "cpf-cnpj-validator";
import { Submit, Button } from "src/components/button"
import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { actions, AppDispatch } from 'src/core/store';
import { useSnackbar } from "notistack"
import { updateSupplier } from "src/core/store/modules/payment-update-supplier/thunks"
import { listPaymentBanks } from "src/core/store/modules/payment/selectors";
import { getPaymentBanks } from "src/core/store/modules/payment/thunks";

export type Props = {
	data: any,
	callback: (data: TPaymentFavoredData) => void;
}

type InternalProps =  {
	onCloseModal: () => void
}

const InternalComponent: React.FC<InternalProps> = (props) => {

	const { values, setFieldValue, setValues, handleSubmit } = useFormikContext<TPaymentFavoredData>();
	const [isCNPJ, setIsCNPJ] = useState(false);

	useEffect(() => {
		setIsCNPJ(cnpj.isValid(values.cpf));
	}, [values.cpf]);

	const { banksAsOptions } = useBanks();

	const dispatch = useDispatch();

	const paymentBanks = useSelector(listPaymentBanks);
	const { banks } = useBanks();

	const { statesAsOptions, citiesAsOptions } = useStatesAndCities(
		values.estadoId || 0
	);

	 const onSelectContact = (contact: TContact) => {
		dispatch(getPaymentBanks(contact.cpfCnpj));
		setValues({
			...values,
			nomeReclamante: contact.name,
			cpf: contact.cpfCnpj ?? "",
			email: contact.email,
			telefone: contact.phone ?? "",
			dataNascimento: contact.birthDate,
			endereco: contact.address,
			numero: contact.addressNumber,
			bairro: contact.neighborhood,
			cep: contact.areaCode,
			cidadeId: contact.cityId,
			estadoId: contact.stateId,
			fornecedor: contact.name,
			fornecedorId: contact.sapCodeCliFor ?? "",
		}); 
	}; 

	useEffect(() => {
		if (paymentBanks && paymentBanks.length > 0) {
			const paymentBank = paymentBanks[0];

			if (paymentBanks.length === 1) {
				const bank = banks.find((x: { code: any }) => x.code === paymentBank.codBanco);
				setFieldValue("bancoId", bank?.id);
			}

			setFieldValue("agencia", paymentBank.codAgencia);
			setFieldValue("agenciaDv", paymentBank.digAgencia);
			setFieldValue("conta", paymentBank.codConta);
			setFieldValue("contaDv", paymentBank.digConta);

			 if (values.fornecedorId === null) {
				setFieldValue("fornecedorId", paymentBank.codsapFornTransp)
			} 
		}
	}, [banks, paymentBanks, setFieldValue, values.fornecedorId]);


	return (

	<form 
	noValidate 
	onSubmit={handleSubmit}
	>
		<Grid container spacing={3}>
			<Grid item xs={12} md={4}>
				<ContactsAutocompleteField
					filter="cpfCnpj"
					name="cpf"
					label={t("solicitacaoPagamento:dadosFavorecido.cpfcnpj")}
					onSelectContact={onSelectContact}
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
				options={banksAsOptions}
				 />
			</Grid>
			<Grid item xs={10} sm={9} md={3} xl={2}>
				<TextField
					label={t("solicitacaoPagamento:dadosFavorecido.agencia")}
					name="agencia"
					required
				/>
			</Grid>
			<Grid item xs={2} sm={3} md={1} xl={1}
			>
			<TextField label="DV" name="agenciaDv" required maxLength={4} />
			</Grid>
			<Grid item xs={10} sm={9} md={3} xl={2}>
				<TextField
					required
					label={t("solicitacaoPagamento:dadosFavorecido.conta")}
					name="conta"
				/>
			</Grid>
			<Grid item xs={2}  sm={3} md={1} xl={1}>
				<TextField required label="DV" name="contaDv" maxLength={4} />
			</Grid>
		</Grid>
		<Grid container spacing={3}>
			<Grid item xs={12} sm={5} md={3} xl={2}>
				<DateField
					required={!isCNPJ}
					name="dataNascimento"
					label={t("solicitacaoPagamento:dadosFavorecido.dataNascimento")}
					maxDate={moment()}
				/>
			</Grid>
			<Grid item xs={12} sm={7} md={5} xl={4}>
				<TextField
					required
					name="email"
					label={t("solicitacaoPagamento:dadosFavorecido.email")}
				/>
			</Grid>
			<Grid item xs={12} sm={5} md={4} xl={2}>
				<PhoneField
					required
					name="telefone"
					label={t("solicitacaoPagamento:dadosFavorecido.telefone")}
					type="phone"
				/>
			</Grid>
		</Grid>
		<Grid container spacing={3}>
			<Grid item xs={12} sm={7} md={3} xl={2}>
				<MaskField
					required
					name="cep"
					mask="99999-999"
					minLength={9}
					label={t("solicitacaoPagamento:dadosFavorecido.cep")}
					type="cep"
				/>
			</Grid>
			<Grid item xs={12} sm={8} md={7} xl={4}>
				<TextField
					required
					name="endereco"
					label={t("solicitacaoPagamento:dadosFavorecido.endereco")}
				/>
			</Grid>
			<Grid item xs={12} sm={4} md={2} xl={3}>
				<TextField
					required
					name="numero"
					label={t("solicitacaoPagamento:dadosFavorecido.numero")}
				/>
			</Grid>
		</Grid>
		<Grid container spacing={3}>
			<Grid item xs={12} sm={12} md={4} xl={3}>
				<TextField
					required
					name="bairro"
					label={t("solicitacaoPagamento:dadosFavorecido.bairro")}
				/>
			</Grid>
			<Grid item xs={12} sm={12} md={4} xl={3}> 
					<SelectField
					required
					name="estadoId"
					label={t("solicitacaoPagamento:dadosFavorecido.estado")}
					options={statesAsOptions}
				/> 
			</Grid>
			<Grid item xs={12} sm={12} md={4} xl={3}>
					<SelectField
					required
					name="cidadeId"
					label={t("solicitacaoPagamento:dadosFavorecido.cidade")}
					options={citiesAsOptions}
				/>  
			</Grid>
			<Grid container justifyContent="flex-end" className='margin-top-16'>
				<Grid item xs={12} md={2} style={{ textAlign: 'end' }}>
					<Button
						text={t("solicitacaoPagamento:dadosFavorecido.backButton")}
						onClick={props.onCloseModal}
						variant="text"
					/>
					<Submit text={t("solicitacaoPagamento:dadosFavorecido.sendButton")} />
				</Grid>
			</Grid>
		</Grid>
	</form>
	)
}

const UpdateSupplierModal: React.FC<Props> = (props) => {
	const modalId = useSelector(getLastModalOpen);
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();

	const backHandler = useCallback(() => {
		dispatch(actions.modal.close({ modalId }));
	}, [dispatch, modalId])

	const handleSubmit = useCallback(async (form: TPaymentFavoredData) => {
		 const body: SupplierUpdateRequestData = {
			cpf: form.cpf,
			bancoId: Number(form.bancoId),
			agencia: form.agencia,
			agenciaDv: form.agenciaDv,
			conta: form.conta,
			contaDv: form.contaDv,
			dataNascimento: form.dataNascimento,
			email: form.email,
			telefone: form.telefone,
			cep: form.cep,
			endereco: form.endereco,
			numero: form.numero,
			bairro: form.bairro,
			cidadeId: Number(form.cidadeId),
			estadoId: Number(form.estadoId),
			fornecedorId: form.fornecedorId?.toString() ?? '',
			nomeReclamante: form.nomeReclamante
		};

		const { payload, meta } = await dispatch(updateSupplier(body))

		if(meta.requestStatus === "rejected") {

			return enqueueSnackbar(`Ocorreu um erro com a solicitação: ${payload.detail}`, {
				variant: 'error'
			})
		}

		if (payload.messageType === 'S') {
			enqueueSnackbar("Atualização realizada com sucesso", {
				variant: 'success'
			})

			props.callback(form);

			return backHandler()
		}

		return enqueueSnackbar(`Ocorreu um erro com a solicitação: ${payload.message}`, {
			variant: 'error'
		}) 

	}, [dispatch, enqueueSnackbar, backHandler, props])
	return (<Formik initialValues={props.data} onSubmit={handleSubmit} >
		{() => <InternalComponent onCloseModal={backHandler} />}
	</Formik>)
}

export default UpdateSupplierModal;