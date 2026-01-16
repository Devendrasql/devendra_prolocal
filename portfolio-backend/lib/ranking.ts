import { prisma } from "@/lib/prisma";

export async function updateProjectRanking(projectId: number) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      ranking: true,
    },
  });

  if (!project || !project.ranking) return;

  const viewsScore = project.views * 0.1;
  const editorialScore = project.ranking.editorialRank * 10;

  const score = viewsScore + editorialScore;

  await prisma.projectRanking.update({
    where: { projectId },
    data: { score },
  });
}
