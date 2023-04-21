import { PrismaClient } from '@prisma/client'
import { BadRequestException } from "@nestjs/common";

const prisma = new PrismaClient()

export async function deleteExpiredMutes() {

	const lifetime = 60/*  * 2 */ * 1000 //2 minutes en ms

	const now = Date.now()

	const cutoff = now - lifetime

	console.log('cutoff: ', cutoff)

	const numDelete = await prisma.mute.deleteMany({
		where: {
			createdAt: { lte: new Date(cutoff) }
		}
	}).catch((e) => {
		throw new BadRequestException(e);
	})

	return numDelete
} 