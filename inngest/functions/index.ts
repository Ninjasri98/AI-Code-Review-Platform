import prisma from "@/lib/db";
import { inngest } from "../client";
import { getRepofileContents } from "@/modules/github/lib/github";
import { indexCodebase } from "@/modules/ai/lib/rag";

export const indexRepo = inngest.createFunction(
    {id : "index-repo"},
    {event : "repository.connected"},
    async ({ event, step }) => {
        const { owner, repo, userId } = event.data;

        //fetch all files in this repository
        const files = await step.run("fetch-files", async() =>{
            const account = await prisma.account.findFirst({
                where:{
                    userId : userId,
                    providerId : "github"
                }
            })

            if(!account?.accessToken){
                throw new Error("No access token found for user")
            }

            return await getRepofileContents(
                account.accessToken,
                owner,
                repo
            );
        })

        //index codebase

        await step.run("index-codebase", async() =>{
            await indexCodebase(
                `${owner}/${repo}`,
                files
            )
        })

        return { success: true, indexedFiles: files.length}
    }
)