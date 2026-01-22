"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { RepositoryListSkeleton } from '@/modules/repositories/components/repository-skeleton'
import { useConnectRepository } from '@/modules/repositories/hooks/use-connect-repository'
import { useRepositories } from '@/modules/repositories/hooks/use-repositories'
import { ExternalLink, Search, Star } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const RepositoryPage = () => {

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useRepositories()

    const { mutate: connectRepo } = useConnectRepository()

    const [searchQuery, setSearchQuery] = useState('');

    const allRepositories = data?.pages.flatMap(page => page) || []

    const [localConnectingId, setLocalConnectingId] = useState<number | null>(null);


    const observerTarget = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
            }
        }, { threshold: 0.1 })

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);


    if (isLoading) {
        return (
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
                    <p className="text-muted-foreground">Manage and view all your GitHub repositories</p> </div>
                <RepositoryListSkeleton />
            </div>)
    }

    if (isError) {
        return <div>Failed to fetch repositories</div>
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleConnect = (repo: { isConnected?: boolean; id: any; node_id?: string; name: any; full_name: any; license?: { key: string; name: string; url: string | null; spdx_id: string | null; node_id: string; html_url?: string } | null; forks?: number; permissions?: { admin: boolean; pull: boolean; triage?: boolean; push: boolean; maintain?: boolean } | undefined; owner?: { name?: string | null; email?: string | null; login: string; id: number; node_id: string; avatar_url: string; gravatar_id: string | null; url: string; html_url: string; followers_url: string; following_url: string; gists_url: string; starred_url: string; subscriptions_url: string; organizations_url: string; repos_url: string; events_url: string; received_events_url: string; type: string; site_admin: boolean; starred_at?: string; user_view_type?: string }; private?: boolean; html_url?: string; description?: string | null; fork?: boolean; url?: string; archive_url?: string; assignees_url?: string; blobs_url?: string; branches_url?: string; collaborators_url?: string; comments_url?: string; commits_url?: string; compare_url?: string; contents_url?: string; contributors_url?: string; deployments_url?: string; downloads_url?: string; events_url?: string; forks_url?: string; git_commits_url?: string; git_refs_url?: string; git_tags_url?: string; git_url?: string; issue_comment_url?: string; issue_events_url?: string; issues_url?: string; keys_url?: string; labels_url?: string; languages_url?: string; merges_url?: string; milestones_url?: string; notifications_url?: string; pulls_url?: string; releases_url?: string; ssh_url?: string; stargazers_url?: string; statuses_url?: string; subscribers_url?: string; subscription_url?: string; tags_url?: string; teams_url?: string; trees_url?: string; clone_url?: string; mirror_url?: string | null; hooks_url?: string; svn_url?: string; homepage?: string | null; language?: string | null; forks_count?: number; stargazers_count?: number; watchers_count?: number; size?: number; default_branch?: string; open_issues_count?: number; is_template?: boolean | undefined; topics?: string[] | undefined; has_issues?: boolean; has_projects?: boolean; has_wiki?: boolean; has_pages?: boolean; has_downloads?: boolean; has_discussions?: boolean | undefined; archived?: boolean; disabled?: boolean; visibility?: string | undefined; pushed_at?: string | null; created_at?: string | null; updated_at?: string | null; allow_rebase_merge?: boolean | undefined; temp_clone_token?: string | undefined; allow_squash_merge?: boolean | undefined; allow_auto_merge?: boolean | undefined; delete_branch_on_merge?: boolean | undefined; allow_update_branch?: boolean | undefined; use_squash_pr_title_as_default?: boolean | undefined; squash_merge_commit_title?: "PR_TITLE" | "COMMIT_OR_PR_TITLE" | undefined; squash_merge_commit_message?: "PR_BODY" | "COMMIT_MESSAGES" | "BLANK" | undefined; merge_commit_title?: "PR_TITLE" | "MERGE_MESSAGE" | undefined; merge_commit_message?: "PR_TITLE" | "PR_BODY" | "BLANK" | undefined; allow_merge_commit?: boolean | undefined; allow_forking?: boolean | undefined; web_commit_signoff_required?: boolean | undefined; open_issues?: number; watchers?: number; master_branch?: string | undefined; starred_at?: string | undefined; anonymous_access_enabled?: boolean | undefined; code_search_index_status?: { lexical_search_ok?: boolean; lexical_commit_sha?: string } | undefined }) => {
        setLocalConnectingId(repo.id);
        connectRepo({
            owner: repo.full_name.split("/")[0],
            repo: repo.name,
            githubId: repo.id,
        },
            {
                onSettled: () => {
                    setLocalConnectingId(null);
                }
            }
        )
    }

    const filteredRepositories = allRepositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className='space-y-4'>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
                <p className="text-muted-foreground">Manage and view all your GitHub repositories</p> </div>
            <div className='relative'>
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search repositories..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className='grid gap-4'>
                {
                    filteredRepositories.map(repo => (
                        <Card key={repo.id} className='hover:shadow-md transition-shadow'>

                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg">{repo.name}</CardTitle>
                                            <Badge variant="outline">{repo.language || "Unknown"}</Badge>
                                            {repo.isConnected && <Badge variant="secondary">Connected</Badge>}
                                        </div>
                                        <CardDescription>{repo.description}</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button
                                            onClick={() => handleConnect(repo)}
                                            disabled={localConnectingId === repo.id || repo.isConnected}
                                            variant={repo.isConnected ? "outline" : "default"}>
                                            {localConnectingId === repo.id ? "Connecting..." : repo.isConnected ? "Connected" : "Connect"}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"> <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-primary text-primary" />
                                        <span className="text-sm font-medium">{repo.stargazers_count}</span>
                                    </div>
                                </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
            <div ref={observerTarget} className='py-4'>
                {isFetchingNextPage && <RepositoryListSkeleton />}
                {
                    !hasNextPage && allRepositories.length > 0 && (
                        <p className='text-center text-muted-foreground'>No More Rrepositories</p>)
                }
            </div>
        </div>
    )
}

export default RepositoryPage