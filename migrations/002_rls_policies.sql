-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hate_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Users policies
-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can read matched users' data
CREATE POLICY "Users can read matched users"
  ON public.users FOR SELECT
  USING (
    id IN (
      SELECT user1_id FROM public.matches WHERE user2_id = auth.uid()
      UNION
      SELECT user2_id FROM public.matches WHERE user1_id = auth.uid()
    )
  );

-- Users can insert their own record
CREATE POLICY "Users can insert own record"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own record
CREATE POLICY "Users can update own record"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Hate Topics policies
-- Public read access to topics
CREATE POLICY "Topics are publicly readable"
  ON public.hate_topics FOR SELECT
  TO authenticated
  USING (true);

-- User Topics policies
-- Users can read their own topics
CREATE POLICY "Users can read own topics"
  ON public.user_topics FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own topics
CREATE POLICY "Users can insert own topics"
  ON public.user_topics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own topics
CREATE POLICY "Users can delete own topics"
  ON public.user_topics FOR DELETE
  USING (auth.uid() = user_id);

-- Matches policies
-- Users can read matches they are part of
CREATE POLICY "Users can read own matches"
  ON public.matches FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Users can create matches (system will handle this)
CREATE POLICY "Users can create matches"
  ON public.matches FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages policies
-- Users can read messages from matches they are part of
CREATE POLICY "Users can read match messages"
  ON public.messages FOR SELECT
  USING (
    match_id IN (
      SELECT id FROM public.matches
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

-- Users can send messages in their matches
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    match_id IN (
      SELECT id FROM public.matches
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

-- Posts policies
-- Public read access to posts
CREATE POLICY "Posts are publicly readable"
  ON public.posts FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can create posts
CREATE POLICY "Users can create posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);
