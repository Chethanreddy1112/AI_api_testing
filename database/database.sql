    CREATE DATABASE IF NOT EXISTS api_testing;

    USE api_testing;

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE api_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        api_url TEXT,
        method VARCHAR(20),
        status_code INT,
        result VARCHAR(100),
        response_text LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    );