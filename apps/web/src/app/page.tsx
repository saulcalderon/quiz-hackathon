import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Force dynamic rendering to avoid build-time Supabase calls
export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    } else {
      redirect("/login");
    }
  } catch {
    // If Supabase is not configured, redirect to login
    redirect("/login");
  }
}
