# Database Schema

## 📋 Overview

The AppEx Affiliation Portal uses PostgreSQL 15 as its primary database. The schema is designed for ACID compliance, performance optimization, and scalability. All tables use UUID primary keys and include audit fields for tracking.

## 🏗️ Database Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PostgreSQL 15                               │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Users     │  │ Affiliates  │  │ Referrals  │  │ Commissions │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Payouts   │  │   Courses   │  │ Certificates│  │   Webhooks  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ Audit Logs  │  │   Sessions  │  │   Jobs      │  │   Settings  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## 👥 Core Tables

### users

Core user authentication and profile information.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'deleted')),
    role VARCHAR(20) DEFAULT 'affiliate' CHECK (role IN ('affiliate', 'trainer', 'reseller', 'admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Columns**:
- `id` - Unique identifier (UUID)
- `email` - User email address (unique)
- `password_hash` - Bcrypt hash of password
- `email_verified` - Email verification status
- `phone` - Phone number (Zimbabwe format)
- `status` - Account status (pending/active/suspended/deleted)
- `role` - User role for authorization
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp
- `last_login` - Last successful login timestamp

### affiliates

Extended affiliate-specific information and commission configuration.

```sql
CREATE TABLE affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    affiliate_code VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    affiliate_type VARCHAR(20) NOT NULL CHECK (affiliate_type IN ('trainer', 'reseller')),
    commission_rate DECIMAL(5,4) DEFAULT 0.1000,
    tier VARCHAR(20) DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    parent_affiliate_id UUID REFERENCES affiliates(id),
    bio TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    avatar_url VARCHAR(500),
    total_earned DECIMAL(12,2) DEFAULT 0.00,
    pending_payments DECIMAL(12,2) DEFAULT 0.00,
    join_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    
    CONSTRAINT affiliates_commission_rate_check CHECK (commission_rate >= 0.0000 AND commission_rate <= 1.0000)
);

-- Indexes
CREATE INDEX idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX idx_affiliates_affiliate_code ON affiliates(affiliate_code);
CREATE INDEX idx_affiliates_type ON affiliates(affiliate_type);
CREATE INDEX idx_affiliates_tier ON affiliates(tier);
CREATE INDEX idx_affiliates_parent_id ON affiliates(parent_affiliate_id);
CREATE INDEX idx_affiliates_status ON affiliates(status);
```

**Columns**:
- `id` - Unique identifier (UUID)
- `user_id` - Reference to users table
- `affiliate_code` - Unique affiliate referral code
- `first_name` - Affiliate's first name
- `last_name` - Affiliate's last name
- `affiliate_type` - Type of affiliate (trainer/reseller)
- `commission_rate` - Commission rate (decimal, 0.0000 to 1.0000)
- `tier` - Performance tier (bronze/silver/gold/platinum)
- `parent_affiliate_id` - Parent affiliate for multi-tier structure
- `bio` - Professional biography
- `location` - Geographic location
- `website` - Personal or business website
- `avatar_url` - Profile image URL
- `total_earned` - Lifetime earnings
- `pending_payments` - Amount awaiting payout
- `join_date` - Affiliate program join date
- `status` - Current affiliate status

### referrals

Potential customers and business leads referred by affiliates.

```sql
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    business_name VARCHAR(255),
    product_interest VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'interested', 'converted', 'lost')),
    source VARCHAR(50),
    notes TEXT,
    next_follow_up TIMESTAMP WITH TIME ZONE,
    last_contact TIMESTAMP WITH TIME ZONE,
    conversion_date TIMESTAMP WITH TIME ZONE,
    conversion_value DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT referrals_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR email IS NULL)
);

-- Indexes
CREATE INDEX idx_referrals_affiliate_id ON referrals(affiliate_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_email ON referrals(email);
CREATE INDEX idx_referrals_created_at ON referrals(created_at);
CREATE INDEX idx_referrals_conversion_date ON referrals(conversion_date);
CREATE INDEX idx_referrals_next_follow_up ON referrals(next_follow_up);
```

**Columns**:
- `id` - Unique identifier (UUID)
- `affiliate_id` - Reference to referring affiliate
- `name` - Contact person name
- `email` - Contact email address
- `phone` - Contact phone number
- `business_name` - Business or company name
- `product_interest` - Product category of interest
- `status` - Current referral status
- `source` - Lead source (website, referral, etc.)
- `notes` - Additional notes and comments
- `next_follow_up` - Scheduled next contact date
- `last_contact` - Last contact timestamp
- `conversion_date` - Date when referral became customer
- `conversion_value` - Value of converted sale
- `created_at` - Referral creation timestamp
- `updated_at` - Last update timestamp

### commissions

Commission records for affiliate earnings.

```sql
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
    referral_id UUID REFERENCES referrals(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    rate DECIMAL(5,4) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
    description TEXT,
    reference_id VARCHAR(100),
    earned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_date TIMESTAMP WITH TIME ZONE,
    paid_date TIMESTAMP WITH TIME ZONE,
    payout_id UUID REFERENCES payouts(id),
    
    CONSTRAINT commissions_amount_check CHECK (amount >= 0.00),
    CONSTRAINT commissions_rate_check CHECK (rate >= 0.0000 AND rate <= 1.0000)
);

-- Indexes
CREATE INDEX idx_commissions_affiliate_id ON commissions(affiliate_id);
CREATE INDEX idx_commissions_referral_id ON commissions(referral_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_type ON commissions(type);
CREATE INDEX idx_commissions_earned_date ON commissions(earned_date);
CREATE INDEX idx_commissions_payout_id ON commissions(payout_id);
```

**Columns**:
- `id` - Unique identifier (UUID)
- `affiliate_id` - Reference to earning affiliate
- `referral_id` - Reference to related referral
- `type` - Commission type (pos_sale, subscription, referral_bonus)
- `amount` - Commission amount
- `rate` - Commission rate applied
- `status` - Payment status (pending/approved/paid/cancelled)
- `description` - Commission description
- `reference_id` - External reference (payment ID, invoice number)
- `earned_date` - Date commission was earned
- `approved_date` - Date commission was approved
- `paid_date` - Date commission was paid
- `payout_id` - Reference to payout batch

## 💰 Financial Tables

### payouts

Batch payment records for affiliate commissions.

```sql
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    method VARCHAR(20) NOT NULL CHECK (method IN ('ecocash', 'bank_transfer', 'mobile_money')),
    account_number VARCHAR(50),
    account_name VARCHAR(255),
    bank_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    reference VARCHAR(100),
    transaction_id VARCHAR(100),
    processing_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT payouts_amount_check CHECK (amount > 0.00)
);

-- Indexes
CREATE INDEX idx_payouts_affiliate_id ON payouts(affiliate_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_method ON payouts(method);
CREATE INDEX idx_payouts_created_at ON payouts(created_at);
CREATE INDEX idx_payouts_processing_date ON payouts(processing_date);
```

**Columns**:
- `id` - Unique identifier (UUID)
- `affiliate_id` - Reference to affiliate receiving payout
- `amount` - Payout amount
- `method` - Payment method (ecocash/bank_transfer/mobile_money)
- `account_number` - Account or phone number for payment
- `account_name` - Account holder name
- `bank_name` - Bank name (for bank transfers)
- `status` - Payout status
- `reference` - Internal reference number
- `transaction_id` - External transaction ID
- `processing_date` - Date processing began
- `completed_date` - Date payout was completed
- `notes` - Additional notes
- `created_at` - Payout request timestamp

## 🎓 Training Tables

### courses

Training courses available to affiliates.

```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    level VARCHAR(20) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER,
    thumbnail_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_sort_order ON courses(sort_order);
```

### course_progress

Affiliate progress through training courses.

```sql
CREATE TABLE course_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'certified')),
    completed_modules TEXT[], -- Array of completed module IDs
    current_module UUID,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent_minutes INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(affiliate_id, course_id)
);

-- Indexes
CREATE INDEX idx_course_progress_affiliate_id ON course_progress(affiliate_id);
CREATE INDEX idx_course_progress_course_id ON course_progress(course_id);
CREATE INDEX idx_course_progress_status ON course_progress(status);
CREATE UNIQUE INDEX idx_course_progress_unique ON course_progress(affiliate_id, course_id);
```

### certificates

Issued certificates for completed training.

```sql
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
    pdf_url VARCHAR(500),
    verification_code VARCHAR(20) UNIQUE NOT NULL,
    
    CONSTRAINT certificates_expiry_check CHECK (expiry_date > issue_date OR expiry_date IS NULL)
);

-- Indexes
CREATE INDEX idx_certificates_affiliate_id ON certificates(affiliate_id);
CREATE INDEX idx_certificates_course_id ON certificates(course_id);
CREATE INDEX idx_certificates_certificate_number ON certificates(certificate_number);
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);
CREATE INDEX idx_certificates_status ON certificates(status);
```

## 🔧 System Tables

### audit_logs

Comprehensive audit trail for all system actions.

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_id UUID
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_resource_id ON audit_logs(resource_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_session_id ON audit_logs(session_id);
```

### user_sessions

Active user sessions for authentication management.

```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    family_id VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    is_revoked BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_family_id ON user_sessions(family_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_is_revoked ON user_sessions(is_revoked);
```

### background_jobs

Queue and status tracking for background jobs.

```sql
CREATE TABLE background_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_name VARCHAR(50) NOT NULL,
    job_type VARCHAR(100) NOT NULL,
    data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed', 'failed', 'delayed')),
    priority INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    delay_until TIMESTAMP WITH TIME ZONE,
    processed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_background_jobs_queue_name ON background_jobs(queue_name);
CREATE INDEX idx_background_jobs_status ON background_jobs(status);
CREATE INDEX idx_background_jobs_priority ON background_jobs(priority);
CREATE INDEX idx_background_jobs_delay_until ON background_jobs(delay_until);
CREATE INDEX idx_background_jobs_created_at ON background_jobs(created_at);
```

## 📊 Database Views

### affiliate_summary

Comprehensive view of affiliate performance metrics.

```sql
CREATE VIEW affiliate_summary AS
SELECT 
    a.id,
    a.affiliate_code,
    a.first_name,
    a.last_name,
    a.affiliate_type,
    a.tier,
    a.commission_rate,
    a.total_earned,
    a.pending_payments,
    u.email,
    u.status as user_status,
    COUNT(DISTINCT r.id) as total_referrals,
    COUNT(DISTINCT CASE WHEN r.status = 'converted' THEN r.id END) as converted_referrals,
    COUNT(DISTINCT CASE WHEN c.status = 'paid' THEN c.id END) as paid_commissions,
    COALESCE(SUM(CASE WHEN c.status = 'paid' THEN c.amount END), 0) as total_paid,
    a.join_date,
    a.updated_at
FROM affiliates a
JOIN users u ON a.user_id = u.id
LEFT JOIN referrals r ON a.id = r.affiliate_id
LEFT JOIN commissions c ON a.id = c.affiliate_id
GROUP BY a.id, a.affiliate_code, a.first_name, a.last_name, a.affiliate_type, 
         a.tier, a.commission_rate, a.total_earned, a.pending_payments, 
         u.email, u.status, a.join_date, a.updated_at;
```

### monthly_commissions

Monthly commission aggregation for reporting.

```sql
CREATE VIEW monthly_commissions AS
SELECT 
    a.id as affiliate_id,
    a.affiliate_code,
    a.first_name,
    a.last_name,
    DATE_TRUNC('month', c.earned_date) as month,
    COUNT(*) as commission_count,
    SUM(c.amount) as total_amount,
    AVG(c.amount) as average_amount,
    COUNT(DISTINCT c.referral_id) as unique_referrals
FROM affiliates a
JOIN commissions c ON a.id = c.affiliate_id
WHERE c.status IN ('approved', 'paid')
GROUP BY a.id, a.affiliate_code, a.first_name, a.last_name, DATE_TRUNC('month', c.earned_date)
ORDER BY month DESC, total_amount DESC;
```

## 🔍 Database Functions

### calculate_commission_rate()

Calculate commission rate based on affiliate tier and performance.

```sql
CREATE OR REPLACE FUNCTION calculate_commission_rate(
    affiliate_tier VARCHAR(20),
    monthly_sales DECIMAL(12,2),
    referral_count INTEGER
) RETURNS DECIMAL(5,4) AS $$
DECLARE
    base_rate DECIMAL(5,4);
    performance_bonus DECIMAL(5,4) := 0.0000;
BEGIN
    -- Base rate by tier
    CASE affiliate_tier
        WHEN 'bronze' THEN base_rate := 0.1000;
        WHEN 'silver' THEN base_rate := 0.1200;
        WHEN 'gold' THEN base_rate := 0.1500;
        WHEN 'platinum' THEN base_rate := 0.2000;
        ELSE base_rate := 0.1000;
    END CASE;
    
    -- Performance bonus
    IF monthly_sales >= 10000.00 THEN
        performance_bonus := performance_bonus + 0.0100;
    END IF;
    
    IF referral_count >= 20 THEN
        performance_bonus := performance_bonus + 0.0050;
    END IF;
    
    RETURN LEAST(base_rate + performance_bonus, 0.2500);
END;
$$ LANGUAGE plpgsql;
```

### update_affiliate_tier()

Update affiliate tier based on performance metrics.

```sql
CREATE OR REPLACE FUNCTION update_affiliate_tier(affiliate_id_param UUID) RETURNS VOID AS $$
DECLARE
    monthly_sales DECIMAL(12,2);
    referral_count INTEGER;
    current_tier VARCHAR(20);
    new_tier VARCHAR(20);
BEGIN
    -- Get current performance metrics
    SELECT 
        COALESCE(SUM(c.amount), 0),
        COUNT(DISTINCT c.referral_id)
    INTO monthly_sales, referral_count
    FROM commissions c
    WHERE c.affiliate_id = affiliate_id_param
      AND c.earned_date >= DATE_TRUNC('month', CURRENT_DATE)
      AND c.status IN ('approved', 'paid');
    
    -- Get current tier
    SELECT tier INTO current_tier
    FROM affiliates
    WHERE id = affiliate_id_param;
    
    -- Determine new tier
    IF monthly_sales >= 50000.00 AND referral_count >= 50 THEN
        new_tier := 'platinum';
    ELSIF monthly_sales >= 25000.00 AND referral_count >= 30 THEN
        new_tier := 'gold';
    ELSIF monthly_sales >= 10000.00 AND referral_count >= 15 THEN
        new_tier := 'silver';
    ELSE
        new_tier := 'bronze';
    END IF;
    
    -- Update tier if changed
    IF new_tier != current_tier THEN
        UPDATE affiliates 
        SET tier = new_tier, 
            commission_rate = calculate_commission_rate(new_tier, monthly_sales, referral_count),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = affiliate_id_param;
    END IF;
END;
$$ LANGUAGE plpgsql;
```

## 🗂️ Database Triggers

### update_timestamp()

Automatically update updated_at timestamp.

```sql
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER users_update_timestamp BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER affiliates_update_timestamp BEFORE UPDATE ON affiliates
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER referrals_update_timestamp BEFORE UPDATE ON referrals
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

### log_audit_changes()

Log all data changes to audit trail.

```sql
CREATE OR REPLACE FUNCTION log_audit_changes() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        ip_address,
        user_agent
    ) VALUES (
        COALESCE(current_setting('app.current_user_id', true)::UUID, NULL),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        inet_client_addr(),
        current_setting('app.user_agent', true)
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply to core tables
CREATE TRIGGER users_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER affiliates_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON affiliates
    FOR EACH ROW EXECUTE FUNCTION log_audit_changes();
```

## 📈 Performance Indexes

### Composite Indexes for Common Queries

```sql
-- Affiliate dashboard queries
CREATE INDEX idx_affiliates_dashboard ON affiliates(user_id, status, tier) 
    INCLUDE (affiliate_code, first_name, last_name, total_earned);

-- Commission reporting
CREATE INDEX idx_commissions_reporting ON commissions(affiliate_id, earned_date, status) 
    INCLUDE (amount, type, referral_id);

-- Referral management
CREATE INDEX idx_referrals_management ON referrals(affiliate_id, status, next_follow_up) 
    INCLUDE (name, email, business_name, created_at);

-- Payout processing
CREATE INDEX idx_payouts_processing ON payouts(status, processing_date) 
    INCLUDE (amount, method, affiliate_id);
```

### Partial Indexes for Optimized Storage

```sql
-- Only index active affiliates
CREATE INDEX idx_affiliates_active ON affiliates(affiliate_code) 
    WHERE status = 'active';

-- Only index pending commissions
CREATE INDEX idx_commissions_pending ON commissions(earned_date) 
    WHERE status = 'pending';

-- Only index recent referrals
CREATE INDEX idx_referrals_recent ON referrals(created_at) 
    WHERE created_at > CURRENT_DATE - INTERVAL '30 days';
```

## 🔐 Security Constraints

### Row-Level Security (RLS)

```sql
-- Enable RLS on sensitive tables
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own commissions
CREATE POLICY commissions_user_policy ON commissions
    FOR SELECT USING (
        affiliate_id IN (
            SELECT id FROM affiliates WHERE user_id = current_setting('app.current_user_id')::UUID
        )
    );

-- Policy: Users can only see their own payouts
CREATE POLICY payouts_user_policy ON payouts
    FOR SELECT USING (
        affiliate_id IN (
            SELECT id FROM affiliates WHERE user_id = current_setting('app.current_user_id')::UUID
        )
    );
```

---

**Next**: [State Management](../frontend/state-management.md) → Frontend architecture documentation
