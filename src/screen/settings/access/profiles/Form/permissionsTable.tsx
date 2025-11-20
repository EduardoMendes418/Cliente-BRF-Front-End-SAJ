import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { SwitchField } from "src/components/form";
import { useTranslation, t } from "src/locale/i18n";
import { TPermissions } from "src/core/models/profiles";

const PERMISSION_DISABLED = {
	"pagamentos/autorizar-acordo": ["del"],
	"pagamentos/solicitacao": ["del"],
	"pagamentos/aprovacao-controle-juridico": ["add", "del"],
	"pagamentos/aprovacao-advogado-interno": ["add", "del"],
	"fiscalizacao/solicitacao": ["del"],
	"fiscalizacao/aprovacao-controle-juridico": ["add", "del"],
	"fiscalizacao/aprovacao-advogado-interno": ["add", "del"],
	"recebimento-credito/solicitacao": ["del"],
	"recebimento-credito/avaliacao": ["add", "del"],
	"bens-e-garantias/solicitacao": ["del"],
	"bens-e-garantias/avaliacao-controle-juridico": ["add", "del"],
	"bens-e-garantias/avaliacao-advogado-interno": ["add", "del"],
	"bens-e-garantias/fluxo": ["del"],
	"bens-e-garantias/gestao": ["add", "del"],
	"bens-e-garantias/prestacao-de-contas-solicitacao": ["del"],
	"bens-e-garantias/prestacao-de-contas-avaliacao": ["del"],
	"bloqueios-e-transferencias/avaliacao": ["del"],
	"bloqueios-e-transferencias/solicitacao": ["del"],
	"pensoes/solicitar-pensao": ["del"],
	"provisoes/atualizacao-de-valores": ["add", "edit", "del"],
	calculos: ["del"],
	"requisicoes/lote-de-requisicoes": ["del"],
	"requisicoes/requisicoes": ["del"],
	"requisicoes/atendimento": ["add", "del"],
	"configuracoes/geral/cadastro-aprovadores": ["edit"],
	"configuracoes/geral/dias-nao-uteis": ["edit"],
	"configuracoes/pagamentos/prazo-dias": ["del"],
	"configuracoes/pagamentos/indice-fgts": ["del"],
	"configuracoes/bens-e-garantias/nota-explicativa": ["del"],
	"configuracoes/bens-e-garantias/tipo-de-conta": ["del"],
	"configuracoes/bens-e-garantias/tipo-de-liberacao": ["del"],
	"configuracoes/pagamentos/codigo-pagamento": ["del"],
	"configuracoes/pagamentos/indice-inss-gps": ["del"],
	"configuracoes/pagamentos/relacao-tipo-forma": ["del"],
	"configuracoes/geral/parametros-ir": ["del"],
	"configuracoes/geral/parametros-inss": ["del"],
	"carga-de-dados/contatos": ["add", "edit", "del"],
	"carga-de-dados/bens-e-garantias": ["add", "edit", "del"],
	"carga-de-dados/pagamentos": ["add", "edit", "del"],
	"carga-de-dados/documentos": ["add", "edit", "del"],
	"carga-de-dados/recebimento-de-credito": ["edit", "del"],
	"carga-de-dados/ficha-do-processo": ["add", "edit", "del"],
	"carga-de-dados/requisicoes": ["add", "edit", "del"],
	"carga-de-dados/ficha-processo-andamentos": ["add", "edit", "del"],
	"carga-de-dados/troca-inteligente": ["add", "edit", "del"],
	"carga-de-dados/carga-watson": ["del"],
	"carga-de-dados/pedidos-pasta-ctg": ["add", "edit", "del"],
	"fechamento/executar-equalizacao": ["edit", "del"],
	"fechamento/relatorio-de-provisao": ["add", "edit", "del"],
	"provisoes/consulta-pasta": ["add", "edit", "del"],
	"fechamento/busines-combination": ["add", "edit", "del"],
	"pagamentos/DIRF": ["add", "edit", "del"],
} as any;

type PermissionsTableProps = {
	permissions: TPermissions[];
	remove: any;
	screenTitles: any;
};

const PermissionsTable = ({
	permissions,
	remove,
	screenTitles,
}: PermissionsTableProps) => {
	const { t } = useTranslation();

	return !permissions.length ? null : (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow data-testid="table-row-header">
						<TableCell component="th">
							{t("settings:profiles.form.name")}
						</TableCell>
						<TableCell component="th">
							{t("settings:profiles.form.add")}
						</TableCell>
						<TableCell component="th">
							{t("settings:profiles.form.edit")}
						</TableCell>
						<TableCell component="th">
							{t("settings:profiles.form.del")}
						</TableCell>
						<TableCell component="th">
							{t("settings:profiles.form.view")}
						</TableCell>
						{remove && (
							<TableCell component="th">
								{t("settings:profiles.form.actions")}
							</TableCell>
						)}
					</TableRow>
				</TableHead>
				<TableBody>
					{permissions.map(({ name }:any, index:number) => (
						<TableRow key={`tablerow_${index}`}>
							<TableCell component="td">
								{screenTitles[name]}
							</TableCell>
							<TableCell component="td">
								<SwitchField
									name={`permissions.${index}.add`}
									disabled={PERMISSION_DISABLED[
										name
									]?.includes("add")}
								/>
							</TableCell>
							<TableCell component="td">
								<SwitchField
									name={`permissions.${index}.edit`}
									disabled={PERMISSION_DISABLED[
										name
									]?.includes("edit")}
								/>
							</TableCell>
							<TableCell component="td">
								<SwitchField
									name={`permissions.${index}.del`}
									disabled={PERMISSION_DISABLED[
										name
									]?.includes("del")}
								/>
							</TableCell>
							<TableCell component="td">
								<SwitchField
									name={`permissions.${index}.view`}
									disabled
								/>
							</TableCell>
							{remove && (
								<TableCell component="td">
									<IconButton
										aria-label="del"
										onClick={() => remove(index)}
										type="button"
									>
										<DeleteIcon color="error" />
									</IconButton>
								</TableCell>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default PermissionsTable;
