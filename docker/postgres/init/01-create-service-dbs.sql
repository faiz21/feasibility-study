DO
$$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'n8n') THEN
    CREATE ROLE n8n LOGIN PASSWORD 'n8n';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'n8n') THEN
    CREATE DATABASE n8n OWNER n8n;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'directus') THEN
    CREATE ROLE directus LOGIN PASSWORD 'directus';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'directus') THEN
    CREATE DATABASE directus OWNER directus;
  END IF;
END
$$;
