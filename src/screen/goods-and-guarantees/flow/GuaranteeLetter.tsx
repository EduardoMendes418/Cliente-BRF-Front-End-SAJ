import { useDispatch } from 'react-redux';
import { Box, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useMsal } from '@azure/msal-react';
import moment from 'moment';

import Form, { DateField, SelectField, TextField } from 'src/components/form';
import JustificationModal, { TForm } from 'src/components/JustificationModal';
import ActionButtons from 'src/components/ActionButtons';
import FieldColumn from 'src/components/FieldColumn';
import Attachments from 'src/components/Attachments'
import { modal } from 'src/components/modals';
import Panel from "src/components/Panel"
import Logs from 'src/components/Logs';
import JustificationDisplay from 'src/components/JustificationDisplay';
import { t } from "src/locale/i18n";

import { TGoodsGuaranteesRequest, TGuaranteeFlowLetter } from 'src/core/models/goods-guarantee';
import { editGoodsGuaranteesRequest, updateGoodsGuaranteesStatusFlow } from 'src/core/store/modules/goods-guarantee/thunks';
import { TActors } from 'src/core/models/profiles';
import { useBanks } from 'src/hooks/fetchLists';

import { customTaskTitleStyle, ACTIONS_TO_STATUS, ACTIONS } from './constants';
import { RECORD_TYPE, statusTextLetter, STATUS_FLOW } from '../constants';
import { approverScope, requesterScope } from '../func';

const validate = ({ startEffective, endEffective }: any) => {
	const initialDate = moment(startEffective).startOf('day')
	const finalDate = moment(endEffective).startOf('day')
	if (initialDate.isAfter(finalDate))
		return { endEffective: t('validations.finalDate') }
}

type TTasks = {
	item: TGoodsGuaranteesRequest & TGuaranteeFlowLetter;
} & TActors

