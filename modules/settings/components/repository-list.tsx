import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { disconnectAllRepositories, disconnectRepository, getConnectedRepositories } from "../actions";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RepositoryList() {
    const queryClient = useQueryClient();

    const [disconnectAllOpen, setDisconnectAllOpen] = useState(false);

    const { data: repositories, isLoading } = useQuery({
        queryKey: ["connected-repositories"],
        queryFn: async () => await getConnectedRepositories(),
        staleTime: 1000 * 60 * 2, // 2 minutes
        refetchOnWindowFocus: false,
    })

    const disconnectMutation = useMutation({
        mutationFn: async (repositoryId: string) => {
            return await disconnectRepository(repositoryId);
        },
        onSuccess: (result) => {
            if (result?.success) {
                queryClient.invalidateQueries({ queryKey: ["connected-repositories"] })
                queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
                toast.success("Repository disconnected successfully")
            } else {
                toast.error(result?.error || "Failed to disconnect repository")
            }
        },
    })

    const disconnectAllMutation = useMutation({
        mutationFn: async () => {
            return await disconnectAllRepositories()
        },

        onSuccess: (result) => {
            if (result?.success) {
                queryClient.invalidateQueries({ queryKey: ["connected-repositories"] })
                queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
                toast.success(`Disconnected ${result.count} repositories`)
                setDisconnectAllOpen(false)
            } else {
                toast.error(result?.error || "Failed to disconnect repositories")
            }

        },
    })

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Connected Repositories</CardTitle>
                    <CardDescription>
                        Manage your connected GitHub repositories
                    </ CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-4">
                        <div className="h-20 bg-muted rounded"></div>
                        <div className="h-20 bg-muted rounded"></div>
                    </div>
                </CardContent>
            </Card>
        )
    };

    return (
        <Card>
            <CardHeader>
                
            </CardHeader>
        </Card>
    )
}