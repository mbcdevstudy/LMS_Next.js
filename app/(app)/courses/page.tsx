import { sanityFetch } from '@/sanity/lib/live';
import { USER_COURSES_QUERY } from '@/sanity/lib/queries';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'
import { getUserTier, hasAccessToTier } from "@/lib/user-plan";
import UserCourse from '../_components/UserCourse';

async function page() {

    const user = await currentUser()
    if (!user) return null;

    const [{ data: courses }, userTier] = await Promise.all([
        sanityFetch({
            query: USER_COURSES_QUERY,
            params: { userId: user.id },
        }),
        getUserTier(),
    ]);

    // Filter courses based on access using hasAccessToTier
    const accessChecks = await Promise.all(
        courses.map(async (course: any) => ({
            course,
            hasAccess: await hasAccessToTier(course.tier)
        }))
    );
    const filteredCourses = accessChecks
        .filter(item => item.hasAccess)
        .map(item => item.course);

    const firstName = user.firstName ?? user.username ?? "there";
    return (
        <div className="container mx-auto p-4 md:p-8 pt-6">
            <UserCourse courses={filteredCourses} userTier={userTier} />
        </div>
    )
}

export default page