import { NextResponse } from "next/server";
import { validatePoc } from "@/lib/poc";
import { getPocWebhook } from "@/lib/poc-server";

export async function POST(request: Request) {
  let value: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 16000)
      return NextResponse.json(
        { ok: false, message: "申请内容过长，请精简后重试。" },
        { status: 413 },
      );
    value = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { ok: false, message: "申请内容格式有误，请重新提交。" },
      { status: 400 },
    );
  }
  const result = validatePoc(value);
  if (!result.valid)
    return NextResponse.json(
      { ok: false, errors: result.errors, message: "请检查申请资料。" },
      { status: 400 },
    );
  const webhook = getPocWebhook();
  if (!webhook)
    return NextResponse.json(
      {
        ok: false,
        message: "申请接收服务暂未开放，您的资料尚未发送。请稍后再试。",
      },
      { status: 503 },
    );
  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.POC_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.POC_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        source: "skymythos-website",
        receivedAt: new Date().toISOString(),
        lead: result.data,
      }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (!response.ok)
      return NextResponse.json(
        {
          ok: false,
          message: "暂时无法确认接收申请，资料已保留在当前页面。请稍后重试。",
        },
        { status: 502 },
      );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "暂时无法确认接收申请，资料已保留在当前页面。请稍后重试。",
      },
      { status: 502 },
    );
  }
}
