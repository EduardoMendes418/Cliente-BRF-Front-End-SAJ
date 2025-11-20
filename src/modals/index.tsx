import { Fragment } from "react";
import { useSelector } from 'react-redux';
import { RootState } from 'src/core/store';
import { ActiveModals } from '../components/modals';

const Modal = () => {
	const selectedModals = useSelector(
		(state: RootState) => state.modal.selectedModals
	);

	return (
		<>
			{selectedModals.map(modalId => {
				const modalInst = ActiveModals.find(m => m.id === modalId);
				if (!modalInst) return null;

				return (
					<Fragment key={modalId}>
						{modalInst.component}
					</Fragment>
				);
			})}
		</>
	);
};

export default Modal;
