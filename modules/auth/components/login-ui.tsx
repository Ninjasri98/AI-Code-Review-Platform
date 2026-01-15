"use client"
import { signIn } from '@/lib/auth-client';
import React, { useState } from 'react';
import { GithubIcon } from "lucide-react"

const LoginUI = () => {
    //loading state
    const [isLoading, setIsLoading] = useState(false);
    //handling github login
    const handleGithubLogin = async () => {
        setIsLoading(true);
        try {
            await signIn.social({
                provider: "github"
            })
        } catch (error) {
            console.error("Login Error : ", error);
            setIsLoading(false);
        }
    }
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 text-white dark flex">
            {/* Left Section Hero Content */}
            <div className="flex-1 flex flex-col justify-center px-12 py-16">
                <div className="max-w-lg">
                    {/* Logo */}
                    <div className="mb-16">
                        <div className="inline-flex items-center gap-2 text-2x1 font-bold">
                            <div className="w-8 h-8 bg-primary rounded-full" /> <span>CodeAudit</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <h1 className="text-5xl font-bold mb-6 leading-tight text-balance">
                        Cut Code Review Time & Bugs in Half. <span className="block">Instantly.</span> </h1>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        Supercharge your team to ship faster with the most advanced AI code reviews.
                    </p>
                </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center px-12 py-16">
                <div className="w-full max-w-sm ">
                    <div className="mb-12 ">
                        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                        <p className=" text-gray-400">Login using the following providers:</p>
                    </div>

                    {/* GitHub Login Button */}
                    <button
                        onClick={handleGithubLogin}
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-primary text-black rounded-lg font-semibold hover:bg-primary-foreground disabled: opacity-50 disabled: cursor-not-allowed transition-colors flex items-center justify-center gap-3 mb-8">
                        <GithubIcon size={20} />
                        {isLoading ? "Signing in..." : "GitHub"}
                    </button>

                    {/* Footer Links */}
                    <div className="space-y-4 text-center text-sm text-gray-400">
                        <div>
                            New to CodeAudit?{" "}
                            <a href="#" className="text-primary hover:text-primary-foreground font-semibold">
                                Sign Up
                            </a>
                        </div>
                        <div>
                            <a href="#" className="text-primary hover:text-primary-foreground font-semibold">
                                Self-Hosted Services
                            </a>
                        </div>
                    </div>
                    {/* Bottom Links */}
                    <div className="mt-12 pt-8 border-t text-xs text-gray-500 border-gray-700 flex justify-center gap-4">
                        <a href="#" className="hover: text-gray-400">
                            Terms of Use
                        </a>
                        <span>and</span>
                        <a href="#" className="hover: text-gray-400">
                            Privacy Policy
                        </a>
                    </div>
                </div >
            </div>
        </div>
    )
}

export default LoginUI