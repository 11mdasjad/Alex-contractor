"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="error-page">
      <h1>Something interrupted the view.</h1>
      <p>Please try again in a moment.</p>
      <div>
        <button onClick={reset} className="button">
          Try again
        </button>
      </div>
    </section>
  );
}
