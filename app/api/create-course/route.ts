import { writeClient } from "@/sanity/lib/write-client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const category = formData.get("category") as string;
        const tier = formData.get("tier") as string;
        const featured = formData.get("featured") === "on";
        const thumbnail = formData.get("thumbnail") as File | null;
        const moduleIdsRaw = formData.get("moduleIds") as string;

        // Validate required fields
        if (!title || !description || !category || !tier) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        let imageAssetId = null;
        if (thumbnail && thumbnail.size > 0) {
            const asset = await writeClient.assets.upload("image", thumbnail, {
                filename: thumbnail.name,
            });
            imageAssetId = asset._id;
        }

        const slug = {
            _type: "slug",
            current: title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, ""),
        };

        // Build module references array
        let moduleIds: string[] = [];
        try {
            moduleIds = moduleIdsRaw ? JSON.parse(moduleIdsRaw) : [];
        } catch {
            moduleIds = [];
        }

        const modules = moduleIds.map((id: string) => ({
            _type: "reference",
            _ref: id,
            _key: id,
        }));

        const newCourse = await writeClient.create({
            _type: "course",
            title,
            slug,
            description,
            category: {
                _type: "reference",
                _ref: category,
            },
            tier,
            featured: !!featured,
            ...(imageAssetId && {
                thumbnail: {
                    _type: "image",
                    asset: {
                        _type: "reference",
                        _ref: imageAssetId,
                    },
                },
            }),
            ...(modules.length > 0 && { modules }),
        });

        return NextResponse.json(newCourse);
    } catch (error: any) {
        console.error("Error creating course:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create course" },
            { status: 500 }
        );
    }
}