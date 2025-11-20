import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Tabs from 'src/components/Tabs';
import Payment from './Payment';
import GoodsAndGuarantees from './GoodsAndGuarantees'
import ProvisionLog from './ProvisionLog'
import ConfronterLog from '../../components/ConfronterLog'
import { getProvisionsProcess } from "src/core/store/modules/provision-order/selectors";
import LogInterest from "./LogInterest";
import LogBlocksAndTransfers from "./LogBlocksAndTransfers";
import LogCreditReceipt from "./LogCreditReceipt";

const Lists = () => {
	const [value, setValue] = useState(0);
	const { location: { pathname } } = useHistory();

	const process = useSelector(getProvisionsProcess); 
	const folderNumber = process.folderNumber
	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	};

	const renderList = () => {
		switch (value) {
			case 0: return <ProvisionLog />
			case 1: return <LogInterest folderNumber={folderNumber} />
			case 2: return <ConfronterLog folderNumber={folderNumber} />
			case 3: return <Payment pathname={pathname} />
			case 4: return <GoodsAndGuarantees />
			case 5: return <LogBlocksAndTransfers folderNumber={folderNumber} />
			case 6: return <LogCreditReceipt folderNumber={folderNumber} />

			default: return <ProvisionLog />
		}
	}

	return (<>
		<Tabs
			value={value}
			onChange={handleChange}
			tabs={["Log de provisão", "Log de juros", "Log do confrontador", "Pagamentos", "Garantias", "Bloqueios e transferências", "Recebimento de crédito"]}
		/>
		{renderList()}
	</>);
};

export default Lists;
