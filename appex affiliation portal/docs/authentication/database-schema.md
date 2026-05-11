# Auth Database Schema

## 📋 Overview

This document outlines the complete database schema for the AppEx Affiliation Portal's authentication system. The schema is designed for security, performance, and scalability while maintaining compliance with Zimbabwean data protection regulations.

## 🏗️ Database Architecture

### Schema Organization

```sql
-- Main authentication schema
CREATE SCHEMA auth;

-- Security and audit schema
CREATE SCHEMA security;

-- OAuth and external integrations schema
CREATE SCHEMA integrations;
```

### Design Principles

- **Security First**: All sensitive data is encrypted at rest
- **Audit Ready**: Comprehensive logging for compliance
- **Performance Optimized**: Strategic indexing for fast queries
- **Scalable**: Horizontal scaling support
- **Zimbabwe Compliant**: Data localization and privacy controls

---

## 👥 Core User Tables

### Users Table

```sql
CREATE TABLE auth.users (
    -- Primary identification
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email                   TEXT UNIQUE NOT NULL,
    phone                   TEXT UNIQUE,
    
    -- Authentication
    password_hash           TEXT NOT NULL,
    mfa_enabled             BOOLEAN DEFAULT FALSE,
    mfa_secret              TEXT, -- Encrypted TOTP secret
    password_changed_at     TIMESTAMP DEFAULT NOW(),
    last_password_change    TIMESTAMP,
    
    -- Verification status
    email_verified          BOOLEAN DEFAULT FALSE,
    email_verified_at       TIMESTAMP,
    phone_verified          BOOLEAN DEFAULT FALSE,
    phone_verified_at       TIMESTAMP,
    
    -- Trust and security
    trust_level             INTEGER DEFAULT 0 CHECK (trust_level >= 0 AND trust_level <= 5),
    trust_level_updated_at  TIMESTAMP,
    failed_login_attempts   INTEGER DEFAULT 0,
    locked_until            TIMESTAMP,
    lock_reason             TEXT,
    
    -- Account status
    status                  TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED', 'PERMANENTLY_LOCKED')),
    registration_stage      TEXT DEFAULT 'INITIATED' CHECK (registration_stage IN ('INITIATED', 'EMAIL_VERIFIED', 'PROFILE_SET', 'KYC_SUBMITTED', 'APPROVED', 'ACTIVE', 'REJECTED')),
    
    -- Profile information
    full_name               TEXT NOT NULL,
    national_id             TEXT,
    id_document_type        TEXT CHECK (id_document_type IN ('NATIONAL_ID', 'PASSPORT', 'DRIVERS_LICENSE')),
    
    -- Business information
    business_name           TEXT,
    business_type           TEXT CHECK (business_type IN ('INDIVIDUAL', 'SOLE_PROPRIETOR', 'COMPANY')),
    business_registration_number TEXT,
    
    -- Referral system
    referral_code           TEXT UNIQUE NOT NULL,
    referred_by             UUID REFERENCES auth.users(id),
    
    -- Affiliate information
    affiliate_tier          TEXT DEFAULT 'BRONZE' CHECK (affiliate_tier IN ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM')),
    roles                   TEXT[] DEFAULT ARRAY['AFFILIATE'],
    
    -- Address information
    residential_address     JSONB, -- Structured address data
    
    -- Communication preferences
    preferred_language      TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'sn', 'nd')),
    preferred_communication_channel TEXT DEFAULT 'email' CHECK (preferred_communication_channel IN ('email', 'sms', 'whatsapp')),
    
    -- Consent and compliance
    terms_accepted_at       TIMESTAMP,
    privacy_policy_accepted_at TIMESTAMP,
    marketing_consent       BOOLEAN DEFAULT FALSE,
    data_processing_consent BOOLEAN DEFAULT TRUE,
    
    -- OAuth specific
    oauth_only              BOOLEAN DEFAULT FALSE,
    
    -- Activity tracking
    last_login_at           TIMESTAMP,
    last_login_ip           INET,
    last_login_device       TEXT,
    
    -- Metadata
    created_at              TIMESTAMP DEFAULT NOW(),
    updated_at              TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_phone_check CHECK (phone IS NULL OR phone ~ '^(077|071|078|079)\d{7}$'),
    CONSTRAINT users_referral_code_check CHECK (referral_code ~ '^[A-Z0-9]{8}$')
);

-- Indexes for performance
CREATE INDEX CONCURRENTLY idx_users_email ON auth.users(email);
CREATE INDEX CONCURRENTLY idx_users_phone ON auth.users(phone);
CREATE INDEX CONCURRENTLY idx_users_referral_code ON auth.users(referral_code);
CREATE INDEX CONCURRENTLY idx_users_status_tier ON auth.users(status, affiliate_tier);
CREATE INDEX CONCURRENTLY idx_users_trust_level ON auth.users(trust_level);
CREATE INDEX CONCURRENTLY idx_users_referred_by ON auth.users(referred_by);
CREATE INDEX CONCURRENTLY idx_users_created_at ON auth.users(created_at);
CREATE INDEX CONCURRENTLY idx_users_last_login ON auth.users(last_login_at DESC);
CREATE INDEX CONCURRENTLY idx_users_email_verified ON auth.users(email_verified) WHERE email_verified = true;
CREATE INDEX CONCURRENTLY idx_users_phone_verified ON auth.users(phone_verified) WHERE phone_verified = true;

-- Full-text search for names
CREATE INDEX CONCURRENTLY idx_users_full_name_fts ON auth.users USING gin(to_tsvector('english', full_name));
```

