import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <h1 className="font-serif text-4xl text-ink-900">Sign in</h1>
      <p className="mt-2 text-sm text-ink-900/65">
        Use a seeded demo account to open the matching workspace.
      </p>
      <div className="mt-8">
        <SignInForm />
      </div>
      <p className="mt-6 text-sm text-ink-900/60">
        New here?{" "}
        <Link href="/register" className="font-medium text-teal-800 hover:underline">
          Register
        </Link>
      </p>
    </main>
  );
}
