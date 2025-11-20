import { useEffect, useState, useMemo } from "react";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core";
import Table, { ColumnData } from "src/components/Table";
import { IconButton } from "@mui/material";
import AddIcon from "@material-ui/icons/Add";
import { CostCenterField, CurrencyField, SelectField, TextField } from "src/components/form";
import Panel from "src/components/Panel";
import { useTranslation } from "src/locale/i18n";
import { Form, FormikProvider, useFormik } from "formik";
import { TCostCenter } from "src/core/models/cost-center";
import { TPaymentInspectionApportionmentFine } from "src/core/models/inspection";
import { useStage } from "src/screen/inspection/utils";
import { STATUS_APPROVALS_FLOW } from "src/core/utils/constants";
import { usePaymentType } from "src/hooks/fetchLists";
import { Modulos } from "src/core/models/modules";
import { useSelector } from "react-redux";
import { getPaymentSearch } from "src/core/store/modules/inspection/selectors";
import { toCurrency, toNumber } from "src/core/utils/func";


type ListValues = {
	costCenter: string;
	costCenterId: number | string;
	description: string;
	fineValue: any;
	id?: number;
	divisao?: any;
	tipoPagamentoId?: any;
	tipoPagamentoDescricao?: any;
};

type Props = {
	setData?: any;
	initialList?: TPaymentInspectionApportionmentFine[];
	statusFlow?: STATUS_APPROVALS_FLOW;
	setPendingValueToCheck?: any
};

const defaultInitialValues = {
	costCenter: "",
	costCenterId: 0,
	description: "",
	fineValue: "",
	tipoPagamentoId: "",
	divisao: ""
}

