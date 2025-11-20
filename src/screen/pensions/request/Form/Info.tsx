import { Grid } from '@material-ui/core';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FieldColumn from 'src/components/FieldColumn';
import Panel from 'src/components/Panel';
import { getPensionRequestFolderInfo } from 'src/core/store/modules/pensions/request-pensions/selectors';
import { fetchProcessFolder } from 'src/core/store/modules/process/thunks';
import { t } from 'src/locale/i18n';

type Props = {
	folderNumber?: string;
};

const Info = ({ folderNumber }: Props) => {
	const dispatch = useDispatch();

	useEffect(() => {
		if (folderNumber) dispatch(fetchProcessFolder({ folderNumber }));
	}, [folderNumber, dispatch]);

	const {
		costCenter,
		processNumber,
		legalDepartmentArea,
		localidade,
		parteContraria,
		chaveProcesso,
		individual,
	} = useSelector(getPensionRequestFolderInfo);

	return (
		<Panel title={t('pension:request.form.pensionData')} withPadding>
			<Grid container justifyContent='space-between' spacing={3}>
				<Grid item md={3} xs={12} sm={6}>
					<FieldColumn label={t('form.area')} value={legalDepartmentArea} />
				</Grid>
				<Grid item md={3} xs={12} sm={6}>
					<FieldColumn label={t('pension:request.form.location')} value={localidade} />
				</Grid>
				<Grid item md={3} xs={12} sm={6}>
					<FieldColumn label={t('processInformation.processNumber')} value={processNumber} />
				</Grid>
				<Grid item md={3} xs={12}>
					<FieldColumn label={t('pension:request.form.processKey')} value={chaveProcesso} />
				</Grid>
				<Grid item md={3} xs={12} sm={6}>
					<FieldColumn
						label={t('solicitacaoPagamento:dadosPagamento.centroCusto')}
						value={costCenter}
					/>
				</Grid>
				<Grid item md={3} xs={12} sm={6}>
					<FieldColumn
						label={t('pension:request.form.opposingPartyName')}
						value={ parteContraria }
					/>
				</Grid>
				<Grid item md={3} xs={12} sm={6}>
					<FieldColumn label={t('pension:request.form.gender')} value={individual?.gender} />
				</Grid>
				<Grid item md={3} xs={12} sm={6}>
					<FieldColumn
						label={t('personInformation.birthDate')}
						type='date'
						value={individual?.birthDate}
					/>
				</Grid>
			</Grid>
		</Panel>
	);
};

export default Info;