### Sessions Table

```sql
CREATE TABLE auth.sessions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Token management
    refresh_token_jti       UUID UNIQUE NOT NULL,
    device_fingerprint      TEXT NOT NULL,
    
    -- Device information
    device_name             TEXT,
    device_type             TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
    ip_address              INET NOT NULL,
    user_agent              TEXT,
    
    -- Location data
    location                JSONB, -- Geolocation data
    
    -- Session state
    is_active               BOOLEAN DEFAULT TRUE,
    is_trusted              BOOLEAN DEFAULT FALSE,
    
    -- OAuth information
    oauth_provider          TEXT, -- Which OAuth provider created this session
    
    -- Timestamps
    created_at              TIMESTAMP DEFAULT NOW(),
    last_used_at            TIMESTAMP DEFAULT NOW(),
    expires_at              TIMESTAMP NOT NULL,
    revoked_at              TIMESTAMP,
    revoke_reason           TEXT,
    
    -- Constraints
    CONSTRAINT sessions_expires_future CHECK (expires_at > created_at),
    CONSTRAINT sessions_revoked_order CHECK (revoked_at IS NULL OR revoked_at >= created_at)
);

-- Indexes for session management
CREATE INDEX CONCURRENTLY idx_sessions_user_active ON auth.sessions(user_id, is_active);
CREATE INDEX CONCURRENTLY idx_sessions_refresh_jti ON auth.sessions(refresh_token_jti);
CREATE INDEX CONCURRENTLY idx_sessions_device_fingerprint ON auth.sessions(device_fingerprint);
CREATE INDEX CONCURRENTLY idx_sessions_ip_address ON auth.sessions(ip_address);
CREATE INDEX CONCURRENTLY idx_sessions_expires_at ON auth.sessions(expires_at);
CREATE INDEX CONCURRENTLY idx_sessions_last_used ON auth.sessions(last_used_at DESC);
CREATE INDEX CONCURRENTLY idx_sessions_oauth_provider ON auth.sessions(oauth_provider) WHERE oauth_provider IS NOT NULL;
```

---

## 🔐 Security Tables

### MFA Methods Table

