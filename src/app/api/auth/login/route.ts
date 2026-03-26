import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-Mail und Passwort sind erforderlich" },
        { status: 400 }
      );
    }

    const benutzer = await prisma.user.findUnique({ where: { email } });

    if (!benutzer || !(await bcrypt.compare(password, benutzer.password))) {
      return NextResponse.json(
        { error: "Ungültige E-Mail oder falsches Passwort" },
        { status: 401 }
      );
    }

    const token = await signToken({
      userId: benutzer.id,
      email: benutzer.email,
      role: benutzer.role,
      name: benutzer.name,
    });

    const antwort = NextResponse.json({ ok: true });
    antwort.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return antwort;
  } catch {
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}