import ScreenTemplate from 'src/components/Screen';
import { useDispatch, useSelector } from "react-redux";

import { Button } from '@material-ui/core';
import List from './List';
import { usePagination } from "src/hooks/pagination";
import { fetchReport } from "src/core/store/modules/report/thunks";
import { AppDispatch } from "src/core/store";
import { ButtonDiv } from './styled';
import { getLoadingReports } from 'src/core/store/modules/report/selectors';

const ReportConfiguration = () => {
	const { pageSize } = usePagination();
	const dispatch = useDispatch<AppDispatch>();
	const loading = useSelector(getLoadingReports);

	return (
		<ScreenTemplate>
			<ButtonDiv>
				<Button
					disabled={loading}
					onClick={(e) => dispatch(fetchReport({page: 1, pageSize}))}
					variant="contained"
					color='primary'
				>
					Atualizar a Lista
				</Button>
			</ButtonDiv>
			<List />
		</ScreenTemplate>
	);
};

export default ReportConfiguration;