```sql
CREATE TABLE auth.mfa_methods (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Method configuration
    method_type             TEXT NOT NULL CHECK (method_type IN ('TOTP', 'SMS', 'BACKUP_CODES')),
    is_active               BOOLEAN DEFAULT TRUE,
    is_primary              BOOLEAN DEFAULT FALSE,
    
    -- Method-specific data
    secret                  TEXT, -- Encrypted TOTP secret
    phone_number            TEXT, -- For SMS method
    
    -- Usage tracking
    last_used_at            TIMESTAMP,
    usage_count             INTEGER DEFAULT 0,
    
    -- Metadata
    setup_completed_at      TIMESTAMP DEFAULT NOW(),
    created_at              TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT mfa_methods_unique_user_method UNIQUE(user_id, method_type),
    CONSTRAINT mfa_methods_secret_required CHECK (
        (method_type = 'TOTP' AND secret IS NOT NULL) OR
        (method_type = 'SMS' AND phone_number IS NOT NULL) OR
        (method_type = 'BACKUP_CODES')
    )
);

CREATE INDEX CONCURRENTLY idx_mfa_methods_user_active ON auth.mfa_methods(user_id, is_active);
CREATE INDEX CONCURRENTLY idx_mfa_methods_type ON auth.mfa_methods(method_type);
CREATE INDEX CONCURRENTLY idx_mfa_methods_primary ON auth.mfa_methods(user_id, is_primary) WHERE is_primary = true;
```

### Backup Codes Table

```sql
CREATE TABLE auth.backup_codes (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Code information
    code_hash               TEXT NOT NULL, -- Hashed backup code
    code_index              INTEGER NOT NULL, -- Sequential index for user reference
    
    -- Status
    is_active               BOOLEAN DEFAULT TRUE,
    used_at                 TIMESTAMP,
    
    -- Metadata
    created_at              TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT backup_codes_unique_user_index UNIQUE(user_id, code_index)
);

CREATE INDEX CONCURRENTLY idx_backup_codes_user_active ON auth.backup_codes(user_id, is_active);
CREATE INDEX CONCURRENTLY idx_backup_codes_used_at ON auth.backup_codes(used_at) WHERE used_at IS NOT NULL;
```

### Trusted Devices Table

```sql
CREATE TABLE auth.trusted_devices (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Device identification
    device_fingerprint      TEXT NOT NULL,
    device_name             TEXT,
    
    -- Network information
    ip_address              INET,
    user_agent              TEXT,
    
    -- Trust management
    expires_at              TIMESTAMP NOT NULL,
    is_active               BOOLEAN DEFAULT TRUE,
    
    -- Usage tracking
    last_used_at            TIMESTAMP DEFAULT NOW(),
    usage_count             INTEGER DEFAULT 0,
    
    -- Metadata
    created_at              TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT trusted_devices_unique_user_device UNIQUE(user_id, device_fingerprint),
    CONSTRAINT trusted_devices_expires_future CHECK (expires_at > created_at)
);

CREATE INDEX CONCURRENTLY idx_trusted_devices_user_expires ON auth.trusted_devices(user_id, expires_at);
CREATE INDEX CONCURRENTLY idx_trusted_devices_device_fingerprint ON auth.trusted_devices(device_fingerprint);
CREATE INDEX CONCURRENTLY idx_trusted_devices_expires_at ON auth.trusted_devices(expires_at);
```

---

## 📧 Verification Tables

### Verification Tokens Table

```sql
CREATE TABLE auth.verification_tokens (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Token information
    token                   TEXT NOT NULL, -- Hashed token
    type                    TEXT NOT NULL CHECK (type IN ('EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'MFA_BACKUP', 'ACCOUNT_RECOVERY')),
    
    -- Expiration and usage
    expires_at              TIMESTAMP NOT NULL,
    used                    BOOLEAN DEFAULT FALSE,
    used_at                 TIMESTAMP,
    
    -- Metadata
    created_at              TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT verification_tokens_expires_future CHECK (expires_at > created_at),
    CONSTRAINT verification_tokens_used_order CHECK (used_at IS NULL OR used_at >= created_at)
);

CREATE INDEX CONCURRENTLY idx_verification_user_type ON auth.verification_tokens(user_id, type);
CREATE INDEX CONCURRENTLY idx_verification_expires ON auth.verification_tokens(expires_at) WHERE used = false;
CREATE INDEX CONCURRENTLY idx_verification_type_expires ON auth.verification_tokens(type, expires_at);
```

