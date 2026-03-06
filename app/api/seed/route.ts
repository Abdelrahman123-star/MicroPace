import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Path } from "@/models/Path";
import { Sprint } from "@/models/Sprint";
import {
  getDataAnalystPaths,
  getBeginnerSprints,
  getIntermediateSprints,
} from "@/lib/seed/data-analyst-course";

export async function GET() {
  try {
    await connectDB();

    // // 1. Wipe existing data
    // await Path.deleteMany({});
    // await Sprint.deleteMany({});

    const paths = getDataAnalystPaths();

    // 2. Create Data Analyst: Beginner path
    const pathBeginner = await Path.create(paths[0]);
    const beginnerSprints = getBeginnerSprints(pathBeginner._id);
    await Sprint.insertMany(beginnerSprints);

    // 3. Create Data Analyst: Intermediate path
    const pathIntermediate = await Path.create(paths[1]);
    const intermediateSprints = getIntermediateSprints(pathIntermediate._id);
    await Sprint.insertMany(intermediateSprints);

    return NextResponse.json({
      message: "Database seeded with Data Analyst course successfully!",
      paths: [
        { name: pathBeginner.name, slug: pathBeginner.slug, sprints: beginnerSprints.length },
        { name: pathIntermediate.name, slug: pathIntermediate.slug, sprints: intermediateSprints.length },
      ],
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
