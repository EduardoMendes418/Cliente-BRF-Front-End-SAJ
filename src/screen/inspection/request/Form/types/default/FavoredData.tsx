import { useCallback, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { useParams } from "react-router-dom";
import { cnpj } from "cpf-cnpj-validator";
import { Grid } from "@material-ui/core";

import {
	ContactsAutocompleteField,
} from "src/components/form";
import Panel from "src/components/Panel";
import FieldColumn from "src/components/FieldColumn";

import { useTranslation } from "src/locale/i18n";
import { useBanks } from "src/hooks/fetchLists";
import { TPaymentFavoredData } from "src/core/models/inspection";
import { TContact } from "src/core/models/contacts";
import { useDispatch, useSelector } from "react-redux";
import { listPaymentBanks } from "src/core/store/modules/payment/selectors";
import { getPaymentBanks } from "src/core/store/modules/payment/thunks";
import { Button } from "src/components/button";
import { useUpdateSupplierModal } from "../../hooks/useModal";
import { fetchLikeAndCpfWithoutIncludes } from "src/core/store/modules/contacts/thunks";
import { stringToCpforCnpj } from "src/core/utils/func";


const FavoredData = () => {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const { values, setFieldValue, setValues } = useFormikContext<TPaymentFavoredData>();
	const [isCNPJ, setIsCNPJ] = useState(false);
	const dispatch = useDispatch();

	const paymentBanks = useSelector(listPaymentBanks);
	const { banks } = useBanks();
	const isNew = id === "novo";
	const { showModal } = useUpdateSupplierModal();
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
	
	useEffect(() => {
		setIsCNPJ(cnpj.isValid(values.cnpj));
	}, [values.cnpj]);

	useEffect(() => {
		if (isCNPJ) setFieldValue("dataNascimento", null);
	}, [setFieldValue, isCNPJ]);

	const onSelectContact = (contact: TContact) => {
		dispatch(getPaymentBanks(contact.cpfCnpj));

		setValues({
			...values,
			nomeReclamante: contact.name,
			cnpj: contact.identificationNumber ?? "",
			fornecedor: contact.name,
			fornecedorId: contact.supplierCode,
			sapCodeCliFor: contact.sapCodeCliFor
		});
	};

	useEffect(() => {
		if (paymentBanks && paymentBanks.length > 0) {
			const paymentBank = paymentBanks[0];
			if (values.fornecedorId === null) {
				setFieldValue("fornecedorId", paymentBank.codsapFornTransp);
			}
		}
	}, [banks, paymentBanks, setFieldValue, values.fornecedorId]);

	const getFavoredData = async () => {
		const {payload} = await dispatch(
			fetchLikeAndCpfWithoutIncludes({
				pageSize: 20,
				page: 1,
				fragment: values?.nomeReclamante,
			})
		) as any;
		if(payload){

		const cpfCnpjFormatted = stringToCpforCnpj(payload[0]?.identificationNumber)
		setFieldValue('cnpj', cpfCnpjFormatted)
		setFieldValue('fornecedorId', payload[0]?.sapCodeCliFor)
	}

	}

	const openUpdateSupplierModal = useCallback(() => {
		setIsUpdateModalOpen(true)
		showModal({
			data: values,
			callback: (data: any) => {
				setValues({
					...values,
					...data,
				});
			},
		});
	}, [showModal, values, setValues]);

	useEffect(() => {
		if(isNew === false){
			getFavoredData();
		}
	}, [isNew])

	return (
		<Panel title={t("solicitacaoPagamento:dadosFavorecido.title")} 
		withPadding
		slotTopRight={isNew && (
			<Button
				text={t("solicitacaoPagamento:dadosFavorecido.supplierChangeButton")}
				onClick={openUpdateSupplierModal}
			/>)}
		slotTopRightPermission="edit"
		>
			<Grid container spacing={3} >
				<Grid item md={3} xs={12}>
					{
						isNew === false ? <FieldColumn
						label={t("solicitacaoPagamento:dadosFavorecido.cpfcnpj")}
						value={values.cnpj}
					/>
					:
					<ContactsAutocompleteField
						filter="fragment"
						name="cpf"
						label={t("solicitacaoPagamento:dadosFavorecido.cpfcnpj")}
						optionWithSupplierCode
						onSelectContact={onSelectContact}      
					/> 
					}
				</Grid>
					<Grid item md={4} xs={12}>
						<FieldColumn
							label={t("solicitacaoPagamento:dadosFavorecido.favorecido")}
							value={values.nomeReclamante}
						/>
									
					</Grid>	
						<Grid item md={4} xs={12}>
							<FieldColumn
								label={"Código fornecedor"}
								value={values.sapCodeCliFor ?? values.fornecedorId}
							/>
									
						</Grid>		
				</Grid>
		</Panel>
	);
};

export default FavoredData;
