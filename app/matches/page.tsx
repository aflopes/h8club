"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { findPotentialMatches, createMatch, PotentialMatch } from "@/lib/matching";
import Link from "next/link";

interface ExistingMatch {
  id: string;
  other_user: {
    id: string;
    display_name: string;
  };
}

export default function MatchesPage() {
  const [potentialMatches, setPotentialMatches] = useState<PotentialMatch[]>([]);
  const [existingMatches, setExistingMatches] = useState<ExistingMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingMatch, setCreatingMatch] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      // Load existing matches
      const { data: matches, error: matchesError } = await supabase
        .from("matches")
        .select("id, user1_id, user2_id")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (matchesError) throw matchesError;

      // Load user details for matches
      const formattedMatches: ExistingMatch[] = await Promise.all(
        (matches || []).map(async (match: any) => {
          const otherUserId =
            match.user1_id === user.id ? match.user2_id : match.user1_id;
          
          const { data: otherUser } = await supabase
            .from("users")
            .select("id, display_name")
            .eq("id", otherUserId)
            .single();

          return {
            id: match.id,
            other_user: {
              id: otherUser?.id || otherUserId,
              display_name: otherUser?.display_name || "Unknown",
            },
          };
        })
      );

      setExistingMatches(formattedMatches);

      // Load potential matches
      const potentials = await findPotentialMatches(supabase, user.id);
      setPotentialMatches(potentials);
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = async (otherUserId: string) => {
    try {
      setCreatingMatch(otherUserId);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const matchId = await createMatch(supabase, user.id, otherUserId);

      if (matchId) {
        router.push(`/chat/${matchId}`);
      } else {
        alert("Failed to create match. Please try again.");
      }
    } catch (error) {
      console.error("Error creating match:", error);
      alert("Failed to create match. Please try again.");
    } finally {
      setCreatingMatch(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-white">Loading matches...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Matches</h1>
          <div className="flex gap-4">
            <Link
              href="/feed"
              className="text-white hover:text-red-400 transition-colors"
            >
              Feed
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/auth");
              }}
              className="text-white hover:text-red-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Existing Matches */}
        {existingMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Your Matches</h2>
            <div className="space-y-3">
              {existingMatches.map((match) => (
                <Link
                  key={match.id}
                  href={`/chat/${match.id}`}
                  className="block bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                >
                  <div className="text-white font-semibold">
                    {match.other_user.display_name}
                  </div>
                  <div className="text-gray-400 text-sm">Click to chat</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Potential Matches */}
        {potentialMatches.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Potential Matches
            </h2>
            <div className="space-y-3">
              {potentialMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-gray-800 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-white font-semibold text-lg">
                        {match.display_name}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {match.shared_topic_count} shared topics
                      </div>
                    </div>
                    <button
                      onClick={() => handleCreateMatch(match.id)}
                      disabled={creatingMatch === match.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {creatingMatch === match.id ? "Creating..." : "Match"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {match.shared_topics.slice(0, 5).map((topic, idx) => (
                      <span
                        key={idx}
                        className="bg-red-900 text-red-200 text-xs px-2 py-1 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                    {match.shared_topics.length > 5 && (
                      <span className="text-gray-400 text-xs">
                        +{match.shared_topics.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {existingMatches.length === 0 && potentialMatches.length === 0 && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">
              No matches found. Check back later for potential matches!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
