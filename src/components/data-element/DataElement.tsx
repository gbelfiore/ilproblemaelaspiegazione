import { formatDay, formatHours } from "@/utils/DateUitls";

interface IDataElementProps {
	data: string;
}
const DataElement = ({ data }: IDataElementProps) => {
	return (
		<div className="flex flex-col items-center">
			<div>{formatDay(data)}</div>
			<div>{formatHours(data)}</div>
		</div>
	);
};

export default DataElement;
