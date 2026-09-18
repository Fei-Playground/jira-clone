import type { ActionFunction } from "react-router";
import { data as json, redirect } from "react-router";
import { Locale } from "@app/locales";
import { getLocaleSession } from "@app/session-storage/locale-storage.server";

export const loader = () => redirect("/", { status: 404 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const locale = form.get("locale") as Locale;
  const localeSession = await getLocaleSession(request);
  localeSession.setLocale(locale);

  return json(
    { success: true },
    {
      headers: { "Set-Cookie": await localeSession.commit() },
    }
  );
};

export default function SetLocaleAction() {
  return <div>Oops... You should not see this.</div>;
}
