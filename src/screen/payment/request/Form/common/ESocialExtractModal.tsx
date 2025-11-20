import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Table from 'src/components/Table';
import { extractEsocialFile } from 'src/core/store/modules/e-social-event-launch/thunks';
import { convertToBlob, numberToCurrency, valuesToNumber } from 'src/core/utils/func';
import { Grid } from "@material-ui/core";
import { useSnackbar } from 'notistack';

export type Props = {
	files: any
	values: any,
	folderNumber: any,
	isNew: boolean,
	setEnableButton: Function,
}

const ESocialExtractModal = ({values, files, folderNumber, isNew, setEnableButton}: Props) => {
	
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const [extractData, setExtractData] = useState<any[]>([])
	const [vrCrTotal, setVrCrTotal] = useState<number>(0)
	const [isLoading, setIsLoading] = useState<boolean>(true)

	const columns: any[] = [
		
		{
			label: "Descrição",
			field: "description",
		},
		{
			label: "Cod. receita",
			field: "tpCr",
		},
		{
			label: "Valor",
			field: "vrCr",
			type: 'currency'
		
		},
	];

	const convertToBase64 = async (file: File): Promise<string> => {
		return new Promise(async (resolve, reject) => {
			const fileReader = new FileReader();
			const fileToBlob = await convertToBlob(file)
			fileReader.readAsDataURL(fileToBlob);

			fileReader.onload = () => {
				const result = fileReader.result as string;
				const base64Data = result.split(',')[1];
				resolve(base64Data);
			};

			fileReader.onerror = (error) => {
				reject(error);
			};
		});
	};

	const getExtractEsocialFileData = async () => {
		setEnableButton(false);

		const base64 = await convertToBase64(files[0]);
		
		const normalizedValues = {
			...(valuesToNumber(
				[
					"compensationAmount",
					"remunerationAmount",
				],
				values
			)),
		}

		const { payload } = await dispatch(extractEsocialFile(isNew === true ? {
			fileName: Object.getOwnPropertyNames(files)[0],
			fileBase64: Object.values(files)[0],
			folderNumber: folderNumber,
			pagamentoESocial: normalizedValues
		} : {
			fileName: files[0].documentName,
			fileBase64: "",
			folderNumber: folderNumber,
			pagamentoESocial: normalizedValues,
			paymentId: values.paymentId
		})) as any;

		setExtractData(payload?.data)
		setVrCrTotal(payload?.data.reduce((acc: any, obj: { vrCr: number; }) => acc + obj.vrCr, 0))
		setIsLoading(false)
		setEnableButton(false);
	} 
	useEffect(() => {
		getExtractEsocialFileData();
	}, [])

	return <div className='margin-top-16 form-accordion'>
				<Table 
					columns={columns} 
					rows={extractData}
					isLoading={isLoading} 
				/>
				{
					extractData?.length > 0 ?
					<Grid container spacing={2}  justifyContent='flex-end'>
				<Grid item xs={12} md={4}>
						<h2 > Total: {numberToCurrency(vrCrTotal)}</h2>
					</Grid>
				</Grid>	: null
				}	
			</div>
}

export default ESocialExtractModal;