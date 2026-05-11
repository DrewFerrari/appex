# Incident Runbook

## 📋 Overview

This incident runbook provides standardized procedures for identifying, responding to, and resolving incidents in the AppEx Affiliation Portal. It ensures consistent handling of operational issues while minimizing downtime and impact on users.

## 🚨 Severity Classification

### Severity Levels

| Severity | Definition | Response Time | Resolution Target | Escalation |
|----------|------------|---------------|-------------------|------------|
| **SEV-0** | Business-critical outage affecting all users | 5 minutes | 1 hour | Immediate |
| **SEV-1** | Critical service degradation affecting many users | 15 minutes | 4 hours | 30 minutes |
| **SEV-2** | Significant feature failure affecting some users | 1 hour | 24 hours | 4 hours |
| **SEV-3** | Minor issue with limited impact | 4 hours | 72 hours | 24 hours |
| **SEV-4** | Low-priority issue or improvement request | 24 hours | 1 week | No escalation |

### Incident Triage

```typescript
// src/services/incident.service.ts
export class IncidentService {
  classifyIncident(incident: {
    affectedUsers: number
    totalUsers: number
    serviceImpact: 'critical' | 'significant' | 'minor'
    businessImpact: 'high' | 'medium' | 'low'
  }): Severity {
    const affectedPercentage = (incident.affectedUsers / incident.totalUsers) * 100
    
    // SEV-0: Complete outage or critical business impact
    if (incident.serviceImpact === 'critical' || 
        incident.businessImpact === 'high' || 
        affectedPercentage > 90) {
      return 'SEV-0'
    }
    
    // SEV-1: Major degradation
    if (incident.serviceImpact === 'significant' || 
        affectedPercentage > 50) {
      return 'SEV-1'
    }
    
    // SEV-2: Significant issue
    if (affectedPercentage > 10 || 
        incident.businessImpact === 'medium') {
      return 'SEV-2'
    }
    
    // SEV-3: Minor issue
    if (affectedPercentage > 1) {
      return 'SEV-3'
    }
    
    return 'SEV-4'
  }
}
```

## 📞 Incident Response Process

### Initial Response Checklist

1. **Acknowledge Incident** (5 minutes)
   - [ ] Create incident ticket in tracking system
   - [ ] Set severity level based on impact
   - [ ] Notify on-call engineer
   - [ ] Post initial status to status page

2. **Assess Impact** (15 minutes)
   - [ ] Determine affected services
   - [ ] Estimate number of affected users
   - [ ] Check monitoring dashboards
   - [ ] Review recent deployments/changes

3. **Form Response Team** (30 minutes)
   - [ ] Assign incident commander
   - [ ] Notify required specialists
   - [ ] Establish communication channel
   - [ ] Set up incident bridge

### Communication Templates

#### Initial Incident Notification

```
🚨 INCIDENT DECLARED - SEV-{severity}

Service: {service_name}
Impact: {impact_description}
Started: {timestamp}
Affected Users: {number}

Investigation in progress. Next update in 30 minutes.

#incident-{incident_id}
```

#### Status Update Template

```
📊 INCIDENT UPDATE - SEV-{severity}

Incident: {incident_id}
Service: {service_name}
Duration: {duration}
Status: {status}

Current Situation:
{current_status}

Next Steps:
{next_steps}

ETA for Resolution: {eta}

#incident-{incident_id}
```

#### Resolution Template

```
✅ INCIDENT RESOLVED - SEV-{severity}

Incident: {incident_id}
Service: {service_name}
Duration: {total_duration}
Resolved At: {timestamp}

Root Cause:
{root_cause}

Resolution:
{resolution_steps}

Preventive Measures:
{preventive_actions}

Post-mortem scheduled: {post_mortem_date}

#incident-{incident_id}
```

## 🔧 Common Incident Scenarios

### Scenario 1: API 5xx Errors

#### Detection
- Error rate > 5% over 5 minutes
- Response time > 2 seconds
- Health check failures

#### Immediate Actions
```bash
# 1. Check service status
kubectl get pods -n appex
kubectl logs -f deployment/api-server -n appex

# 2. Check database connectivity
kubectl exec -it postgres-pod -- psql -U postgres -d appex_db -c "SELECT 1;"

# 3. Check Redis connectivity
kubectl exec -it redis-pod -- redis-cli ping

# 4. Check recent deployments
kubectl rollout history deployment/api-server -n appex
```

#### Troubleshooting Steps
1. **Database Issues**
   ```bash
   # Check database connections
   SELECT count(*) FROM pg_stat_activity;
   
   # Check slow queries
   SELECT query, mean_time, calls 
   FROM pg_stat_statements 
   ORDER BY mean_time DESC 
   LIMIT 10;
   ```

