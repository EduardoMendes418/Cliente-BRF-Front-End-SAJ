import { useEffect, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { Grid } from "@material-ui/core";
import { useTranslation } from "src/locale/i18n";

import useProcessFilterOptions from "src/hooks/useProcessFilterOptions";
import { SelectField, DateField, Upload, TextField, SwitchField } from "src/components/form";
import Panel from "src/components/Panel";
import { Modulos } from "src/core/models/modules";
import {
	usePaymentType,
	useGuaranteeModality,
	useGroupedAreas,
} from "src/hooks/fetchLists";
import { bearishReasonsOptions } from "src/screen/goods-and-guarantees/constants";
import { statusApprovalsOptions } from "src/core/utils/constants";
import { fetchFormOfCorrection } from "src/core/store/modules/pensions/form-of-correction/thunks";
import { contingencyEnumAsOptions } from "src/screen/data-import/watson/constants";
import { statusOptions } from "src/screen/reports/Form/constants";
import { useEconomicIndices } from "src/hooks/fetchLists";
import { situationStatusOptions } from "src/screen/goods-and-guarantees/accountability/constants";
import { accountabilityStatusOptions } from "src/screen/goods-and-guarantees/accountability/constants";
import { useFormikContext } from "formik";
import { modal } from "src/components/modals";
import { ErrorDiv, LoadingBaseP, LoadingP } from "./styled";
import GroupedSelectFiledMultiple from "src/components/GroupedSelectMultiple";

export enum FOLDER_OPTIONS {
	ALL = 0,
	MAIN = 1,
	LINKED = 2,
}

export const folderOption = [
	{ label: "Todas", value: FOLDER_OPTIONS.ALL },
	{ label: "Principal", value: FOLDER_OPTIONS.MAIN },
	{ label: "Vinculada", value: FOLDER_OPTIONS.LINKED },
];

const Fields = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { setFieldValue, values }: any = useFormikContext();
	const { statusesOptions, spheresOptions, provisionClassesOptions } =
		useProcessFilterOptions();

		const { groupedAreasAsOptions } = useGroupedAreas();

	const path = window.location.pathname;

	const isDataLoading = path.includes("carga-de-dados/carga-watson/novo");

	const spheresOptionsFiltred = spheresOptions.filter((item) => item.value);
	useEffect(() => {
		dispatch(fetchFormOfCorrection());
	}, [dispatch]);

	const isValidFile = (files: FileList | null): boolean => {
		return !!files?.length && files[0].name.split(".").pop() === "csv";
	};

	const showErrorModal = (title: string) => {
		const component = (
			<ErrorDiv>
				{t("dataImport:documents.modalErrorText")}
			</ErrorDiv>
		);

		modal({
			title,
			component,
			buttons: [],
			dialogProps: { maxWidth: "md", showCloseButton: true },
		});
	};

	const getFormattedfoldersNumber = (contentFile: string): string[] => {
		try {
			const foldersNumber = contentFile
				.split("\n")
				.filter(
					(foldersNumber) => foldersNumber !== "" && foldersNumber !== "\r"
				)
				.map((foldersNumber) => {
					const value = foldersNumber.replace(/(\r\n|\n|\r)/gm, "");
					if (Number(value)) throw new Error("Invalid format");

					return value;
				});

			for (let x = 0; x < foldersNumber.length; x++) {
				foldersNumber[x] = foldersNumber[x].replace("#", "");
			}
			if (!foldersNumber || !foldersNumber.length)
				throw new Error("Empty file");

			return foldersNumber;
		} catch (err: any) {
			const error = t("validations.emptyFile");
			showErrorModal(error);
			return [];
		}
	};

	const onUploadfoldersNumberFile = (event: ChangeEvent) => {
		const { files } = event.target as HTMLInputElement;
		if (!isValidFile(files)) {
			showErrorModal(t("validations.invalidFileFormat"));
			setFieldValue("folderNumber", "");
			return;
		}

		const reader = new FileReader();
		files && reader.readAsText(files[0]);
		reader.onload = function (loadedEvent: any) {
			const foldersNumberFromFile = getFormattedfoldersNumber(
				loadedEvent.target.result
			);
			setFieldValue("folderNumber", foldersNumberFromFile.join(";"));
		};
	};

	const onDeletefoldersNumberFile = () => {
		setFieldValue("folderNumber", "");
	};

	const { guaranteeModalityAsOptions } = useGuaranteeModality();
	const { paymentTypeAsOptions } = usePaymentType(Modulos.Pagamento);
	const { economicIndicesAsOptions } = useEconomicIndices();

	const isDateFieldRequired = values.folderNumber.length > 0 ? false : true;

	return (
		<>
			<Panel title={t("dataImport:watson.form.generalFilter")} withPadding>
				<Grid container spacing={2}>
					<Grid item md={3} xs={12}>
						<GroupedSelectFiledMultiple
							options={groupedAreasAsOptions}
							label={t("dataImport:watson.form.legalDepartamentArea")}
							name="legalDepartamentArea"
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							options={folderOption}
							label={t("reports:main.form.folderNumberOption")}
							name="litigationRelationship"
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<TextField
							name="folderNumber"
							label={t("dataImport:documents.form.foldersNumber")}
							maxLength={600}
						/>
					</Grid>
					{isDataLoading && (
						<>
							<Grid item xs={12} md={3}>
								<LoadingP>
									<SwitchField
										name="simulation"
									/>
									Simulação
								</LoadingP>
								<LoadingBaseP>
									<SwitchField
										name="baseRevision"
									/>
									Revisao de Base
								</LoadingBaseP>
							</Grid>
							
						</>
					)}
					<Grid item xs={12} md={12}>
						<Upload
							id="file"
							onUploadAfterChanges={(event) =>
								onUploadfoldersNumberFile(event)
							}
							onDelete={() => onDeletefoldersNumberFile()}
							name={"file"}
							disabled={false}
							text={"Carregar Arquivo"}
						/>
					</Grid>
				</Grid>
			</Panel>

			<Panel title={t("dataImport:watson.form.generalBaseFile")} withPadding>
				<Grid container spacing={2}>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t("dataImport:watson.form.contigencyType")}
							name="filterBaseGeralContingencyEnum"
							options={contingencyEnumAsOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t("dataImport:watson.form.status")}
							name="filterBaseGeralStatusEnum"
							options={statusesOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t("dataImport:watson.form.sphere")}
							name="filterBaseGeralSphere"
							options={spheresOptionsFiltred}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									name="filterBaseGeralCreationDateStart"
									label={t("dataImport:watson.form.registryStart")}
									required={isDateFieldRequired}
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									name="filterBaseGeralCreationDateEnd"
									label={t("dataImport:watson.form.to")}
									required={isDateFieldRequired}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t("dataImport:watson.form.provisionClass")}
							name="filterBaseGeralProvisionClass"
							options={provisionClassesOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
				</Grid>
			</Panel>

			<Panel
				title={t("dataImport:watson.form.generalBaseDeadFile")}
				withPadding
			>
				<Grid container spacing={2}>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t("dataImport:watson.form.contigencyType")}
							name="filterBaseGeralDeadContingencyEnum"
							options={contingencyEnumAsOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t("dataImport:watson.form.status")}
							name="filterBaseGeralDeadStatusEnum"
							options={statusesOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t("dataImport:watson.form.sphere")}
							name="filterBaseGeralDeadSphere"
							options={spheresOptionsFiltred}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									name="filterBaseGeralDeadTerminationDateStart"
									label={"Data morto"}
									required={isDateFieldRequired}
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									name="filterBaseGeralDeadTerminationDateEnd"
									label={t("dataImport:watson.form.to")}
									required={isDateFieldRequired}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							label={t("dataImport:watson.form.provisionClass")}
							name="filterBaseGeralDeadProvisionClass"
							options={provisionClassesOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
				</Grid>
			</Panel>

			<Panel title={t("dataImport:watson.form.warrantyFile")} withPadding>
				<Grid container spacing={2}>
					<Grid item xs={12} md={3}>
						<SelectField
							name="filterGoodsGuarantesGuaranteeModeId"
							label={t("dataImport:watson.form.warrantyType")}
							options={guaranteeModalityAsOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<SelectField
							name="filterGoodsGuarantesPaymentType"
							label={t("creditReceipt:form.paymentType")}
							options={paymentTypeAsOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<SelectField
							name="filterGoodsGuarantesStatusEnum"
							label={t("reports:guarantees.form.status")}
							options={statusesOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<SelectField
							name="filterGoodsGuarantesBearishReasons"
							label={t("reports:guarantees.form.statusGoods")}
							options={statusOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
				</Grid>
			</Panel>

			<Panel title={t("dataImport:watson.form.convertedDeposit")} withPadding>
				<Grid container spacing={2}>
					<Grid item xs={12} md={3}>
						<SelectField
							name="filterConvertedDepositGuaranteeModeId"
							label={t("dataImport:watson.form.warrantyType")}
							options={guaranteeModalityAsOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<SelectField
							name="filterConvertedDepositPaymentType"
							label={t("creditReceipt:form.paymentType")}
							options={paymentTypeAsOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<SelectField
							name="filterConvertedStatus"
							label={"Situação"}
							options={situationStatusOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<SelectField
							name="filterConvertedDepositSituationAccountability"
							label={"Status da prestação de conta"}
							options={accountabilityStatusOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							name="filterConvertedDepositBearishReasons"
							label={t("goodsAndGuarantees:accountability.bearishReasons")}
							options={bearishReasonsOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item xs={6} md={3}>
						<DateField
							name="filterConvertedDepositApprovalDateStart"
							label={t("dataImport:watson.form.datePresentation")}
							required={isDateFieldRequired}
						/>
					</Grid>
					<Grid item xs={6} md={2}>
						<DateField
							name="filterConvertedDepositApprovalDateEnd"
							label={t("dataImport:watson.form.to")}
							required={isDateFieldRequired}
						/>
					</Grid>
				</Grid>
			</Panel>

			<Panel title={t("dataImport:watson.form.courtPayment")} withPadding>
				<Grid container spacing={2}>
					<Grid item xs={12} md={3}>
						<SelectField
							name="filterPaymentStatusApprovalId"
							label={t("dataImport:watson.form.status")}
							options={statusApprovalsOptions.map((options) => ({
								...options,
								value: Number(options.value),
							}))}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<SelectField
							name="filterPaymentPaymentType"
							label={t("creditReceipt:form.paymentType")}
							options={paymentTypeAsOptions}
							multiple
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item md={3} xs={12}>
						<Grid container spacing={3}>
							<Grid item xs={6} md={6}>
								<DateField
									name="filterPaymentSapEntryDateStart"
									label={t("dataImport:watson.form.registrySAP")}
									required={isDateFieldRequired}
								/>
							</Grid>
							<Grid item xs={6} md={6}>
								<DateField
									name="filterPaymentSapEntryDateEnd"
									label={t("dataImport:watson.form.to")}
									required={isDateFieldRequired}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Panel>

			<Panel title={t("dataImport:watson.form.indexesFile")} withPadding>
				<Grid container spacing={2}>
					<Grid item xs={12} md={3}>
						<SelectField
							name="indexSelic"
							label={t("dataImport:watson.form.indexes")}
							options={economicIndicesAsOptions}
							required
							disabled={isDataLoading}
						/>
					</Grid>
					<Grid item xs={12} md={3}>
						<SelectField
							name="indexLegalInterest"
							label={t("dataImport:watson.form.indexLegalInterest")}
							options={economicIndicesAsOptions}
							required
							disabled={isDataLoading}
						/>
					</Grid>
				</Grid>
			</Panel>
		</>
	);
};
export default Fields;

