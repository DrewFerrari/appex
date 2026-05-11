# Database Migrations

## 📋 Overview

This document outlines the database migration strategy for the AppEx Affiliation Portal. We use a structured, version-controlled approach to manage schema evolution while ensuring data integrity and minimal downtime.

## 🏗️ Migration Architecture

### Migration System

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Migration System                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   Source Code   │    │   Migration     │    │   Database      │ │
│  │                 │    │   Files         │    │                 │ │
│  │ • Schema        │    │ • SQL/TS        │    │ • PostgreSQL    │ │
│  │ • Types         │    │ • Rollback      │    │ • Versioning    │ │
│  │ • Seeds         │    │ • Dependencies  │    │ • Backups       │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘ │
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   CI/CD Pipeline│    │   Migration     │    │   Monitoring    │ │
│  │                 │    │   Runner        │    │                 │ │
│  │ • Test Env      │    │ • Drizzle ORM    │    │ • Health Checks │ │
│  │ • Staging Env   │    │ • Locking       │    │ • Performance   │ │
│  │ • Production    │    │ • Validation    │    │ • Alerts        │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Migration Tools

We use **Drizzle ORM** for database migrations due to its TypeScript-first approach and excellent PostgreSQL support.

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/schema/index.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config
```

## 📁 Migration Structure

### Directory Organization

```
drizzle/
├── 0001_initial_schema.sql
├── 0002_add_affiliate_tiers.sql
├── 0003_add_audit_logs.sql
├── 0004_add_commission_rates.sql
├── 0005_add_training_system.sql
├── 0006_add_background_jobs.sql
├── 0007_add_rbac_system.sql
├── 0008_optimize_indexes.sql
└── 0009_add_webhook_tracking.sql

src/schema/
├── index.ts
├── users.ts
├── affiliates.ts
├── referrals.ts
├── commissions.ts
├── payouts.ts
├── training.ts
├── audit.ts
├── rbac.ts
└── migrations.ts
```

### Migration Naming Convention

```
{version}_{description}.sql

Examples:
- 0001_initial_schema.sql
- 0002_add_affiliate_tiers.sql
- 0003_add_audit_logs.sql
- 0004_add_commission_rates.sql
```

## 🔧 Migration Workflow

### Six-Step Migration Process

#### Step 1: Development & Testing

```bash
# Create new migration
npm run db:generate

# Review generated migration
cat drizzle/000X_migration_name.sql

# Test locally
npm run db:migrate

# Run tests
npm run test:db
```

#### Step 2: Staging Deployment

```bash
# Deploy to staging
npm run deploy:staging

# Run migration on staging
npm run db:migrate:staging

# Verify data integrity
npm run db:verify:staging

# Run integration tests
npm run test:integration:staging
```

#### Step 3: Production Backup

```bash
# Create backup
kubectl exec -it postgres-pod -- pg_dump -U postgres appex_affiliate_portal > backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup
pg_restore --list backup_20240417_143000.sql
```

#### Step 4: Production Migration

```bash
# Put application in maintenance mode
kubectl annotate deployment/api-server maintenance-mode="true"

# Run migration
npm run db:migrate:production

# Verify migration success
npm run db:verify:production
```

#### Step 5: Application Deployment

```bash
# Deploy new application version
npm run deploy:production

# Remove maintenance mode
kubectl annotate deployment api-server maintenance-mode-

# Health check
curl -f https://api.appexaffiliation.com/api/health
```

#### Step 6: Post-Migration Validation

```bash
# Run smoke tests
npm run test:smoke:production

# Monitor performance
npm run monitor:performance

# Check error rates
npm run monitor:errors
```

## 📝 Migration Examples

### Example 1: Adding Affiliate Tiers

```sql
-- 0002_add_affiliate_tiers.sql

-- Add tier column to affiliates table
ALTER TABLE affiliates 
ADD COLUMN tier VARCHAR(20) DEFAULT 'bronze' 
CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum'));

