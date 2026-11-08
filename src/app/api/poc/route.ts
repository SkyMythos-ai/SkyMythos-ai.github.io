import { NextResponse } from "next/server";
import { validatePoc } from "@/lib/poc";
import type { Locale } from "@/lib/i18n";
import { getPocWebhook } from "@/lib/poc-server";

export async function POST(request: Request) {
  const locale: Locale = request.headers.get("accept-language")?.toLowerCase().startsWith("en") ? "en" : "zh";
  const text = (zh: string, en: string) => locale === "zh" ? zh : en;
  let value: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 16000)
      return NextResponse.json(
        { ok: false, message: text("申请内容过长，请精简后重试。", "Your request is too long. Shorten it and try again.") },
        { status: 413 },
      );
    value = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { ok: false, message: text("申请内容格式有误，请重新提交。", "The request format is invalid. Please submit it again.") },
      { status: 400 },
    );
  }
  const result = validatePoc(value, locale);
  if (!result.valid)
    return NextResponse.json(
      { ok: false, errors: result.errors, message: text("请检查申请资料。", "Please check your request details.") },
      { status: 400 },
    );
  const webhook = getPocWebhook();
  if (!webhook)
    return NextResponse.json(
      {
        ok: false,
        message: text("申请接收服务暂未开放，您的资料尚未发送。请稍后再试。", "The receiving service is not available yet. Your details have not been sent. Please try again later."),
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
          message: text("暂时无法确认接收申请，资料已保留在当前页面。请稍后重试。", "Receipt could not be confirmed. Your details remain on this page. Please try again later."),
        },
        { status: 502 },
      );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: text("暂时无法确认接收申请，资料已保留在当前页面。请稍后重试。", "Receipt could not be confirmed. Your details remain on this page. Please try again later."),
      },
      { status: 502 },
    );
  }
}
