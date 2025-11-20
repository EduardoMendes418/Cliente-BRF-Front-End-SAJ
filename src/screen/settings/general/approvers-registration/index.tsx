import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ScreenTemplate from 'src/components/Screen';
import Panel from 'src/components/Panel';
import Pagination from 'src/components/Pagination';
import { useTranslation } from 'src/locale/i18n';
import { actions } from 'src/core/store';
import { useActionHierarchy } from 'src/hooks/hierarchy';

import List from './List';
import Search from './Search';

const ApproversRegistration = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	useActionHierarchy('/configuracoes/cadastro-aprovadores');

	useEffect(() => {
		return () => {
			dispatch(actions.hierarchy.clear());
		};
	}, [dispatch]);

	return (
		<ScreenTemplate slotTopRight>
			<Panel title={t('approversRegistration:title')}>
				<div className="panel-content">
					<Search />
				</div>
				<List />
			</Panel>
			<Pagination />
		</ScreenTemplate>
	);
};

export default ApproversRegistration;
