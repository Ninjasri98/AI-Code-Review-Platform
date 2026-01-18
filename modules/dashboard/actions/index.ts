"use server";

import { auth } from "@/lib/auth";
import { fetchUserContributions, getGithubToken } from "@/modules/github/lib/github";
import { headers } from "next/headers";
import { Octokit } from "octokit";

export async function getDashboardStats() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user) {
            throw new Error("Unauthorized")
        }

        const token = await getGithubToken();
        const octokit = new Octokit({ auth: token });

        //get users github username
        const { data: user } = await octokit.rest.users.getAuthenticated();

        // TODO Fetch total connected repo from db
        const totalRepos = 30;

        //fetch contribution stats
        const calendar = await fetchUserContributions(token, user.login)
        const totalCommits = calendar.totalContributions || 0;

        //counting prs from db or github
        const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
            q: `author:${user.login} type:pr`,
            per_page: 1
        })

        const totalPRs = prs.total_count || 0;

        //TODO Count ai reviews from db
        const totalReviews = 44;

        return {
            totalCommits,
            totalPRs,
            totalReviews,
            totalRepos
        }
    } catch (error) {
        console.error("Error fetching DashboardStats:", error);
        return {
            totalCommits: 0,
            totalPRs: 0,
            totalReviews: 0,
            totalRepos: 0
        }
    }
}