import { render } from '@testing-library/react';
import Table from '.';

describe('Table Component', () => {
	test('renderização inicial', () => {
		const columns = [
			{
				label: 'Col1',
				field: 'value1',
			},
			{
				label: 'Col2',
				field: 'value2',
			},
		];
		const { getByText } = render(<Table columns={columns} rows={[]} />);
		expect(getByText(/Col1/i)).toBeInTheDocument();
		expect(getByText(/Col2/i)).toBeInTheDocument();
		expect(getByText(/Nenhum registro encontrado/i)).toBeInTheDocument();
	});

	test('exibe os valores corretamente', () => {
		const columns = [
			{
				label: 'Col1',
				field: 'value1',
			},
			{
				label: 'Col2',
				field: 'value2',
			},
		];

		const rows = [
			{
				value1: 'Value1',
				value2: 'Value2',
			},
			{
				value1: 'AnotherValue1',
				value2: 'AnotherValue2',
			},
		];

		const { getByTestId, getAllByTestId } = render(
			<Table columns={columns} rows={rows} />
		);

		const th = getByTestId('table-row-header');
		const tb = getAllByTestId('table-row-body');

		expect(th.children.length).toBe(2);
		expect(th.children[0].innerHTML).toBe('Col1');
		expect(th.children[1].innerHTML).toBe('Col2');

		expect(tb.length).toBe(2);
		expect(tb[0].children.length).toBe(2);
		expect(tb[0].children[0].innerHTML).toBe('Value1');
		expect(tb[0].children[1].innerHTML).toBe('Value2');
		expect(tb[1].children.length).toBe(2);
		expect(tb[1].children[0].innerHTML).toBe('AnotherValue1');
		expect(tb[1].children[1].innerHTML).toBe('AnotherValue2');
	});
});
