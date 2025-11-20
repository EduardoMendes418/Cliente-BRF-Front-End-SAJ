import { Button } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useFormikContext } from "formik";

import { useDispatch } from "react-redux";
import { actions } from "src/core/store";
import { FormikContext } from "../form";

type Props = {
    action?: string;
    onClick?: () => void;
    noResetForm?: boolean;
    disabled?: boolean;
    page?: string;
    text?: string;
    variant?: "text" | "outlined" | "contained";
    style?: React.CSSProperties;
    color?: "primary" | "secondary" | "default";
};

const CleanButton = ({
    action,
    onClick,
    noResetForm,
    disabled,
    page,
    text,
    variant = "outlined",
    style = {},
    color,
}: Props) => {
    const dispatch = useDispatch();

    const { resetForm } = useFormikContext<FormikContext>();

    return (
        <Button
            variant={variant}
            startIcon={<CloseIcon />}
            color={color}
            style={{ marginTop: "15px", marginBottom: "15px", ...style }}
            onClick={() => {
                const module = action
                    ?.split(".")
                    .reduce((acc, current) => acc && acc[current], actions);

                module && dispatch(module.clearFilters(page));
                dispatch(actions.pagination.clear());
                onClick && onClick();
                !noResetForm && resetForm();
            }}
            disabled={disabled}
        >
            {text ? text : "Limpar pesquisa"}
        </Button>
    );
};

export default CleanButton;
