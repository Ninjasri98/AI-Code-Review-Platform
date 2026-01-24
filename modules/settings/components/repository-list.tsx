import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { disconnectAllRepositories, disconnectRepository, getConnectedRepositories } from "../actions";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

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
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Connected Repositories</CardTitle>
                        <CardDescription>Manage your connected GitHub repositories</CardDescription>
                    </div>
                    {repositories && repositories.length > 0 && (
                        <AlertDialog open={disconnectAllOpen} onOpenChange={setDisconnectAllOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Disconnect All
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-destructive" />
                                        Disconnect All Repositories?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will disconnect all {repositories.length} repositories and delete
                                        all associated AI reviews.
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => disconnectAllMutation.mutate()}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        disabled={disconnectAllMutation.isPending}>
                                        {disconnectAllMutation.isPending ? "Disconnecting..." : "Disconnect All"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </CardHeader>
        </Card>
    )
}