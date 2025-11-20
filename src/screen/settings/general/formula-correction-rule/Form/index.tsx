import { CircularProgress } from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import ScreenTemplate from "src/components/Screen";

import { actions } from "src/core/store";
import { getHasItemFormulaCorrectionRule, getItemFormulaCorrectionRule, getLoadingFormulaCorrectionRule } from "src/core/store/modules/formula-correction-rule/selectors";
import { fetchFormulaCorrectionRuleById } from "src/core/store/modules/formula-correction-rule/thunks";

import CorrectionRules from "./CorrectionRules";
import FormulaForm from "./FormulaForm";

const FormulaCorrectionRuleForm = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { id } = useParams<{ id: string }>();

	const item = useSelector(getItemFormulaCorrectionRule);
	const hasItem = useSelector(getHasItemFormulaCorrectionRule);
	const isFetchingItem = useSelector(getLoadingFormulaCorrectionRule);

	const isNew = id === 'novo';

	useEffect(() => {
		if (isNew && hasItem) history.replace(`/configuracoes/geral/formula-regra-correcao/${item.id}`);
	}, [isNew, hasItem, item, history])

	useEffect(() => {
		if (id && !isNew) dispatch(fetchFormulaCorrectionRuleById(Number(id)));
		return () => {
			dispatch(actions.correctionRule.clear());
			dispatch(actions.formulaCorrectionRule.clear());
		};
	}, [dispatch, id, isNew]);

	return (
		<ScreenTemplate>
			{isFetchingItem
				? <CircularProgress className='margin-top-16 align-center' />
				: (<>
					<FormulaForm id={id} isNew={isNew} formulaName={item?.formulaName ?? ''} />
					{!isNew && hasItem && <CorrectionRules formulaCorrectionRule={item} params={id} />}
				</>)}

		</ScreenTemplate>
	)
}

export default FormulaCorrectionRuleForm;