### Password History Table

```sql
CREATE TABLE auth.password_history (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Password information
    password_hash           TEXT NOT NULL,
    
    -- Metadata
    created_at              TIMESTAMP DEFAULT NOW()
);

CREATE INDEX CONCURRENTLY idx_password_history_user ON auth.password_history(user_id);
CREATE INDEX CONCURRENTLY idx_password_history_created ON auth.password_history(created_at DESC);
```

### Password Resets Table

```sql
CREATE TABLE auth.password_resets (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Reset token
    token_hash              TEXT NOT NULL,
    
    -- Expiration and usage
    expires_at              TIMESTAMP NOT NULL,
    used                    BOOLEAN DEFAULT FALSE,
    used_at                 TIMESTAMP,
    
    -- Request tracking
    ip_address              INET,
    user_agent              TEXT,
    
    -- Metadata
    created_at              TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT password_resets_expires_future CHECK (expires_at > created_at)
);

CREATE INDEX CONCURRENTLY idx_password_resets_user ON auth.password_resets(user_id);
CREATE INDEX CONCURRENTLY idx_password_resets_expires ON auth.password_resets(expires_at) WHERE used = false;
CREATE INDEX CONCURRENTLY idx_password_resets_token_hash ON auth.password_resets(token_hash);
```

---

## 🔗 OAuth Integration Tables

### OAuth Identities Table

```sql
CREATE TABLE integrations.oauth_identities (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Provider information
    provider                TEXT NOT NULL CHECK (provider IN ('google', 'facebook', 'microsoft', 'linkedin')),
    provider_id             TEXT NOT NULL,
    email                   TEXT NOT NULL,
    
    -- Profile data
    profile_data            JSONB, -- Raw profile data from provider
    
    -- Usage tracking
    last_used_at            TIMESTAMP DEFAULT NOW(),
    usage_count             INTEGER DEFAULT 0,
    
    -- Metadata
    created_at              TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT oauth_identities_unique_provider UNIQUE(provider, provider_id)
);

CREATE INDEX CONCURRENTLY idx_oauth_identities_user ON integrations.oauth_identities(user_id);
CREATE INDEX CONCURRENTLY idx_oauth_identities_provider ON integrations.oauth_identities(provider);
CREATE INDEX CONCURRENTLY idx_oauth_identities_email ON integrations.oauth_identities(email);
CREATE INDEX CONCURRENTLY idx_oauth_identities_last_used ON integrations.oauth_identities(last_used_at DESC);
```

### OAuth Sessions Table

```sql
CREATE TABLE integrations.oauth_sessions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- OAuth flow data
    provider                TEXT NOT NULL,
    state                   TEXT NOT NULL,
    redirect_uri            TEXT,
    
    -- Session management
    created_at              TIMESTAMP DEFAULT NOW(),
    expires_at              TIMESTAMP NOT NULL,
    used_at                 TIMESTAMP,
    
    -- Constraints
    CONSTRAINT oauth_sessions_unique_state UNIQUE(state),
    CONSTRAINT oauth_sessions_expires_future CHECK (expires_at > created_at)
);

CREATE INDEX CONCURRENTLY idx_oauth_sessions_state ON integrations.oauth_sessions(state);
CREATE INDEX CONCURRENTLY idx_oauth_sessions_expires ON integrations.oauth_sessions(expires_at);
CREATE INDEX CONCURRENTLY idx_oauth_sessions_provider ON integrations.oauth_sessions(provider);
```

---

## 📊 KYC and Compliance Tables

