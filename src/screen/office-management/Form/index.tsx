import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ScreenTemplate from "src/components/Screen";

import { getOfficeManagementPayment } from "src/core/store/modules/office-management-payment/thunks";

import {
  getItemOfficeManagementPayment,
  getStatusOfficeManagementPayment as getStatus,
  getErrorMessageOfficeManagementPayment as getErrorMessage,
} from "src/core/store/modules/office-management-payment/selectors";

import { useRegisterDefault } from "src/hooks";
import { actions } from "src/core/store";
import RequestPaymentStep from "./steps/request-payment-step";
import {
  getOfficeManagementType,
  OfficeManagementTypeEnum,
} from "../utils/getOfficeManagementType";
import LawyerReviewStep from "./steps/lawyer-review-step";
import InvoicePostingStep from "./steps/invoice-posting-step";
import EvaluationJuridicalStep from "./steps/evaluation-juridical-step";
import EvaluationControlStep from "./steps/evaluation-control-step";

const OfficeManagementForm = (props: any) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const locate = useLocation();
  const [stage] = useState(getOfficeManagementType(locate.pathname));

  const item = useSelector(getItemOfficeManagementPayment);

  useEffect(() => {
    const idNumber = parseInt(id);
    if (!item && !isNaN(idNumber)) {
      dispatch(getOfficeManagementPayment(idNumber));
    }
  }, [dispatch, id, item]);

  useEffect(
    () => () => dispatch(actions.officeManagementPayment.setItem(undefined)),
    [dispatch]
  );

  useRegisterDefault({
    action: "officeManagementPayment",
    getStatus,
    getErrorMessage,
		route: stage === OfficeManagementTypeEnum.evaluationControl ? 'noRedirect' : undefined
  });

  const renderOfficeManagementPaymentStep = () => {
    switch (stage) {
      case OfficeManagementTypeEnum.evaluationControl:
        return <EvaluationControlStep />;
      case OfficeManagementTypeEnum.evaluationJuridical:
        return <EvaluationJuridicalStep />;
      case OfficeManagementTypeEnum.invoicePosting:
        return <InvoicePostingStep />;
      case OfficeManagementTypeEnum.lawyerReview:
        return <LawyerReviewStep />;
      case OfficeManagementTypeEnum.requestPayment:
      default:
        return <RequestPaymentStep />;
    }
  };

  return <ScreenTemplate>{renderOfficeManagementPaymentStep()}</ScreenTemplate>;
};

export default OfficeManagementForm;
