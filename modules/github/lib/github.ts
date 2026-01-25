import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { headers } from "next/headers"
import { Octokit } from "octokit"

interface ContributionData {
    user: {
        contributionsCollection: {
            contributionCalendar: {
                totalContributions: number;
                weeks: {
                    contributionDays: {
                        contributionCount: number;
                        date: string ;
                        color: string;
                    }[];
                }[];
            };
        };
    };
}

//method for getting github access token
export const getGithubToken = async() =>{
    const session = await auth.api.getSession({
        headers : await headers()
    })

    if(!session){
        throw new Error("Unauthorized")
    }

    const account = await prisma.account.findFirst({
        where : {
            userId : session.user.id,
            providerId : "github"
        }
    })

    if(!account?.accessToken){
        throw new Error("GitHub access token not found")
    }

    return account.accessToken;
}

export async function fetchUserContributions(token: string, username: string) {
    const octokit = new Octokit({
        auth: token,
    })
    const query = `
    query($username: String!) {
        user(login: $username) {
            contributionsCollection {
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                            contributionCount
                            date
                            color
                        }
                    }
                }
            }
        }
    }
    `
    try {
        const response: ContributionData= await octokit.graphql(query,{
            username
        })
        return response.user.contributionsCollection.contributionCalendar;
    } catch (error) {
        throw new Error("Failed to fetch user contributions : "+ error);
    }
}

export const getRepositories = async (page: number = 1, perPage: number = 10) => {
    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const {data} = await octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        direction: 'desc',
        visibility: 'all',
        per_page: perPage,
        page: page,
    })

    return data;
}

export const createWebhook = async(owner : string , repo : string) => {
    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const webHookUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`

    const {data : hooks} = await octokit.rest.repos.listWebhooks({
        owner,
        repo
    })

    const existingHook = hooks.find(hook => hook.config.url === webHookUrl);

    if(existingHook){
        return existingHook;
    }

    const {data} = await octokit.rest.repos.createWebhook({
        owner,
        repo,
        config : {
            url : webHookUrl,
            content_type : "json"
        },
        events : ["pull_request"]
    })

    return data;
}

export const deleteWebhook = async(owner : string , repo : string) => {
    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const webHookUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`;

    try {
        const {data : hooks} = await octokit.rest.repos.listWebhooks({
            owner,
            repo
        });

        const hookToDelete = hooks.find(hook => hook.config.url === webHookUrl);

        if(hookToDelete){
            await octokit.rest.repos.deleteWebhook({
                owner,
                repo,
                hook_id : hookToDelete.id
            })

            return true;
        }

        return false;
    } catch (error) {
        console.error("Error deleting webhook", error);
        return false;
    }
}

