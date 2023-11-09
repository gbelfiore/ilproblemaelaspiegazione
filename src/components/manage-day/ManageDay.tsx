import { deleteDay, editDay, getAllDay } from "@/services/DayServices";
import { IDay } from "@/types/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import Layout from "../layout/Layout";
import styles from "./ManageDay.module.css";
import FormDay from "../form-day/FormDay";
import classNames from "classnames";
import { useRouter } from "next/router";
import moment from "moment";
import useModalState from "@/zustand/modalState";
import { formatData } from "@/utils/DateUitls";
import { fantaMoneyToEuro } from "@/utils/MoneyUtils";
import DataElement from "../data-element/DataElement";

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

	const getTimeOfGame = useCallback((day: IDay) => {
		const start = moment(day.startTime);
		const end = moment(day.endTime);
		var duration = moment.duration(end.diff(start));
		var hours = duration.asHours();
		return hours;
	}, []);

	const renderTable = useCallback(
		(isClosed: boolean) => {
			const days = isClosed ? daysClosed : daysOpened;
			return (
				<>
					<h1 className="text-primary">{isClosed ? "Giornate chiuse" : "Giornate aperte"}</h1>
					<table className="table">
						<thead>
							<tr>
								<th className="w-[70px]">ID</th>
								<td className="w-[250px]">Nome</td>
								<td className="text-center w-[150px]">Inizio</td>
								<td className="text-center w-[150px]">Fine</td>
								<td className="text-center w-[150px]">Tempo di gioco</td>
								<td className="text-center w-[150px]"># giocatori</td>
								<td className="text-center w-[150px]">Rake totale</td>
								<th className="text-center w-[150px]"></th>
							</tr>
						</thead>
						<tbody>
							{days?.map((day) => {
								return (
									<tr key={`day_${day.id}`}>
										<th>{day.id}</th>
										<td>{day.name}</td>

										<td>
											<DataElement data={day.startTime} />
										</td>
										<td>{day.endTime && <DataElement data={day.endTime} />}</td>

										<td className="text-center w-[150px]">{day.endTime && `${getTimeOfGame(day)} ore`}</td>

										<td className="text-center w-[150px]">{day.userDay?.length}</td>

										<td>
											{day.rake && (
												<div className="flex flex-col gap-2 items-center">
													<span className="text-orange-500">{`${day.rake}¥`}</span>
													<span className="text-violet-500">{`${fantaMoneyToEuro(day.rake)}€`}</span>
												</div>
											)}
										</td>

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
				</>
			);
		},
		[daysClosed, daysOpened, getTimeOfGame, onDeleteDay, onEditDay, router]
	);

	return (
		<Layout title="GIORNATE">
			<div className={styles.manageDayHeader}>
				<button className="btn" onClick={onAddDay} disabled={Boolean(daysOpened?.length ?? 0 > 0)}>
					Aggiungi giornata
				</button>
			</div>

			{renderTable(false)}
			<br />
			<br />
			<br />
			{renderTable(true)}
		</Layout>
	);
};

export default ManageDay;
