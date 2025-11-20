import { ReactNode } from 'react';
import { Formik, FormikConfig, FormikProps } from 'formik';
import { useCurrentUser } from 'src/config/permissions';
import { useParams } from 'react-router';
import { TPermissionType } from 'src/core/models/profiles';

function Form<T>({
	onSubmit,
	children,
	permission,
	...props
}: {
	children: (props: FormikProps<T>) => ReactNode
}
	& FormikConfig<T>
	& { permission?: TPermissionType | boolean; }
) {
	const { id } = useParams<{ id: string }>();
	const isNew = id === 'novo';

	const { currentScreenPermissions } = useCurrentUser(id)

	const allow = typeof permission === 'boolean'
		? permission
		: currentScreenPermissions[permission || (isNew ? 'add' : 'edit')]

	return (
		<Formik
			initialStatus={allow ? undefined : 'readOnly'}
			{...props}
			onSubmit={
				allow
					? onSubmit
					: (_, { setSubmitting }) => { setSubmitting(false) }
			}
			render={children}
		/>
	)
}

export default Form