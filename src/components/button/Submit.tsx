import { CSSProperties } from "react";
import { Button, CircularProgress, IconButton } from "@material-ui/core";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import { SearchOutlined } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";

import { t } from "src/locale/i18n";

type TProps = {
  type?: "search" | "button" | "add" | "save";
  text?: string;
  isNew?: boolean;
  submitting?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  click?: () => void;
};

const Submit = ({
  text,
  submitting,
  disabled,
  type = "button",
  isNew,
  click,
  ...props
}: TProps) => {
  if (submitting) return <CircularProgress />;

  if (type === "search")
    return (
      <IconButton
        color="primary"
        type="submit"
        disabled={disabled}
        aria-label="submit"
        {...props}
      >
        <SearchOutlined />
      </IconButton>
    );

  if (type === "add")
    return (
      <IconButton
        color="primary"
        type="submit"
        disabled={disabled}
        aria-label="submit"
        {...props}
      >
        <AddIcon />
      </IconButton>
    );

	if (type === "save")
    return (
      <IconButton
        color="primary"
        type="submit"
        disabled={disabled}
        aria-label="submit"
        {...props}
      >
        <SaveOutlinedIcon />
      </IconButton>
    );

  return (
    <Button
      color="primary"
      type="submit"
      variant={disabled ? undefined : "contained"}
      disabled={disabled}
      onClick={click}
      {...props}
    >
      {text ? text : isNew ? t("btnNew") : t("btnSalvarEdicao")}
    </Button>
  );
};

export default Submit;
