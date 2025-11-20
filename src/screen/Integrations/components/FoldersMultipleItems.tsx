import { Grid } from "@material-ui/core";
import { useCallback, useState } from "react";
import { CheckboxesAutocompleteField } from "src/components/form";
import { useFolderNumber } from "src/hooks/process";
import { t } from "src/locale/i18n";

const FOLDER_LENGTH = 7;

const FoldersMultipleItems: React.FC = () => {
	const [folderNumber, setFolderNumber] = useState<string>("");
	const { folderOptions } = useFolderNumber(folderNumber);

	const handleChange = useCallback((value: string) => {
		if (value.length === FOLDER_LENGTH) {
		setFolderNumber(value);
		}
	}, []);


	return (
		<Grid item xs={12} md={3}>
			<CheckboxesAutocompleteField
				onChange={handleChange}
				name="folderNumbers"
				options={folderOptions}
				label={t("integrations:request.form.folderNumbers")}
			/>
		</Grid>
	);
};

export default FoldersMultipleItems;
