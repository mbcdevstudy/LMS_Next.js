
import { Loader2, ArrowRight, Star, Clock, BookOpen, CheckCircle } from "lucide-react"; // Added some icons that might be useful
import { TIER_STYLES, Tier } from "@/lib/constants";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Assuming utils exists, usually does in shadcn
import { Button } from "@/components/ui/button";

interface Course {
    _id: string;
    title: string;
    slug: { current: string };
    description: string;
    tier: string;
    featured: boolean;
    thumbnail?: {
        asset?: {
            _id: string;
            url: string;
        };
    };
    moduleCount: number;
    lessonCount: number;
    category?: {
        title: string;
    };
}

interface CourseListProps {
    courses: Course[];
    userTier: Tier;
}

export default function UserCourse({ courses, userTier }: CourseListProps) {
    const tierStyle = TIER_STYLES[userTier] || TIER_STYLES.free;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back! Here are the courses included in your plan.
                    </p>
                </div>

                <div className={cn(
                    "flex items-center gap-3 mt-20 px-4 py-2 rounded-full border bg-card/50 backdrop-blur-sm",
                    tierStyle.border
                )}>
                    <span className="text-sm font-medium text-muted-foreground">Current Plan:</span>
                    <span className={cn(
                        "text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r",
                        tierStyle.gradient
                    )}>
                        {userTier.charAt(0).toUpperCase() + userTier.slice(1)}
                    </span>
                    {userTier === 'free' && (
                        <Button variant="outline" size="sm" className="ml-2 h-7 text-xs" asChild>
                            <Link href="/pricing">Upgrade</Link>
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses?.map((course) => (
                    <div
                        key={course._id}
                        className="group relative flex flex-col h-full rounded-2xl border border-border overflow-hidden bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={course.thumbnail?.asset?.url || '/placeholder-course.jpg'}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3">
                                <span className={cn(
                                    "px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-md border",
                                    course.tier === 'ultra' ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" :
                                        course.tier === 'pro' ? "bg-violet-500/10 border-violet-500/20 text-violet-400" :
                                            "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                )}>
                                    {course.tier.charAt(0).toUpperCase() + course.tier.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col flex-grow p-6">
                            <div className="flex justify-between items-start mb-4">
                                {course.category && (
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {course.category.title}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {course.title}
                            </h3>

                            <p className="text-muted-foreground text-sm mb-6 line-clamp-2 flex-grow">
                                {course.description}
                            </p>

                            <div className="space-y-4 pt-4 border-t border-border/50 mt-auto">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{course.moduleCount || 0} Modules</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{course.lessonCount || 0} Lessons</span>
                                    </div>
                                </div>

                                <Button className="w-full group/btn" asChild>
                                    <Link href={`/course/${course.slug.current}`}>
                                        Start Learning
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {courses?.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-muted-foreground">No courses found</h3>
                    <p className="text-muted-foreground/60 mt-2">Check back later for new content.</p>
                </div>
            )}
        </div>
    );
}
