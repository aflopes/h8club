import { SupabaseClient } from "@supabase/supabase-js";

export interface PotentialMatch {
  id: string;
  display_name: string;
  shared_topics: string[];
  shared_topic_count: number;
}

export async function findPotentialMatches(
  supabase: SupabaseClient,
  userId: string
): Promise<PotentialMatch[]> {
  // Get user's topics
  const { data: userTopics, error: topicsError } = await supabase
    .from("user_topics")
    .select("topic_id")
    .eq("user_id", userId);

  if (topicsError || !userTopics || userTopics.length === 0) {
    return [];
  }

  const userTopicIds = userTopics.map((ut) => ut.topic_id);

  // Get existing matches to exclude
  const { data: existingMatches } = await supabase
    .from("matches")
    .select("user1_id, user2_id")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

  const excludedUserIds = new Set<string>();
  excludedUserIds.add(userId);
  existingMatches?.forEach((match) => {
    excludedUserIds.add(match.user1_id);
    excludedUserIds.add(match.user2_id);
  });

  // Find users with shared topics (at least 2)
  const { data: otherUserTopics, error: otherTopicsError } = await supabase
    .from("user_topics")
    .select("user_id, topic_id, hate_topics!inner(name)")
    .in("topic_id", userTopicIds)
    .neq("user_id", userId);

  if (otherTopicsError || !otherUserTopics) {
    return [];
  }

  // Group by user and count shared topics
  const userSharedTopics = new Map<string, string[]>();
  otherUserTopics.forEach((ut: any) => {
    if (!excludedUserIds.has(ut.user_id)) {
      if (!userSharedTopics.has(ut.user_id)) {
        userSharedTopics.set(ut.user_id, []);
      }
      userSharedTopics.get(ut.user_id)!.push(ut.hate_topics.name);
    }
  });

  // Filter users with at least 2 shared topics
  const potentialMatches: PotentialMatch[] = [];
  for (const [otherUserId, sharedTopics] of userSharedTopics.entries()) {
    if (sharedTopics.length >= 2) {
      // Get user display name
      const { data: user } = await supabase
        .from("users")
        .select("display_name")
        .eq("id", otherUserId)
        .single();

      if (user) {
        potentialMatches.push({
          id: otherUserId,
          display_name: user.display_name,
          shared_topics: [...new Set(sharedTopics)],
          shared_topic_count: sharedTopics.length,
        });
      }
    }
  }

  // Sort by number of shared topics (descending)
  return potentialMatches.sort((a, b) => b.shared_topic_count - a.shared_topic_count);
}

export async function createMatch(
  supabase: SupabaseClient,
  user1Id: string,
  user2Id: string
): Promise<string | null> {
  // Ensure consistent ordering (user1_id < user2_id)
  const [user1, user2] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];

  const { data, error } = await supabase
    .from("matches")
    .insert({
      user1_id: user1,
      user2_id: user2,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating match:", error);
    return null;
  }

  return data.id;
}
