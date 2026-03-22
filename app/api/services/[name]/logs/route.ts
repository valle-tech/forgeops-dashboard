import { NextResponse } from "next/server";
import { getServiceLogsBundle } from "@/lib/service-observe-data";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> },
) {
  const { name: raw } = await context.params;
  const name = decodeURIComponent(raw);
  const data = await getServiceLogsBundle(name);
  return NextResponse.json(data);
}
