import { addUserOnDay } from "@/services/UserDayServices";
import { IDay, IUser, IUserDay } from "@/types/types";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

interface IManageDayUserItemOutProps {
	user: IUser;
	day: IDay;
	onAddUserInDay: () => void;
}

const ManageDayUserItemOut = ({ user, day, onAddUserInDay }: IManageDayUserItemOutProps) => {
	const defaultValues = { moneyIn: 0, timeIn: "" };
	const {
		setValue,
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<{ moneyIn: number; timeIn: string }>({
		defaultValues: defaultValues,
	});

	const moneyIn = watch("moneyIn");

	const addUserInGame = useCallback(
		async (data: { moneyIn: number; timeIn: string }) => {
			const result = await addUserOnDay(user.id, day.id, data.moneyIn, data.timeIn);
			if (!result.error) {
				onAddUserInDay();
			}
		},
		[day, onAddUserInDay, user]
	);

	const decMoneyIn = useCallback(() => {
		if (moneyIn > 0) {
			setValue("moneyIn", moneyIn - 5000);
		}
	}, [moneyIn, setValue]);

	const incMoneyIn = useCallback(() => {
		setValue("moneyIn", moneyIn + 5000);
	}, [moneyIn, setValue]);

	return (
		<tr>
			<td>{`${user?.surname} ${user?.name}`}</td>
			<td>
				<div className="form-control w-full">
					<input
						type="time"
						defaultValue={defaultValues.timeIn ?? ""}
						placeholder="inserisci l'orario di ingresso"
						className="input input-bordered w-full"
						{...register("timeIn", { required: "orario di ingresso obbligatorio" })}
					/>
					{errors.timeIn && (
						<label className="label">
							<span className="label-text-alt text-red-500">{errors.timeIn.message}</span>
						</label>
					)}
				</div>
			</td>
			<td>
				<button className="btn btn-circle btn-sm" onClick={decMoneyIn}>
					-
				</button>
				<span className="inline-block mx-4 w-[50px] text-center">{moneyIn}</span>
				<button className="btn btn-circle btn-sm" onClick={incMoneyIn}>
					+
				</button>
				<div className="form-control w-full">
					<input
						defaultValue={defaultValues.moneyIn}
						type="hidden"
						{...register("moneyIn", { required: "money in obbligatorio", min: { value: 5000, message: "almeno 5000" } })}
					/>
					{errors.moneyIn && (
						<label className="label">
							<span className="label-text-alt text-red-500">{errors.moneyIn.message}</span>
						</label>
					)}
				</div>
			</td>

			<td>
				<button className="btn btn-info btn-sm" onClick={handleSubmit(addUserInGame)}>
					Entra in partita
				</button>
			</td>
		</tr>
	);
};

export default ManageDayUserItemOut;
