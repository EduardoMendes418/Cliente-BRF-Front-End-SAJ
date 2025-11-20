import { useEffect, ChangeEvent, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { Formik } from "formik";
import Panel from "src/components/Panel";
import { Grid } from "@material-ui/core";
import {
	getRequestParametersAsOptions,
	getLoadingRequestParameters,
} from "src/core/store/modules/request-parameters/selectors";
import { t } from "src/locale/i18n";
import {
	fetchRequestParameters,
	getRequestParameters,
} from "src/core/store/modules/request-parameters/thunks";
import { Submit } from "src/components/button";
import { Upload, SelectField } from "src/components/form";
import { modal } from "src/components/modals";
import { FolderNumber } from "src/core/models/requisitions";
import SearchInfo from "src/components/SearchInfo";
import {
	getProcessError,
	getProcessIsFetching,
} from "src/core/store/modules/process/selectors";
import { getDeadlineDateRequisitions } from "src/core/store/modules/requisitions/thunks";
import moment from "moment";

type Props = {
	setFolderNumbers: (folderNumbers: FolderNumber[]) => void;
};

const Search = ({ setFolderNumbers }: Props) => {
	const dispatch = useDispatch();
	const currentDate = moment().format("YYYY-MM-DD");
	const [uploadFileCaptionVisible, setUploadFileCaptionVisible] =
		useState<boolean>(false);

	useEffect(() => {
		dispatch(fetchRequestParameters({ notPaginate: true, status: true }));
	}, [dispatch]);

	const onChangeRequisitionType = (valueRequisitionType: any) => {
		const requisitionTypeId = valueRequisitionType.target.value;
		dispatch(getRequestParameters(requisitionTypeId));
		dispatch(
			getDeadlineDateRequisitions({
				requestParameterId: requisitionTypeId,
				dateTime: currentDate,
			})
		);
	};

	const requisitionTypesOptions = useSelector(getRequestParametersAsOptions);
	const loadingItem = useSelector(getLoadingRequestParameters);
	const error = useSelector(getProcessError);
	const loadingFolder = useSelector(getProcessIsFetching);

	const loading = loadingItem || loadingFolder;

	const onSubmit = (values: TSearch) => {
		dispatch(getRequestParameters(values.requisitionType));
		dispatch(
			getDeadlineDateRequisitions({
				requestParameterId: Number(values.requisitionType),
				dateTime: currentDate,
			})
		);

		setFolderNumbers(values.folderNumbers);
	};

	type TSearch = {
		requisitionType: string;
		file: FileList;
		folderNumbers: FolderNumber[];
	};

	const initialValues = {
		requisitionType: "",
		file: {} as FileList,
		folderNumbers: [],
	};

	const showErrorModal = (title: string) => {
		const component = <div>{t("requisitions:batch.form.modalErrorText")}</div>;

		modal({
			title,
			component,
			buttons: [],
			dialogProps: { maxWidth: "md", showCloseButton: true },
		});
	};

	const getFormattedFolderNumbers = (contentFile: string): FolderNumber[] => {
		try {
			const folderNumbers = contentFile
				.split("\n")
				.filter((folderNumber) => folderNumber !== "" && folderNumber !== "\r")
				.map((folderNumber) => {
					const value = folderNumber.replace(/(\r\n|\n|\r)/gm, "");

					if (!/(\d*)\/?(\d*)?/.test(value)) throw new Error("Invalid format");

					return { folderNumber: value?.replaceAll("#", "") };
				});

			if (!folderNumbers || !folderNumbers.length)
				throw new Error("Empty file");

			return folderNumbers;
		} catch (err: any) {
			const error =
				err.message === "Empty file"
					? t("validations.emptyFile")
					: t("validations.invalidFileContent");
			showErrorModal(error);
			return [];
		}
	};

	const isValidFile = (files: FileList | null): boolean => {
		if (!files || files.length === 0) {
			return false;
		}

		return files[0].name.split(".").pop() === "csv";
	};

	const onUploadFolderNumbersFile = (
		event: ChangeEvent,
		setFieldValue: (
			field: string,
			value: any,
			shouldValidate?: boolean | undefined
		) => void
	) => {
		const { files } = event.target as HTMLInputElement;
		if (!isValidFile(files)) {
			setUploadFileCaptionVisible(false);
			showErrorModal(t("validations.invalidFileFormat"));
			setFieldValue("folderNumbers", []);
			return;
		}

		const reader = new FileReader();
		files && reader.readAsText(files[0]);
		reader.onload = function (loadedEvent: any) {
			const folderNumbersFromFile = getFormattedFolderNumbers(
				loadedEvent.target.result
			);
			setFieldValue("folderNumbers", folderNumbersFromFile);
			setUploadFileCaptionVisible(true);
		};
	};

	const onDeleteFolderNumbersFile = (
		setFieldValue: (
			field: string,
			value: any,
			shouldValidate?: boolean | undefined
		) => void
	) => {
		setFieldValue("folderNumbers", []);
		setUploadFileCaptionVisible(false);
	};

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			enableReinitialize
		>
			{({ handleSubmit, setFieldValue, values, dirty }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Panel title={t("requisitions:batch.form.newBatchRequisition")}>
						<div className="panel-content">
							<Grid container spacing={2}>
								<Grid item xs={10} md={6}>
									<SelectField
										disabled={loading}
										label={t("requisitions:form.requisitionType")}
										name="requisitionType"
										options={requisitionTypesOptions ?? []}
										onChange={onChangeRequisitionType}
										required
									/>
								</Grid>
								<Grid item xs={1} md={1}>
									<Submit
										type="search"
										disabled={!dirty || !values.folderNumbers.length}
										submitting={loading}
									/>
								</Grid>
								<Grid item xs={12} md={12}>
									<Upload
										id="file"
										onUploadAfterChanges={(event) =>
											onUploadFolderNumbersFile(event, setFieldValue)
										}
										onDelete={() => onDeleteFolderNumbersFile(setFieldValue)}
										name={"file"}
										disabled={false}
										text={"Carregar Arquivo"}
										helperText="Arquivo .CSV - Linhas: 01234567 ou 01234567/001"
									/>
									{uploadFileCaptionVisible && (
										<Typography
											variant="caption"
											style={{ padding: "0", marginTop: 8 }}
											data-testid="accordion-title"
										>
											Faça a busca para carregar as pastas contidas no arquivo
										</Typography>
									)}
								</Grid>
							</Grid>
							{!loadingFolder && <SearchInfo error={error} />}
						</div>
					</Panel>
					<input
						type="hidden"
						value={values.folderNumbers}
						name="folderNumbers"
					/>
				</form>
			)}
		</Formik>
	);
};

export default Search;