2. **Memory/CPU Issues**
   ```bash
   # Check resource usage
   kubectl top pods -n appex
   
   # Scale up if needed
   kubectl scale deployment api-server --replicas=6 -n appex
   ```

3. **Recent Deployment Issues**
   ```bash
   # Rollback if needed
   kubectl rollout undo deployment/api-server -n appex
   ```

#### Escalation Triggers
- Error rate > 20% for 10 minutes
- Complete service outage
- Database connection failures

### Scenario 2: Database Performance Degradation

#### Detection
- Query response time > 500ms
- Database CPU > 80%
- Connection pool exhaustion

#### Immediate Actions
```sql
-- 1. Check active connections
SELECT count(*), state 
FROM pg_stat_activity 
GROUP BY state;

-- 2. Check long-running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';

-- 3. Check table sizes
SELECT schemaname,tablename,pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### Performance Optimization
```sql
-- Kill long-running queries
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE (now() - query_start) > interval '10 minutes';

-- Update statistics
ANALYZE;

-- Rebuild indexes if needed
REINDEX DATABASE appex_affiliate_portal;
```

### Scenario 3: Payment Processing Failure

#### Detection
- Paynow webhook failures
- Commission calculation errors
- Payout processing failures

#### Immediate Actions
```typescript
// Check payment service status
const paymentStatus = await checkPaymentServiceHealth()
if (!paymentStatus.healthy) {
  // Switch to backup payment processor
  await switchToBackupProcessor()
  
  // Notify affected users
  await notifyPaymentInterruption()
}

// Check commission calculations
const failedCalculations = await getFailedCommissionCalculations()
if (failedCalculations.length > 0) {
  // Queue for retry
  await queueFailedCalculations(failedCalculations)
}
```

#### Recovery Procedures
1. **Payment Gateway Issues**
   - Switch to backup provider
   - Queue failed transactions for retry
   - Notify users of processing delays

2. **Commission Calculation Errors**
   - Identify failed calculations
   - Fix data inconsistencies
   - Recalculate affected commissions

### Scenario 4: Email Service Outage

#### Detection
- Email delivery failure rate > 10%
- SMTP connection timeouts
- Bounce rate increase

#### Immediate Actions
```typescript
// Switch to backup email service
await emailService.switchToBackupProvider()

// Queue failed emails for retry
const failedEmails = await emailService.getFailedEmails()
await emailService.queueRetry(failedEmails)

// Update user notifications
await notificationService.updateDeliveryStatus({
  channel: 'email',
  status: 'degraded',
  message: 'Email delivery experiencing delays'
})
```

## 📊 Monitoring & Alerting

### Critical Metrics

| Metric | Threshold | Alert Level | Escalation |
|--------|-----------|-------------|------------|
| API Error Rate | >5% | Warning | 15 minutes |
| API Response Time | >2s (p95) | Warning | 15 minutes |
| Database CPU | >80% | Critical | 5 minutes |
| Database Connections | >90% of pool | Critical | 5 minutes |
| Redis Memory | >85% | Warning | 15 minutes |
| Queue Length | >1000 jobs | Warning | 30 minutes |
| Failed Login Rate | >10% | Critical | 5 minutes |

### Alert Configuration

```yaml
# prometheus-alerts.yml
groups:
  - name: appex-critical
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }}"

      - alert: DatabaseConnectionsHigh
        expr: db_connections_active / db_connections_max > 0.9
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Database connection pool exhausted"
          description: "{{ $value | humanizePercentage }} of connections in use"
```

## 🔄 Post-Incident Procedures

### Post-Mortem Template

```markdown
# Post-Mortem: {incident_title}

**Date:** {date}
**Incident ID:** {incident_id}
**Severity:** {severity}
**Duration:** {duration}
**Author:** {author}

## Summary
{brief_summary}

## Timeline
- {timestamp}: {event}
- {timestamp}: {event}
- {timestamp}: {event}

## Impact
- **Users Affected:** {number}
- **Revenue Impact:** {amount}
- **Customer Satisfaction:** {impact}

## Root Cause Analysis
{detailed_analysis}

## What Went Well
- {positive_aspect_1}
- {positive_aspect_2}

## What Went Wrong
- {negative_aspect_1}
- {negative_aspect_2}

## Action Items
- [ ] {action_item_1} (Owner: {person}, Due: {date})
- [ ] {action_item_2} (Owner: {person}, Due: {date})
- [ ] {action_item_3} (Owner: {person}, Due: {date})

## Preventive Measures
{preventive_actions}