### KYC Submissions Table

```sql
CREATE TABLE auth.kyc_submissions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Document information
    document_type           TEXT NOT NULL CHECK (document_type IN ('NATIONAL_ID', 'PASSPORT', 'DRIVERS_LICENSE')),
    id_number               TEXT NOT NULL,
    expiry_date             DATE,
    
    -- Document files
    documents               JSONB NOT NULL, -- Array of uploaded documents
    
    -- Status tracking
    status                  TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ADDITIONAL_INFO_REQUIRED')),
    
    -- Review information
    reviewed_by             UUID REFERENCES auth.users(id),
    reviewed_at             TIMESTAMP,
    review_notes            TEXT,
    rejection_reason        TEXT,
    
    -- Metadata
    submitted_at            TIMESTAMP DEFAULT NOW(),
    updated_at              TIMESTAMP DEFAULT NOW()
);

CREATE INDEX CONCURRENTLY idx_kyc_submissions_user ON auth.kyc_submissions(user_id);
CREATE INDEX CONCURRENTLY idx_kyc_submissions_status ON auth.kyc_submissions(status);
CREATE INDEX CONCURRENTLY idx_kyc_submissions_submitted ON auth.kyc_submissions(submitted_at DESC);
CREATE INDEX CONCURRENTLY idx_kyc_submissions_reviewed ON auth.kyc_submissions(reviewed_at DESC);
```

### Consent Records Table

```sql
CREATE TABLE auth.consent_records (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Consent information
    consent_type            TEXT NOT NULL CHECK (consent_type IN ('TERMS', 'PRIVACY', 'MARKETING', 'DATA_PROCESSING', 'KYC')),
    version                 TEXT NOT NULL,
    granted                 BOOLEAN NOT NULL,
    
    -- Context
    ip_address              INET,
    user_agent              TEXT,
    
    -- Timestamps
    granted_at              TIMESTAMP DEFAULT NOW(),
    revoked_at              TIMESTAMP,
    
    -- Metadata
    created_at              TIMESTAMP DEFAULT NOW()
);

CREATE INDEX CONCURRENTLY idx_consent_records_user ON auth.consent_records(user_id);
CREATE INDEX CONCURRENTLY idx_consent_records_type ON auth.consent_records(consent_type);
CREATE INDEX CONCURRENTLY idx_consent_records_granted ON auth.consent_records(granted_at DESC);
```

---

## 🔒 Security and Audit Tables

### Security Events Table

```sql
CREATE TABLE security.security_events (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Event information
    event_type              TEXT NOT NULL,
    severity                TEXT DEFAULT 'LOW' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    
    -- Context
    ip_address              INET,
    user_agent              TEXT,
    device_fingerprint      TEXT,
    
    -- Additional data
    metadata                JSONB,
    
    -- Timestamps
    created_at              TIMESTAMP DEFAULT NOW()
);

-- Indexes for security monitoring
CREATE INDEX CONCURRENTLY idx_security_events_user ON security.security_events(user_id);
CREATE INDEX CONCURRENTLY idx_security_events_type_time ON security.security_events(event_type, created_at);
CREATE INDEX CONCURRENTLY idx_security_events_severity ON security.security_events(severity) WHERE severity IN ('HIGH', 'CRITICAL');
CREATE INDEX CONCURRENTLY idx_security_events_ip ON security.security_events(ip_address);
CREATE INDEX CONCURRENTLY idx_security_events_created ON security.security_events(created_at DESC);
CREATE INDEX CONCURRENTLY idx_security_events_metadata ON security.security_events USING gin(metadata);
```

### Failed Login Attempts Table

