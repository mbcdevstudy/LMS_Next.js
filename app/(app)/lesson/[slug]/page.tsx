import { sanityFetch } from '@/sanity/lib/live';
import { LESSON_BY_SLUG_QUERY } from '@/sanity/lib/queries';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import React from 'react';
import { TIER_STYLES, Tier } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
    CheckCircle2,
    PlayCircle,
    Clock,
    BookOpen,
    ChevronDown,
    ArrowLeft,
    Lock,
    Star,
} from 'lucide-react';
import Link from 'next/link';
import MarkCompleteButton from '@/components/MarkCompleteButton';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LessonRef {
    _id: string;
    title: string;
    slug?: { current: string };
    completedBy?: string[];
}

interface ModuleRef {
    _id: string;
    title: string;
    lessons?: LessonRef[];
}

interface CourseRef {
    _id: string;
    title: string;
    slug?: { current: string };
    tier: string;
    modules?: ModuleRef[];
}

interface BlockChild {
    _key?: string;
    _type: string;
    text?: string;
    marks?: string[];
}

interface Block {
    _key?: string;
    _type: string;
    style?: string;
    children?: BlockChild[];
    asset?: { url?: string; _ref?: string };
    alt?: string;
    caption?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

// Minimal portable-text renderer (no external package needed)
function renderBlock(block: Block, idx: number): React.ReactNode {
    if (block._type === 'image') {
        const src = block.asset?.url;
        if (!src) return null;
        return (
            <figure key={idx} className="my-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={block.alt ?? ''} className="rounded-xl w-full object-cover" />
                {block.caption && (
                    <figcaption className="text-center text-xs text-muted-foreground mt-2">
                        {block.caption}
                    </figcaption>
                )}
            </figure>
        );
    }

    if (block._type !== 'block') return null;

    const children = (block.children ?? []).map((child: BlockChild, ci: number) => {
        const marks = child.marks ?? [];
        let node: React.ReactNode = child.text ?? '';
        if (marks.includes('strong')) node = <strong key={ci}>{node}</strong>;
        if (marks.includes('em')) node = <em key={ci}>{node}</em>;
        if (marks.includes('code')) node = <code key={ci} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{node}</code>;
        if (marks.includes('underline')) node = <u key={ci}>{node}</u>;
        return <React.Fragment key={ci}>{node}</React.Fragment>;
    });

    const style = block.style ?? 'normal';
    const base = 'mb-4';

    switch (style) {
        case 'h1': return <h1 key={idx} className={`${base} text-3xl font-bold mt-8`}>{children}</h1>;
        case 'h2': return <h2 key={idx} className={`${base} text-2xl font-bold mt-6`}>{children}</h2>;
        case 'h3': return <h3 key={idx} className={`${base} text-xl font-semibold mt-5`}>{children}</h3>;
        case 'h4': return <h4 key={idx} className={`${base} text-lg font-semibold mt-4`}>{children}</h4>;
        case 'blockquote':
            return (
                <blockquote key={idx} className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-4">
                    {children}
                </blockquote>
            );
        default:
            return <p key={idx} className={`${base} text-muted-foreground leading-relaxed`}>{children}</p>;
    }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface LessonPageProps {
    params: Promise<{ slug: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
    const { userId } = await auth();
    const { slug } = await params;

    const { data: lesson } = await sanityFetch({
        query: LESSON_BY_SLUG_QUERY,
        params: { slug },
    });

    if (!lesson) notFound();


    const isCompleted = lesson.completedBy?.includes(userId ?? '') ?? false;
    const playbackId = lesson.video?.asset?.playbackId;
    const duration = lesson.video?.asset?.data?.duration;

    // Pick the first course for sidebar context
    const course = lesson.courses?.[0] as CourseRef | undefined;
    const tier = (course?.tier ?? 'free') as Tier;
    const tierStyle = TIER_STYLES[tier] || TIER_STYLES.free;

    // Flatten all lessons across all modules for prev/next navigation
    const allLessons: LessonRef[] = (course?.modules ?? []).flatMap(
        (m: ModuleRef) => m.lessons ?? []
    );
    const currentIdx = allLessons.findIndex((l) => l.slug?.current === slug);
    const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
    const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">

            {/* ── Top bar ── */}
            <div className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-md">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
                    {course ? (
                        <Link
                            href={`/course/${course.slug?.current}`}
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            <span className="hidden sm:inline">{course.title}</span>
                            <span className="sm:hidden">Back</span>
                        </Link>
                    ) : (
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Dashboard
                        </Link>
                    )}

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{lesson.title}</p>
                    </div>

                    {isCompleted && (
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                        </span>
                    )}
                </div>
            </div>

            {/* ── Main layout ── */}
            <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">

                {/* ── Video + Content column ── */}
                <main className="flex-1 min-w-0">

                    {/* Video player */}
                    <div className="bg-black w-full aspect-video">
                        {playbackId ? (
                            <iframe
                                src={`https://stream.mux.com/${playbackId}`}
                                className="w-full h-full"
                                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                <PlayCircle className="w-16 h-16 opacity-20" />
                                <p className="text-sm opacity-60">No video available for this lesson</p>
                            </div>
                        )}
                    </div>

                    {/* Lesson meta + content */}
                    <div className="px-4 sm:px-8 lg:px-12 py-8 max-w-3xl">

                        {/* Title row */}
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
                                    {lesson.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                    {duration && (
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {formatDuration(duration)}
                                        </span>
                                    )}
                                    {course && (
                                        <span className="flex items-center gap-1.5">
                                            <Star className="w-4 h-4" />
                                            <span
                                                className={cn(
                                                    'font-medium bg-clip-text text-transparent bg-gradient-to-r',
                                                    tierStyle.gradient
                                                )}
                                            >
                                                {tier.charAt(0).toUpperCase() + tier.slice(1)} Plan
                                            </span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            {isCompleted && (
                                <span className="sm:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Completed
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {lesson.description && (
                            <p className="text-muted-foreground leading-relaxed mb-8 text-base border-b border-border/40 pb-8">
                                {lesson.description}
                            </p>
                        )}

                        {/* Mark complete button */}
                        <div className="mb-8">
                            <MarkCompleteButton lessonId={lesson._id} isCompleted={isCompleted} />
                        </div>

                        {/* Portable text content */}
                        {lesson.content && Array.isArray(lesson.content) && lesson.content.length > 0 && (
                            <div className="prose-custom">
                                {(lesson.content as Block[]).map((block, idx) => renderBlock(block, idx))}
                            </div>
                        )}

                        {/* Prev / Next navigation */}
                        <div className="flex items-center justify-between gap-4 mt-12 pt-8 border-t border-border/40">
                            {prevLesson ? (
                                <Link
                                    href={`/lesson/${prevLesson.slug?.current ?? prevLesson._id}`}
                                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                    <div className="text-left">
                                        <p className="text-xs text-muted-foreground/60 mb-0.5">Previous</p>
                                        <p className="font-medium line-clamp-1">{prevLesson.title}</p>
                                    </div>
                                </Link>
                            ) : <div />}

                            {nextLesson ? (
                                <Link
                                    href={`/lesson/${nextLesson.slug?.current ?? nextLesson._id}`}
                                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right"
                                >
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground/60 mb-0.5">Next</p>
                                        <p className="font-medium line-clamp-1">{nextLesson.title}</p>
                                    </div>
                                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            ) : <div />}
                        </div>
                    </div>
                </main>

                {/* ── Course sidebar ── */}
                {course && (
                    <aside className="hidden lg:flex flex-col w-80 xl:w-96 border-l border-border/50 bg-card/30 overflow-y-auto max-h-[calc(100vh-3.5rem)] sticky top-14">

                        {/* Sidebar header */}
                        <div className="px-5 py-4 border-b border-border/50 flex-shrink-0">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                Course
                            </p>
                            <h2 className="font-bold text-sm leading-snug line-clamp-2">
                                {course.title}
                            </h2>

                            {/* Overall progress */}
                            {userId && (() => {
                                const total = allLessons.length;
                                const done = allLessons.filter(
                                    (l) => l.completedBy?.includes(userId)
                                ).length;
                                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                                return (
                                    <div className="mt-3">
                                        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                                            <span>{done}/{total} lessons</span>
                                            <span
                                                className={cn(
                                                    'font-semibold bg-clip-text text-transparent bg-gradient-to-r',
                                                    tierStyle.gradient
                                                )}
                                            >
                                                {pct}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-border/60 overflow-hidden">
                                            <div
                                                className={cn(
                                                    'h-full rounded-full bg-gradient-to-r transition-all duration-700',
                                                    tierStyle.gradient
                                                )}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Module accordion list */}
                        <div className="flex-1 overflow-y-auto py-2">
                            {(course.modules ?? []).map((mod: ModuleRef, modIdx: number) => {
                                const lessons = mod.lessons ?? [];
                                const hasCurrentLesson = lessons.some(
                                    (l) => l.slug?.current === slug
                                );
                                return (
                                    <details
                                        key={mod._id}
                                        className="group border-b border-border/30 last:border-0"
                                        open={hasCurrentLesson}
                                    >
                                        <summary className="flex items-center gap-3 px-5 py-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden hover:bg-muted/30 transition-colors">
                                            <div
                                                className={cn(
                                                    'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-gradient-to-br text-white',
                                                    tierStyle.gradient
                                                )}
                                            >
                                                {modIdx + 1}
                                            </div>
                                            <span className="flex-1 text-xs font-semibold line-clamp-2 leading-snug">
                                                {mod.title}
                                            </span>
                                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 transition-transform duration-200 group-open:rotate-180" />
                                        </summary>

                                        <ul className="pb-1">
                                            {lessons.map((l: LessonRef, lIdx: number) => {
                                                const isCurrent = l.slug?.current === slug;
                                                const isDone = l.completedBy?.includes(userId ?? '') ?? false;
                                                return (
                                                    <li key={l._id}>
                                                        <Link
                                                            href={`/lesson/${l.slug?.current ?? l._id}`}
                                                            className={cn(
                                                                'flex items-center gap-3 px-5 py-2.5 text-xs transition-all duration-150',
                                                                isCurrent
                                                                    ? cn(
                                                                        'font-semibold text-foreground border-l-2',
                                                                        tier === 'ultra'
                                                                            ? 'border-cyan-400 bg-cyan-500/5'
                                                                            : tier === 'pro'
                                                                                ? 'border-violet-400 bg-violet-500/5'
                                                                                : 'border-emerald-400 bg-emerald-500/5'
                                                                    )
                                                                    : isDone
                                                                        ? 'text-emerald-400 hover:bg-muted/30'
                                                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                                            )}
                                                        >
                                                            <span className="flex-shrink-0 w-4 h-4">
                                                                {isDone ? (
                                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                                ) : isCurrent ? (
                                                                    <PlayCircle className={cn(
                                                                        'w-4 h-4',
                                                                        tier === 'ultra' ? 'text-cyan-400'
                                                                            : tier === 'pro' ? 'text-violet-400'
                                                                                : 'text-emerald-400'
                                                                    )} />
                                                                ) : (
                                                                    <Lock className="w-4 h-4 opacity-30" />
                                                                )}
                                                            </span>
                                                            <span className="text-muted-foreground/50 flex-shrink-0 w-6 text-right">
                                                                {modIdx + 1}.{lIdx + 1}
                                                            </span>
                                                            <span className="flex-1 line-clamp-2 leading-snug">
                                                                {l.title}
                                                            </span>
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </details>
                                );
                            })}
                        </div>

                        {/* Sidebar footer — course link */}
                        <div className="px-5 py-4 border-t border-border/50 flex-shrink-0">
                            <Link
                                href={`/course/${course.slug?.current}`}
                                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all"
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                View Course Overview
                            </Link>
                        </div>
                    </aside>
                )}
            </div>

            {/* ── Mobile course nav (bottom drawer trigger) ── */}
            {course && (
                <div className="lg:hidden sticky bottom-0 border-t border-border/50 bg-background/90 backdrop-blur-md px-4 py-3">
                    <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <BookOpen className="w-4 h-4 text-primary" />
                                Course Contents
                            </div>
                            <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                        </summary>

                        <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-border/60 bg-card divide-y divide-border/40">
                            {(course.modules ?? []).map((mod: ModuleRef, modIdx: number) => (
                                <details key={mod._id} className="group/inner" open={mod.lessons?.some(l => l.slug?.current === slug)}>
                                    <summary className="flex items-center gap-2 px-4 py-2.5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                                        <span className="text-xs font-semibold flex-1 line-clamp-1">{mod.title}</span>
                                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 group-open/inner:rotate-180" />
                                    </summary>
                                    <ul className="pb-1">
                                        {(mod.lessons ?? []).map((l: LessonRef, lIdx: number) => {
                                            const isCurrent = l.slug?.current === slug;
                                            const isDone = l.completedBy?.includes(userId ?? '') ?? false;
                                            return (
                                                <li key={l._id}>
                                                    <Link
                                                        href={`/lesson/${l.slug?.current ?? l._id}`}
                                                        className={cn(
                                                            'flex items-center gap-2 px-4 py-2 text-xs transition-colors',
                                                            isCurrent ? 'text-foreground font-semibold' : isDone ? 'text-emerald-400' : 'text-muted-foreground'
                                                        )}
                                                    >
                                                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> : <PlayCircle className="w-3.5 h-3.5 flex-shrink-0 opacity-40" />}
                                                        <span className="opacity-50 flex-shrink-0">{modIdx + 1}.{lIdx + 1}</span>
                                                        <span className="line-clamp-1">{l.title}</span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </details>
                            ))}
                        </div>
                    </details>
                </div>
            )}
        </div>
    );
}