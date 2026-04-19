-- Row Level Security policies (browser/anon key). Service role bypasses RLS.

-- Topics & languages: public read
CREATE POLICY "topics_select_all"
  ON public.topics FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "coding_languages_select_all"
  ON public.coding_languages FOR SELECT
  TO anon, authenticated
  USING (true);

-- Questions: published only (for direct PostgREST; backend uses service role too)
CREATE POLICY "questions_select_published"
  ON public.questions FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Test cases: never expose hidden rows to clients
CREATE POLICY "test_cases_select_public"
  ON public.test_cases FOR SELECT
  TO anon, authenticated
  USING (NOT is_hidden);

-- Profiles: public read for leaderboard / profile pages; users update own
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Submissions
CREATE POLICY "submissions_select_own"
  ON public.submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "submissions_insert_own"
  ON public.submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Submission results (via own submissions)
CREATE POLICY "submission_results_select_own"
  ON public.submission_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.submissions s
      WHERE s.id = submission_results.submission_id
        AND s.user_id = auth.uid()
    )
  );

-- Daily activity, streaks, bookmarks, achievements, topic interests
CREATE POLICY "daily_activity_own"
  ON public.daily_activity FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "streaks_own"
  ON public.streaks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "streaks_update_own"
  ON public.streaks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookmarks_own"
  ON public.bookmarks FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "achievements_own"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_topic_interests_own"
  ON public.user_topic_interests FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Leaderboard: public read
CREATE POLICY "leaderboard_select_all"
  ON public.leaderboard FOR SELECT
  TO anon, authenticated
  USING (true);

-- Tutor
CREATE POLICY "tutor_sessions_own"
  ON public.tutor_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tutor_messages_own"
  ON public.tutor_messages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tutor_sessions ts
      WHERE ts.id = tutor_messages.session_id
        AND ts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tutor_sessions ts
      WHERE ts.id = tutor_messages.session_id
        AND ts.user_id = auth.uid()
    )
  );

-- Reports
CREATE POLICY "reported_questions_insert_own"
  ON public.reported_questions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reported_questions_select_own"
  ON public.reported_questions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
