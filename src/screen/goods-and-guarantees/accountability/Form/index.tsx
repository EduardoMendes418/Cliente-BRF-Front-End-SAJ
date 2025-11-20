import { useParams } from 'react-router';
import IndexSingle from './indexSingle'
import IndexMultiple from './indexMultiple'

const GuaranteeAccountabilityForm = () => {
	const { id } = useParams<{ id: string }>();
	if (!id.includes("multipla")) return <IndexSingle />
	return <IndexMultiple/>
}

export default GuaranteeAccountabilityForm;