```sql
CREATE TABLE security.failed_login_attempts (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Attempt information
    email                   TEXT NOT NULL,
    ip_address              INET NOT NULL,
    user_agent              TEXT,
    device_fingerprint      TEXT,
    
    -- Reason
    reason                  TEXT NOT NULL CHECK (reason IN ('INVALID_PASSWORD', 'ACCOUNT_LOCKED', 'USER_NOT_FOUND', 'MFA_REQUIRED')),
    
    -- Timestamps
    created_at              TIMESTAMP DEFAULT NOW()
);

CREATE INDEX CONCURRENTLY idx_failed_login_email ON security.failed_login_attempts(email);
CREATE INDEX CONCURRENTLY idx_failed_login_ip ON security.failed_login_attempts(ip_address);
CREATE INDEX CONCURRENTLY idx_failed_login_created ON security.failed_login_attempts(created_at DESC);
CREATE INDEX CONCURRENTLY idx_failed_login_reason ON security.failed_login_attempts(reason);
```

---

## 📈 Analytics and Reporting Tables

### User Activity Summary Table

```sql
CREATE TABLE auth.user_activity_summary (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Time period
    date                    DATE NOT NULL,
    period_type             TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
    
    -- Activity metrics
    login_count             INTEGER DEFAULT 0,
    session_duration        INTEGER DEFAULT 0, -- Total seconds
    page_views              INTEGER DEFAULT 0,
    api_calls               INTEGER DEFAULT 0,
    
    -- Security metrics
    failed_login_attempts   INTEGER DEFAULT 0,
    mfa_verifications       INTEGER DEFAULT 0,
    security_events         INTEGER DEFAULT 0,
    
    -- Business metrics
    commissions_earned      DECIMAL(15,2) DEFAULT 0.00,
    referrals_made          INTEGER DEFAULT 0,
    conversion_events       INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at              TIMESTAMP DEFAULT NOW(),
    updated_at              TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT user_activity_summary_unique UNIQUE(user_id, date, period_type)
);

CREATE INDEX CONCURRENTLY idx_user_activity_user_date ON auth.user_activity_summary(user_id, date DESC);
CREATE INDEX CONCURRENTLY idx_user_activity_period ON auth.user_activity_summary(period_type, date);
```

---

## 🔄 Database Functions and Triggers

### Update Timestamp Function

```sql
CREATE OR REPLACE FUNCTION auth.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON auth.users 
    FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column();
```

### Trust Level Update Trigger

```sql
CREATE OR REPLACE FUNCTION auth.update_trust_level()
RETURNS TRIGGER AS $$
BEGIN
    -- Update trust level based on verification status
    NEW.trust_level = CASE
        WHEN NEW.email_verified = false THEN 0
        WHEN NEW.phone_verified = false THEN 1
        WHEN EXISTS (
            SELECT 1 FROM auth.kyc_submissions ks 
            WHERE ks.user_id = NEW.id AND ks.status = 'APPROVED'
        ) THEN 3
        ELSE 2
    END;
    
    -- Update trust level timestamp if changed
    IF NEW.trust_level <> OLD.trust_level THEN
        NEW.trust_level_updated_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_trust_level
    BEFORE UPDATE OF email_verified, phone_verified ON auth.users
    FOR EACH ROW EXECUTE FUNCTION auth.update_trust_level();
```

### Security Event Logging Trigger

```sql
CREATE OR REPLACE FUNCTION security.log_login_attempt()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO security.security_events (user_id, event_type, severity, ip_address, user_agent, metadata)
        VALUES (
            NEW.user_id,
            'LOGIN_SUCCESS',
            'LOW',
            NEW.last_login_ip,
            NEW.last_login_device,
            jsonb_build_object('device_fingerprint', NEW.last_login_device)
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_successful_login
    AFTER UPDATE OF last_login_at ON auth.users
    FOR EACH ROW WHEN (OLD.last_login_at IS DISTINCT FROM NEW.last_login_at)
    EXECUTE FUNCTION security.log_login_attempt();
```

---

## 📊 Database Views

### User Security View

