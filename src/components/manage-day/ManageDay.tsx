import { deleteDay, editDay, getAllDay } from "@/services/DayServices";
import { IDay } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import styles from "./ManageDay.module.css";
import FormDay from "../form-day/FormDay";
import classNames from "classnames";

const ManageDay = () => {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [daysOpened, setDaysOpened] = useState<Array<IDay> | null>(null);
	const [daysClosed, setDaysClosed] = useState<Array<IDay> | null>(null);
	const [dayEdit, setDayEdit] = useState<IDay | null>(null);

	const loadDays = useCallback(async (isClosed: boolean) => {
		const result = await getAllDay(isClosed);
		if (!result.error) {
			isClosed ? setDaysClosed(result.data) : setDaysOpened(result.data);
		}
	}, []);

	useEffect(() => {
		loadDays(true);
		loadDays(false);
	}, [loadDays]);

	const onSaveDay = useCallback((days: Array<IDay>) => {
		setDaysOpened((state) => {
			return [...(state ?? []), ...days];
		});
		setOpenModal(false);
	}, []);

	const onDeleteDay = useCallback(async (id: number) => {
		const deleted = await deleteDay(id);
		if (deleted) {
			setDaysOpened((state) => {
				return (state ?? []).filter((day) => day.id != id);
			});
		}
	}, []);

	const onEditDay = useCallback((day: IDay) => {
		setDayEdit(day);
		setOpenModal(true);
	}, []);

	const onEditedDay = useCallback((days: Array<IDay>) => {
		setDaysOpened((state) => {
			state = state ?? [];
			return [...days, ...state.filter((u) => !days.find((u1) => u1.id == u.id))];
		});
		setOpenModal(false);
		setDayEdit(null);
	}, []);

	const renderModal = useCallback(() => {
		return (
			<dialog id="dialog_day" className={classNames("modal", { "modal-open": openModal })} key={`modal_${dayEdit ? dayEdit.id : "new"}`}>
				<div className="modal-box">
					<h3 className="font-bold text-lg">Aggiungi giornata</h3>
					<p className="py-4">
						<FormDay day={dayEdit} onAdd={onSaveDay} onEdit={onEditedDay} onCancell={() => setOpenModal(false)} />
					</p>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		);
	}, [onEditedDay, onSaveDay, openModal, dayEdit]);

	const renderTable = useCallback(
		(isClosed: boolean) => {
			const days = isClosed ? daysClosed : daysOpened;
			return (
				<table className="table">
					<thead>
						<tr>
							<th className="w-[100px]">ID</th>
							<td className="w-[250px]">Nome</td>
							<td className="w-[250px]">Fanta rake ($)</td>
							<td className="w-[250px]">Real rake (€)</td>
							<td className="w-[250px]">Data</td>
							<td className="w-[250px]">Inizio ore</td>
							<td className="w-[250px]">Fine ore</td>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{days?.map((day) => {
							return (
								<tr key={`day_${day.id}`}>
									<th>{day.id}</th>
									<td>{day.name}</td>
									<td>{day.rake ? `$ ${day.rake}` : "NON CALCOLATO"}</td>
									<td>{day.rake ? `€ ${Math.round((day.rake / 1000 + Number.EPSILON) * 100) / 100}` : "NON CALCOLATO"}</td>
									<td>{day.date}</td>
									<td>{day.startTime}</td>
									<td>{day.endTime ? day.endTime : "NON TERMINATA"}</td>
									{/* <td>{day.surname}</td> */}
									<td className="flex flex-row gap-2 justify-end">
										<button className="btn btn-warning" onClick={() => onEditDay(day)}>
											Gestisci
										</button>
										{!isClosed && (
											<button className="btn btn-info" onClick={() => onEditDay(day)}>
												Modifica
											</button>
										)}
										{!isClosed && (
											<button className="btn btn-error" onClick={() => onDeleteDay(day.id)}>
												Cancella
											</button>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
					<tfoot>
						<tr>
							<th className="w-[100px]">ID</th>
							<td className="w-[250px]">Nome</td>
							<td className="w-[250px]">Fanta rake ($)</td>
							<td className="w-[250px]">Real rake (€)</td>
							<td className="w-[250px]">Data</td>
							<td className="w-[250px]">Inizio ore</td>
							<td className="w-[250px]">Fine ore</td>
							<th></th>
						</tr>
					</tfoot>
				</table>
			);
		},
		[daysClosed, daysOpened, onDeleteDay, onEditDay]
	);

	return (
		<Layout title="GIORNATE">
			{renderModal()}

			<div className={styles.manageDayHeader}>
				<button className="btn" onClick={() => setOpenModal(true)} disabled={Boolean(daysOpened?.length ?? 0 > 0)}>
					Aggiungi giornata
				</button>
			</div>

			<h1>Giornate aperte</h1>
			{renderTable(false)}
			<br />
			<br />
			<br />
			<h1>Giornate chiuse</h1>
			{renderTable(true)}
		</Layout>
	);
};

export default ManageDay;
