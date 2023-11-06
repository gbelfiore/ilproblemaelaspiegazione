import { ReactElement } from "react";
import styles from "./Layout.module.css";
import { useRouter } from "next/router";
import Login from "../login/Login";
import useUserStore from "@/zustand/userState";

interface ILayoutProps {
	title: string;
	children: string | JSX.Element | JSX.Element[];
}
const Layout = ({ title, children }: ILayoutProps) => {
	const router = useRouter();

	return (
		<Login>
			<div className={styles.layout}>
				<div className={styles.layoutHeader}>
					<div className="navbar bg-neutral text-neutral-content">
						<div className={styles.layoutHeaderLogo}>
							<img src={"/logo.png"} alt={"logo"} />
						</div>
						<div className={styles.layoutHeaderTitle}>{title}</div>
						<div className="flex-none">
							<ul className="menu menu-horizontal px-1">
								<li>
									<a onClick={() => router.push("days")}>Giornate</a>
								</li>
								<li>
									<a onClick={() => router.push("users")}>Utenti</a>
								</li>
							</ul>
						</div>

						<div className="dropdown dropdown-end">
							<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
								<div className="w-10 rounded-full">
									<img src="/user.png" />
								</div>
							</label>
							<ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
								{/* <li>
									<a className="justify-between">
										Profile
										<span className="badge">New</span>
									</a>
								</li>
								<li>
									<a>Settings</a>
								</li> */}
								<li>
									<a onClick={() => useUserStore.getState().logout()}>Logout</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className={styles.layoutBody}>{children}</div>
			</div>
		</Login>
	);
};

export default Layout;
