import { insertUser } from "@/Sarvices/UserServices";
import { IUser } from "@/types/types";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

export const FormUser = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<IUser>();

	const onSubmit = useCallback(async (data) => {
		const result = await insertUser(data.name, data.surname);
	}, []);
};
