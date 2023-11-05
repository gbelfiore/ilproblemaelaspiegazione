import { getAllDay } from "@/Sarvices/DayServices";
import Layout from "@/components/layout/Layout";
import { useCallback } from "react";

const Home = () => {
	const xxx = useCallback(async () => {
		let data = await getAllDay();
		console.log(data);
	}, []);
	return (
		<Layout title="Home Page">
			<div>cisoooo</div>
		</Layout>
	);
};

export default Home;
