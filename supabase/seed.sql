-- Run after migrations (Supabase SQL editor: paste & run, or `supabase db reset` with seed path configured).
-- Uses fixed UUIDs for stable references.

INSERT INTO public.topics (id, name, slug, icon, description, display_order) VALUES
  ('b1000001-0000-4000-8000-000000000001', 'Arrays', 'arrays', 'Layers', 'Array techniques', 1),
  ('b1000001-0000-4000-8000-000000000002', 'Strings', 'strings', 'Type', 'String problems', 2),
  ('b1000001-0000-4000-8000-000000000003', 'Linked Lists', 'linked-lists', 'List', 'Pointer manipulation', 3),
  ('b1000001-0000-4000-8000-000000000004', 'Stacks & Queues', 'stacks-queues', 'Boxes', 'LIFO & FIFO', 4),
  ('b1000001-0000-4000-8000-000000000005', 'Trees', 'trees', 'GitBranch', 'Trees & graphs intro', 5),
  ('b1000001-0000-4000-8000-000000000006', 'Graphs', 'graphs', 'Share2', 'Traversal & paths', 6),
  ('b1000001-0000-4000-8000-000000000007', 'Dynamic Programming', 'dynamic-programming', 'Cpu', 'Optimal substructure', 7),
  ('b1000001-0000-4000-8000-000000000008', 'Hashing', 'hashing', 'Hash', 'Hash maps & sets', 8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.coding_languages (id, name, slug, version, docker_image, compile_command, run_command, template_code, file_extension) VALUES
  ('c2000001-0000-4000-8000-000000000001', 'Python', 'python', '3.11', 'codeverse/python:3.11', NULL, 'python main.py', E'def solve():\n    pass\n\nif __name__ == ''__main__'':\n    solve()\n', 'py'),
  ('c2000001-0000-4000-8000-000000000002', 'JavaScript', 'javascript', 'Node 20', 'codeverse/node:20', NULL, 'node main.js', E'function solve() {\n}\n\nsolve();\n', 'js'),
  ('c2000001-0000-4000-8000-000000000003', 'C++', 'cpp', 'g++ 13', 'codeverse/cpp:13', 'g++ -std=c++20 -O2 -o main main.cpp', './main', E'#include <iostream>\nusing namespace std;\n\nint main() {\n  return 0;\n}\n', 'cpp'),
  ('c2000001-0000-4000-8000-000000000004', 'Java', 'java', '21', 'codeverse/java:21', 'javac Main.java', 'java Main', E'public class Main {\n  public static void main(String[] args) {\n  }\n}\n', 'java'),
  ('c2000001-0000-4000-8000-000000000005', 'Go', 'go', '1.22', 'codeverse/go:1.22', NULL, 'go run .', E'package main\n\nimport "fmt"\n\nfunc main() {\n}\n', 'go'),
  ('c2000001-0000-4000-8000-000000000006', 'C', 'c', 'gcc 13', 'codeverse/c:13', 'gcc -O2 -o main main.c', './main', E'#include <stdio.h>\n\nint main(void) {\n  return 0;\n}\n', 'c')
ON CONFLICT (id) DO NOTHING;

-- Questions (published)
INSERT INTO public.questions (id, title, slug, description, difficulty, topic_id, company_tags, constraints, input_format, output_format, sample_input, sample_output, editorial, is_premium, is_published) VALUES
(
  'd3000001-0000-4000-8000-000000000001',
  'Two Sum',
  'two-sum',
  E'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume exactly one solution exists.',
  'easy',
  'b1000001-0000-4000-8000-000000000001',
  ARRAY['Google','Amazon'],
  E'2 <= nums.length <= 10^4',
  E'First line: n, then n integers, then target.',
  E'Two indices i j (space-separated).',
  E'4\n2 7 11 15\n9',
  E'0 1',
  E'Use a hash map from value to index.',
  false,
  true
),
(
  'd3000001-0000-4000-8000-000000000002',
  'Valid Parentheses',
  'valid-parentheses',
  E'Determine if a string of brackets is valid.',
  'easy',
  'b1000001-0000-4000-8000-000000000004',
  ARRAY['Bloomberg'],
  E'1 <= s.length <= 10^4',
  E'One line string s.',
  E'true or false',
  E'()[]{}',
  E'true',
  E'Use a stack.',
  false,
  true
),
(
  'd3000001-0000-4000-8000-000000000003',
  'Binary Search',
  'binary-search',
  E'Given sorted distinct integers and a target, return index or -1.',
  'easy',
  'b1000001-0000-4000-8000-000000000001',
  ARRAY['Meta'],
  E'1 <= nums.length <= 10^4',
  E'Sorted array and target.',
  E'Integer index',
  E'5\n-1 0 3 5 9\n9',
  E'4',
  E'Classic binary search.',
  false,
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.test_cases (question_id, input, expected_output, is_hidden, weight, display_order) VALUES
  ('d3000001-0000-4000-8000-000000000001', E'4\n2 7 11 15\n9', E'0 1', false, 1, 1),
  ('d3000001-0000-4000-8000-000000000001', E'3\n3 2 4\n6', E'1 2', true, 1, 2),
  ('d3000001-0000-4000-8000-000000000001', E'2\n3 3\n6', E'0 1', true, 1, 3),
  ('d3000001-0000-4000-8000-000000000002', E'()[]{}', E'true', false, 1, 1),
  ('d3000001-0000-4000-8000-000000000002', E'([)]', E'false', true, 1, 2),
  ('d3000001-0000-4000-8000-000000000003', E'5\n-1 0 3 5 9\n9', E'4', false, 1, 1),
  ('d3000001-0000-4000-8000-000000000003', E'5\n-1 0 3 5 9\n2', E'1', true, 1, 2);