## Lessons Learned
{lessons_learned}
```

### Follow-up Tracking

```typescript
// src/services/post-mortem.service.ts
export class PostMortemService {
  async createPostMortem(incidentId: string, data: PostMortemData): Promise<PostMortem> {
    const postMortem = await this.database.query(`
      INSERT INTO post_mortems (incident_id, title, summary, timeline, impact, root_cause, action_items, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [incidentId, data.title, data.summary, data.timeline, data.impact, data.rootCause, data.actionItems, new Date()])
    
    // Create action items
    for (const item of data.actionItems) {
      await this.createActionItem(postMortem.id, item)
    }
    
    return postMortem.rows[0]
  }
  
  async trackActionItem(itemId: string, status: 'pending' | 'in_progress' | 'completed'): Promise<void> {
    await this.database.query(`
      UPDATE action_items 
      SET status = $1, updated_at = $2 
      WHERE id = $3
    `, [status, new Date(), itemId])
  }
}
```

## 📱 Emergency Contacts

### On-Call Rotation

| Role | Primary | Backup | Contact |
|------|---------|--------|---------|
| **Incident Commander** | John Doe | Jane Smith | +263-712-345-678 |
| **Backend Engineer** | Mike Johnson | Sarah Wilson | +263-773-456-789 |
| **Database Admin** | David Brown | Emily Davis | +263-783-567-890 |
| **DevOps Engineer** | Chris Lee | Lisa Anderson | +263-713-678-901 |
| **Product Manager** | Alex Taylor | Morgan White | +263-723-789-012 |

### Escalation Contacts

| Situation | Contact | Phone | Email |
|-----------|---------|-------|-------|
| **Critical Outage** | CTO | +263-714-890-123 | cto@appex.co.zw |
| **Security Incident** | Security Lead | +263-724-901-234 | security@appex.co.zw |
| **Legal/Compliance** | Legal Counsel | +263-734-012-345 | legal@appex.co.zw |
| **PR/Media** | Communications | +263-744-123-456 | comms@appex.co.zw |

### External Services

| Service | Contact | Priority |
|---------|---------|----------|
| **Railway (Hosting)** | support@railway.app | High |
| **Cloudinary (CDN)** | support@cloudinary.com | Medium |
| **Paynow (Payments)** | support@paynow.co.zw | High |
| **Africa's Talking (SMS)** | support@africastalking.com | Medium |
| **Google Workspace** | support@google.com | Low |

## 🛠️ Quick Reference Commands

### System Health Checks

```bash
# API Health
curl -f https://api.appexaffiliation.com/api/health

# Database Health
kubectl exec -it postgres-pod -- pg_isready

# Redis Health
kubectl exec -it redis-pod -- redis-cli ping

# Queue Status
redis-cli llen email-sending
redis-cli llen pdf-generation
```

### Log Analysis

```bash
# API Logs
kubectl logs -f deployment/api-server -n appex --since=1h

# Database Logs
kubectl logs -f postgres-statefulset-0 -n appex --since=1h

# Error Logs
kubectl logs deployment/api-server -n appex | grep ERROR

# Recent Errors
journalctl -u appex-api --since "1 hour ago" -p err
```

### Performance Diagnostics

```bash
# Database Performance
kubectl exec -it postgres-pod -- psql -U postgres -d appex_db -c "
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;"

# API Performance
curl -w "@curl-format.txt" -o /dev/null -s "https://api.appexaffiliation.com/api/dashboard"

# Memory Usage
kubectl top pods -n appex --sort-by=memory
```

### Emergency Procedures

```bash
# Scale up services
kubectl scale deployment api-server --replicas=10 -n appex

# Restart services
kubectl rollout restart deployment/api-server -n appex

# Force update
kubectl rollout undo deployment/api-server -n appex

# Emergency maintenance mode
kubectl annotate deployment/api-server maintenance-mode="true" -n appex
```

## 📋 Incident Response Checklist

### Pre-Incident Preparation
- [ ] On-call schedule updated
- [ ] Monitoring dashboards accessible
- [ ] Communication tools tested
- [ ] Emergency contacts verified
- [ ] Documentation up to date

### During Incident
- [ ] Incident declared and classified
- [ ] Response team assembled
- [ ] Communication channel established
- [ ] Status page updated
- [ ] Root cause investigation started
- [ ] Mitigation actions implemented
- [ ] Regular status updates provided

### Post-Incident
- [ ] Resolution confirmed
- [ ] All systems restored
- [ ] Post-mortem initiated
- [ ] Action items created
- [ ] Follow-up scheduled
- [ ] Documentation updated
- [ ] Team debrief conducted

---

**Next**: [Database Migrations](../deployment/migrations.md) → Schema evolution workflow documentation
