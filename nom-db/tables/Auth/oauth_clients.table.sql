CREATE TABLE Auth.oauth_clients (
    client_id VARCHAR(80) NOT NULL,
    client_secret VARCHAR(80),
    redirect_uri VARCHAR(2000),
    grant_types VARCHAR(80),
    scope VARCHAR(4000),
    user_id VARCHAR(80),
    PRIMARY KEY (client_id)
);