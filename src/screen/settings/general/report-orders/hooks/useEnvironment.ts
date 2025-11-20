import { useMemo } from "react";
import { TOptionsSelect } from "src/components/form";

export enum Environments {
	DEV,
	QAS,
	PRD,
}

const useEnvironments = () => {
	const environmentOptions = useMemo<TOptionsSelect[]>(
		() => [
			{
				label: "DEV",
				value: Environments.DEV,
			},
			{
				label: "QAS",
				value: Environments.QAS,
			},
			{
				label: "PRD",
				value: Environments.PRD,
			},
		],
		[]
	);

	return { environmentOptions };
};

export default useEnvironments;
