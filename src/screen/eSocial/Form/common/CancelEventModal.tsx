import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Grid } from "@material-ui/core";
import { SelectField } from "src/components/form";
import { Submit } from "src/components/button";
import { Formik } from "formik";
import { cancelEventLaunch } from "src/core/store/modules/e-social-event-launch/thunks";
import { useHistory } from "react-router-dom";
import { useEvaluationReasons } from "src/hooks/fetchLists";
import { getLastModalOpen } from "src/core/store/modules/modals/selectors";
import { actions } from 'src/core/store';

const CancelEventModal = ({ id }: { id: number }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const { canceledReasonsAsOptions } = useEvaluationReasons(12, 4);
  const modalId = useSelector(getLastModalOpen);
  
  const initialValues = {
    rejectionAndReturnReasonsId: null,
  };

  const onSubmit = async (values: any) => {
    const { type } = await dispatch(cancelEventLaunch({id: id, rejectionAndReturnReasonsId: values.rejectionAndReturnReasonsId})) as any;
    if (type === "eSocialEventLauch/cancelEventLaunch/fulfilled") {
      enqueueSnackbar("Evento cancelado com sucesso!", { variant: "success" });
      dispatch(actions.modal.close({ modalId }))
      history.goBack();
      return;
    } else {
      dispatch(actions.modal.close({ modalId }))
      enqueueSnackbar("Erro ao cancelar evento", { variant: "error" });
      return;
    }
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, dirty, isSubmitting }) => {
          return (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <SelectField
                    name="rejectionAndReturnReasonsId"
                    label="Motivo do cancelamento"
                    required
                    options={canceledReasonsAsOptions}
                  />
                </Grid>
                <Grid item xs={2} md={1}>
                  <Submit type="button" text="Salvar" submitting={isSubmitting} disabled={!dirty} />
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </>
  );
};

export default CancelEventModal;