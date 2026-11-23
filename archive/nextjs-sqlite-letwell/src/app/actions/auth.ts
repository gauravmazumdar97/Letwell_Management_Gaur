"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";
import { dashboardPathForRole } from "@/lib/session";
import { prisma } from "@/lib/db";
import type { Role } from "@prisma/client";

export type SignInState = {
  error?: string;
};

export async function signInAction(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Those details do not match our records." };
    }
    throw error;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Those details do not match our records." };
  }

  if (user.status === "PENDING") {
    redirect("/account/pending");
  }
  if (user.status === "REJECTED") {
    redirect("/account/rejected");
  }
  if (user.status === "SUSPENDED") {
    redirect("/account/suspended");
  }

  redirect(dashboardPathForRole(user.role as Role));
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
