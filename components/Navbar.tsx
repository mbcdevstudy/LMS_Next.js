"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
            <div className="container mb mx-auto px-4 md:px-6 h-12 md:h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">E</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">EduNova</span>
                </div>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    <SignedIn>
                        <Link
                            href="/courses"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            Courses
                        </Link>
                    </SignedIn>
                    <Link
                        href="#"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        Mentors
                    </Link>
                    <Link
                        href="#"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        Pricing
                    </Link>
                </div>

                {/* Desktop Auth / User */}
                <div className="hidden md:flex items-center gap-4">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton />
                        <SignUpButton>
                            <Button>Sign Up</Button>
                        </SignUpButton>
                    </SignedOut>
                </div>

                {/* Mobile: User Button + Hamburger */}
                <div className="flex md:hidden items-center gap-3">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden"
                >
                    <div className="container mx-auto px-6 pb-4 pt-2 flex flex-col gap-2 border-t border-white/5">
                        <SignedIn>
                            <Link
                                href="/courses"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
                            >
                                Courses
                            </Link>
                        </SignedIn>
                        <Link
                            href="#"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
                        >
                            Mentors
                        </Link>
                        <Link
                            href="#"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
                        >
                            Pricing
                        </Link>

                        <SignedOut>
                            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/5">
                                <SignInButton />
                                <SignUpButton>
                                    <Button size="sm" className="w-full">
                                        Sign Up
                                    </Button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                    </div>
                </div>
            )}
        </nav>
    );
}
