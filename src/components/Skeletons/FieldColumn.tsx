import { Skeleton } from '@mui/material';

const SkeletonFieldColumn = () => {
	return (
		<>
			<Skeleton width={100} height={20} />
			<Skeleton width='70%' height={25} />
		</>
	)
}


export default SkeletonFieldColumn;