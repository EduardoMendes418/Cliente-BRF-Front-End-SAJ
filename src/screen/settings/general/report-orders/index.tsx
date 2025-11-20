import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScreenTemplate from "src/components/Screen";
import {
	TReportDictionary,
	TReportDictionaryFilter,
} from "src/core/models/reports";
import { actions, AppDispatch } from "src/core/store";
import { getReportConfiguration } from "src/core/store/modules/report/selectors";
import {
	fetchReportConfiguration,
	updateReportConfiguration,
} from "src/core/store/modules/report/thunks";
import { useTranslation } from "src/locale/i18n";
import Filter from "./Filter";
import Form from "./Form";
import useModal from "./hooks/useModal";
import List from "./List";

const ReportOrders = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { enqueueSnackbar } = useSnackbar();
	const { t } = useTranslation();

	const [reportComponent, setReportComponent] = useState<number>();
	const [finalConfiguration, setFinalConfiguration] =
		useState<TReportDictionary[]>();
	const [item, setItem] = useState<TReportDictionary>();
	const [index, setIndex] = useState<number>();

	const configurations = useSelector(getReportConfiguration);
	const { showModal } = useModal();

	useEffect(() => {
		if (configurations) {
			setFinalConfiguration(configurations.slice());
		} else {
			setFinalConfiguration(undefined);
		}
	}, [configurations]);

	const onSelectReportComponent = async (value: TReportDictionaryFilter) => {
		setReportComponent(value.reportComponent);
		await dispatch(fetchReportConfiguration(value));
	};

	const onEdit = (row: TReportDictionary, index: number) => {
		setItem(row);
		setIndex(index);
	};

	const onDelete = (index: number) => {
		if (!finalConfiguration) return;

		setFinalConfiguration(finalConfiguration.filter((_, i) => i !== index));
	};

	const onUp = (index: number) => {
		if (!finalConfiguration) return;

		const thisRow = finalConfiguration[index];
		const targetRow = finalConfiguration[index - 1];

		setFinalConfiguration(
			finalConfiguration.map((x, i) => {
				if (index - 1 === i) {
					return thisRow;
				} else if (index === i) {
					return targetRow;
				} else {
					return x;
				}
			})
		);
	};

	const onDown = (index: number) => {
		if (!finalConfiguration) return;

		const thisRow = finalConfiguration[index];
		const targetRow = finalConfiguration[index + 1];

		setFinalConfiguration(
			finalConfiguration.map((x, i) => {
				if (index + 1 === i) {
					return thisRow;
				} else if (index === i) {
					return targetRow;
				} else {
					return x;
				}
			})
		);
	};

	const onSwitch = (index: number) => {
		if (!finalConfiguration) return;

		setFinalConfiguration(
			finalConfiguration.map((x, i) => {
				if (index === i) {
					return {
						...x,
						fixedField: !x.fixedField,
					};
				} else {
					return x;
				}
			})
		);
	};

	const onAdd = (data: TReportDictionary) => {
		if (!finalConfiguration) {
			setFinalConfiguration([data]);

			return;
		}

		if (index !== undefined) {
			setFinalConfiguration(
				finalConfiguration.map((x, i) => {
					if (index === i) {
						return data;
					} else {
						return x;
					}
				})
			);
		} else {
			setFinalConfiguration(finalConfiguration.concat(data));
		}

		setItem(undefined);
		setIndex(undefined);
	};

	const onClearItem = () => {
		setItem(undefined);
		setIndex(undefined);
	};

	const onModalSaveOpen = () => {
		showModal({
			onSave: async (data) => {
				if (!reportComponent || !finalConfiguration) return;

				const { meta } = await dispatch(
					updateReportConfiguration({
						...data,
						reportComponent,
						configurations: finalConfiguration.map((x) => ({
							...x,
							id: 0,
							reportComponent,
						})),
					})
				);

				if (meta.requestStatus === "rejected") {
					enqueueSnackbar(t("anErrorHasOcurred"), { variant: "error" });
				} else {
					enqueueSnackbar(t("recordEditedSuccessfully"), {
						variant: "success",
					});
				}

				dispatch(actions.report.clear());
			},
		});
	};

	return (
		<ScreenTemplate>
			<Filter onSelect={onSelectReportComponent} />
			{finalConfiguration && reportComponent !== undefined && (
				<Form onAdd={onAdd} item={item} onClear={onClearItem} />
			)}
			{finalConfiguration && finalConfiguration.length > 0 && (
				<List
					items={finalConfiguration}
					onEdit={onEdit}
					onDelete={onDelete}
					onUp={onUp}
					onDown={onDown}
					onSave={onModalSaveOpen}
					onSwitch={onSwitch}
				/>
			)}
		</ScreenTemplate>
	);
};

export default ReportOrders;
