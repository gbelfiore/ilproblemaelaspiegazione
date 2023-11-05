import { deleteUser, editUser, getAllUser } from "@/sarvices/UserServices";
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
	}, []);

	const renderModal = useCallback(() => {
		return (
			<dialog id="dialog_user" className={classNames("modal", { "modal-open": openModal })} key={`modal_${userEdit ? userEdit.id : "new"}`}>
				<div className="modal-box">
					<h3 className="font-bold text-lg">Aggiungi utente</h3>
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
						<th></th>
					</tr>
				</thead>
				<tbody>
					{users?.map((user) => {
						return (
							<tr key={`user_${user.id}`}>
								<th>{user.id}</th>
								<td>{user.name}</td>
								<td>{user.surname}</td>
								<td className="flex flex-row gap-2 justify-end">
									<button className="btn btn-info" onClick={() => onEditUser(user)}>
										Modifica
									</button>
									<button className="btn btn-error" onClick={() => onDeleteUser(user.id)}>
										Cancella
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
				<tfoot>
					<tr>
						<th>ID</th>
						<td>Nome</td>
						<td>Cognome</td>
						<th></th>
					</tr>
				</tfoot>
			</table>
		</Layout>
	);
};

export default ManageUser;