const GuaranteeLetter = ({
	item: { statusFlowId, process, ...item },
	isRequester,
	isApprover,
}: TTasks) => {
	const dispatch = useDispatch();

	const { banksAsOptions } = useBanks()
	const { accounts } = useMsal()

	const requested = statusFlowId === STATUS_FLOW.REQUESTED;
	const started = statusFlowId !== STATUS_FLOW.NONE;
	const cancelled = statusFlowId === STATUS_FLOW.REJECTED_DEFINITIVE && !item.logs?.find(({ statusFlowId}) => statusFlowId === STATUS_FLOW.REQUESTED);
	const finished = [STATUS_FLOW.REJECTED_DEFINITIVE, STATUS_FLOW.APPROVED_DEFINITIVE].includes(statusFlowId);
	const id = Number(item.id)

	const onJustify = (type: 'rejected' | 'cancelled') => {
		const component = (
			<JustificationModal
				reason={type === "cancelled" ? 'cancelled': undefined}
				onSubmitJustification={(item: TForm) => onSubmitReject(item, type)}
				moduloId={5}
			/>
		)

		const title = requested
			? t('goodsAndGuarantees:tasks.justificationForUnavailableLetter')
			: t('goodsAndGuarantees:tasks.justificationForCancelRequest')

		modal({
			title,
			component,
			buttons: [],
			dialogProps: { maxWidth: 'md', showCloseButton: true, fullWidth: true },
		})
	}

	const actionButtons = [
		{
			label: t('goodsAndGuarantees:tasks.cancelRequest'),
			statuses: [STATUS_FLOW.NONE, STATUS_FLOW.RETURNED],
			onClick: () => onJustify('cancelled')
		},
		{
			label: t('goodsAndGuarantees:tasks.unavailableLetter'),
			statuses: [STATUS_FLOW.REQUESTED],
			onClick: () => onJustify('rejected')
		},
		{
			label: t('btnRequest'),
			statuses: [STATUS_FLOW.NONE, STATUS_FLOW.RETURNED],
		},
		{
			label: t('btnFinish'),
			statuses: [STATUS_FLOW.REQUESTED],
		},
	];

	const validActionButtons = actionButtons
		.filter(({ statuses }) => statuses.includes(Number(statusFlowId)))
	const finishedInfo = item.logs?.find((log) =>
		[STATUS_FLOW.APPROVED_DEFINITIVE, STATUS_FLOW.REJECTED_DEFINITIVE].includes(
			log.statusFlowId as STATUS_FLOW
		) && !log.observation.includes("Histórico de Alterações")
	);
	const onSubmit = ({ ...values }: TGuaranteeFlowLetter) => {
		const newStatusFlow = requested ? 'APPROVE_DEFINITIVE' : 'REQUEST';
		const generateLog = {
			id,
			observation: isLetterInfoHidden ? values.observation :  values.observationRequest ?? "",
			statusFlowId: ACTIONS_TO_STATUS[ACTIONS[newStatusFlow]]
		}

		dispatch(editGoodsGuaranteesRequest({
			...item,
			...values,
			id,
			generateLog,
			sendEmail: !requested,
			recordType: requested ? RECORD_TYPE.EFFECTIVE : item.recordType
		}));
	}

	const onSubmitReject = ({ justification, rejectionAndReturnReasonsId }: TForm, type: 'rejected' | 'cancelled') => {
		const newStatusFlow = type === 'rejected' ? ACTIONS_TO_STATUS[ACTIONS.RETURN_DRAFT] : ACTIONS_TO_STATUS[ACTIONS.REJECT_DEFINITIVE]
		dispatch(updateGoodsGuaranteesStatusFlow({
			id,
			observation: justification,
			statusFlowId: newStatusFlow,
			rejectionAndReturnReasonsId
		}));
	}

	const requestedInfo = item.logs?.find(log => log.statusFlowId === STATUS_FLOW.REQUESTED);
	
	const {	occurrenceDate } = requestedInfo ?? {}
	const isLetterInfoHidden = !started || (statusFlowId === STATUS_FLOW.REJECTED_DEFINITIVE && !requestedInfo)

	const initialValues = {
		id,
		effectiveDate: occurrenceDate ?? moment().format('YYYY-MM-DD'),
		statusFlowId,
		observationRequest: finishedInfo?.observation ?? '',
		observation: item.observation ?? '',
		suretyLetterNumber: item.suretyLetterNumber || '',
		bankId: item.bankId ?? '',
		startEffective: item.startEffective || null,
		endEffective: item.endEffective || null,
		emails: item.emails ?? '',
		attachments: item.files.filter(({ isMainFile }: any) => !isMainFile) as any,
	}

	return (
		<Form
			initialValues={initialValues}
			onSubmit={onSubmit}
			validate={validate}
			enableReinitialize
			permission={
				!finished &&
				((isRequester && requesterScope(statusFlowId)) ||
				(isApprover && approverScope(statusFlowId)))
			}
		>
			{({ handleSubmit, status: statusForm }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Panel title={t('goodsAndGuarantees:tasks.title')} withPadding>
						<Typography variant='h4' style={customTaskTitleStyle}>
							{ t('goodsAndGuarantees:tasks.letterRequest') }
						</Typography>
						<Box mt={3}>
							<Grid container spacing={3}>
								<Grid item xs={12} md={3}>
									<FieldColumn
										label={t('goodsAndGuarantees:formFlow.responsible')}
										value={requestedInfo?.userName || accounts[0]?.name}
									/>
								</Grid>
								<Grid item md={3} xs={12}>
									<DateField
										name="effectiveDate"
										label="Data"
										readOnly
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										name="emails"
										label={t('goodsAndGuarantees:formFlow.emails')}
										helperText={t('goodsAndGuarantees:formFlow.emailsHelperText')}
										readOnly={started || statusForm === 'readOnly'}
									/>
								</Grid>
								<Grid item md={12} xs={12}>
									<TextField
										name={"observation"}
										label="Observações"
										placeholder={t('form.typeHere')}
										readOnly={started || statusForm === 'readOnly'}
									/>
								</Grid>
							</Grid>
						</Box>
						{ !isLetterInfoHidden && (
							<Box mt={3}>
								<Typography variant='h4' style={customTaskTitleStyle}>
									{ t('goodsAndGuarantees:tasks.attachmentsLetter') }
								</Typography>
								<Grid container spacing={3}>
									<Grid item xs={12} md={3}>
										<FieldColumn
											label={t('goodsAndGuarantees:formFlow.responsible')}
											value={finishedInfo?.userName || accounts[0]?.name}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<TextField
											name="suretyLetterNumber"
											label={t('goodsAndGuarantees:formFlow.suretyLetterNumber')}
											placeholder={t('form.typeHere')}
											readOnly={!requested || statusForm === 'readOnly'}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<SelectField
											name="bankId"
											label={t('goodsAndGuarantees:formFlow.bankId')}
											options={banksAsOptions}
											readOnly={!requested || statusForm === 'readOnly'}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<DateField
											name="startEffective"
											label={t('goodsAndGuarantees:formFlow.startEffective')}
											readOnly={!requested || statusForm === 'readOnly'}
										/>
									</Grid>
									<Grid item md={3} xs={12}>
										<DateField
											name="endEffective"
											label={t('goodsAndGuarantees:formFlow.endEffective')}
											readOnly={!requested || statusForm === 'readOnly'}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextField
											name="observationRequest"
											label="Observações"
											placeholder={t('form.typeHere')}
											readOnly={!requested || statusForm === 'readOnly'}
										/>
									</Grid>
								</Grid>
							</Box>
						)}
					</Panel>
					{(requested || finished) && (
						<Attachments
							name="attachments"
							label={t('goodsAndGuarantees:tasks.attachmentsTask')}
						/>
					)}
					{cancelled && (
						<JustificationDisplay
							logs={item.logs}
							status={statusFlowId}
							type='cancelled'
							moduloId={5}
						/>
					)}
					<Logs
						logs={item.logs}
						statuses={statusTextLetter}
						statusOrder={['flow']}
					/>
					<ActionButtons hidden={finished || statusForm === 'readOnly'} buttons={validActionButtons} />
				</form>
			)}
		</Form>
	)
}

export default GuaranteeLetter;
