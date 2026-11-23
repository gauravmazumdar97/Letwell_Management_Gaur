import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-ink/45">Registration</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">Under maintenance</h1>
      <p className="mt-3 text-sm text-ink/65">
        New account registration is temporarily unavailable. Please sign in with an existing demo
        account, or check back later.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/sign-in">
          <Button>Go to sign in</Button>
        </Link>
        <Link to="/">
          <Button variant="outline">Back home</Button>
        </Link>
      </div>
    </main>
  );
}
