import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
	const router = useRouter();
	const { data: sessionData } = useSession();

	console.log(sessionData);

	if (sessionData && router.isReady) {
		void router.push("/homepage");
	}

	return (
		<>
			<Head>
				<title>Share a Tip!</title>
				<meta name="description" content="Made by barrybtw!" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f026d78] to-[#15162c]">
				<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
					<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
						Share a Tip!
					</h1>
					<div className="flex flex-col items-center justify-center gap-4">
						<button
							className="rounded-md bg-[#2f026d] px-4 py-2 text-lg font-semibold text-white"
							onClick={() => void signIn("google")}
						>
							Sign in to begin!
						</button>
					</div>
				</div>
			</main>
		</>
	);
};

export default Home;
