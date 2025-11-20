import { Grid, Box } from '@material-ui/core';
import { Formik, FormikHelpers } from 'formik';
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useMsal } from "@azure/msal-react";
import { useHistory } from 'react-router';
import { useTranslation } from 'src/locale/i18n';

import { getLastModalOpen } from 'src/core/store/modules/modals/selectors';
import { getDataCurrentUser } from "src/core/store/modules/currentUser/selectors";
import { getStatusWatson } from "src/core/store/modules/watson/selector";
import { TextField } from 'src/components/form';
import { Submit } from 'src/components/button';
import { actions } from 'src/core/store';
import { fetchUser } from "src/core/store/modules/currentUser/thunks";
import { TWatson } from 'src/core/models/watson';
import { addWatson, editWatson } from 'src/core/store/modules/watson/thunks';

const NameModal = ({ valuesWatson, isNew }: { valuesWatson: TWatson, isNew: boolean }) => {
	const dispatch = useDispatch()
	const { accounts } = useMsal();
	const { email, id: userId } = useSelector(getDataCurrentUser)
	const { t } = useTranslation();

	const statusClosures = useSelector(getStatusWatson)
	const modalId = useSelector(getLastModalOpen)
	const history = useHistory();

	useEffect(() => {
		accounts[0].username !== email && dispatch(fetchUser(accounts[0].username))
	}, [dispatch, accounts, email]);

	const initialValues: TWatson = { ...valuesWatson }

	const onSubmit = (
		values: TWatson,
		{ resetForm }: FormikHelpers<TWatson>
	) => {
		dispatch(isNew ? addWatson({ ...values, createdDate: new Date().toISOString(), userId }) : editWatson({...values, createdDate: new Date().toISOString()}));
		resetForm();
		dispatch(actions.modal.close({ modalId }));
		history.push(`/configuracoes/geral/watson`);
	}

	return <Formik
		initialValues={initialValues}
		onSubmit={onSubmit}
		enableReinitialize
	>
		{({ handleSubmit }) => (
			<form noValidate onSubmit={handleSubmit}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={12}>
						<TextField
							label={t('settings:watson.filterName')}
							name="nameFilter"
							required
						/>
					</Grid>
					<Grid item md={12} xs={12} >
						<Box sx={{ flexDirection: "row-reverse" }} className='margin-top-16' display="flex">
							<Submit submitting={statusClosures === 'fetching'} />
						</Box>
					</Grid>
				</Grid>
			</form>
		)}
	</Formik>;
};
export default NameModal;