import { useMemo } from "react";
import { TOptionsSelect } from "src/components/form";
import { PersonTypeEnum } from "src/core/models/legal-document-request";
import { useTranslation } from "src/locale/i18n";

export const usePersonTypes = () => {
	const { t } = useTranslation();

	const persons = [
		PersonTypeEnum.Legal,
		PersonTypeEnum.Phisical
	]

	const personsAsOption = useMemo<TOptionsSelect[]>(() => ([
		{
			label: t("legalDocs:bestowed.kindOfPerson.judicial"),
			value: PersonTypeEnum.Legal
		},
		{
			label: t("legalDocs:bestowed.kindOfPerson.fisica"),
			value: PersonTypeEnum.Phisical
		}
	]), [t])

	return {
		persons,
		personsAsOption
	}
}