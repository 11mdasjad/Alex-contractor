import Link from "next/link";
export default function NotFound() {
  return (
    <section className="error-page">
      <span>404</span>
      <h1>A different path forward.</h1>
      <p>The page you’re looking for could not be found.</p>
      <div className="error-actions">
        <Link href="/" className="button">
          Back to Home
        </Link>
        <Link href="/services" className="button outline">
          Explore Services
        </Link>
        <Link href="/contact" className="button outline">
          Contact Us
        </Link>
      </div>
    </section>
  );
}
