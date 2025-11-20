import { Fragment } from "react"
import { useSelector } from "react-redux";
import {
	getSumOfValues
} from 'src/core/store/modules/log-provision/selectors'
import { Grid } from "@material-ui/core";
import { numberToCurrency } from 'src/core/utils/func';

const dictionary = {
	totalAccountingBalance: "Somatório saldo contábil (depósitos)",
	totalLegalBalance: "Somatório saldo jurídico (depósitos)",
	totalPrincipalAmountPayment: "Principal total pagamentos",
	totalFinePayment: "Multa total pagamentos",
	totalInterestPayment: "Juros total pagamentos",
	totalPaymentCharges: "Encargos total pagamentos",
	totalLossPayment: "Sucumbência total pagamentos",
	totalInsurancePremiumPayments: "Prêmios de Seguros total pagamentos",
	totalConvertedPayment: "Depósito despesado",
};

const SumOfValues = () => {
	const sumOfValues = useSelector(getSumOfValues)

	return (
		<div className="grayBox">
			<Grid container spacing={2}>
				{Object.entries(dictionary).map(([key, value], index) => <Fragment key={`key-${index}`}>
					<Grid item xs={12} md={8}>
						<p className="grayKey">{value}</p>
					</Grid>
					<Grid item xs={12} md={4}>
						<p className="grayValue">R$ {numberToCurrency(sumOfValues[key])}</p>
					</Grid>
				</Fragment>)}
			</Grid>
		</div>
	);
};

export default SumOfValues;
