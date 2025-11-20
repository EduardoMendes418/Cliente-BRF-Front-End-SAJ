import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useFormikContext } from 'formik';
import { useEffect } from 'react';
import { SelectField } from 'src/components/form';

import { modal } from 'src/components/modals';
import FormDefault from '../../../../payment/request/Form/types/default/Form';
import FormDadosPagGuia from '../../../../payment/request/Form/types/guides/Form';
import FormFGTS from '../../../../payment/request/Form/types/FGTS/Form';
import FormGPS from '../../../../payment/request/Form/types/GPS/Form';
import FormIRRF from '../../../../payment/request/Form/types/IRRF/Form';
import { ComponentDiv, MainDiv } from './styled';

const viewForm = (form: string) => {
	switch (form) {
		case 'fgts':
			return FormFGTS;
		case 'guia':
			return FormDadosPagGuia;
		case 'gps':
			return FormGPS;
		case 'irrf':
			return FormIRRF;
		default:
			return FormDefault;
	}
};

const formularioOptions = [
	{ label: 'Default', value: 'default' },
	{ label: 'FGTS', value: 'fgts' },
	{ label: 'Guia', value: 'guia' },
	{ label: 'GPS', value: 'gps' },
	{ label: 'IRRF', value: 'irrf' },
];

type Props = {
	table: {
		formaPagamentoId: number;
		formaPagamentoDescricao: string;
		formulario: string;
	}[];
};

type formaPagamentos = {
	formaPagamentos: {
		formaPagamentoId: number;
		formaPagamentoDescricao: string;
		formulario: string;
	}[];
};

const RelacaoTipoFormaPagamentoTable = ({ table }: Props) => {
	const formik = useFormikContext<formaPagamentos>();

	useEffect(() => {
		table.forEach(({ formaPagamentoId }, index) => {
			formik.setFieldValue(
				`formaPagamentos[${index}].formaPagamentoId`,
				formaPagamentoId
			);
		})
	}, [table])

	const handleVisualizar = (index: number) => {
		const { formulario } = formik.values.formaPagamentos[index] ?? '';
		const Component = viewForm(formulario);
		modal({
			title: 'Formulário',
			component: (
				<MainDiv className='form-visualizer'>
					<ComponentDiv
						className='visualizer'
					></ComponentDiv>
					<Component hasItem showEmptyForm isApprovalInternalLawyer={false} isApprovalLegalControl={false} />
				</MainDiv>
			),
		});
	};

	const handleChange = (index: number) => {
		formik.setFieldValue(
			`formaPagamentos[${index}].formaPagamentoId`,
			table[index].formaPagamentoId
		);
	};

	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow data-testid='table-row-header'>
						<TableCell component='th'>Formas de pagamento</TableCell>
						<TableCell component='th'>Formulário vinculado</TableCell>
						<TableCell component='td' width='200px'>
							Ações
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{
						table.length
							? table.map((item, index) => (
								<TableRow key={`tablerow_${index}`}>
									<TableCell component='td'>{item.formaPagamentoDescricao}</TableCell>
									<TableCell component='td'>
										<SelectField
											label='Formulário'
											name={`formaPagamentos[${index}].formulario`}
											required
											options={formularioOptions}
											onChange={() => handleChange(index)}
										/>
									</TableCell>
									<TableCell component='td'>
										<IconButton aria-label='edit' onClick={() => handleVisualizar(index)}>
											<VisibilityIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))
							: (
								<TableRow>
									<TableCell colSpan={3}>Nenhum registro encontrado</TableCell>
								</TableRow>
							)
					}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default RelacaoTipoFormaPagamentoTable;