```sql
CREATE VIEW security.user_security_summary AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.trust_level,
    u.status,
    u.failed_login_attempts,
    u.locked_until,
    u.mfa_enabled,
    u.email_verified,
    u.phone_verified,
    COALESCE(session_count.active_sessions, 0) as active_sessions,
    COALESCE(security_count.high_severity_events, 0) as high_severity_events,
    u.last_login_at,
    u.created_at
FROM auth.users u
LEFT JOIN (
    SELECT user_id, COUNT(*) as active_sessions
    FROM auth.sessions
    WHERE is_active = true AND expires_at > NOW()
    GROUP BY user_id
) session_count ON u.id = session_count.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as high_severity_events
    FROM security.security_events
    WHERE severity IN ('HIGH', 'CRITICAL')
    AND created_at > NOW() - INTERVAL '30 days'
    GROUP BY user_id
) security_count ON u.id = security_count.user_id;
```

### Trust Level Analytics View

```sql
CREATE VIEW auth.trust_level_analytics AS
SELECT 
    trust_level,
    COUNT(*) as user_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage,
    AVG(EXTRACT(EPOCH FROM (NOW() - created_at)) / 86400) as avg_account_age_days,
    AVG(failed_login_attempts) as avg_failed_attempts,
    COUNT(CASE WHEN mfa_enabled THEN 1 END) as mfa_enabled_count,
    COUNT(CASE WHEN email_verified THEN 1 END) as email_verified_count,
    COUNT(CASE WHEN phone_verified THEN 1 END) as phone_verified_count
FROM auth.users
WHERE status = 'ACTIVE'
GROUP BY trust_level
ORDER BY trust_level;
```

---

## 🔐 Security Considerations

### Data Encryption

```sql
-- Enable row-level security for sensitive tables
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.mfa_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.backup_codes ENABLE ROW LEVEL SECURITY;

-- Create encryption key management
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION auth.encrypt_sensitive_data(data TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(encrypt(data::bytea, current_setting('app.encryption_key'), 'aes'), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION auth.decrypt_sensitive_data(encrypted_data TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN convert_from(decrypt(decode(encrypted_data, 'base64'), current_setting('app.encryption_key'), 'aes'), 'UTF8');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Audit Logging

```sql
-- Create audit log table
CREATE TABLE security.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    user_id UUID REFERENCES auth.users(id),
    old_values JSONB,
    new_values JSONB,
    changed_at TIMESTAMP DEFAULT NOW()
);

-- Generic audit trigger
CREATE OR REPLACE FUNCTION security.audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO security.audit_log (table_name, operation, user_id, old_values, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, OLD.id, row_to_json(OLD), NOW());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO security.audit_log (table_name, operation, user_id, old_values, new_values, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(OLD), row_to_json(NEW), NOW());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO security.audit_log (table_name, operation, user_id, new_values, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(NEW), NOW());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit trigger to sensitive tables
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION security.audit_trigger();
```

---

## 📋 Migration Strategy

### Version Control

```sql
-- Migration version tracking
CREATE TABLE schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT NOW()
);

-- Example migration
INSERT INTO schema_migrations (version) VALUES ('001_initial_auth_schema');
```

### Data Migration Scripts

```sql
-- Migration script for adding new trust levels
DO $$
BEGIN
    -- Update existing users to new trust level system
    UPDATE auth.users 
    SET trust_level = CASE
        WHEN email_verified = true AND phone_verified = true THEN 2
        WHEN email_verified = true THEN 1
        ELSE 0
    END
    WHERE trust_level IS NULL;
    
    -- Log migration
    INSERT INTO security.security_events (event_type, severity, metadata)
    VALUES ('TRUST_LEVEL_MIGRATION', 'MEDIUM', jsonb_build_object('updated_users', ROW_COUNT));
