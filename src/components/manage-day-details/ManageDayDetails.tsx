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
				setDay(result.data);
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
							<td className="w-[250px]">Inizio</td>
							<td className="w-[250px]">Money In</td>
							<td className="w-[250px]">Fine</td>
							<td className="w-[250px]">Money Out</td>
							<td className="w-[250px]">Esito</td>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{day?.userDay?.map((userDay) => {
							const user = userDay.user;
							return <ManageDayUserItemIn key={`userDay_${userDay.id}`} userDay={userDay} onExitUserToDay={loadDay}></ManageDayUserItemIn>;
						})}
					</tbody>
				</table>
			</>
		);
	}, [day, loadDay]);

	const renderTableUserOutGame = useCallback(() => {
		if (!day) return <div>loading</div>;
		if (day.endTime)
			return (
				<div className="alert alert-info">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<span>{`Partita terminata il ${moment(day.endTime).format("DD-MM-YYYY HH:mm")}`}</span>
				</div>
			);
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
	}, [day, loadDay, users]);

	const onCloseDay = useCallback(
		async (data: { endTime: string }) => {
			if (!day) return null;

			const moneyInTotal = day.userDay?.reduce((acc, ud) => acc + ud.moneyIn, 0) ?? 0;
			const moneyOutTotal = day.userDay?.reduce((acc, ud) => acc + ud.moneyOut, 0) ?? 0;

			const rake = moneyInTotal - moneyOutTotal;
			const result = await closeDay(day, data.endTime, rake);
			if (!result.error) {
				setDay(result.data);
			}
		},
		[day]
	);

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

			{renderTableUserInGame()}
			<br />
			<br />
			<br />

			{renderTableUserOutGame()}
		</Layout>
	);
};

export default ManageDayDetails;
