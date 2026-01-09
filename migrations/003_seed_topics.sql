-- Seed predefined hate topics
INSERT INTO public.hate_topics (name, category) VALUES
  -- School category
  ('Homework', 'school'),
  ('Exams', 'school'),
  ('Group Projects', 'school'),
  ('Early Morning Classes', 'school'),
  ('Group Presentations', 'school'),
  ('Pop Quizzes', 'school'),
  ('Final Exams', 'school'),
  ('Group Assignments', 'school'),
  
  -- People category
  ('Loud Chewers', 'people'),
  ('Slow Walkers', 'people'),
  ('People Who Stand in Doorways', 'people'),
  ('Queue Jumpers', 'people'),
  ('People Who Talk During Movies', 'people'),
  ('Backseat Drivers', 'people'),
  ('One-Uppers', 'people'),
  ('People Who Are Always Late', 'people'),
  
  -- Situations category
  ('Traffic Jams', 'situations'),
  ('Long Lines', 'situations'),
  ('Broken Wi-Fi', 'situations'),
  ('Running Out of Battery', 'situations'),
  ('Forgetting Passwords', 'situations'),
  ('Spilling Coffee', 'situations'),
  ('Missing the Bus', 'situations'),
  ('Rain on Weekends', 'situations')
ON CONFLICT (name) DO NOTHING;
