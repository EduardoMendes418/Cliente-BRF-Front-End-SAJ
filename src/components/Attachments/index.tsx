import { useTranslation } from "src/locale/i18n";
import { FormikContext, Upload } from "src/components/form/index";
import { useFormikContext } from "formik";
import { ReactNode } from "react";
import { TPermissionType } from "src/core/models/profiles";
import AccordionPanel from "../AccordionPanel";

type Props = {
	name: string;
	label?: string;
	multiple?: boolean;
	accept?: string;
	disabled?: boolean;
	onDelete?: (file: any) => void;
	id?: string;
	text?: string;
	confirmDeletionGoodsAndGuarantees?: boolean;
	sideButton?: ReactNode;
	onClickCancel?: () => void;
	panelConfig?: {
		slotTopRight?: ReactNode;
		slotTopRightPermission?: TPermissionType;
		slotBottomRight?: ReactNode;
		slotBottonRightPermission?: TPermissionType | boolean;
		slotBottomLeft?: ReactNode;
		slotBottonLeftPermission?: TPermissionType | boolean;
		noSlotCancel?: boolean;
	};
};

const Attachments = ({
	onDelete,
	multiple = true,
	disabled,
	accept,
	name,
	label,
	panelConfig,
	id,
	text,
	confirmDeletionGoodsAndGuarantees,
	sideButton,
	onClickCancel,
	...props
}: Props) => {
	const { t } = useTranslation();

	const { values, status } = useFormikContext<FormikContext>();
	const hasItem = Array.isArray(values[name]) && !!values[name].length;

	if ((disabled || status === "readOnly") && !hasItem) return null;

	return (
		<AccordionPanel title={label || t("form.attachments")} {...panelConfig} startExpanded onClickCancel={onClickCancel}>
			<Upload
				confirmDeletionGoodsAndGuarantees={confirmDeletionGoodsAndGuarantees}
				multiple={multiple}
				accept={accept}
				name={name}
				onDelete={onDelete}
				disabled={disabled}
				id={id}
				text={text}
				sideButton={sideButton}
				{...props}
			/>
		</AccordionPanel>
	);
};

export default Attachments;
