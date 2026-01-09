"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Post {
  id: string;
  user_id: string;
  topic_id: string;
  content: string;
  created_at: string;
  users: {
    display_name: string;
  };
  hate_topics: {
    name: string;
    category: string;
  };
}

interface Topic {
  id: string;
  name: string;
  category: string;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTopic, setNewPostTopic] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadTopics();
    loadPosts();
  }, [selectedTopic]);

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
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (selectedTopic) {
        query = query.eq("topic_id", selectedTopic);
      }

      const { data: postsData, error } = await query;

      if (error) throw error;

      // Fetch user and topic details for each post
      const postsWithDetails = await Promise.all(
        (postsData || []).map(async (post) => {
          const [userResult, topicResult] = await Promise.all([
            supabase.from("users").select("display_name").eq("id", post.user_id).single(),
            supabase.from("hate_topics").select("name, category").eq("id", post.topic_id).single(),
          ]);

          return {
            ...post,
            users: { display_name: userResult.data?.display_name || "Unknown" },
            hate_topics: {
              name: topicResult.data?.name || "Unknown",
              category: topicResult.data?.category || "unknown",
            },
          };
        })
      );

      setPosts(postsWithDetails);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !newPostTopic || submitting) return;

    try {
      setSubmitting(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        topic_id: newPostTopic,
        content: newPostContent.trim(),
      });

      if (error) throw error;

      setNewPostContent("");
      setNewPostTopic("");
      loadPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Public Feed</h1>
          <div className="flex gap-4">
            <Link
              href="/matches"
              className="text-white hover:text-red-400 transition-colors"
            >
              Matches
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

        {/* Topic Filter */}
        <div className="mb-6">
          <select
            value={selectedTopic || ""}
            onChange={(e) => setSelectedTopic(e.target.value || null)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="">All Topics</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name} ({topic.category})
              </option>
            ))}
          </select>
        </div>

        {/* Create Post Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Create Post</h2>
          <form onSubmit={handleSubmitPost}>
            <div className="mb-4">
              <select
                value={newPostTopic}
                onChange={(e) => setNewPostTopic(e.target.value)}
                required
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 mb-3"
              >
                <option value="">Select a topic</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name} ({topic.category})
                  </option>
                ))}
              </select>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What do you hate about this topic?"
                required
                rows={4}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <button
              type="submit"
              disabled={!newPostContent.trim() || !newPostTopic || submitting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </form>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="text-white text-center py-8">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No posts yet. Be the first to post!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-white font-semibold">
                      {post.users.display_name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {new Date(post.created_at).toLocaleString()}
                    </div>
                  </div>
                  <span className="bg-red-900 text-red-200 text-xs px-2 py-1 rounded">
                    {post.hate_topics.name}
                  </span>
                </div>
                <p className="text-gray-200 mt-3 whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
