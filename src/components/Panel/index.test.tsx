import { render } from '@testing-library/react';
import Panel from '.';

describe('Panel Component', () => {
	test('Exibe o título e o conteúdo interno', () => {
		const title = 'Teste';
		const children = <span>Children</span>;

		const { getByTestId, getByText } = render(
			<Panel title={title}>{children}</Panel>
		);
		const panelTitle = getByTestId('panel-title');
		const panelChildren = getByText('Children');

		expect(panelTitle).toBeInTheDocument();
		expect(panelTitle.textContent).toBe(title);
		expect(panelChildren).toBeInTheDocument();
	});

	test('Exibe informação alinhada com o título', () => {
		const title = 'Teste';
		const topRight = <span>TopRight</span>;
		const children = <span>Children</span>;

		const { getByTestId, getByText } = render(
			<Panel title={title} slotTopRight={topRight}>
				{children}
			</Panel>
		);
		const panelHeader = getByTestId('panel-header');
		const panelTopRight = getByText('TopRight');

		expect(panelHeader.children.length).toBe(2);
		expect(panelTopRight).toBeInTheDocument();
	});

	test('Exibe informação no campo inferior esquerdo', () => {
		const title = 'Teste';
		const children = <span>Children</span>;
		const bottomLeft = <span>bottomLeft</span>;

		const { getByTestId, getByText } = render(
			<Panel title={title} slotBottomLeft={bottomLeft}>
				{children}
			</Panel>
		);
		const panelBottomLeft = getByTestId('panel-bottom-left');

		expect(panelBottomLeft).toBeInTheDocument();
		expect(getByText('bottomLeft')).toBeTruthy();
	});

	test('Exibe informação no campo inferior direito', () => {
		const title = 'Teste';
		const children = <span>Children</span>;
		const bottomRight = <span>bottomRight</span>;

		const { getByTestId, getByText } = render(
			<Panel title={title} slotBottomRight={bottomRight}>
				{children}
			</Panel>
		);
		const panelBottomRight = getByTestId('panel-bottom-right');

		expect(panelBottomRight).toBeInTheDocument();
		expect(getByText('bottomRight')).toBeTruthy();
	});
});
