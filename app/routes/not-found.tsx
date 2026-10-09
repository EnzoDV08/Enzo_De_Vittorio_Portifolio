import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { notFound } from "~/content/pages";

export function meta() {
  return [
    { title: notFound.meta.title },
    { name: "description", content: notFound.meta.description },
    { name: "robots", content: "noindex" },
  ];
}

export default function NotFound() {
  return (
    <Container className="flex min-h-[85svh] flex-col justify-end pt-32 pb-16">
      <p className="meta text-muted">404</p>
      <h1 className="mt-6 display text-display">
        {notFound.heading} <span className="serif-accent text-accent">{notFound.accent}</span>
      </h1>
      <p className="mt-8 max-w-prose text-lg text-muted">{notFound.copy}</p>
      <div className="mt-10">
        <Button to="/" icon={<ArrowLeft />}>
          {notFound.home}
        </Button>
      </div>
    </Container>
  );
}
