CREATE DATABASE api_testing;

USE api_testing;

CREATE TABLE api_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    api_url TEXT,
    method VARCHAR(20),
    status_code INT,
    response_text LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);