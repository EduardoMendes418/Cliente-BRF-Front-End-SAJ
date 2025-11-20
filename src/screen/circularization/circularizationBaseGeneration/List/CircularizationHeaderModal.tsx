import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid } from "@material-ui/core";
import { fetchCircularizationBaseGenerationExtract } from 'src/core/store/modules/circularizationBaseGeneration/thunks';
import { Formik} from "formik";
import { useTranslation } from 'src/locale/i18n';
import { CurrencyField, TextField } from 'src/components/form';


const CircularizationHeaderModal = (id: any) => {
	
	const dispatch = useDispatch();
	const [extractData, setExtractData] = useState<any>()

	const { t } = useTranslation();

	const getExtractEsocialFileData = async () => {
		
		const { payload } = await dispatch(fetchCircularizationBaseGenerationExtract({circularizationBaseGenerationHeaderId: id.id})) as any
		setExtractData(payload.data)
		
	} 
	useEffect(() => {
		getExtractEsocialFileData();
	}, [])

	const initialValues: any = useMemo(
			() => ({
				numberOfRows: extractData?.numberOfRows,
				totalPossible: extractData?.totalPossible,
				totalProbably: extractData?.totalProbably,
				totalRemote: extractData?.totalRemote,
			}),
			[extractData]
		);

	return (
		<Formik
			initialValues={initialValues}
			
			enableReinitialize
			onSubmit={(values) => {
				console.log;
			}}
			
		>
			{({ handleSubmit,  }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Grid container spacing={2}  justifyContent='flex-end'>
					<Grid item xs={12} md={3}>
							<TextField
											name="numberOfRows"
											label={"Quantidade de fichas"}
											readOnly
										/>
							</Grid>
							
						<Grid item xs={12} md={3}>
								<CurrencyField
									label={t("provisions:fields.probableValue")}
									name="totalProbably"
									readOnly
									disabled={true}
								/>
							</Grid>
							
							<Grid item xs={12} md={3}>
								<CurrencyField
									label={"Total Possível"}
									name="totalPossible"
									readOnly
									disabled={true}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<CurrencyField
									label={"Total Remoto"}
									name="totalRemote"
									readOnly
									disabled={true}
								/>
							</Grid>
							

					</Grid>
				</form>
			)}
		</Formik>
	);
}

export default CircularizationHeaderModal;