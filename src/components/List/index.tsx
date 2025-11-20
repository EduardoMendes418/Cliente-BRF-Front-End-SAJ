import Panel from 'src/components/Panel';
import Table, { ColumnData } from 'src/components/Table';
import Pagination from 'src/components/Pagination';

type Props = {
	title: string;
	columns: ColumnData[];
	items: any;
	loading?: boolean;
	onVisualize?: (row: any) => void;
	onEdit?: (row: any) => void;
	onDelete?: (row: any) => void;
};

const List = ({ title, columns, items, loading, ...rest }: Props) => (
	<>
		<Panel title={title}>
			<Table
				columns={columns}
				rows={items}
				isLoading={loading}
				{...rest}
			/>
		</Panel>
		<Pagination />
	</>
);

export default List