import { updateMoneyIn, updateMoneyOut } from "@/services/UserDayServices";
import { IUserDay } from "@/types/types";
import { formatData } from "@/utils/DateUitls";
import { fantaMoneyToEuro, toFixed } from "@/utils/MoneyUtils";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import DataElement from "../data-element/DataElement";

interface IManageDayUserItemInProps {
	userDay: IUserDay;
	onExitUserToDay: () => void;
}

const ManageDayUserItemIn = ({ userDay: userDayProps, onExitUserToDay }: IManageDayUserItemInProps) => {
	const [userDay, setUserDay] = useState<IUserDay>(userDayProps);
	const { user } = userDay;

	const defaultValues = { moneyOut: 0, timeOut: "" };
	const {
		register,
		handleSubmit,
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
				onExitUserToDay();
			}
		},
		[onExitUserToDay, userDay]
	);

	const outcome = useMemo(() => {
		return userDay.moneyOut - (userDay.moneyIn - userDay.rakeShare);
	}, [userDay]);

	return (
		<tr>
			<td>{`${user?.surname} ${user?.name}`}</td>
			<td>
				<DataElement data={userDay.timeIn} />
			</td>
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
				{userDay.moneyOut != null && (
					<div className="flex flex-col gap-2 items-center">
						<span className="text-orange-500">{`${userDay.moneyIn}¥`}</span>
						<span className="text-violet-500">{`${fantaMoneyToEuro(userDay.moneyIn)}€`}</span>
					</div>
				)}
			</td>
			<td>
				{!userDay.timeOut && (
					<div className="form-control w-full">
						<input
							type="datetime-local"
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
				{userDay.timeOut && <DataElement data={userDay.timeOut} />}
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
				{userDay.moneyOut != null && (
					<div className="flex flex-col gap-2 items-center">
						<span className="text-orange-500">{`${userDay.moneyOut}¥`}</span>
						<span className="text-violet-500">{`${fantaMoneyToEuro(userDay.moneyOut)}€`}</span>
					</div>
				)}
			</td>

			<td>
				{userDay.rakeShare != null && (
					<div className="flex flex-col gap-2 items-center">
						<span className="text-orange-500">{`${toFixed(userDay.rakeShare)}¥`}</span>
						<span className="text-violet-500">{`${fantaMoneyToEuro(userDay.rakeShare)}€`}</span>
					</div>
				)}
			</td>

			<td>
				{userDay.moneyOut != null && userDay.rakeShare != null && (
					<div className="flex flex-col gap-2 items-center">
						<span className="text-orange-500">{`${toFixed(outcome)}¥`}</span>
						<span className="text-violet-500">{`${fantaMoneyToEuro(outcome)}€`}</span>
					</div>
				)}
			</td>

			<td className="text-center">
				{outcome > 0 ? <span className="text-green-500">VINCENTE</span> : <span className="text-red-500">PERDENTE</span>}
			</td>

			<td>
				<button className="btn btn-sm btn-secondary" onClick={handleSubmit(addUserOutGame)} disabled={Boolean(userDay.timeOut)}>
					Esce
				</button>
			</td>
		</tr>
	);
};

export default ManageDayUserItemIn;
