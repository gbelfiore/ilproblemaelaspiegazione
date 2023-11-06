import { updateMoneyIn, updateMoneyOut } from "@/services/UserDayServices";
import { IUserDay } from "@/types/types";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

interface IManageDayUserItemProps {
	userDay: IUserDay;
}

const ManageDayUserItem = ({ userDay: userDayProps }: IManageDayUserItemProps) => {
	const [userDay, setUserDay] = useState<IUserDay>(userDayProps);
	const { user } = userDay;

	const defaultValues = { moneyOut: 0, timeOut: "" };
	const {
		setValue,
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<{ moneyOut: number; timeOut: string }>({
		defaultValues: defaultValues,
	});

	const decMoneyIn = useCallback(async () => {
		const newMoneyIn = userDay.moneyIn > 0 ? userDay.moneyIn - 5000 : 0;
		const result = await updateMoneyIn(userDay.id, newMoneyIn);
		if (!result.error) {
			setUserDay(result.data);
		}
	}, [userDay]);

	const incMoneyIn = useCallback(async () => {
		const newMoneyIn = userDay.moneyIn + 5000;
		const result = await updateMoneyIn(userDay.id, newMoneyIn);
		if (!result.error) {
			setUserDay(result.data);
		}
	}, [userDay]);

	const addUserOutGame = useCallback(
		async (data: { moneyOut: number; timeOut: string }) => {
			const result = await updateMoneyOut(userDay.id, data.moneyOut, data.timeOut);
			if (!result.error) {
				setUserDay(result.data);
			}
		},
		[userDay]
	);

	return (
		<tr>
			<td>{`${user?.surname} ${user?.name}`}</td>
			<td>{userDay.timeIn}</td>
			<td>
				{userDay.moneyOut == null && (
					<>
						<button className="btn btn-circle btn-sm" onClick={decMoneyIn}>
							-
						</button>
						<span className="inline-block mx-4 w-[50px] text-center">{userDay.moneyIn}</span>
						<button className="btn btn-circle btn-sm" onClick={incMoneyIn}>
							+
						</button>
					</>
				)}
				{userDay.moneyOut != null && userDay.moneyIn}
			</td>
			<td>
				{!userDay.timeOut && (
					<div className="form-control w-full">
						<input
							type="time"
							placeholder="Type here on close game"
							className="input input-bordered w-full max-w-xs"
							{...register("timeOut", { required: "orario di uscita obbligatorio" })}
						/>
						{errors.timeOut && (
							<label className="label">
								<span className="label-text-alt text-red-500">{errors.timeOut.message}</span>
							</label>
						)}
					</div>
				)}
				{userDay.timeOut && userDay.timeOut}
			</td>
			<td>
				{userDay.moneyOut == null && (
					<div className="form-control w-full">
						<input
							type="number"
							placeholder="Type here on close game"
							className="input input-bordered w-full max-w-xs"
							{...register("moneyOut", { required: "orario di uscita obbligatorio" })}
						/>
						{errors.moneyOut && (
							<label className="label">
								<span className="label-text-alt text-red-500">{errors.moneyOut.message}</span>
							</label>
						)}
					</div>
				)}
				{userDay.moneyOut != null && userDay.moneyOut}
			</td>
			<td>{userDay.moneyOut != null ? userDay.moneyOut - userDay.moneyIn : "-"}</td>
			<td>
				<button className="btn btn-sm btn-secondary" onClick={handleSubmit(addUserOutGame)} disabled={Boolean(userDay.timeOut)}>
					Esce dalla partita
				</button>
			</td>
		</tr>
	);
};

export default ManageDayUserItem;
