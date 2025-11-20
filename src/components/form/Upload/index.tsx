import { ChangeEvent, useEffect } from "react";
import { useFormikContext } from "formik";
import { Box, FormHelperText, Typography } from "@material-ui/core";
import { ReactNode } from "react";
import AddIcon from "@material-ui/icons/Add";

import { confirm } from "src/components/modals";
import { useTranslation } from "src/locale/i18n";
// import { useCurrentUser } from "src/config/permissions";

import UploadButton from "./UploadButton";
import UploadCard from "./UploadCard";
import { FormikContext } from "..";
import { useSnackbar } from "notistack";

const MAX_SIZE = 262144000;

function formatBytes(bytes: number, decimals = 2): string {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

type Props = {
	text?: string;
	name: string;
	multiple?: boolean;
	accept?: string;
	onDelete?: (file: File) => void;
	onUpload?: (event: ChangeEvent) => void;
	confirmDeletion?: boolean;
	confirmDeletionGoodsAndGuarantees?: boolean;
	disabled?: boolean;
	onUploadAfterChanges?: (event: ChangeEvent) => void;
	id?: string;
	notDisplayFiles?: boolean;
	helperText?: string;
	sideButton?: ReactNode;
	verifyIdUserFile?: boolean;
	fileNameLengthLimiter?: boolean;
};

type Document = {
	documentName?: string;
};

export type FileType = File & Document;

const Upload = ({
	text,
	name,
	multiple,
	accept,
	onDelete,
	disabled = false,
	confirmDeletion,
	confirmDeletionGoodsAndGuarantees,
	onUpload,
	onUploadAfterChanges,
	fileNameLengthLimiter,
	id,
	notDisplayFiles,
	helperText,
	sideButton,
	verifyIdUserFile,
}: Props) => {
	const { t } = useTranslation();
	const { values, setFieldValue, status, errors, touched } = useFormikContext<FormikContext>();

	const { enqueueSnackbar } = useSnackbar();
	const hasItem = Array.isArray(values[name]) && !!values[name].length;
	// const { userId: localUserId, isAdmin } = useCurrentUser("");
	
	const handleChange = (event: ChangeEvent) => {
		if (onUpload) onUpload(event);

		const { files } = event.target as HTMLInputElement;
		const normalizeFiles = Array.from(files || []);

		if(fileNameLengthLimiter){
		try {
			const hasLongFileName = normalizeFiles.some((file: any) => (file?.name?.length || 0) > 119);
			if (hasLongFileName) {
				return enqueueSnackbar(
					t("goodsAndGuarantees:characterLimiterWarningMessage"),
					{ variant: "error" }
				);
			}

		} catch (error) {
			console.error(error)
		}
	}

		if (multiple) {

			const newValue = [...values[name], ...normalizeFiles];
			const arrayOfLenght = [];

			for (const file of newValue) {
	
				arrayOfLenght.push(file.size);
				const totalLenght = arrayOfLenght.reduce((acc, size) => acc + size, 0);
				
				if (MAX_SIZE <= totalLenght) {
					enqueueSnackbar(
						`A soma do tamanho dos arquivos adicionados deve ser de no máximo ${formatBytes(MAX_SIZE)}`,
						{ variant: "error" }
					);
					return;
				}
			}

			setFieldValue(name, newValue);
		} else {
			if (normalizeFiles.length && MAX_SIZE <= normalizeFiles[0].size) {
				enqueueSnackbar(
					`O tamanho máximo do arquivo que enviado é ${formatBytes(MAX_SIZE)}`,
					{ variant: "error" }
				);
				return;
			}
			setFieldValue(name, normalizeFiles);
		}

		if (onUploadAfterChanges) onUploadAfterChanges(event);
	};

	const handleDelete = async (file: FileType) => {
		if (
			confirmDeletionGoodsAndGuarantees &&
			!(await confirm("O arquivo será excluído. Deseja continuar?", "Atenção:"))
		)
			return;
		if (confirmDeletion && !(await confirm(t("confirmDeletion")))) return;

		const oldValue = Array.from(values[name]) as File[];
		const newValue = oldValue.filter((value: FileType) =>
			file.hasOwnProperty("documentName") === true
				? value.documentName !== file.documentName
				: value.name !== file.name
		);

		setFieldValue(name, newValue);
		if (onDelete) onDelete(file);
	};

	useEffect(() => {
		if (hasItem) {
			const normalizeFiles = Array.from(values[name] || []).map(
				(value: any) => ({ ...value, name: value?.name ?? value?.documentName })
			);
			setFieldValue(name, normalizeFiles);
		}

	}, []);
	return (
		<Box display="flex" flexDirection="column" gridGap="1rem">
			{!disabled && status !== "readOnly" && (
				<Box display="flex" gridGap="1rem" alignItems="center" flexWrap="wrap">
					<UploadButton
						variant="outlined"
						color="secondary"
						id={id}
						text={text}
						onChange={handleChange}
						multiple={multiple}
						accept={accept}
						startIcon={<AddIcon />}
					/>
					{sideButton}

					{helperText && <Typography>{helperText}</Typography>}
				</Box>
			)}
			{!notDisplayFiles && hasItem && (
				<Box display="flex" flexDirection="column" gridGap="1rem">
					{values[name].map(
						(
							file: File | any,
							index: number
						) => {
							return (
								<UploadCard
									file={file}
									key={`uploadcard_${index}`}
									onDelete={handleDelete}
									disabled={
										(disabled || status === "readOnly")// ||
										// (
										// 	verifyIdUserFile && 
										// 	userId !== undefined &&
										// 	userId !== localUserId &&
										// 	!isAdmin
										// )
									}
								/>
							);
						}
					)}
				</Box>
			)}
			{errors[name] && touched[name] && (
				<FormHelperText error>{errors[name]}</FormHelperText>
			)}
		</Box>
	);
};

export default Upload;
