USE tasks_today_db;

-- Reset only this application's sample records so the seed remains repeatable.
DELETE FROM tasks;
DELETE FROM users;
ALTER TABLE tasks AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;

-- Eight tasks across yesterday, today, and tomorrow. Four are always for today.
INSERT INTO tasks (title, status, task_date, created_at) VALUES
  ('Review yesterday''s project notes', 'completed', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 26 HOUR)),
  ('Send the weekly progress summary', 'completed', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 25 HOUR)),
  ('Plan the top priorities for today', 'completed', CURDATE(), DATE_SUB(NOW(), INTERVAL 4 HOUR)),
  ('Finish the dashboard wireframes', 'in-progress', CURDATE(), DATE_SUB(NOW(), INTERVAL 3 HOUR)),
  ('Meet with the product team', 'pending', CURDATE(), DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  ('Prepare tomorrow''s handoff notes', 'pending', CURDATE(), DATE_SUB(NOW(), INTERVAL 1 HOUR)),
  ('Review customer feedback', 'pending', DATE_ADD(CURDATE(), INTERVAL 1 DAY), NOW()),
  ('Outline the next sprint', 'pending', DATE_ADD(CURDATE(), INTERVAL 1 DAY), NOW());

-- Exactly one demo user.
INSERT INTO users (username, full_name, email, created_at) VALUES
  ('alex.morgan', 'Alex Morgan', 'alex.morgan@example.com', NOW());
