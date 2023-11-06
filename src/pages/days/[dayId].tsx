import ManageDayDetails from "@/components/manage-day-details/ManageDayDetails";
import { useRouter } from "next/router";

const DayDetails = () => {
	const router = useRouter();
	const { dayId } = router.query;
	return <ManageDayDetails dayId={dayId as string} />;
};

export default DayDetails;
