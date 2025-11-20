import { ReactNode } from 'react';
import { Divider, Grid, Typography } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';

import { TPermissionType } from 'src/core/models/profiles';
import { useCurrentUser } from 'src/config/permissions';
import SkeletonFieldColumn from 'src/components/Skeletons/FieldColumn'
import SkeletonSelectField from 'src/components/Skeletons/SelectField'
import CancelButton from '../button/Cancel';
import { MainDiv } from './styled';

type PanelProps = {
	title: string;
	children: ReactNode;
	slotTopRight?: ReactNode;
	slotTopRightPermission?: TPermissionType;
	slotBottomRight?: ReactNode;
	slotBottonRightPermission?: TPermissionType | boolean;
	slotBottomLeft?: ReactNode;
	slotBottonLeftPermission?: TPermissionType | boolean;
	noSlotCancel?: boolean;
	loading?: boolean;
	withPadding?: boolean;
	className?: string;
	cancelAndGoBack?: boolean;
};

const SkeletonPanel = () => {
	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={3}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item xs={12} md={3}>
				<SkeletonSelectField />
			</Grid>
			<Grid item xs={12} md={3}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item xs={12} md={3}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item xs={12} md={3}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item xs={12} md={3}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item xs={12} md={3}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item xs={12} md={3}>
				<SkeletonSelectField />
			</Grid>
			<Grid item xs={12} md={3}>
				<SkeletonSelectField />
			</Grid>
			<Grid item xs={12} md={3}>
				<SkeletonFieldColumn />
			</Grid>
			<Grid item xs={12} md={3}>
				<SkeletonFieldColumn />
			</Grid>
		</Grid>
	)
}

const Panel = ({
	title,
	children,
	slotTopRight,
	slotTopRightPermission,
	slotBottomRight,
	slotBottonRightPermission,
	slotBottomLeft,
	slotBottonLeftPermission,
	loading = false,
	noSlotCancel,
	withPadding,
	className,
	cancelAndGoBack = false
}: PanelProps) => {

	const { id } = useParams<{ id: string }>();

	const { currentScreenPermissions } = useCurrentUser(id);
	const history = useHistory(); 

	return (
		<MainDiv className={className}>
			<div className='panel'>
				<Grid
					container
					justifyContent='space-between'
					alignItems='center'
					className='panel-header'
					data-testid='panel-header'
				>
					<Grid item>
						<Typography
							variant='h2'
							data-testid='panel-title'
							className='panel-title'
						>
							{title}
						</Typography>
					</Grid>
					{
						slotTopRight
						&& slotTopRightPermission
						&& currentScreenPermissions[slotTopRightPermission]
						&& <Grid item>{slotTopRight}</Grid>
					}
				</Grid>
				<Divider />
				{loading
					? (
						<div className='panel-content'>
							<Grid container justifyContent='center' className='margin-top-16'>
								<SkeletonPanel />
							</Grid>
						</div>
					) : withPadding
						? <div className='panel-content'>{children}</div>
						: children
				}
			</div>

			{(slotBottomRight || slotBottomLeft) && (
				<Grid
					container
					direction='row'
					justifyContent='space-between'
					className='margin-top-24'
				>
					<Grid item data-testid='panel-bottom-left'>
						{
							slotBottomLeft && (
								<Grid container spacing={2}>
									<Grid item>
										{!noSlotCancel && <CancelButton />}
									</Grid>
									<Grid item>
										{
											(typeof slotBottonLeftPermission === 'boolean' && slotBottonLeftPermission)
												|| (typeof slotBottonLeftPermission === 'string' && currentScreenPermissions[slotBottonLeftPermission])
												? slotBottomLeft
												: null
										}
									</Grid>
								</Grid>
							)
						}
					</Grid>
					<Grid item data-testid='panel-bottom-right'>
						{
							slotBottomRight && (
								<Grid container spacing={2}>
									<Grid item>
										{!noSlotCancel && cancelAndGoBack === false ? <CancelButton /> : <CancelButton onClickCancel={() => history.goBack()} />}
									</Grid>
									<Grid item>
										{
											(typeof slotBottonRightPermission === 'boolean' && slotBottonRightPermission)
												|| (typeof slotBottonRightPermission === 'string' && currentScreenPermissions[slotBottonRightPermission])
												? slotBottomRight
												: null
										}
									</Grid>
								</Grid>
							)
						}
					</Grid>
				</Grid>
			)}
		</MainDiv>
	)
}

export default Panel;
