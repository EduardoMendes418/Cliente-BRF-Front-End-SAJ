import { ReactNode, useMemo, isValidElement, ReactElement } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import { Grid } from '@material-ui/core';

import { useTranslation } from 'src/locale/i18n';
import AddNewButton from 'src/components/button/AddNew';

import ListBreadcrumbs, { PathProps } from '../Breadcrumbs';
import { joinPaths } from 'src/core/utils/func';
import { useCurrentUser } from 'src/config/permissions';
import { TPermissionType } from 'src/core/models/profiles';

type ScreenTemplateProps = {
	breadcrumbsPath?: PathProps[];
	children: ReactNode;
	slotTopRight?: { to: string, title?: string, showIcon?: boolean } | boolean | string | ReactElement;
	slotTopRithtPermission?: boolean | TPermissionType;
	permission?: boolean | TPermissionType;
};

const ScreenTemplate = ({
	breadcrumbsPath,
	slotTopRight,
	slotTopRithtPermission = 'add',
	permission,
	children,
}: ScreenTemplateProps) => {
	const { t } = useTranslation();
	const { location: { pathname } } = useHistory()
	const { id } = useParams<{ id: string }>();
	const hasId = !!id
	const isNew = id === 'novo';

	const {
		routesWithPermissions,
		currentScreenPermissions,
	} = useCurrentUser(id)

	const breadcrumbsDefault = useMemo(() => {
		const accBreadcrumbs = [{ label: t('dashboard'), url: '/' }]

		pathname.split('/').slice(1)
			.reduce((acc, path, idx, arr) => {
				const route = acc.find(item => item.path === path)

				if (route) {
					if (route.title) {
						accBreadcrumbs.push({
							label: route.title,
							url: (!route.component || idx + 1 === arr.length) ? '' : joinPaths(arr.slice(0, idx + 1))
						})
					}
					if (route.subroutes) return route.subroutes
				} else if (hasId) accBreadcrumbs.push({ label: t('register'), url: '' })

				return []
			}, routesWithPermissions)

		return accBreadcrumbs;
	}, [pathname, t, hasId, routesWithPermissions])

	const buttonTopRight = useMemo(() => {
		if (typeof slotTopRithtPermission !== 'boolean' && !currentScreenPermissions[slotTopRithtPermission]) return false
		else if (slotTopRithtPermission) {
			if (slotTopRight === true) return ({ to: pathname + '/novo' })
			else if (typeof slotTopRight === 'string') return ({ title: slotTopRight, to: pathname + '/novo' })
			return slotTopRight
		}
	}, [slotTopRight, pathname, currentScreenPermissions, slotTopRithtPermission])

	const allow = typeof permission === 'boolean'
		? permission
		: currentScreenPermissions[permission || (isNew ? 'add' : 'view')]

	return !allow
		? <Redirect to={pathname.replace(/\/\w+\/?$/, '')} />
		: (
			<>
				<Grid
					container
					direction='row'
					justifyContent='space-between'
					alignItems='center'
					style={{ height: '36px' }}
				>
					<Grid item>
						<ListBreadcrumbs paths={breadcrumbsPath || breadcrumbsDefault} />
					</Grid>
					<Grid item>
						{isValidElement(buttonTopRight) && buttonTopRight}
						{buttonTopRight && !isValidElement(buttonTopRight) && (
							<AddNewButton to={buttonTopRight.to} showIcon={buttonTopRight.showIcon}>
								{buttonTopRight.title || t('btnNew')}
							</AddNewButton>
						)}
					</Grid>
				</Grid>

				{children}
			</>
		);
};

export default ScreenTemplate;
