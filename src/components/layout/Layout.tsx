import { ReactElement } from "react";
import styles from "./Layout.module.css";
import { useRouter } from "next/router";

interface ILayoutProps {
	title: string;
	children: string | JSX.Element | JSX.Element[];
}
const Layout = ({ title, children }: ILayoutProps) => {
	const router = useRouter();

	return (
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
				</div>
			</div>
			<div className={styles.layoutBody}>{children}</div>
		</div>
	);
};

export default Layout;
