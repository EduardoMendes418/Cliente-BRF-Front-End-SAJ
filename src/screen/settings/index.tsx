import Panel from 'src/components/Panel';
import ScreenTemplate from 'src/components/Screen';

import ConfiguracoesHome, { CategoryEntry } from './home';

import { t } from 'src/locale/i18n';
import { joinPaths } from 'src/core/utils/func';
import { TRoutes } from 'src/config/routes/config';
import { useCurrentUser } from 'src/config/permissions';

const ConfiguracoesPage = () => {

	const { routesWithPermissions } = useCurrentUser('')

	const routesConfig = routesWithPermissions
		.find(({ path }) => path === 'configuracoes')?.subroutes ?? [] as TRoutes[]

	const configPages = routesConfig
		.reduce((acc, { title = '', subroutes, path }: TRoutes) => {
			if (subroutes) {
				acc.push({
					title,
					pages: subroutes.map(item => ({
						title: item.title ?? '',
						url: joinPaths([path, item.path]).slice(1)
					}))
				})
			} else {
				acc = [
					{ ...acc[0], pages: [...acc[0].pages, { title, url: path }] },
					...acc.slice(1)
				]
			}
			return acc
		}, [{ title: '', pages: [] }] as CategoryEntry[])

	return (
		<ScreenTemplate permission>
			<Panel title={t('configuracoes')}>
				<ConfiguracoesHome categories={configPages} />
			</Panel>
		</ScreenTemplate>
	);
}

export default ConfiguracoesPage;