END $$;
```

---

## 🚀 Performance Optimization

### Partitioning Strategy

```sql
-- Partition security events by month
CREATE TABLE security.security_events_y2026m01 PARTITION OF security.security_events
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- Partition user activity by year
CREATE TABLE auth.user_activity_summary_y2026 PARTITION OF auth.user_activity_summary
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
```

### Materialized Views

```sql
CREATE MATERIALIZED VIEW auth.user_metrics AS
SELECT 
    u.id,
    u.email,
    u.trust_level,
    u.status,
    COUNT(DISTINCT s.id) as total_sessions,
    COUNT(DISTINCT CASE WHEN s.is_active THEN s.id END) as active_sessions,
    MAX(s.last_used_at) as last_session,
    COUNT(DISTINCT se.id) as security_events,
    u.created_at,
    u.last_login_at
FROM auth.users u
LEFT JOIN auth.sessions s ON u.id = s.user_id
LEFT JOIN security.security_events se ON u.id = se.user_id
GROUP BY u.id, u.email, u.trust_level, u.status, u.created_at, u.last_login_at;

-- Refresh strategy
CREATE OR REPLACE FUNCTION auth.refresh_user_metrics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY auth.user_metrics;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh (requires pg_cron extension)
SELECT cron.schedule('refresh-user-metrics', '0 */6 * * *', 'SELECT auth.refresh_user_metrics();');
```

---

## 📋 Database Maintenance

### Cleanup Procedures

```sql
-- Clean up expired sessions
CREATE OR REPLACE FUNCTION auth.cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM auth.sessions 
    WHERE expires_at < NOW() OR (is_active = false AND revoked_at < NOW() - INTERVAL '7 days');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log cleanup
    INSERT INTO security.security_events (event_type, severity, metadata)
    VALUES ('SESSION_CLEANUP', 'LOW', jsonb_build_object('deleted_sessions', deleted_count));
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Clean up old verification tokens
CREATE OR REPLACE FUNCTION auth.cleanup_old_verification_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM auth.verification_tokens 
    WHERE expires_at < NOW() - INTERVAL '7 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
```

### Backup Strategy

```sql
-- Backup critical tables
CREATE OR REPLACE FUNCTION security.backup_critical_data()
RETURNS void AS $$
BEGIN
    -- This would integrate with your backup system
    -- Example: Export users, sessions, and security events
    PERFORM * FROM auth.users WHERE status = 'ACTIVE';
    PERFORM * FROM auth.sessions WHERE is_active = true;
    PERFORM * FROM security.security_events 
    WHERE created_at > NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;
```

---

## 📊 Monitoring Queries

### Daily Security Report

```sql
CREATE OR REPLACE FUNCTION security.daily_security_report(report_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE(
    metric TEXT,
    value BIGINT,
    details JSONB
) AS $$
BEGIN
    RETURN QUERY
    -- New registrations
    SELECT 
        'new_registrations'::TEXT,
        COUNT(*)::BIGINT,
        jsonb_build_object('date', report_date)
    FROM auth.users 
    WHERE DATE(created_at) = report_date
    
    UNION ALL
    
    -- Successful logins
    SELECT 
        'successful_logins'::TEXT,
        COUNT(*)::BIGINT,
        jsonb_build_object('date', report_date)
    FROM security.security_events
    WHERE event_type = 'LOGIN_SUCCESS' 
    AND DATE(created_at) = report_date
    
    UNION ALL
    
    -- Failed login attempts
    SELECT 
        'failed_login_attempts'::TEXT,
        COUNT(*)::BIGINT,
        jsonb_build_object('date', report_date)
    FROM security.failed_login_attempts
    WHERE DATE(created_at) = report_date
    
    UNION ALL
    
    -- Security incidents
    SELECT 
        'security_incidents'::TEXT,
        COUNT(*)::BIGINT,
        jsonb_build_object('date', report_date, 'severity', severity)
    FROM security.security_events
    WHERE severity IN ('HIGH', 'CRITICAL')
    AND DATE(created_at) = report_date
    GROUP BY severity;
END;
$$ LANGUAGE plpgsql;
```

---

**Next**: [Auth State Machine](./state-machine.md) → Frontend state management documentation
