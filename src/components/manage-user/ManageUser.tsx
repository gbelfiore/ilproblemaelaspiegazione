import { deleteUser, editUser, getAllUser } from "@/services/UserServices";
import { IUser } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import styles from "./ManageUser.module.css";
import FormUser from "../form-user/FormUser";
import classNames from "classnames";

const ManageUser = () => {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [users, setUsers] = useState<Array<IUser> | null>(null);
	const [userEdit, setUserEdit] = useState<IUser | null>(null);

	const loadUsers = useCallback(async () => {
		const result = await getAllUser();
		if (!result.error) {
			setUsers(result.data);
		}
	}, []);

	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	const onSaveUser = useCallback((users: Array<IUser>) => {
		setUsers((state) => {
			return [...(state ?? []), ...users];
		});
		setOpenModal(false);
	}, []);

	const onDeleteUser = useCallback(async (id: number) => {
		const deleted = await deleteUser(id);
		if (deleted) {
			setUsers((state) => {
				return (state ?? []).filter((user) => user.id != id);
			});
		}
	}, []);

	const onEditUser = useCallback((user: IUser) => {
		setUserEdit(user);
		setOpenModal(true);
	}, []);

	const onEditedUser = useCallback((users: Array<IUser>) => {
		setUsers((state) => {
			state = state ?? [];
			return [...users, ...state.filter((u) => !users.find((u1) => u1.id == u.id))];
		});
		setOpenModal(false);
		setUserEdit(null);
	}, []);

	const renderModal = useCallback(() => {
		return (
			<dialog id="dialog_user" className={classNames("modal", { "modal-open": openModal })} key={`modal_${userEdit ? userEdit.id : "new"}`}>
				<div className="modal-box">
					<h3 className="font-bold text-lg">{userEdit ? `Modifica utente ${userEdit.surname} ${userEdit.name}` : "Aggiungi utente"}</h3>
					<p className="py-4">
						<FormUser user={userEdit} onAdd={onSaveUser} onEdit={onEditedUser} onCancell={() => setOpenModal(false)} />
					</p>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		);
	}, [onEditedUser, onSaveUser, openModal, userEdit]);

	return (
		<Layout title="Utenti">
			{renderModal()}
			<div className={styles.manageUserHeader}>
				<button className="btn" onClick={() => setOpenModal(true)}>
					Aggiungi utente
				</button>
			</div>

			<table className="table">
				<thead>
					<tr>
						<th className="w-[100px]">ID</th>
						<td className="w-[250px]">Nome</td>
						<td className="w-[250px]">Cognome</td>
						<td className="w-[250px]"># Partite</td>
						<td className="w-[250px]">Money In</td>
						<td className="w-[250px]">Money Out</td>
						<td className="w-[250px]">Andamento giocatore</td>
						<th></th>
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
								<td>{user.userDay?.length}</td>
								<td>{moneyIn}</td>
								<td>{moneyOut}</td>
								<td className={classNames({ "text-green-600": moneyOut - moneyIn > 0, "text-red-600": moneyOut - moneyIn < 0 })}>
									{moneyOut - moneyIn}
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
