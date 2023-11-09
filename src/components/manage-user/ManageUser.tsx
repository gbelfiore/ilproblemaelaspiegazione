import { deleteUser, editUser, getAllUser } from "@/services/UserServices";
import { IUser } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import styles from "./ManageUser.module.css";
import FormUser from "../form-user/FormUser";
import classNames from "classnames";
import useModalState from "@/zustand/modalState";
import { fantaMoneyToEuro } from "@/utils/MoneyUtils";

const ManageUser = () => {
	const [users, setUsers] = useState<Array<IUser> | null>(null);

	const loadUsers = useCallback(async () => {
		const result = await getAllUser();
		if (!result.error) {
			setUsers(result.data);
		}
	}, []);

	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	const onSaveUser = useCallback((user: IUser) => {
		setUsers((state) => {
			return [user, ...(state ?? [])];
		});
		useModalState.getState().closeModal("modal_new_user");
	}, []);

	const onDeleteUser = useCallback(async (id: number) => {
		const deleted = await deleteUser(id);
		if (deleted) {
			setUsers((state) => {
				return (state ?? []).filter((user) => user.id != id);
			});
		}
	}, []);

	const onEditedUser = useCallback((user: IUser) => {
		setUsers((state) => {
			state = state ?? [];
			return [user, ...state.filter((u) => user.id != u.id)];
		});
		useModalState.getState().closeModal(`modal_edit_user_${user.id}`);
	}, []);

	const onEditUser = useCallback(
		(user: IUser) => {
			const key = `modal_edit_user_${user.id}`;
			useModalState.getState().openModal(key, {
				title: `Modifica utente ${user.surname} ${user.name}`,
				body: <FormUser user={user} onEdit={onEditedUser} onCancell={() => useModalState.getState().closeModal(key)} />,
			});
		},
		[onEditedUser]
	);

	const onAddUser = useCallback(() => {
		const key = `modal_new_user`;
		useModalState.getState().openModal(key, {
			title: `Aggiungi utente `,
			body: <FormUser onAdd={onSaveUser} onCancell={() => useModalState.getState().closeModal(key)} />,
		});
	}, [onSaveUser]);

	return (
		<Layout title="Utenti">
			<div className={styles.manageUserHeader}>
				<button className="btn" onClick={onAddUser}>
					Aggiungi utente
				</button>
			</div>

			<table className="table">
				<thead>
					<tr>
						<th className="w-[100px]">ID</th>
						<td className="w-[250px]">Nome</td>
						<td className="w-[150px]">Cognome</td>
						<td className="w-[100px] text-center"># Partite</td>
						<td className="w-[150px] text-center">Andamento Money In</td>
						<td className="w-[150px] text-center">Andamento Money Out</td>
						<td className="w-[150px] text-center">Andamento esito</td>
						<th className="w-[150px]"></th>
					</tr>
				</thead>
				<tbody>
					{users?.map((user) => {
						const moneyIn = user.userDay?.reduce((partialSum, elem) => partialSum + elem.moneyIn, 0) ?? 0;
						const moneyOut = user.userDay?.reduce((partialSum, elem) => partialSum + elem.moneyOut, 0) ?? 0;
						return (
							<tr key={`user_${user.id}`}>
								<th>{user.id}</th>
								<td>{user.name}</td>
								<td>{user.surname}</td>
								<td className="text-center">{user.userDay?.length}</td>
								<td>
									<div className="flex flex-col gap-2 items-center">
										<span className="text-orange-500">{`${moneyIn}¥`}</span>
										<span className="text-violet-500">{`${fantaMoneyToEuro(moneyIn)}€`}</span>
									</div>
								</td>
								<td>
									<div className="flex flex-col gap-2 items-center">
										<span className="text-orange-500">{`${moneyOut}¥`}</span>
										<span className="text-violet-500">{`${fantaMoneyToEuro(moneyOut)}€`}</span>
									</div>
								</td>
								<td className={classNames({ "bg-green-200": moneyOut - moneyIn > 0, "bg-red-200": moneyOut - moneyIn < 0 })}>
									<div className="flex flex-col gap-2 items-center">
										<span className="text-orange-500">{`${moneyOut - moneyIn}¥`}</span>
										<span className="text-violet-500">{`${fantaMoneyToEuro(moneyOut - moneyIn)}€`}</span>
									</div>
								</td>
								<td className="flex flex-col gap-2 justify-end">
									<button className="btn btn-info btn-sm" onClick={() => onEditUser(user)}>
										Modifica
									</button>
									<button className="btn btn-error btn-sm" onClick={() => onDeleteUser(user.id)} disabled={Boolean(user.userDay?.length ?? 0 > 0)}>
										Cancella
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</Layout>
	);
};

export default ManageUser;
