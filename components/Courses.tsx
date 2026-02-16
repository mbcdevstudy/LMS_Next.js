import { ArrowRight, Star } from "lucide-react";
import { Button } from "./ui/button";
import { FEATURED_COURSES_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";

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
}

export async function Courses() {

    const { data: courses } = await sanityFetch({ query: FEATURED_COURSES_QUERY });
    return (
        <section className="py-24">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl lg:text-5xl font-bold">
                        Most Popular <span className="text-primary">Tracks</span>
                    </h2>
                    <Button variant="ghost" className="hidden md:flex text-primary hover:text-primary/80">
                        View All Tracks <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {courses?.map((track: Course, index: number) => (
                        <div key={track._id || index} className="group relative rounded-2xl border border-border overflow-hidden bg-card/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={track.thumbnail?.asset?.url || '/placeholder-course.jpg'}
                                    alt={track.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        {track.tier || 'Beginner'}
                                    </span>
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-sm font-semibold">4.8</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                    {track.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-6">
                                    {track.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                    <span className="text-sm text-muted-foreground">{track.moduleCount || 0} modules</span>
                                    <Button variant="link" className="p-0 h-auto text-primary">
                                        Enroll Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Button variant="outline" className="w-full">
                        View All Tracks
                    </Button>
                </div>
            </div>
        </section>
    );
}
