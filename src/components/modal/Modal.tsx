import useModalState from "@/zustand/modalState";
import classNames from "classnames";

interface IActionModal {
	label: string;
	callback: () => void;
}

interface IModalProps {
	title: string | JSX.Element | JSX.Element[];
	body: string | JSX.Element | JSX.Element[];
	actions?: Array<IActionModal>;
}

const Modal = ({ title, body, actions }: IModalProps) => {
	return (
		<dialog className={classNames("modal", "modal-open")}>
			<div className="modal-box">
				<h3 className="font-bold text-lg">{title}</h3>
				<p className="py-4">{body}</p>
				{actions && (
					<div className="modal-action">
						<form method="dialog" className="flex flex-row gap-2">
							{actions?.map((action) => (
								<button className="btn btn-primary" key={action.label} onClick={action.callback}>
									{action.label}
								</button>
							))}
						</form>
					</div>
				)}
			</div>
		</dialog>
	);
};
export type { IModalProps };
export default Modal;
