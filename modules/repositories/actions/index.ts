"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getRepositories } from "@/modules/github/lib/github";
import { headers } from "next/headers";

export const fetchRepositories = async(page: number = 1, perPage: number = 10) =>{
    const session = await auth.api.getSession({
        headers : await headers()
    })

    if(!session){
        throw new Error("Unauthorized")
    }

    const githubRepos = await getRepositories(page, perPage);

    const dbRepos = await prisma.repository.findMany({
        where : {
            userId : session.user.id
        }
    });

    const connectedRepoIds = new Set(dbRepos.map(repo => repo.githubId));

    return githubRepos.map(repo => ({
        ...repo,
        isConnected : connectedRepoIds.has(BigInt(repo.id))
    }));
}