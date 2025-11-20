import { Grid } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FieldColumn from "src/components/FieldColumn";
import Panel from "src/components/Panel";
import { TProvisionProcess } from "src/core/models/provision-order";
import { getPensionRequestFolderInfo } from "src/core/store/modules/pensions/request-pensions/selectors";
import { fetchProcessFolder } from "src/core/store/modules/process/thunks";
import { t } from "src/locale/i18n";
import api from "src/core/api/process"

type Props = {
    folderNumber?: string;
};

const Info = ({ folderNumber }: Props) => {
    
    const dispatch = useDispatch();
    const [process, setProcess] = useState<TProvisionProcess | null>(null);

    const doRequest = useCallback(async (folderNumber: string) => { 
		const processApi = await api.getFolderSheetComponentFolderNumber(folderNumber)
		setProcess(processApi.data)
	}, [])

    useEffect(() => {
        if (folderNumber) {
            dispatch(fetchProcessFolder({ folderNumber }));
            doRequest(folderNumber);
        }
    }, [folderNumber, dispatch]);

    const {
        costCenter,
        processNumber,
        legalDepartmentArea,
        localidade,
        parteContraria,
        chaveProcesso,
        individual,
    } = useSelector(getPensionRequestFolderInfo);

    return (
        <Panel title={"Dados da ficha do processo"} withPadding>
            <Grid container justifyContent="space-between" spacing={3}>
                <Grid item md={3} xs={12} sm={6}>
                    <FieldColumn
                        label={t("form.area")}
                        value={process?.legalDepartmentArea}
                    />
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                    <FieldColumn
                        label={t("pension:request.form.location")}
                        value={""/* localidade */}
                    />
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                    <FieldColumn
                        label={t("processInformation.processNumber")}
                        value={process?.processNumber}
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <FieldColumn
                        label={t("pension:request.form.processKey")}
                        value={process?.id}
                    />
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                    <FieldColumn
                        label={t("solicitacaoPagamento:dadosPagamento.centroCusto")}
                        value={""/* costCenter */}
                    />
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                    <FieldColumn
                        label={t("pension:request.form.opposingPartyName")}
                        value={process?.otherPartName}
                    />
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                    <FieldColumn
                        label={t("pension:request.form.gender")}
                        value={""/* individual?.gender */}
                    />
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                    <FieldColumn
                        label={t("personInformation.birthDate")}
                        type="date"
                        value={""/* individual?.birthDate */}
                    />
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                    <FieldColumn
                        label={t("provisions:fields.courtPanel")}
                        value={`${process?.courtPanelNumber}ª ${process?.courtPanelDescription}`}
                    />
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                    <FieldColumn
                        label={t("provisions:fields.jurisdiction")}
                        value={process?.jurisdictionDescription}
                    />
                </Grid>
            </Grid>
        </Panel>
    );
};

export default Info;