-- Create commission rate configuration table
CREATE TABLE commission_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier VARCHAR(20) UNIQUE NOT NULL,
    min_monthly_sales DECIMAL(12,2) DEFAULT 0,
    min_referrals INTEGER DEFAULT 0,
    commission_rate DECIMAL(5,4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default tier configurations
INSERT INTO commission_tiers (tier, min_monthly_sales, min_referrals, commission_rate) VALUES
('bronze', 0, 0, 0.1000),
('silver', 10000, 15, 0.1200),
('gold', 25000, 30, 0.1500),
('platinum', 50000, 50, 0.2000);

-- Update existing affiliates to bronze tier
UPDATE affiliates SET tier = 'bronze' WHERE tier IS NULL;

-- Create index for tier queries
CREATE INDEX idx_affiliates_tier ON affiliates(tier);

-- Create trigger to update commission rate based on tier
CREATE OR REPLACE FUNCTION update_commission_rate()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE affiliates 
    SET commission_rate = (
        SELECT commission_rate 
        FROM commission_tiers 
        WHERE commission_tiers.tier = NEW.tier
    )
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_affiliate_commission_rate
    AFTER UPDATE OF tier ON affiliates
    FOR EACH ROW
    EXECUTE FUNCTION update_commission_rate();
```

### Example 2: Adding Audit Logging

```sql
-- 0003_add_audit_logs.sql

-- Create audit logs table
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

-- Create indexes for audit queries
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_resource_id ON audit_logs(resource_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION log_audit_changes()
RETURNS TRIGGER AS $$
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

-- Apply audit triggers to core tables
CREATE TRIGGER users_audit_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER affiliates_audit_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON affiliates
    FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER referrals_audit_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON referrals
    FOR EACH ROW EXECUTE FUNCTION log_audit_changes();
```

### Example 3: Performance Optimization

```sql
-- 0008_optimize_indexes.sql

-- Drop inefficient indexes
DROP INDEX IF EXISTS idx_affiliates_email;
DROP INDEX IF EXISTS idx_referrals_created_at;

-- Create optimized composite indexes
CREATE INDEX CONCURRENTLY idx_affiliates_status_tier 
ON affiliates(status, tier) 
INCLUDE (affiliate_code, first_name, last_name, commission_rate);

CREATE INDEX CONCURRENTLY idx_referrals_affiliate_status_created 
ON referrals(affiliate_id, status, created_at) 
INCLUDE (name, email, business_name);

CREATE INDEX CONCURRENTLY idx_commissions_affiliate_date_status 
ON commissions(affiliate_id, earned_date, status) 
INCLUDE (amount, type, referral_id);

-- Create partial indexes for common queries
CREATE INDEX CONCURRENTLY idx_affiliates_active 
ON affiliates(affiliate_code) 
WHERE status = 'active';

CREATE INDEX CONCURRENTLY idx_commissions_pending 
ON commissions(earned_date) 
WHERE status = 'pending';

-- Create JSON indexes for audit logs
CREATE INDEX CONCURRENTLY idx_audit_logs_details_gin 
ON audit_logs USING gin(details);

-- Create full-text search index
CREATE INDEX CONCURRENTLY idx_affiliates_search 
ON affiliates USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(bio, '')));

-- Analyze tables for query planner
ANALYZE affiliates;
ANALYZE referrals;
ANALYZE commissions;
ANALYZE audit_logs;
```

## 🛡️ Migration Safety Rules

### Rule 1: No Direct Production Changes

```bash
# ❌ NEVER do this in production
psql -d appex_affiliate_portal -c "ALTER TABLE users ADD COLUMN temp VARCHAR(50);"

# ✅ ALWAYS use migration system
npm run db:generate
npm run db:migrate:production
```

### Rule 2: Always Test Migrations

```typescript
// tests/migrations.test.ts
import { migrate } from 'drizzle-node/postgres-js/migrator'
import { db } from '../src/database'

describe('Database Migrations', () => {
  beforeEach(async () => {
    // Reset to clean state
    await db.execute('DROP SCHEMA public CASCADE')
    await db.execute('CREATE SCHEMA public')
  })

  it('should run all migrations successfully', async () => {
    await expect(migrate(db, { migrationsFolder: './drizzle' }))
      .resolves.not.toThrow()
  })

  it('should maintain data integrity', async () => {
    // Run migrations
    await migrate(db, { migrationsFolder: './drizzle' })
    
    // Test basic operations
    await db.insert(users).values({
      email: 'test@example.com',
      passwordHash: 'hash',
    })
    
    const result = await db.select().from(users)
    expect(result).toHaveLength(1)
  })
})
```

### Rule 3: Use CONCURRENTLY for Indexes

```sql
-- ❌ Blocking index creation
CREATE INDEX idx_large_table ON large_table(column_name);

-- ✅ Non-blocking index creation
CREATE INDEX CONCURRENTLY idx_large_table ON large_table(column_name);
```

### Rule 4: Handle NOT NULL Constraints Carefully

```sql
-- ❌ Risky - may fail if data exists
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NOT NULL;

