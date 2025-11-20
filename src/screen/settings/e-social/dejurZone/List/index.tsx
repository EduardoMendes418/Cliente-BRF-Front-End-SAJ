import React from 'react';
import { useDispatch, useSelector } from "react-redux";

import { getLoadingESocialAreas, getListESocialAreas } from 'src/core/store/modules/e-social-areas/selectors';
import { fetchESocialAreasGridList } from 'src/core/store/modules/e-social-areas/thunks';
import ScreenTemplate from 'src/components/Screen';
import { useTranslation } from 'src/locale/i18n';
import Panel from 'src/components/Panel';
import List from './List';

const DejurZoneList = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const loading = useSelector(getLoadingESocialAreas);
	const items = useSelector(getListESocialAreas);

	React.useEffect(() => {
		dispatch(fetchESocialAreasGridList({}));
	}, []);

	return (
		<ScreenTemplate slotTopRight>
			<Panel title={t('eSocial:dejurZone.title')}>
				<List items={items} loading={loading} />
			</Panel>
		</ScreenTemplate>
	);
};

export default DejurZoneList;
