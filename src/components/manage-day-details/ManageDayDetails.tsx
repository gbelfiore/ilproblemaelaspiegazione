import { closeDay, getDayById } from "@/services/DayServices";
import { IDay, IUser } from "@/types/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import Layout from "../layout/Layout";
import styles from "./manageDayDetails.module.css";
import { useRouter } from "next/router";
import ManageDayUserItemIn from "./ManageDayUserItemIn";
import { getAllUserNotInGame } from "@/services/UserServices";
import ManageDayUserItemOut from "./ManageDayUserItemOut";
import { useForm } from "react-hook-form";
import moment from "moment";
import { updateShareRake } from "@/services/UserDayServices";
import { formatData } from "@/utils/DateUitls";
import { fantaMoneyToEuro } from "@/utils/MoneyUtils";

interface ImanageDayDetailsProps {
	dayId: string;
}

const ManageDayDetails = ({ dayId }: ImanageDayDetailsProps) => {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ endTime: string }>({
		defaultValues: { endTime: "" },
	});

	const [day, setDay] = useState<IDay | null>(null);
	const [users, setUsers] = useState<Array<IUser> | null>(null);

	const loadDay = useCallback(async () => {
		if (dayId) {
			const result = await getDayById(parseInt(dayId));
			if (!result.error) {
				setDay({ ...result.data });
			}
		}
	}, [dayId]);

	const existsUserInGame = useMemo(() => {
		return (day?.userDay?.length ?? 0) == 0 || day?.userDay?.some((ud) => ud.timeOut == null);
	}, [day]);

	const loadUsers = useCallback(async () => {
		if (day) {
			const userInGame = day.userDay?.map((userDay) => userDay.userId) ?? [];

			const result = await getAllUserNotInGame(userInGame);
			if (!result.error) {
				setUsers(result.data);
			}
		}
	}, [day]);

	useEffect(() => {
		loadDay();
	}, [loadDay]);

	useEffect(() => {
		loadUsers();
	}, [day, loadUsers]);

	const renderTableUserInGame = useCallback(() => {
		if (!day) return <div>loading</div>;
		return (
			<>
				<h1 className="text-primary">Giocatori in partita</h1>
				<table className="table">
					<thead>
						<tr>
							<td className="w-[250px]">Giocatore</td>
							<td className="text-center w-[150px]">Inizio</td>
							<td className="text-center w-[150px]">Money In</td>
							<td className="text-center w-[150px]">Fine</td>
							<td className="text-center w-[150px]">Money Out</td>
							<td className="text-center w-[150px]">Quota rake</td>
							<td className="text-center w-[150px]">Esito</td>
							<td className="text-center w-[150px]">Dare/Avere</td>
							{/* <td className="w-[250px]">Esito (€)</td> */}
							<th></th>
						</tr>
					</thead>
					<tbody>
						{day?.userDay?.map((userDay) => {
							const user = userDay.user;
							return (
								<ManageDayUserItemIn
									key={`userDay_${userDay.id}_${userDay.rakeShare}`}
									userDay={userDay}
									onExitUserToDay={loadDay}
								></ManageDayUserItemIn>
							);
						})}
					</tbody>
				</table>
			</>
		);
	}, [day, loadDay]);

	const renderTableUserOutGame = useCallback(() => {
		if (!day) return <div>loading</div>;
		if (!day.endTime)
			return (
				<>
					<h1 className="text-primary">Giocatori disponibili</h1>
					<table className="table">
						<thead>
							<tr>
								<td className="w-[250px]">Giocatore</td>
								<td className="w-[250px]">Inizio</td>
								<td className="w-[250px]">Money In</td>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{users?.map((user) => {
								return <ManageDayUserItemOut key={`user_${user.id}`} user={user} day={day} onAddUserInDay={loadDay} />;
							})}
						</tbody>
					</table>
				</>
			);
		return <></>;
	}, [day, loadDay, users]);

	const onCloseDay = useCallback(
		async (data: { endTime: string }) => {
			if (!day || !day.userDay) return null;

			const moneyInTotal = day.userDay.reduce((acc, ud) => acc + ud.moneyIn, 0);
			const moneyOutTotal = day.userDay.reduce((acc, ud) => acc + ud.moneyOut, 0);
			const totalHoursGameByUser =
				day.userDay.reduce((acc, ud) => {
					const start = moment(ud.timeIn);
					const end = moment(ud.timeOut);
					var duration = moment.duration(end.diff(start));
					var hours = duration.asHours();
					return acc + hours;
				}, 0) ?? 0;

			const rake = moneyInTotal - moneyOutTotal;

			for (let i = 0; i < (day.userDay?.length ?? 0); i++) {
				const userDay = day.userDay[i];
				const start = moment(userDay.timeIn);
				const end = moment(userDay.timeOut);
				var duration = moment.duration(end.diff(start));
				var hoursGameOfUser = duration.asHours();
				const rakeShare = (rake / totalHoursGameByUser) * hoursGameOfUser;

				const result = await updateShareRake(userDay.id, rakeShare);
			}

			const result = await closeDay(day, data.endTime, rake);
			if (!result.error) {
				setDay(result.data);
			}
		},
		[day]
	);

	const getTimeOfGame = useCallback(() => {
		if (!day) return 0;
		const start = moment(day.startTime);
		const end = moment(day.endTime);
		var duration = moment.duration(end.diff(start));
		var hours = duration.asHours();
		return hours;
	}, [day]);

	const renderSummury = useCallback(() => {
		if (day?.endTime)
			return (
				<div className="card card-sm card-side bg-base-100 shadow-xl mb-10">
					<figure>
						<img
							className="h-[250px]"
							src="https://www.igol.it/wp-content/uploads/Texas-Hold-Em-Poker-Why-ItS-Called-The-Cadillac-Of-Poker.jpeg"
							alt="bg-poker"
						/>
					</figure>
					<div className="card-body">
						<h2 className="card-title">Partita terminata</h2>
						<ul>
							<li>Inizio gioco: {formatData(day.startTime)}</li>
							<li>Fine gioco: {formatData(day.endTime)}</li>
							<li>Numero giocatori: {day.userDay?.length}</li>
							<li>Tempo di gioco: {getTimeOfGame()} ore</li>
							<li>
								Rake totale: <span className="text-orange-500">{`${day.rake}¥`}</span>
								<span> / </span>
								<span className="text-violet-500">{`${fantaMoneyToEuro(day.rake)}€`}</span>
							</li>
						</ul>
					</div>
				</div>
			);
		return <></>;
	}, [day]);

	return (
		<Layout title={`Giornata ${day?.name ?? "..."} del ${day?.startTime ?? "..."}`}>
			<div className={styles.manageDayDetailsHeader}>
				<button className="btn" onClick={() => router.push("/days")}>
					Torna indietro
				</button>

				{!existsUserInGame && (
					<div className="flex flex-row gap-2 items-center">
						{!day?.endTime && (
							<div className="form-control">
								<input
									type="datetime-local"
									placeholder="Type here"
									className="input input-bordered w-full"
									{...register("endTime", { required: "fine gioco obbligatoria" })}
								/>
								{errors.endTime && (
									<label className="label">
										<span className="label-text-alt text-red-500">{errors.endTime.message}</span>
									</label>
								)}
							</div>
						)}
						{!day?.endTime && (
							<button className="btn btn-primary" onClick={handleSubmit(onCloseDay)} disabled={existsUserInGame}>
								Fine partita
							</button>
						)}
					</div>
				)}
			</div>

			{renderSummury()}

			{renderTableUserInGame()}
			<br />
			<br />
			<br />

			{renderTableUserOutGame()}
		</Layout>
	);
};

export default ManageDayDetails;
