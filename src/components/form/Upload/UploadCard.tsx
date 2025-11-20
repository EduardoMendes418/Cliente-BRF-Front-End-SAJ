import { useState, useEffect } from "react";
import { Grid, SvgIconTypeMap, Typography } from "@material-ui/core";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import ImageIcon from "@material-ui/icons/Image";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";

import { t } from "src/locale/i18n";

const Icon = (props: { extension: string }) => {
    const { extension } = props;

    const getIcon = () => {
        let Component: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
        switch (extension) {
            case "pdf":
                Component = PictureAsPdfIcon;
                break;
            case "jpg":
            case "png":
            case "jpeg":
                Component = ImageIcon;
                break;
            default:
                Component = InsertDriveFileOutlinedIcon;
                break;
        }

        return <Component fontSize="large" style={{ color: "#5ECFFF" }} />;
    };

    return (
        <div className="upload-card-icon" data-testid="upload-card-icon">
            {getIcon()}
        </div>
    );
};

type Props = {
    file: File | any;
    onDelete?: (file: File | any) => void;
    disabled?: boolean;
};

type UploadCardType = {
    name: string;
    extension: string;
    size?: number;
};

const UploadCard = (props: Props) => {
    const { file, onDelete, disabled } = props;
    const [info, setInfo] = useState<UploadCardType>({} as UploadCardType);
    const [isPending, setIsPending] = useState<boolean>(false);

    useEffect(() => {
        if (!file) return;
        if (file instanceof File) {
            const { name, size } = file;
            const extension = name.split(".")[1];
            setInfo({ name, size, extension });
            setIsPending(true);
        } else {
            const { documentName = "" } = file;
            const extension = documentName && documentName.split(".")[1];
            setInfo({ name: documentName, extension });
        }
    }, [file]);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";

        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleVisualization = () => {
        if (file instanceof File) return;
        window.open(file.path, "download");
    };

    return (
        <div
            className={`upload-card ${
                isPending ? "upload-card__pending" : "upload-card__done"
            }`}
            title={info.name}
        >
            <div className="upload-card__actions">
                <Grid
                    container
                    alignItems="center"
                    justify="center"
                    style={{ height: "100%" }}
                >
                    {!isPending && (
                        <Grid item>
                            <IconButton
                                onClick={handleVisualization}
                                title={t("attachments.download")}
                            >
                                <GetAppIcon fontSize="large" />
                            </IconButton>
                        </Grid>
                    )}
                    <Grid item>
                        {onDelete && !disabled && (
                            <IconButton
                                onClick={() => onDelete(file)}
                                title={t("attachments.deleteFile")}
                            >
                                <DeleteIcon fontSize="large" />
                            </IconButton>
                        )}
                    </Grid>
                </Grid>
            </div>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Icon extension={info.extension} />
                </Grid>
                <Grid item>
                    <Grid container direction="column">
                        <Typography
                            variant="h4"
                            className="margin-bottom-8"
                            data-testid="upload-file-name"
                            style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {info.name}
                        </Typography>
                        <Typography
                            variant="h4"
                            style={{ color: "#A5A5A5" }}
                            data-testid="upload-file-size"
                        >
                            {info.size ? formatBytes(info.size) : "-"}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default UploadCard;
