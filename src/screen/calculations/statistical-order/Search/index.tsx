import {
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@material-ui/core';
import { useSelector } from 'react-redux';

import { getProcessError } from 'src/core/store/modules/process/selectors';
import { TProcessParties, TFolderStatisticalOrder } from 'src/core/models/process';
import AccordionPanel from 'src/components/AccordionPanel';
import FieldColumn from 'src/components/FieldColumn';
import SearchInfo from 'src/components/SearchInfo';
import Panel from 'src/components/Panel';
import { useTranslation } from 'src/locale/i18n';
import SearchForm from './Form';

type PropsInfo = {
	processNumber: string;
	legalDepartmentArea: string;
	costCenter: string;
	provisionClass: string;
	localidade: string;
};

const Info = ({
	processNumber,
	legalDepartmentArea,
	costCenter,
	provisionClass,
	localidade,
}: PropsInfo) => (
	<Grid
		container
		justifyContent='space-between'
		className='padding-top-32'
		spacing={3}
	>
		<Grid item md={3} xs={12} sm={6}>
			<FieldColumn label={'Número do processo'} value={processNumber} />
		</Grid>
		<Grid item md={3} xs={12} sm={6}>
			<FieldColumn label={'Área DEJUR'} value={legalDepartmentArea} />
		</Grid>
		<Grid item md={3} xs={12} sm={6}>
			<FieldColumn label={'Centro de custo agrupador'} value={costCenter} />
		</Grid>
		<Grid item md={3} xs={12} sm={6}>
			<FieldColumn label={'Localidade'} value={localidade} />
		</Grid>
		<Grid item md={3} xs={12}>
			<FieldColumn label={'Classe de provisão'} value={provisionClass} />
		</Grid>
	</Grid>
);

type ProcessPartiesProps = {
	items: TProcessParties[];
};

const ProcessParties = ({ items }: ProcessPartiesProps) => (
	<TableContainer data-testid='calculo-pedido-estatistico-tabela'>
		<Table>
			<TableHead>
				<TableRow>
					<TableCell>Partes envolvidas</TableCell>
					<TableCell>Posição</TableCell>
					<TableCell>Situação</TableCell>
				</TableRow>
			</TableHead>
			<TableBody data-testid='calculo-pedido-estatistico-tabela-body'>
				{
					items.length > 0
						? items.map(({ name, position, situation }, index) => (
							<TableRow data-testid='calculo-pedido-estatistico-tabela-item' key={index}>
								<TableCell component='td'>{name}</TableCell>
								<TableCell component='td'>{position}</TableCell>
								<TableCell component='td'>{situation}</TableCell>
							</TableRow>
						))
						: (
							<TableRow>
								<TableCell component='td' colSpan={3}>
									Nenhuma parte envolvida
								</TableCell>
							</TableRow>
						)
				}
			</TableBody>
		</Table>
	</TableContainer>
);

type PropsSearch = {
	folderNumber: string;
	isEmpty: boolean;
	isFetching: boolean;
	folder: TFolderStatisticalOrder;
};

const Search = ({ folderNumber, isEmpty, isFetching, folder }: PropsSearch) => {
	const { t } = useTranslation();
	const hasFolder = !isFetching && !isEmpty && !folder.closed
	const error = useSelector(getProcessError)

	return (
		<>
			{
				!hasFolder &&
				<Panel title='Cálculo do pedido estatístico' withPadding>
					<SearchForm
						folderNumber={folderNumber}
						isFetching={isFetching}
					/>
					{!isFetching && <SearchInfo error={error} closed={folder.closed} />}
				</Panel>
			}
			{
				hasFolder && 
					<AccordionPanel title={t('calculations:PanelStatisticalOrder.titleList')} startExpanded>
						<Info {...folder} />
					</AccordionPanel>
			}
			{
				hasFolder && 
					<AccordionPanel title={t('calculations:RelatedParties.titleList')} startExpanded>
						<ProcessParties items={folder.processParties ?? []} />
					</AccordionPanel>
			}
		</>
	)
};

export default Search;