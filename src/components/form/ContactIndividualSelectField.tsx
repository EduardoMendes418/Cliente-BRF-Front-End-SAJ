import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutocompleteInputChangeReason } from "@material-ui/lab";
import debounce from "lodash/debounce";
import { useFormikContext } from "formik";

import { AutocompleteField, FormikContext } from "src/components/form";
import { actions } from "src/core/store";

import { fetchLikeAndCpfWithoutIncludes } from "src/core/store/modules/contacts/thunks";
import { getContactsWithoutIncludes,  getIsFetchingContacts } from "src/core/store/modules/contacts/selectors";
import { t } from "src/locale/i18n";
import {  TContactWithoutIncludes } from "src/core/models/contacts";
import { TOptions } from "src/components/form/AutocompleteField";


type TContactIndividualSelectField = {
  name: string;
  label: string;
  setInvalidValueWhenTyping?: boolean;
  disabled?: boolean;
	required?: boolean;
	contactSelected: TContactWithoutIncludes | null;
	onClearContact: () => void;
	onSelectContact: (contact: TContactWithoutIncludes) => void
};

const ContactIndividualSelectField = ({
  setInvalidValueWhenTyping,
	name,
	disabled,
	required,
	onClearContact,
	onSelectContact,
	contactSelected,
  ...props
}: TContactIndividualSelectField) => {
  const dispatch = useDispatch();
	const [customError, setCustomError] = useState('');



  const { setFieldValue, submitCount, values } = useFormikContext<FormikContext>();

	function formatCPForCNPJ(param: string) {
		param = param.replace(/\D/g, '');

		if (param.length === 11) {
			return param.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
		}


		else if (param.length === 14) {
			return param.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
		}


		else {
			return param;
		}
	}

	const contacts = useSelector(getContactsWithoutIncludes);
  const loading = useSelector(getIsFetchingContacts);



	const onSelect = (selectedItem: TOptions | null) => {
    if (!selectedItem) {
			return;
		}
    const selectedContact = contacts.find(i => i.id === Number(selectedItem.value));
		if(selectedContact?.id) {
			onSelectContact(selectedContact)
			setCustomError('')
		}
  };



	const contactsOptions = useMemo(
		() =>
			contacts.slice().filter(i =>!!i.identificationNumber?.length).map((x) => ({
				label: `${x.name} - ${formatCPForCNPJ(String(x.identificationNumber))}`,
				value: x.id.toString(),

			})),
		[contacts]
	);
  useEffect(() => {

		if (submitCount === 1 && !values.favoredId && !customError)
		{
			setCustomError(t("required"));
		}
}, [submitCount, customError, values.favoredId]);


  const delayedFetch = debounce(async (value: string) => {
    		dispatch(fetchLikeAndCpfWithoutIncludes({
			notPaginate: true,
			fragment: value,
		}));

  }, 500);


  const search = useCallback(
    (value: string, reason: AutocompleteInputChangeReason) => {

      if (reason === "clear"){

        dispatch(actions.contacts.clear());
				onClearContact()
				setCustomError(t("required"));
			}
      else if (reason === "input" && value) {

        if (setInvalidValueWhenTyping) setFieldValue(name, -1);

        if (value.length >= 1) delayedFetch(value);

      }else if(reason === "input" && !value){
				onClearContact()
				setCustomError(t("required"));
			}
    },
    
    [delayedFetch, dispatch, name, setFieldValue, setInvalidValueWhenTyping]
  );


  // useEffect(() => {

  //   if (initialValues[name] && Number(initialValues[name])){
	// 		dispatch(fetchLikeAndCpfWithoutIncludes({
	// 			notPaginate: true,
	// 			fragment: 'Arthur Pereira',
	// 		}));
	// 	}

  //   else dispatch(actions.contacts.clearList(name));
  // }, [initialValues, name, dispatch]);


  return (

    <AutocompleteField
      	{...props}
		customError={customError}
		required={true}
      	options={contactsOptions}
		onSelectValue={onSelect}
      	loading={loading}
      	onValueChange={search}
	   	disabled={disabled}
	    disableField={disabled}
      	onDemand
	    name={name}
    />
  );
};

export default ContactIndividualSelectField;
