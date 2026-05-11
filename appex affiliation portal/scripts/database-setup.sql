-- AppEx Affiliation Portal Database Setup
-- This script creates the database and initial setup

-- Create database if it doesn't exist
CREATE DATABASE appex_affiliate_portal;

-- Connect to the database
\c appex_affiliate_portal;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'PERMANENTLY_LOCKED');
CREATE TYPE affiliate_tier AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');
CREATE TYPE commission_type AS ENUM ('STANDARD', 'BONUS', 'RECURRING', 'REFERRAL');
CREATE TYPE commission_status AS ENUM ('PENDING', 'CONFIRMED', 'PAID', 'CANCELLED');
CREATE TYPE referral_status AS ENUM ('PENDING', 'CONTACTED', 'INTERESTED', 'CONVERTED', 'NOT_INTERESTED');
CREATE TYPE payout_method AS ENUM ('BANK_TRANSFER', 'MOBILE_MONEY', 'CASH_PICKUP');
CREATE TYPE payout_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE kyc_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE kyc_document_type AS ENUM ('NATIONAL_ID', 'PASSPORT', 'DRIVERS_LICENSE', 'PROOF_OF_ADDRESS', 'UTILITY_BILL', 'BANK_STATEMENT', 'SELFIE', 'BUSINESS_REGISTRATION', 'TAX_CLEARANCE');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    national_id VARCHAR(50),
    affiliate_code VARCHAR(20) UNIQUE NOT NULL,
    referred_by UUID REFERENCES users(id),
    affiliate_tier affiliate_tier DEFAULT 'BRONZE',
    trust_level INTEGER DEFAULT 1,
    status user_status DEFAULT 'PENDING',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(32),
    email_verification_token VARCHAR(255),
    phone_verification_token VARCHAR(10),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login_at TIMESTAMP,
    registration_stage VARCHAR(50) DEFAULT 'EMAIL_VERIFICATION',
    marketing_consent BOOLEAN DEFAULT FALSE,
    accept_terms BOOLEAN DEFAULT FALSE,
    accept_privacy BOOLEAN DEFAULT FALSE,
    preferred_language VARCHAR(10) DEFAULT 'en',
    preferred_communication_channel VARCHAR(20) DEFAULT 'EMAIL',
    lock_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_name VARCHAR(255),
    device_type VARCHAR(50),
    device_fingerprint VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NOT NULL,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create referrals table
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_email VARCHAR(255) NOT NULL,
    referred_name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    phone VARCHAR(20),
    status referral_status DEFAULT 'PENDING',
    next_follow_up TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    converted_at TIMESTAMP,
    commission_earned DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create commissions table
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referral_id UUID REFERENCES referrals(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    type commission_type NOT NULL,
    status commission_status DEFAULT 'PENDING',
    earned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_date TIMESTAMP,
    paid_date TIMESTAMP,
    payout_id UUID REFERENCES payouts(id) ON DELETE SET NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payouts table
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    method payout_method NOT NULL,
    status payout_status DEFAULT 'PENDING',
    bank_account_data JSONB,
    mobile_money_data JSONB,
    reference VARCHAR(100),
    processed_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP,
    notes TEXT
);

-- Create kyc_submissions table
CREATE TABLE kyc_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status kyc_status DEFAULT 'PENDING',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    reason TEXT,
    notes TEXT
);

-- Create kyc_documents table
CREATE TABLE kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES kyc_submissions(id) ON DELETE CASCADE,
    document_type kyc_document_type NOT NULL,
    document_number VARCHAR(100),
    document_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    extracted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status kyc_status DEFAULT 'PENDING',
    verified_at TIMESTAMP,
    reason TEXT
);

-- Create security_events table
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'MEDIUM',
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notification_logs table
CREATE TABLE notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    success BOOLEAN DEFAULT FALSE,
    error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_affiliate_code ON users(affiliate_code);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_is_active ON sessions(is_active);
CREATE INDEX idx_referrals_affiliate_id ON referrals(affiliate_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_commissions_user_id ON commissions(user_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_earned_date ON commissions(earned_date);
CREATE INDEX idx_payouts_user_id ON payouts(user_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_kyc_submissions_user_id ON kyc_submissions(user_id);
CREATE INDEX idx_kyc_submissions_status ON kyc_submissions(status);
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_created_at ON security_events(created_at);
CREATE INDEX idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX idx_notification_logs_created_at ON notification_logs(created_at);

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
INSERT INTO users (id, email, password_hash, full_name, affiliate_code, status, email_verified, phone_verified, accept_terms, accept_privacy, registration_stage, trust_level, affiliate_tier)
VALUES (
    uuid_generate_v4(),
    'admin@appexaffiliation.com',
    '$2b$12$LQv3c1yqBWVHxkd0L9NuO5B5jK2f.8K5w9B8f5Q2zL7x5E9K6C8qO',
    'System Administrator',
    'ADMIN001',
    'ACTIVE',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    'APPROVED',
    5,
    'PLATINUM'
);

-- Create sample affiliate user (password: user123)
INSERT INTO users (id, email, password_hash, full_name, affiliate_code, status, email_verified, phone_verified, accept_terms, accept_privacy, registration_stage, trust_level, affiliate_tier)
VALUES (
    uuid_generate_v4(),
    'user@appexaffiliation.com',
    '$2b$12$LQv3c1yqBWVHxkd0L9NuO5B5jK2f.8K5w9B8f5Q2zL7x5E9K6C8qO',
    'Test User',
    'USER001',
    'ACTIVE',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    'APPROVED',
    2,
    'BRONZE'
);

COMMIT;
