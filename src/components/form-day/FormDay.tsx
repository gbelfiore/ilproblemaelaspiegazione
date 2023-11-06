import { editDay, insertDay } from "@/services/DayServices";
import { IDay } from "@/types/types";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

interface IFormDay {
	day?: IDay | null;
	onAdd: (day: Array<IDay>) => void;
	onEdit: (day: Array<IDay>) => void;
	onCancell: () => void;
}

const FormDay = ({ day, onAdd, onEdit, onCancell }: IFormDay) => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<IDay>({
		defaultValues: day ?? undefined,
	});

	const onSubmit = useCallback(
		async (data: IDay) => {
			if (!day) {
				const result = await insertDay(data);
				if (!result.error) {
					onAdd(result.data);
				} else {
					alert(JSON.stringify(result.error));
				}
			} else {
				const result = await editDay(data);
				if (!result.error) {
					onEdit(result.data);
				} else {
					alert(JSON.stringify(result.error));
				}
			}
		},
		[onAdd, onEdit, day]
	);

	const now = new Date();

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{day?.id && (
				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">Id</span>
					</label>
					<input defaultValue={day?.id} type="text" placeholder="Type here" className="input input-bordered w-full" {...register("id")} />
				</div>
			)}

			<div className="form-control w-full">
				<label className="label">
					<span className="label-text">Nome</span>
				</label>
				<input
					defaultValue={day?.name}
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

			<div className="form-control w-full">
				<label className="label">
					<span className="label-text">Data</span>
				</label>
				<input
					defaultValue={day?.date}
					type="date"
					placeholder="Type here"
					className="input input-bordered w-full"
					{...register("date", { required: "data obbligatoria" })}
				/>
				{errors.name && (
					<label className="label">
						<span className="label-text-alt text-red-500">{errors.date?.message}</span>
					</label>
				)}
			</div>

			<div className="form-control w-full">
				<label className="label">
					<span className="label-text">Ora di inizio</span>
				</label>
				<input
					defaultValue={day?.startTime}
					type="time"
					placeholder="Type here"
					className="input input-bordered w-full"
					{...register("startTime", { required: "ora di inizio obbligatorio" })}
				/>
				{errors.name && (
					<label className="label">
						<span className="label-text-alt text-red-500">{errors.startTime?.message}</span>
					</label>
				)}
			</div>

			{/* <div className="form-control w-full ">
				<label className="label">
					<span className="label-text">Cognome</span>
				</label>
				<input
					defaultValue={day?.surname}
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
			</div> */}

			<div className="mt-4 text-right flex flex-row gap-2 justify-end">
				<input className="btn" type="submit" value={"salva"} />
				<input className="btn" type="button" value={"cancella"} onClick={onCancell} />
			</div>
		</form>
	);
};

export default FormDay;
