import ScreenTemplate from "src/components/Screen";
import ExecutedAccouting from "./executedAccoutingSearch";
import ExecutedAccoutingList from "./executedAccoutingList";
import Form from "./form";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/core/store";
import {
	getExecutedInterestUpdates,
	getExecutedInterestUpdatesWhenPageLoad,
} from "src/core/store/modules/goods-guarantee/thunks";
import { PayloadAction } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";

type TReportRequest = {
	competenceDate: string;
	juridicalAreaIds: number[];
	accountingTypeId: number | null;
	statusApprovals: number[];
	closureId: number | null;
};

const AccountingReport = () => {
	const dispatch = useDispatch<AppDispatch>();

	const [rows, setRows] = useState<any>();

	const { enqueueSnackbar } = useSnackbar();

	const onSubmitGetInterest = async (
		{
			competenceDate,
			juridicalAreaIds,
			statusApprovals,
			accountingTypeId,
			closureId,
		}: TReportRequest,
		{ setSubmitting }: any
	) => {
		setSubmitting(true);
		const res: PayloadAction<any> = await dispatch(
			getExecutedInterestUpdates({
				competenceDate,
				juridicalAreaIds,
				statusApprovals,
				accountingTypeId,
				closureId,
			})
		);
		setRows(res.payload.items);

		if (typeof res.payload === "string") {
			enqueueSnackbar(`${res.payload}`, { variant: "error" });
		}
		setSubmitting(false);
	};

	const getExecutedInterestUpdatesWhenLoad = async () => {
		const res: PayloadAction<any> = await dispatch(
			getExecutedInterestUpdatesWhenPageLoad()
		);
		setRows(res.payload.items);
	};

	useEffect(() => {
		getExecutedInterestUpdatesWhenLoad();
		
	}, []);

	return (
		<ScreenTemplate>
			<Form setRows={setRows} />
			<ExecutedAccouting
				setRows={setRows}
				onSubmitGetInterest={onSubmitGetInterest}
			/>
			<ExecutedAccoutingList setRows={setRows} rows={rows} />
		</ScreenTemplate>
	);
};

export default AccountingReport;

