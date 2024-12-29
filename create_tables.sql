CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) Not NULL,
  last_name VARCHAR(100) Not NULL,
  age VARCHAR(100) Not NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE media (
  video_id INT AUTO_INCREMENT PRIMARY KEY,
  prompt VARCHAR(250) NOT NULL,
  title TEXT,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (username, email, first_name, last_name, age)
VALUES ('john_doe', 'john.doe@example.com', 'John', 'Doe', 30);
