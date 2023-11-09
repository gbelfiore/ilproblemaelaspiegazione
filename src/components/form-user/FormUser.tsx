import { editUser, insertUser } from "@/services/UserServices";
import { IUser } from "@/types/types";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

interface IFormUser {
	user?: IUser | null;
	onAdd?: (user: IUser) => void;
	onEdit?: (user: IUser) => void;
	onCancell: () => void;
}

const FormUser = ({ user, onAdd, onEdit, onCancell }: IFormUser) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IUser>({
		defaultValues: user ?? undefined,
	});

	const onSubmit = useCallback(
		async (data: IUser) => {
			if (!user) {
				const result = await insertUser(data);
				if (!result.error && onAdd) {
					onAdd(result.data);
				} else {
					alert(JSON.stringify(result.error));
				}
			} else {
				const result = await editUser(data);
				if (!result.error && onEdit) {
					onEdit(result.data);
				} else {
					alert(JSON.stringify(result.error));
				}
			}
		},
		[onAdd, onEdit, user]
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{user?.id && (
				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">Id</span>
					</label>
					<input defaultValue={user?.id} type="text" placeholder="Type here" className="input input-bordered w-full" {...register("id")} />
				</div>
			)}

			<div className="form-control w-full">
				<label className="label">
					<span className="label-text">Nome</span>
				</label>
				<input
					defaultValue={user?.name}
					type="text"
					placeholder="Type here"
					className="input input-bordered w-full"
					{...register("name", { required: "nome obbligatorio" })}
				/>
				{errors.name && (
					<label className="label">
						<span className="label-text-alt text-red-500">{errors.name.message}</span>
					</label>
				)}
			</div>

			<div className="form-control w-full ">
				<label className="label">
					<span className="label-text">Cognome</span>
				</label>
				<input
					defaultValue={user?.surname}
					type="text"
					placeholder="Type here"
					className="input input-bordered w-full"
					{...register("surname", { required: "cognome obbligatorio" })}
				/>
				{errors.surname && (
					<label className="label">
						<span className="label-text-alt text-red-500">{errors.surname.message}</span>
					</label>
				)}
			</div>

			<div className="mt-4 text-right flex flex-row gap-2 justify-end">
				<input className="btn" type="submit" value={"salva"} />
				<input className="btn" type="button" value={"cancella"} onClick={onCancell} />
			</div>
		</form>
	);
};

export default FormUser;
