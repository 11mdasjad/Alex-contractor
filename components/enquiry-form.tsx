"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, UploadCloud, CheckCircle2 } from "lucide-react";
import { services } from "@/lib/content";
type Data = Record<string, string>;
const labels = [
  "Client details",
  "Project details",
  "Requirements",
  "Budget & timeline",
  "Attachments",
  "Review",
];
export function EnquiryForm({
  kind = "contact",
  job,
}: {
  kind?: "contact" | "quote" | "application";
  job?: string;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    location: "",
    description: "",
    budget: "",
    timeline: "",
    job: job || "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");
  const [consent, setConsent] = useState(false);
  const quote = kind === "quote";
  const application = kind === "application";
  function update(name: string, value: string) {
    setData((d) => ({ ...d, [name]: value }));
  }
  function field(
    name: string,
    label: string,
    required = false,
    type = "text",
    full = false,
  ) {
    return (
      <label className={"field " + (full ? "full" : "")} key={name}>
        {label}{" "}
        {required && (
          <span className="required" aria-hidden="true">
            *
          </span>
        )}
        {type === "textarea" ? (
          <textarea
            required={required}
            name={name}
            value={data[name] || ""}
            maxLength={6000}
            onChange={(e) => update(name, e.target.value)}
          />
        ) : (
          <input
            name={name}
            required={required}
            type={type}
            autoComplete={
              name === "name"
                ? "name"
                : name === "email"
                  ? "email"
                  : name === "phone"
                    ? "tel"
                    : name === "company"
                      ? "organization"
                      : "off"
            }
            pattern={type === "tel" ? "[+0-9() .-]{7,25}" : undefined}
            maxLength={name === "description" ? 6000 : 200}
            value={data[name] || ""}
            onChange={(e) => update(name, e.target.value)}
          />
        )}
      </label>
    );
  }
  function select(
    name: string,
    label: string,
    options: string[],
    required = false,
  ) {
    return (
      <label className="field">
        {label}
        {required && (
          <span className="required" aria-hidden="true">
            *
          </span>
        )}
        <select
          name={name}
          required={required}
          value={data[name] || ""}
          onChange={(e) => update(name, e.target.value)}
        >
          <option value="">Select an option</option>
          {options.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
    );
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (quote && step < 5) {
      setStep(step + 1);
      return;
    }
    if (!consent) {
      setError("Please confirm your consent before submitting.");
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => form.set(k, v));
      form.set("kind", kind);
      form.set("consent", "true");
      const trap = new FormData(e.currentTarget).get("website");
      form.set("website", String(trap || ""));
      files.forEach((f) => form.append("files", f));
      const res = await fetch("/api/enquiries", { method: "POST", body: form });
      if (!res.headers.get("content-type")?.includes("application/json"))
        throw new Error(
          res.status === 413
            ? "The upload exceeds the server limit. Please use smaller files."
            : "The enquiry service is unavailable. Please try again.",
        );
      const result = (await res.json()) as { error?: string; id: string };
      if (!res.ok)
        throw new Error(
          result.error || "Your enquiry could not be saved. Please try again.",
        );
      setSuccess(result.id);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Submission unavailable. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  function upload() {
    return (
      <div className="upload-zone">
        <UploadCloud size={32} />
        <h3>
          {application ? "Attach your resume" : "Add context to your project"}
        </h3>
        <p>
          {application
            ? "One PDF resume, up to 5 MB."
            : "Up to 3 PDF, JPEG or PNG files. Maximum 5 MB per file."}
        </p>
        <label className="field">
          {application ? "Resume" : "Drawings, documents or images"}
          <input
            type="file"
            accept={application ? ".pdf" : ".pdf,.jpg,.jpeg,.png"}
            multiple={!application}
            onChange={(e) => {
              const selected = Array.from(e.target.files || []);
              if (
                selected.length > (application ? 1 : 3) ||
                selected.some(
                  (f) =>
                    f.size > 5 * 1024 * 1024 ||
                    !(
                      application
                        ? ["application/pdf"]
                        : ["application/pdf", "image/jpeg", "image/png"]
                    ).includes(f.type),
                )
              ) {
                setError(
                  "Choose supported files within the size and count limits.",
                );
                e.target.value = "";
                setFiles([]);
                return;
              }
              setError("");
              setFiles(selected);
            }}
          />
        </label>
        {files.map((f) => (
          <p key={f.name}>
            {f.name} · {(f.size / 1024).toFixed(0)} KB
          </p>
        ))}
        <p>
          Files are stored privately. Only authorized staff can access them.
        </p>
      </div>
    );
  }
  if (success)
    return (
      <div className="form-panel empty-state" role="status">
        <CheckCircle2 size={45} />
        <h2>
          {application
            ? "Application saved"
            : "Thank you for getting in touch."}
        </h2>
        <p>
          Your {application ? "application" : "enquiry"} has been securely saved
          for review. This confirms receipt, not an agreed project or
          appointment.
        </p>
        <p>
          Reference: <strong>{success}</strong>
        </p>
        <Link href="/" className="button">
          Back to Home <ArrowRight size={16} />
        </Link>
      </div>
    );
  return (
    <div className={quote ? "quote-wrap" : ""}>
      {quote && (
        <div className="quote-progress" aria-label="Quote form progress">
          {labels.map((l, i) => (
            <div
              className={
                "quote-step " +
                (i === step ? "current" : i < step ? "done" : "")
              }
              aria-current={i === step ? "step" : undefined}
              key={l}
            >
              <span>{i + 1}</span>
              {l}
            </div>
          ))}
        </div>
      )}
      <form className="form-panel" onSubmit={submit}>
        {quote ? (
          <div className="quote-title">
            <h2>{labels[step]}</h2>
            <span>Step {step + 1} of 6</span>
          </div>
        ) : (
          <h2>
            {application ? "Apply for " + job : "Tell us about your project"}
          </h2>
        )}
        <div className="honeypot" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        {(!quote || step === 0) && (
          <div className="form-grid">
            {field("name", "Full name", true)}
            {field("email", "Email address", true, "email")}
            {field("phone", "Phone number", true, "tel")}
            {field("company", "Company (optional)")}
          </div>
        )}
        {((!quote && !application) || (quote && step === 1)) && (
          <div
            className="form-grid"
            style={!quote ? { marginTop: 19 } : undefined}
          >
            {select(
              "service",
              "Project type",
              services.map((x) => x.title),
              true,
            )}
            {field("location", "Project location", true)}
          </div>
        )}
        {(!quote || step === 2) && (
          <div
            className="form-grid"
            style={!quote ? { marginTop: 19 } : undefined}
          >
            {field(
              "description",
              application
                ? "Your experience and motivation"
                : "Project scope and requirements",
              true,
              "textarea",
              true,
            )}
          </div>
        )}
        {((!quote && !application) || (quote && step === 3)) && (
          <div
            className="form-grid"
            style={!quote ? { marginTop: 19 } : undefined}
          >
            {select(
              "budget",
              "Estimated budget",
              [
                "To be discussed",
                "Below ₹25 lakh",
                "₹25 lakh – ₹1 crore",
                "₹1 crore – ₹5 crore",
                "Above ₹5 crore",
              ],
              quote,
            )}
            {select(
              "timeline",
              "Preferred start",
              [
                "Exploring options",
                "Within 3 months",
                "3–6 months",
                "6–12 months",
                "More than 12 months",
              ],
              quote,
            )}
          </div>
        )}
        {((quote && step === 4) || application) && (
          <div style={{ marginTop: application ? 20 : 0 }}>{upload()}</div>
        )}
        {quote && step === 5 && (
          <>
            <p>Please review your information before sending.</p>
            <dl className="review-grid">
              {Object.entries(data)
                .filter(([k, v]) => v && k !== "job")
                .map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              <div>
                <dt>Attachments</dt>
                <dd>
                  {files.length ? files.map((f) => f.name).join(", ") : "None"}
                </dd>
              </div>
            </dl>
          </>
        )}
        {(!quote || step === 5) && (
          <label className="consent">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              I agree that the information provided may be used to respond to
              this {application ? "application" : "enquiry"}. I have read the{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </span>
          </label>
        )}
        {error && (
          <div className="form-message" role="alert">
            {error}
          </div>
        )}
        <div className="form-actions">
          {quote && step > 0 ? (
            <button
              type="button"
              className="button outline"
              onClick={() => {
                setError("");
                setStep(step - 1);
              }}
              disabled={busy}
            >
              <ArrowLeft size={15} />
              Previous
            </button>
          ) : (
            <span />
          )}
          <button className="button" type="submit" disabled={busy}>
            {busy
              ? "Saving…"
              : quote && step < 5
                ? "Next Step"
                : application
                  ? "Submit Application"
                  : "Send Enquiry"}
            <ArrowRight size={16} />
          </button>
        </div>
        {!quote && (
          <p className="fine-print">
            Fields marked * are required. Project scope and service availability
            are subject to confirmation.
          </p>
        )}
      </form>
    </div>
  );
}
