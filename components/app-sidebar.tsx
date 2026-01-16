"use client"

import { useSession } from "@/lib/auth-client";
import { BookOpen, Github, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar, SidebarHeader } from "./ui/sidebar";

export const AppSidebar = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const pathname = usePathname();

    const { data: session } = useSession();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, [])


    const navigationItems = [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: BookOpen,
        },
        {
            title: "Repository",
            url: "/dashboard/repository",
            icon: Github,
        },
        {
            title: "Reviews",
            url: "/dashboard/reviews",
            icon: BookOpen,
        },
        {
            title: "Subscription",
            url: "/dashboard/subscription",
            icon: BookOpen,
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings,
        }
    ];

    const isActive = (url: string) => {
        return pathname === url || pathname.startsWith(url + "/dashboard");
    }

    if (!mounted || !session) {
        return null;
    }

    const user = session.user;
    const userName = user.name || user.email?.split("@")[0] || "Guest";
    const userEmail = user.email || "";
    const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase();
    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <div className="flex flex-col gap-4 px-2 py-6">
                    <div className="flex items-center gap-4 px-3 py-4 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent/70 transition-colors">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground shrink-0">
                            <Github className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-sidebar-foreground tracking-wide">Connected Account</p>
                            <p className="text-sm font-medium text-sidebar-foreground/90">@{userName}</p>
                        </div>
                    </div>
                </div>
            </SidebarHeader>
        </Sidebar >
    )
}