import ScreenTemplate from 'src/components/Screen';
import { useDispatch, useSelector } from "react-redux";

import {
	Button, Grid,
} from '@material-ui/core';
import List from './List';
import Search from './Search';
import { usePagination } from "src/hooks/pagination";
import { AppDispatch } from "src/core/store";
import { useHistory } from 'react-router-dom';
import { fetchsmartSwapExecution } from 'src/core/store/modules/smart-swap-execution/thunks';
import { t } from 'src/locale/i18n';
import { SmartSwapChangesParameters } from 'src/core/models/smart-swap-execution';
import { getListFiltersSmartSwapExecution } from 'src/core/store/modules/smart-swap-execution/selectors';
import { IndexDiv } from './styled';

const breadcrumbs = [
	{ label: t("dashboard")},
	{ label: "Carga de dados"},
	{ label: "Troca inteligente", },
	{ label: 'Execução'}
  ];
const SmartSwapExecution = () => {
	const dispatch = useDispatch<AppDispatch>();
	const history = useHistory();
	const { pageSize } = usePagination();
	const filters = useSelector(getListFiltersSmartSwapExecution) as SmartSwapChangesParameters;

	return (
		<ScreenTemplate breadcrumbsPath={breadcrumbs}>
			<IndexDiv>
				<Grid
					container
					direction="row"
					justifyContent="space-between"

				>
					<Button
						style={{marginRight: 10}}
						onClick={(e) => dispatch(fetchsmartSwapExecution({page: 1, pageSize, ...filters}))}
						variant="contained"
						color='primary'
					>
						Atualizar Lista
					</Button>

					<Button
						onClick={() => history.push('/carga-de-dados/troca-inteligente')}
						variant="contained"
						color='primary'
					>
						{ 'Filtros da troca inteligente'}
					</Button>
				</Grid>
			</IndexDiv>
			<Search />
			<List />
		</ScreenTemplate>
	);
};

export default SmartSwapExecution;
