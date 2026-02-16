import Link from "next/link";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">E</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">EduNova</span>
                </div>


                <div className="hidden md:flex items-center gap-8">

                    <SignedIn>
                        <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Courses
                        </Link>

                    </SignedIn>

                    <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Mentors
                    </Link>
                    <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Pricing
                    </Link>
                    <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Enterprise
                    </Link>

                </div>
                <UserButton />

                <SignedOut>
                    <div className="flex items-center gap-4">
                        <SignInButton />
                        <SignUpButton>
                            <Button>Sign Up</Button>
                        </SignUpButton>
                    </div>
                </SignedOut>
            </div>
        </nav>
    );
}
