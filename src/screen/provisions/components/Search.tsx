import { Box, Grid, Typography } from '@material-ui/core'
import { Formik, FormikHelpers } from 'formik'
import { useSelector } from "react-redux";
import apiProvisionAccounting from 'src/core/api/provision-accounting'
import { useSnackbar } from "notistack";

import Panel from 'src/components/Panel'
import { NumericField, Upload } from 'src/components/form'
import { Submit } from 'src/components/button'
import { t } from 'src/locale/i18n'
import { 
	Button, 
	CircularProgress 
} from "@material-ui/core";
import { getOrders } from "src/core/store/modules/provision-order/selectors";
import { useCallback, useState } from 'react';

type FilterForm = {
	folderNumber: string
	formFile?: FileList
}

const initialValues: FilterForm = {
	folderNumber: '',
	formFile: undefined
}

type SearchProps = {
	title: string
	onSearch: (folderNumber: string, formFile?: FileList) => void
	isLoading: boolean
	message?: string
	file?: boolean,
	generateGps?: boolean
}

const Search = ({ title, onSearch, isLoading, message, file, generateGps }: SearchProps) => {
	const { enqueueSnackbar } = useSnackbar();
	const [folderNumber, setFolderNumber] = useState<null | string>(null)
	const [isLoadingAccount, setIsLoadingAccount] = useState<boolean>(false)
	
	const orders: any[] = useSelector(getOrders);
	const filtredAccountingError = orders.filter(({orderStatus}) => orderStatus.id === 5)

	const onSubmit = ({ folderNumber, formFile }: FilterForm, { setSubmitting, resetForm }: FormikHelpers<FilterForm>) => {
		setFolderNumber(folderNumber)
		onSearch(folderNumber, formFile)
		setSubmitting(false)

		if (formFile) {
			resetForm()
		}
	}
	const handleAccount = useCallback(async () => {
		setIsLoadingAccount(true)
		try {
			await apiProvisionAccounting.accountContabilizationErrorByOrderId(Number(filtredAccountingError[0].id))
			enqueueSnackbar("Contabilização realizada com sucesso", { variant: "success" })
			if (folderNumber)
				onSearch(folderNumber)

			setIsLoadingAccount(false)
		} catch (error) {
			enqueueSnackbar("Algo deu errado ao tentar contabilizar o erro", { variant: "error" })
			setIsLoadingAccount(false)

		}
		
	}
	, [filtredAccountingError, folderNumber, onSearch, enqueueSnackbar])

	return (
		<Panel title={title} withPadding>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				enableReinitialize
			>
				{({ handleSubmit}) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={2} alignItems="center">
							<Grid item xs={12} md={3}>
								<NumericField
									disabled={false}
									label={t('form.CTGFolder')}
									name="folderNumber"
								/>
							</Grid>
							<Grid item xs={12} md={1}>
								<Submit type='search' submitting={isLoading} />
							</Grid>
							{
								generateGps && !!filtredAccountingError && !!filtredAccountingError.length && (
									<Grid container xs={12} md={8} style={{flexDirection: 'row-reverse', flex: 1}}>
										{isLoadingAccount && <CircularProgress />}
										{!isLoadingAccount && 
											<Button
												color="primary"
												variant={"contained"}
												onClick={() => handleAccount()}
												
												>
													contabilizar
											</Button>
										}
									</Grid>
								)
							}
							{
								file && (
									<Grid container xs={12} md={8}>
										<Box display="flex" alignItems="center">
											<Upload
												name='formFile'
												id='formFile'
												multiple={false}
												accept='.csv'
												text='Carregar Arquivo'
												onUpload={() => handleSubmit()}
												notDisplayFiles
											/>
											<Typography
												variant='body2'
												style={{ marginLeft: 16 }}
											>
												Arquivo .CSV - Cabeçalho: Pasta/CTG - Linhas: #01234567
											</Typography>
										</Box>
									</Grid>
								)
							}
						</Grid>
						{message && (
							<Grid container item>
								<Box mt={2}>
									<Typography color="error" style={{ fontSize: '18px' }}>
										{message}
									</Typography>
								</Box>
							</Grid>
						)}
					</form>
				)}
			</Formik>
		</Panel>
	)
}

export default Search
