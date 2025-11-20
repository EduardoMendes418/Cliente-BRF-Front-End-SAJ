import { CircularProgress } from '@material-ui/core';

import List from './List'
import PossibleApprovers from './PossibleApprovers'
import {
	TLogs,
	TPossibleApprovers
} from 'src/core/models';

type Props = {
	title?: string;
	logs?: TLogs[];
	possibleApprovers?: TPossibleApprovers[];
	loading?: boolean;
	statusOrder: ('flow' | 'approvalCenter')[];
	statuses?: { [key: number]: string };
	pensionLabel?: boolean;
}

const Logs = ({
	loading,
	logs = [],
	possibleApprovers = [],
	statusOrder,
	statuses = {},
	pensionLabel
}: Props
) => loading
		? <CircularProgress className='margin-top-16 align-center' />
		: (
			<>
				<PossibleApprovers items={possibleApprovers} />
				<List pensionLabel={pensionLabel} items={logs} statusOrder={statusOrder} statuses={statuses} />
			</>
		)


export default Logs;
