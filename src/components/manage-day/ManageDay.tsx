import { deleteDay, editDay, getAllDay } from "@/services/DayServices";
import { IDay } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import styles from "./ManageDay.module.css";
import FormDay from "../form-day/FormDay";
import classNames from "classnames";
import { useRouter } from "next/router";
import moment from "moment";
import useModalState from "@/zustand/modalState";

const ManageDay = () => {
	const router = useRouter();

	const [daysOpened, setDaysOpened] = useState<Array<IDay> | null>(null);
	const [daysClosed, setDaysClosed] = useState<Array<IDay> | null>(null);

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

	const onSaveDay = useCallback((day: IDay) => {
		setDaysOpened((state) => {
			return [day, ...(state ?? [])];
		});
		useModalState.getState().closeModal(`modal_new_day`);
	}, []);

	const onDeleteDay = useCallback(async (id: number) => {
		const deleted = await deleteDay(id);
		if (deleted) {
			setDaysOpened((state) => {
				return (state ?? []).filter((day) => day.id != id);
			});
		}
	}, []);

	const onEditedDay = useCallback((day: IDay) => {
		setDaysOpened((state) => {
			state = state ?? [];
			return [day, ...state.filter((u) => day.id !== u.id)];
		});
		useModalState.getState().closeModal(`modal_edit_day_${day.id}`);
	}, []);

	const onEditDay = useCallback(
		(day: IDay) => {
			const key = `modal_edit_day_${day.id}`;
			useModalState.getState().openModal(key, {
				title: `Modifica giornata ${day.name}`,
				body: <FormDay day={day} onEdit={onEditedDay} onCancell={() => useModalState.getState().closeModal(key)} />,
			});
		},
		[onEditedDay]
	);

	const onAddDay = useCallback(() => {
		const key = `modal_new_day`;
		useModalState.getState().openModal(key, {
			title: `Aggiungi giornata`,
			body: <FormDay onAdd={onSaveDay} onCancell={() => useModalState.getState().closeModal(key)} />,
		});
	}, [onSaveDay]);

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
							<td className="w-[250px]">Inizio</td>
							<td className="w-[250px]">Fine</td>
							<td className="w-[250px]"># giocatori</td>
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
									<td>{moment(day.startTime).format("DD-MM-YYYY HH:mm")}</td>
									<td>{day.endTime ? moment(day.endTime).format("DD-MM-YYYY HH:mm") : "NON TERMINATA"}</td>
									<td>{day.userDay?.length}</td>
									{/* <td>{day.surname}</td> */}
									<td className="flex flex-col gap-2 justify-end">
										<button className="btn btn-warning btn-sm" onClick={() => router.push(`/days/${day.id}`)}>
											Gestisci
										</button>
										{!isClosed && (
											<button className="btn btn-info btn-sm" onClick={() => onEditDay(day)}>
												Modifica
											</button>
										)}
										{!isClosed && (
											<button className="btn btn-error btn-sm" onClick={() => onDeleteDay(day.id)}>
												Cancella
											</button>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			);
		},
		[daysClosed, daysOpened, onDeleteDay, onEditDay, router]
	);

	return (
		<Layout title="GIORNATE">
			<div className={styles.manageDayHeader}>
				<button className="btn" onClick={onAddDay} disabled={Boolean(daysOpened?.length ?? 0 > 0)}>
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
