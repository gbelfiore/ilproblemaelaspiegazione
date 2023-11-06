import { deleteDay, editDay, getAllDay, getDayById } from "@/services/DayServices";
import { IDay, IUser } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import styles from "./manageDayDetails.module.css";
import FormDay from "../form-day/FormDay";
import classNames from "classnames";
import { useRouter } from "next/router";
import ManageDayUserItem from "./ManageDayUserItem";
import { getAllUser, getAllUserNotInGame } from "@/services/UserServices";
import ManageDayUserItemOut from "./ManageDayUserItemOut";

interface ImanageDayDetailsProps {
	dayId: string;
}

const ManageDayDetails = ({ dayId }: ImanageDayDetailsProps) => {
	const router = useRouter();

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

	const loadUsers = useCallback(async () => {
		if (day) {
			console.log(day.userDay);
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
			<table className="table">
				<thead>
					<tr>
						<td className="w-[250px]">Giocatore</td>
						<td className="w-[250px]">Ora inizio</td>
						<td className="w-[250px]">Money In</td>
						<td className="w-[250px]">Ora fine</td>
						<td className="w-[250px]">Money Out</td>
						<td className="w-[250px]">Esito</td>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{day?.userDay?.map((userDay) => {
						const user = userDay.user;
						return <ManageDayUserItem key={`userDay_${userDay.id}`} userDay={userDay}></ManageDayUserItem>;
					})}
				</tbody>
			</table>
		);
	}, [day]);

	const renderTableUserOutGame = useCallback(() => {
		if (!day) return <div>loading</div>;
		return (
			<table className="table">
				<thead>
					<tr>
						<td className="w-[250px]">Giocatore</td>
						<td className="w-[250px]">Ora inizio</td>
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
		);
	}, [day, loadDay, users]);

	return (
		<Layout title={`Giornata ${day?.name ?? "..."} del ${day?.date ?? "..."} iniziata alle ${day?.startTime ?? "..."}`}>
			<div className={styles.manageDayDetailsHeader}>
				<button className="btn" onClick={() => router.push("/days")}>
					Torna indietro
				</button>
			</div>

			<h1 className="text-primary">Giocatori in partita</h1>
			{renderTableUserInGame()}
			<br />
			<br />
			<br />
			<h1 className="text-primary">Giocatori disponibili</h1>
			{renderTableUserOutGame()}
		</Layout>
	);
};

export default ManageDayDetails;