const ApportionmentData = ({ setData, initialList, statusFlow, setPendingValueToCheck }: Props) => {
	const { t } = useTranslation();
	const [costData, setCostData] = useState<TCostCenter>();
	const [list, setList] = useState<ListValues[]>([]);
	const [releasedValue, setReleasedValue] = useState<number>(0.00);
	const [pendingValue, setPendingValue] = useState<number>(0);
	const { isNew } = useStage();
	const [initialValue, setInitialValue] = useState<ListValues>(defaultInitialValues);
    const { paymentTypeAsOptions } = usePaymentType(Modulos.Inspection);
    const { valorTotalGuia } =  useSelector(getPaymentSearch);
	const isEditable = isNew || statusFlow === STATUS_APPROVALS_FLOW.RETURNED;
	
	const formik = useFormik<ListValues>({
		initialValues: initialValue,
		onSubmit: (values, { resetForm }) => {
			resetForm();
		},
		enableReinitialize: true
	});

	const resetForm = () => {
		setInitialValue(defaultInitialValues)
		formik.resetForm()
	}

	const onAdd = async (values: ListValues) => {
		await setList(list.concat(values));
		setCostData(undefined);
		resetForm();
	};

	const onEdit = (index: any) => {
		delete index.isViewButtonHidden;
		const values = index;

		setInitialValue(values);
		setList(list.filter((x) => x.id !== values.id));
	};

	const onDelete = (index: any) => {
		delete index.isViewButtonHidden;
		const value = index;

		setList(list.filter((x) => x.id !== value.id));
	};

	useEffect(() => {
		if(list.length > 0 && isNew === true){
			const fineValues = list.map((item: any) => {
				return item.fineValue;
			})
			setReleasedValue(fineValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0));
			return
		} else if (isNew === false){
			setReleasedValue(valorTotalGuia);
			return
		}  else {
			setReleasedValue(0)
		} 
	}, [list])

	useEffect(()=> {
	const valorTotalGuiaFormatted = toNumber(valorTotalGuia);
		
		if(list.length > 0 && valorTotalGuiaFormatted && isNew === true){
			setPendingValue(Number((valorTotalGuiaFormatted - releasedValue).toFixed(2)))
			return
		} else {
			setPendingValue(0)
		}
	}, [releasedValue, list, pendingValue, setPendingValue])

	useEffect(() => {
		if(list.length === 0){
			setPendingValue(0)
		}
	}, [pendingValue, list])

	useEffect(() => {
		setPendingValueToCheck(pendingValue)
	}, [pendingValue])

	const columns = useMemo<ColumnData[]>(
		() => [
			{
				label: t("Pagamentos:tipoPagamento"),
				field: "tipoPagamentoDescricao"

			},
			{
				label: t("solicitacaoPagamento:rateioValorMulta.value"),
				field: "fineValue",
				type: "currency",
			},
			{
				label: t("solicitacaoPagamento:rateioValorMulta.costCenter"),
				field: "costCenter",
			},
			{
				label: t("solicitacaoPagamento:dadosPagamento.divisão"),
				field: "divisao"
			}
		],
		[t]
	);
	
	useEffect(() => {
		const correctedFineValues = list.map((x) => ({
			costCenterId: x.costCenterId,
			fineValue: x.fineValue,
			tipoPagamentoId: x.tipoPagamentoId,
			divisao: x.divisao
		}));
		const apportionmentFines = correctedFineValues.map((fines) => ({
			costCenterId: fines.costCenterId,
			fineValue: Number(fines.fineValue),
			tipoPagamentoId: fines.tipoPagamentoId,
			divisao: fines.divisao ?? null
		}));
		setData(apportionmentFines);
		
	}, [list]);

	const onSelectCostCenter = (item: TCostCenter) => {
		setCostData(item);
	};

	const onClearCostCenter = () => {
		setCostData(undefined);
	};

	useEffect(() => {
		if (initialList) {
			setList([
				...initialList.map<ListValues>((x) => ({
					id: x.id,
					fineValue: x.fineValue.toString(),
					costCenter: `${x.costCenter ?? ''} - ${x.costCenterDescription ?? ''}`,
					costCenterId: x.costCenterId,
					description: x.costCenterDescription,
					tipoPagamentoDescricao: paymentTypeAsOptions.filter((payment: any) => payment.value === x.tipoPagamentoId)[0]?.label,
					tipoPagamentoId: x.tipoPagamentoId,
					divisao: x.divisao,
					isEditButtonHidden: !isEditable,
					isDeleteButtonHidden: !isEditable,
				})),
			]);
		}
	}, [initialList, isEditable]);

	//RATEIO DO VALOR DE MULTA Isso, mas na tabela de rateio. objeto "paymentInspectionApportionmentFines"
	return (
		<Panel title={t("solicitacaoPagamento:rateioValorMulta.title")} withPadding>
			<FormikProvider value={formik}>
				<Form>
					<Grid container spacing={3}>
						<Grid item md={3} xs={12}>
							<SelectField
								name="tipoPagamentoId"
								label={t("Pagamentos:tipoPagamento")}
								options={paymentTypeAsOptions}
								required
								disabled={!isEditable}
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<CostCenterField
								name="costCenter"
								label={t("solicitacaoPagamento:rateioValorMulta.costCenter")}
								disabled={!isEditable}
								withDescription
								onSelectCostCenter={onSelectCostCenter}
								onClearCostCenter={onClearCostCenter}
								initialValue={{
									label: initialValue?.description,
									value: initialValue?.costCenter
								}}
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								maxLength={4}
								name="divisao"
								label={t("solicitacaoPagamento:dadosPagamento.divisão")}
								disabled={!isEditable}
							/>	
						</Grid>
						<Grid item md={3} xs={12}>
							<CurrencyField
								label={t("solicitacaoPagamento:rateioValorMulta.value")}
								name={"fineValue"}
								disabled={!isEditable}
								required
							/>
						</Grid>
						<Grid
                            container
                            justifyContent="flex-end"
                            className="margin-top-16"
                            spacing={2}
                        >
							<Grid item xs={12} md={2}>
							<Button
								variant="outlined"
								style={{ marginBottom: "15px" }}
								onClick={() => resetForm()}
								disabled={!isNew}
							>
								LIMPAR
							</Button>
						</Grid>

						<Grid item xs={12} md={1}>
							<IconButton
								onClick={() =>
									onAdd({
										costCenter: `${costData?.costCenter ?? ""} - ${costData?.description ?? ""}`,
										description: costData?.description ?? "",
										costCenterId: costData?.id ?? "",
										fineValue: toNumber(formik.values.fineValue),
										divisao: formik.values.divisao,
										tipoPagamentoId: formik.values.tipoPagamentoId,
										tipoPagamentoDescricao: paymentTypeAsOptions.filter((x: any) => x.value === formik.values.tipoPagamentoId)[0]?.label,
										id: Date.now(),
									})
								}
								color="primary"
								disabled={!isNew && !isEditable}
							>
								<AddIcon />
							</IconButton>
						</Grid>
						
						</Grid>
						<Grid item xs={12}>
							<Table

								columns={columns}
								rows={list}
								onEdit={onEdit}
								onDelete={onDelete}
								permissionDelete={true}
							/>
						</Grid>
						<Grid>
						</Grid>
						<div className="grayBox">
							<Grid container spacing={2} >
								<Grid item xs={12} md={8}>
									<p className="grayKey">{"Valor Total da Guia"}</p>
								</Grid>
							<Grid item xs={12} md={4}>
									<p className="grayValue">{toCurrency(valorTotalGuia)}</p>
								</Grid>
								{
									isNew !== false ? <>
									<Grid item xs={12} md={8}>
									<p className="grayKey">{"Valor Lançado"}</p>
								</Grid>
							<Grid item xs={12} md={4}>
									<p className="grayValue">{toCurrency(releasedValue)}</p>
								</Grid>
									</> : <>
									<Grid item xs={12} md={8}>
									<p className="grayKey">{"Valor Lançado"}</p>
								</Grid>
							<Grid item xs={12} md={4}>
									<p className="grayValue">{toCurrency(valorTotalGuia)}</p>
								</Grid>
									</>
								}
								<Grid item xs={12} md={8}>
									<p className="grayKey">{"Valor Pendente"}</p>
								</Grid>
							<Grid item xs={12} md={4}>
									<p className="grayValue">{toCurrency(pendingValue)}</p>
								</Grid>		
							</Grid>
						</div>
					</Grid>
				</Form>
			</FormikProvider>
		</Panel>
	);
};

export default ApportionmentData;
