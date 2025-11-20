import React from "react";
import { Typography } from "@material-ui/core";

import UploadCard from "src/components/form/Upload/UploadCard";
import Panel from "src/components/Panel";
import { t } from "src/locale/i18n";

import { TBudget } from "src/core/models/goods-guarantee-estimates";

import { customTaskTitleStyle } from "../constants";

type TAttachments = {
	budgetList: TBudget[];
	onDeleteAttachment: (id: number, file: File) => void;
	disabled: boolean;
	insurence?: string;
}

const getTitleStyle = (isFirst: boolean) => ({ ...customTaskTitleStyle, marginTop: isFirst ? '0' : '20px' });

const Attachments = ({ budgetList, onDeleteAttachment, disabled, insurence }: TAttachments) => {
	const budgetListWithAttachments = budgetList.filter(item => item.files.length > 0);
	if (budgetListWithAttachments.length === 0) return null;

	return (
		<Panel title={t('goodsAndGuarantees:tasks.attachmentsTask')} withPadding>
			{budgetListWithAttachments.map((item, index) => (
				<React.Fragment key={item.id}>
					<Typography variant='h4' style={getTitleStyle(index === 0)}>
						{insurence ?? item.insuranceCompanyName}
					</Typography>
					<div className='row'>
						{item.files.map(({ file }, index: number) => (
							<UploadCard
								file={file}
								key={`uploadcard_${index}`}
								disabled={disabled}
								onDelete={(file) => onDeleteAttachment(Number(item.id), file)}
							/>
						))}
					</div>
				</React.Fragment>
			))}
		</Panel>
	)
}

export default Attachments;