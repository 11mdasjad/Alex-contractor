import { isAdmin } from "@/lib/server";
import { getChatGPTUser, chatGPTSignInPath } from "@/app/chatgpt-auth";
import { Admin } from "@/components/admin";
import { PageHero } from "@/components/site";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};
export default async function AdminPage() {
  const admin = await isAdmin();
  if (!admin) {
    const user = await getChatGPTUser();
    return (
      <>
        <PageHero title="Administration" />
        <section className="section container">
          <div className="empty-state">
            <h2>Authorized staff access</h2>
            <p>
              {user
                ? "Your account is not on the administrator allowlist. Ask the site owner to authorize your account."
                : "Sign in with an authorized account to manage website content and enquiries."}
            </p>
            {!user && (
              <a
                className="button"
                href={chatGPTSignInPath("/admin")}
                target="_top"
              >
                Sign in with ChatGPT
              </a>
            )}
          </div>
        </section>
      </>
    );
  }
  return (
    <>
      <PageHero
        title="Website Administration"
        description="Manage published content, enquiries and applications."
      />
      <Admin />
    </>
  );
}
