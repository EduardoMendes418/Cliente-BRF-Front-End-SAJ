import { render } from '@testing-library/react';
import ScreenTemplate from '.';

describe('ScreenTemplate Component', () => {
	test('Renderização inicial', () => {
		const paths = [{ label: 'Teste' }];
		const children = <span>children</span>;

		const { getByTestId, getByText } = render(
			<ScreenTemplate breadcrumbsPath={paths}>{children}</ScreenTemplate>
		);

		const breadcrumb = getByTestId('breadcrumbs');
		expect(breadcrumb).toBeInTheDocument();
		expect(getByText('children')).toBeInTheDocument();
	});

	test('Exibe informação alinhada ao breadcrumbs', () => {
		const paths = [{ label: 'Teste' }];
		const children = <span>children</span>;
		const topRight = <span>topRight</span>;

		const { getByText } = render(
			<ScreenTemplate breadcrumbsPath={paths} slotTopRight={topRight}>
				{children}
			</ScreenTemplate>
		);

		expect(getByText('topRight')).toBeInTheDocument();
	});
});
