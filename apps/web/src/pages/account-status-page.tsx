import { Link } from "react-router-dom";
import { useAuth } from "@/auth/auth-context";
import { Button } from "@/components/ui/button";

export function AccountStatusPage({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const { user, logout } = useAuth();
  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-serif text-4xl text-ink">{title}</h1>
      <p className="mt-3 text-sm text-ink/65">
        {user ? `${user.name}: ` : ""}
        {body}
      </p>
      <Button type="button" variant="outline" className="mt-8" onClick={logout}>
        Sign out
      </Button>
      <p className="mt-4 text-sm">
        <Link to="/" className="text-teal-800 hover:underline">
          Return home
        </Link>
      </p>
    </main>
  );
}