-- ✅ Safe approach
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
UPDATE users SET phone = '' WHERE phone IS NULL;
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
```

## 🔄 Rollback Strategy

### Rollback Planning

Every migration must include a rollback script:

```sql
-- 0002_add_affiliate_tiers.sql.rollback

-- Remove triggers
DROP TRIGGER IF EXISTS update_affiliate_commission_rate ON affiliates;

-- Remove function
DROP FUNCTION IF EXISTS update_commission_rate();

-- Remove index
DROP INDEX IF EXISTS idx_affiliates_tier;

-- Remove commission tiers table
DROP TABLE IF EXISTS commission_tiers;

-- Remove tier column from affiliates
ALTER TABLE affiliates DROP COLUMN IF EXISTS tier;
```

### Automated Rollback

```typescript
// src/scripts/rollback-migration.ts
import { migrate } from 'drizzle-node/postgres-js/migrator'
import { db } from '../src/database'

async function rollbackMigration(version: string): Promise<void> {
  console.log(`Rolling back migration: ${version}`)
  
  try {
    // Execute rollback script
    const rollbackScript = await fs.readFile(`drizzle/${version}.rollback.sql`, 'utf8')
    await db.execute(rollbackScript)
    
    // Update migration version
    await db.execute(`
      DELETE FROM drizzle_migrations 
      WHERE hash = $1
    `, [version])
    
    console.log(`Successfully rolled back migration: ${version}`)
  } catch (error) {
    console.error(`Failed to rollback migration ${version}:`, error)
    throw error
  }
}
```

## 📊 Migration Monitoring

### Health Checks

```typescript
// src/services/migration-health.service.ts
export class MigrationHealthService {
  async checkMigrationHealth(): Promise<MigrationHealth> {
    const [pendingMigrations, failedMigrations, migrationAge] = await Promise.all([
      this.getPendingMigrations(),
      this.getFailedMigrations(),
      this.getMigrationAge(),
    ])

    return {
      status: this.calculateHealthStatus(pendingMigrations, failedMigrations, migrationAge),
      pendingMigrations,
      failedMigrations,
      migrationAge,
      lastMigration: await this.getLastMigration(),
    }
  }

  private calculateHealthStatus(
    pending: number,
    failed: number,
    age: number
  ): 'healthy' | 'warning' | 'critical' {
    if (failed > 0) return 'critical'
    if (pending > 0 || age > 86400000) return 'warning' // 24 hours
    return 'healthy'
  }
}
```

### Performance Monitoring

```sql
-- Monitor migration performance
SELECT 
    query,
    mean_time,
    calls,
    total_time
FROM pg_stat_statements 
WHERE query LIKE '%migration%' 
ORDER BY mean_time DESC;

-- Check for long-running transactions
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query
FROM pg_stat_activity 
WHERE state = 'active' 
  AND now() - pg_stat_activity.query_start > interval '5 minutes';
```

## 🚀 CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/database-migrations.yml
name: Database Migrations

on:
  push:
    paths:
      - 'drizzle/**'
      - 'src/schema/**'
  pull_request:
    paths:
      - 'drizzle/**'
      - 'src/schema/**'

jobs:
  test-migrations:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate migrations
        run: npm run db:generate
      
      - name: Run migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Run tests
        run: npm run test:db
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

  deploy-migrations:
    needs: test-migrations
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to production
        run: |
          # Create backup
          kubectl exec -it postgres-pod -- pg_dump -U postgres appex_affiliate_portal > backup.sql
          
          # Run migrations
          npm run db:migrate:production
          
          # Verify deployment
          npm run db:verify:production
```

## 📋 Migration Checklist

### Pre-Migration Checklist
- [ ] Migration script reviewed by senior developer
- [ ] Rollback script tested and verified
- [ ] Database backup created
- [ ] Migration tested in staging environment
- [ ] Performance impact assessed
- [ ] Communication plan prepared
- [ ] Maintenance window scheduled (if needed)

### Post-Migration Checklist
- [ ] Migration completed successfully
- [ ] Application deployed and healthy
- [ ] Data integrity verified
- [ ] Performance metrics normal
- [ ] Error rates within acceptable range
- [ ] Rollback plan no longer needed
- [ ] Documentation updated
- [ ] Team debrief conducted

---

**Next**: [CI/CD Pipeline](./cicd.md) → Build and deployment automation documentation
