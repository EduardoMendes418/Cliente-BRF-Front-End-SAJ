import { TYPE_DOCUMENTS } from 'src/core/models/data-import';

import FiltersPayment from './FiltersPayment';
import FiltersPension from './FiltersPension';
import FiltersAccountability from './FiltersAccountability';
import FiltersLegalOne from './FiltersLegalOne';
import FiltersRequest from './FiltersRequest';

type Props = {
	type: TYPE_DOCUMENTS,
}

const FiltersExport = ({ type }: Props) => {
	switch (type) {
		case TYPE_DOCUMENTS.PAYMENT: return <FiltersPayment />
		case TYPE_DOCUMENTS.PENSION: return <FiltersPension />
		case TYPE_DOCUMENTS.ACCOUNTABILITY: return <FiltersAccountability />
		case TYPE_DOCUMENTS.OTHER_LEGAL_ONE_DOCUMENTS: return <FiltersLegalOne />
		case TYPE_DOCUMENTS.REQUEST: return <FiltersRequest />
		default: return null
	}
}

export default FiltersExport;