import { Router } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import ListBreadcrumbs from './index';

describe('Breadcrumbs Component', () => {
	test("Sem enviar o campo 'url', exibe apenas o texto", () => {
		const paths = [{ label: 'Teste' }, { label: 'Teste1' }];
		const { getAllByTestId } = render(<ListBreadcrumbs paths={paths} />);

		const breadcrumbsItems = getAllByTestId('breadcrumbs-item');
		expect(breadcrumbsItems.length).toBe(2);
		expect(breadcrumbsItems[0].classList.contains('link')).toBe(false);
		expect(breadcrumbsItems[1].classList.contains('link')).toBe(false);
	});

	test("Enviando o campo 'url', exibe um link", () => {
		const paths = [{ label: 'Teste', url: 'url' }, { label: 'Teste1' }];
		const history = createMemoryHistory();
		const { getAllByTestId } = render(
			<Router history={history}>
				<ListBreadcrumbs paths={paths} />
			</Router>
		);

		const breadcrumbsItems = getAllByTestId('breadcrumbs-item');
		expect(breadcrumbsItems[0].classList.contains('link')).toBe(true);
		expect(breadcrumbsItems[1].classList.contains('link')).toBe(false);
	});

	test('Ao clicar em um link, será redirecionado para a url indicada', () => {
		const paths = [{ label: 'Teste', url: 'url' }, { label: 'Teste1' }];
		const history = createMemoryHistory();
		const { getAllByTestId } = render(
			<Router history={history}>
				<ListBreadcrumbs paths={paths} />
			</Router>
		);

		const breadcrumbsItems = getAllByTestId('breadcrumbs-item');
		fireEvent.click(breadcrumbsItems[0]);
		expect(history.location.pathname).toBe('/url');
	});
});
