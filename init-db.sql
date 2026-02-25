-- SmartAccounting AI Database Initialization

-- Create database if not exists (handled by POSTGRES_DB env)

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable JSONB support
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create custom types if needed
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type') THEN
        CREATE TYPE account_type AS ENUM ('asset', 'liability', 'equity', 'income', 'expense');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'balance_type') THEN
        CREATE TYPE balance_type AS ENUM ('debit', 'credit');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
        CREATE TYPE transaction_status AS ENUM ('draft', 'posted', 'cancelled');
    END IF;
END$$;