"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateDisplayName } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAnonymousSignIn = async () => {
    try {
      setLoading(true);

      // Sign in anonymously
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously();

      if (authError) throw authError;
      if (!authData.user) throw new Error("No user returned");

      // Check if user already exists in our users table
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", authData.user.id)
        .single();

      if (!existingUser) {
        // Create user record with auto-generated display name
        const displayName = generateDisplayName();
        const { error: userError } = await supabase
          .from("users")
          .insert({
            id: authData.user.id,
            display_name: displayName,
          });

        if (userError) throw userError;
      }

      // Check if user has completed onboarding
      const { data: userTopics } = await supabase
        .from("user_topics")
        .select("topic_id")
        .eq("user_id", authData.user.id);

      if (!userTopics || userTopics.length === 0) {
        router.push("/onboarding");
      } else {
        router.push("/matches");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-2 text-white">H8CLUB</h1>
          <p className="text-center text-gray-400 mb-8">
            Connect over shared hate topics
          </p>

          <button
            onClick={handleAnonymousSignIn}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Enter Anonymously"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            No email or password required. Just click and go.
          </p>
        </div>
      </div>
    </div>
  );
}
