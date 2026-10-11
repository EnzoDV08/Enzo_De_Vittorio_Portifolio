import { useId, useRef, useState } from "react";
import { contact } from "~/content/pages";
import { cn } from "~/lib/cn";

const env = import.meta.env;
export const emailjsConfig =
  env.VITE_EMAILJS_SERVICE_ID && env.VITE_EMAILJS_TEMPLATE_ID && env.VITE_EMAILJS_PUBLIC_KEY
    ? {
        serviceId: env.VITE_EMAILJS_SERVICE_ID,
        templateId: env.VITE_EMAILJS_TEMPLATE_ID,
        publicKey: env.VITE_EMAILJS_PUBLIC_KEY,
      }
    : null;

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent" | "failed";

const copy = contact.form;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (!String(data.get("name") ?? "").trim()) errors.name = copy.errors.name;
  if (!EMAIL.test(String(data.get("email") ?? "").trim())) errors.email = copy.errors.email;
  if (String(data.get("message") ?? "").trim().length < 10) errors.message = copy.errors.message;
  return errors;
}

const inputClass =
  "mt-2 block w-full rounded-sm border bg-bg-2 px-4 py-3 text-base text-fg placeholder:text-muted " +
  "transition-colors duration-300 focus:border-fg";

/**
 * EmailJS form. Renders nothing unless all three VITE_EMAILJS_* variables exist — never a
 * broken form. The EmailJS SDK is imported on submit, so it never weighs down the page.
 */
export function ContactForm() {
  const id = useId();
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  if (!emailjsConfig) return null;
  const config = emailjsConfig;

  const fieldProps = (field: Field) => ({
    id: `${id}-${field}`,
    name: field,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined,
    className: cn(inputClass, errors[field] ? "border-accent" : "border-line-strong"),
    // After the first submit, re-check as people fix things.
    onBlur: () => {
      if (submitted && form.current) setErrors(validate(new FormData(form.current)));
    },
  });

  const error = (field: Field) =>
    errors[field] && (
      <p id={`${id}-${field}-error`} className="mt-2 text-sm text-accent">
        {errors[field]}
      </p>
    );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitted(true);
    // Bots fill the hidden field; pretend it worked and send nothing.
    if (String(data.get("company") ?? "")) {
      setStatus("sent");
      return;
    }
    const found = validate(data);
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const { default: emailjs } = await import("@emailjs/browser");
      await emailjs.send(
        config.serviceId,
        config.templateId,
        {
          from_name: String(data.get("name")).trim(),
          reply_to: String(data.get("email")).trim(),
          topic: String(data.get("topic")),
          message: String(data.get("message")).trim(),
        },
        { publicKey: config.publicKey },
      );
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <p role="status" className="max-w-[24ch] display text-2xl">
        {copy.success}
      </p>
    );
  }

  const statusText = status === "sending" ? copy.sending : status === "failed" ? copy.failure : "";

  return (
    <form ref={form} noValidate onSubmit={onSubmit} className="relative grid gap-6 sm:grid-cols-2">
      <div>
        <label htmlFor={`${id}-name`} className="meta text-muted">
          {copy.name}
        </label>
        <input {...fieldProps("name")} type="text" autoComplete="name" required />
        {error("name")}
      </div>
      <div>
        <label htmlFor={`${id}-email`} className="meta text-muted">
          {copy.email}
        </label>
        <input
          {...fieldProps("email")}
          type="email"
          autoComplete="email"
          inputMode="email"
          required
        />
        {error("email")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-topic`} className="meta text-muted">
          {copy.topic}
        </label>
        <select
          id={`${id}-topic`}
          name="topic"
          className={cn(inputClass, "border-line-strong")}
          defaultValue={copy.topics[0]}
        >
          {copy.topics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-message`} className="meta text-muted">
          {copy.message}
        </label>
        <textarea {...fieldProps("message")} rows={6} required data-lenis-prevent />
        {error("message")}
      </div>
      {/* Honeypot: off-screen, unfocusable, hidden from assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>{copy.honeypot}</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-11 items-center rounded-sm bg-accent px-6 meta text-accent-fg transition-colors duration-300 hover:bg-fg disabled:opacity-60"
        >
          {status === "sending" ? copy.sending : copy.submit}
        </button>
        <p
          role="status"
          className={cn("text-sm", status === "failed" ? "text-accent" : "text-muted")}
        >
          {statusText}
        </p>
      </div>
    </form>
  );
}
