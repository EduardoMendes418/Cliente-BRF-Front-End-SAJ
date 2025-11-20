import React, { useMemo } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import ScreenTemplate from "src/components/Screen";

import Form from "src/components/form";
import Panel from "src/components/Panel";

import { t } from "src/locale/i18n";
import { Submit } from "src/components/button";

import {
	contactTypeAsOptions,
	getItemContact,
} from "src/core/store/modules/contact/selectors";
import {
	createContact,
	editContact,
	fetchContactById,
	fetchContactEnums,
} from "src/core/store/modules/contact/thunks";
import { useSnackbar } from "notistack";

const contactsForm = () => {
	const dispatch = useDispatch();
	const { id } = useParams<{ id: string }>();
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();
	const contactTypeOptions = useSelector(contactTypeAsOptions);
	const item = useSelector(getItemContact);
	const isNew = id === "novo";

	const initialValues: any = useMemo(
		() => ({
			type: isNew === true ? null : item?.type,
			identificationNumber: isNew === true ? null : item?.identificationNumber,
			name: isNew === true ? "" : item?.name,
			countryId: isNew === true ? null : item?.countryId,
			contactAddresses:
				isNew === false && item?.contactAddresses?.length > 0
					? item.contactAddresses
					: [
							{
								isMain: false,
								street: "",
								number: "",
								complement: "",
								neighborhood: "",
								cityId: "",
								ufId: "",
								cep: "",
								countryId: 526,
								type: "",
							},
					  ],
			contactPf:
				isNew === true
					? {
							gender: null,
							employeeId: "",
							birthDate: "    ",
					  }
					: {
							gender: item?.contactPf?.gender,
							employeeId: item?.contactPf?.employeeId,
							birthDate: item?.contactPf?.birthDate,
							id: item?.contactPf?.id,
					  },
			contactPj:
				isNew === true
					? {
							businessName: "",
					  }
					: {
							businessName: item?.contactPj?.businessName,
					  },
			contactEmails:
				isNew === false && item?.contactEmails?.length > 0
					? item.contactEmails
					: [
							{
								type: "",
								email: "",
								isMain: false,
								isDeleted: false,
							},
					  ],
			contactPhones:
				isNew === false && item?.contactPhones?.length > 0
					? item.contactPhones
					: [
							{
								number: "",
								type: "",
								isMain: false,
								isDeleted: false,
							},
					  ],
		}),
		[item, isNew]
	);

	const onSubmit = async (values: any) => {
		const filteredContactEmails = Array.isArray(values.contactEmails)
			? values.contactEmails.filter(
					(email: any) => email.type !== "" || email.email !== ""
			  )
			: [];

		const filteredContactPhones = Array.isArray(values.contactPhones)
			? values.contactPhones.filter(
					(phone: any) => phone.type !== "" || phone.number !== ""
			  )
			: [];

		const filteredAddresses = Array.isArray(values.contactAddresses)
			? values.contactAddresses.filter(
					(address: any) => address.type !== "" || address.number !== ""
			  )
			: [];

		const dataToSend = {
			...values,
			contactEmails: filteredContactEmails,
			contactPhones: filteredContactPhones,
			contactAddresses: filteredAddresses,
		};

		if (values.type === 1) {
			delete dataToSend.contactPj;
		} else if (values.type === 2) {
			delete dataToSend.contactPf;
		}

		if (isNew) {
			const { payload } = (await dispatch(createContact(dataToSend))) as any;

			if (payload?.status === 400) {
				return enqueueSnackbar(`Erro: ${payload?.detail}`, {
					variant: "error",
				});
			} else {
				enqueueSnackbar("Contato criado com sucesso", { variant: "success" });
				history.goBack();
			}
		} else {
			const { payload } = (await dispatch(
				editContact({ ...dataToSend, id: id })
			)) as any;

			if (payload?.status === 400) {
				return enqueueSnackbar(`Erro: ${payload?.detail}`, {
					variant: "error",
				});
			} else {
				enqueueSnackbar("Contato editado com sucesso", { variant: "success" });
				history.goBack();
			}
		}
	};

	useEffect(() => {
		dispatch(fetchContactEnums());
	}, []);

	useEffect(() => {
		if (isNew === false && id) {
			dispatch(fetchContactById(Number(id)));
		}
	}, [isNew]);

	return (
		<ScreenTemplate>
			<Form
				enableReinitialize
				initialValues={initialValues}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, isSubmitting, dirty}) => (
					<form noValidate onSubmit={handleSubmit}>
						<Panel
							title={
								isNew === true
									? t("contacts:contactRegister")
									: t("contacts:contactEdit")
							}
							withPadding
							slotBottomRight={
								<Submit
									isNew={isNew}
									submitting={isSubmitting}
									disabled={!dirty}
								/>
							}
							slotBottonRightPermission={isNew ? "add" : "edit"}
						>
							teste
						</Panel>
					</form>
				)}
			</Form>
		</ScreenTemplate>
	);
};

export default contactsForm;
