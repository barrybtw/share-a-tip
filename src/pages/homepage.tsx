import { authOptions } from "@/server/auth";
import { Field, Form } from "houseform";

import { type GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { z } from "zod";
import { TypographyH1 } from "@/components/typography/h1";
import { TypographyP } from "@/components/typography/p";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyH3 } from "@/components/typography/h3";
import { TypographyH4 } from "@/components/typography/h4";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const session = await getServerSession(req, res, authOptions);

	if (session === undefined || session === null) {
		return {
			redirect: {
				destination: "/",
				statusCode: 307,
			},
		};
	}

	return {
		props: {
			session: session,
		},
	};
};

function NewTipForm() {
	const { mutate: addTip } = api.tip.addTip.useMutation();
	const titleInputRef = useRef<HTMLInputElement | null>(null);
	const contentInputRef = useRef<HTMLInputElement | null>(null);
	const router = useRouter();
	return (
		<Form
			onSubmit={(values) => {
				addTip(values as { title: string; content: string });
				contentInputRef?.current?.form?.reset();
				titleInputRef?.current?.form?.reset();
			}}
		>
			{({ isValid, submit }) => (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						router.reload();
						void submit();
					}}
					className="flex flex-col items-start justify-center gap-4 lg:w-80 lg:h-96"
				>
					<Field
						name="title"
						onChangeValidate={z
							.string()
							.min(8, "Must be at least 8 characters long")
							.max(50, "Must be less than 50 characters long")}
					>
						{({ value, setValue, onBlur, errors, isTouched }) => {
							return (
								<>
									<Label>Title</Label>
									<Input
										// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
										value={value}
										onBlur={onBlur}
										onChange={(e) => setValue(e.target.value)}
										placeholder={"Title"}
										ref={titleInputRef}
									/>
									{isTouched &&
										errors.map((error) => (
											<TypographyP key={error}>{error}</TypographyP>
										))}
								</>
							);
						}}
					</Field>
					<Field<string>
						name="content"
						onChangeValidate={z
							.string()
							.min(8, "Must be at least 8 characters long")}
					>
						{({ value, setValue, onBlur, errors, isTouched }) => {
							return (
								<>
									<Label>Content</Label>
									<Input
										value={value}
										onBlur={onBlur}
										onChange={(e) => setValue(e.target.value)}
										placeholder={"Tip to share"}
										ref={contentInputRef}
									/>
									{isTouched &&
										errors.map((error) => (
											<TypographyP key={error}>{error}</TypographyP>
										))}
								</>
							);
						}}
					</Field>
					<Button
						disabled={!isValid}
						type="submit"
						variant={"default"}
						className="w-full mt-8"
					>
						Submit
					</Button>
				</form>
			)}
		</Form>
	);
}

export default function Homepage() {
	const router = useRouter();
	const { data: sessionData } = useSession();
	console.log(sessionData);

	const { data: tips } = api.tip.getOne.useQuery();

	console.log(tips);

	return (
		<>
			<Head>
				<title>Homepage | Share a tip</title>
				<meta name="description" content="Made by barrybtw!" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex min-h-screen gap-4 flex-col items-center justify-center bg-gradient-to-b from-[#2f026d78] to-[#15162c] text-white">
				<div className="flex gap-4 flex-row-reverse">
					<Button
						variant={"destructive"}
						onClick={() => {
							void signOut();
							void router.push("/");
						}}
					>
						Sign out of {sessionData?.user.name}
					</Button>
				</div>
				<div className="container flex flex-col items-center justify-center gap-4 px-4 py-16 ">
					<TypographyH1>
						Share something with the world {sessionData?.user.name}!
					</TypographyH1>
					<NewTipForm />
					<div>
						<TypographyH3>
							<br />
							{sessionData?.user.name}s random tip
						</TypographyH3>
						{!tips && <TypographyP>Loading...</TypographyP>}
						{tips && (
							<>
								<TypographyH4>{tips?.title}</TypographyH4>
								<TypographyP>{tips?.content}</TypographyP>
								<br />
								<TypographyP>Submitted by {tips.author.name}</TypographyP>
							</>
						)}
					</div>
				</div>
			</main>
		</>
	);
}
