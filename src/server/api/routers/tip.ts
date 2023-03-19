import { z } from "zod";

import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "@/server/api/trpc";

export const tipRouter = createTRPCRouter({
	addTip: protectedProcedure
		.input(
			z.object({
				title: z.string().min(5).max(50),
				content: z.string().min(8),
			}),
		)
		.mutation(({ ctx, input }) => {
			return ctx.prisma.tip.create({
				data: {
					title: input.title,
					content: input.content,
					author: {
						connect: { id: ctx.session.user.id },
					},
				},
			});
		}),

	getOne: publicProcedure.query(async ({ ctx }) => {
		const tips = await ctx.prisma.tip.findMany({
			include: {
				author: true,
			},
		});
		return tips[Math.floor(Math.random() * tips.length)];
	}),
});
