"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Topic {
  id: string;
  name: string;
  category: string;
}

export default function OnboardingPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const { data, error } = await supabase
        .from("hate_topics")
        .select("*")
        .order("category")
        .order("name");

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error("Error loading topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topicId: string) => {
    const newSelected = new Set(selectedTopics);
    if (newSelected.has(topicId)) {
      newSelected.delete(topicId);
    } else {
      if (newSelected.size < 5) {
        newSelected.add(topicId);
      }
    }
    setSelectedTopics(newSelected);
  };

  const handleSubmit = async () => {
    if (selectedTopics.size < 3) {
      alert("Please select at least 3 topics (maximum 5)");
      return;
    }

    try {
      setSubmitting(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      // Insert user topics
      const userTopics = Array.from(selectedTopics).map((topicId) => ({
        user_id: user.id,
        topic_id: topicId,
      }));

      const { error } = await supabase.from("user_topics").insert(userTopics);

      if (error) throw error;

      router.push("/matches");
    } catch (error) {
      console.error("Error submitting topics:", error);
      alert("Failed to save topics. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading topics...</div>
      </div>
    );
  }

  const topicsByCategory = topics.reduce((acc, topic) => {
    if (!acc[topic.category]) {
      acc[topic.category] = [];
    }
    acc[topic.category].push(topic);
    return acc;
  }, {} as Record<string, Topic[]>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Hate Topics</h1>
          <p className="text-gray-400 mb-6">
            Select 3-5 topics you hate. This helps us match you with like-minded haters.
          </p>

          <div className="mb-6">
            <div className="text-white mb-4">
              Selected: {selectedTopics.size} / 5
            </div>
            {selectedTopics.size < 3 && (
              <div className="text-yellow-400 text-sm mb-4">
                Select at least 3 topics to continue
              </div>
            )}
          </div>

          <div className="space-y-6 mb-8">
            {Object.entries(topicsByCategory).map(([category, categoryTopics]) => (
              <div key={category}>
                <h2 className="text-xl font-semibold text-white mb-3 capitalize">
                  {category}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categoryTopics.map((topic) => {
                    const isSelected = selectedTopics.has(topic.id);
                    return (
                      <button
                        key={topic.id}
                        onClick={() => toggleTopic(topic.id)}
                        disabled={!isSelected && selectedTopics.size >= 5}
                        className={`p-3 rounded-lg text-left transition-colors ${
                          isSelected
                            ? "bg-red-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        } ${
                          !isSelected && selectedTopics.size >= 5
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        {topic.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedTopics.size < 3 || submitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
