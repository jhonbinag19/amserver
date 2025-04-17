-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Organizations policies
CREATE POLICY "Users can view organizations they are members of"
ON organizations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = organizations.id
    AND organization_members.user_id = auth.uid()
  )
);

CREATE POLICY "Organization owners can update their organization"
ON organizations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = organizations.id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role = 'owner'
  )
);

-- Organization members policies
CREATE POLICY "Users can view members of their organizations"
ON organization_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members om
    WHERE om.organization_id = organization_members.organization_id
    AND om.user_id = auth.uid()
  )
);

CREATE POLICY "Organization owners can manage members"
ON organization_members FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM organization_members om
    WHERE om.organization_id = organization_members.organization_id
    AND om.user_id = auth.uid()
    AND om.role = 'owner'
  )
);

-- Available apps policies
CREATE POLICY "Anyone can view available apps"
ON available_apps FOR SELECT
USING (is_active = true);

CREATE POLICY "Only admins can manage available apps"
ON available_apps FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  )
);

-- App configurations policies
CREATE POLICY "Users can view their organization's app configurations"
ON app_configurations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = app_configurations.organization_id
    AND organization_members.user_id = auth.uid()
  )
);

CREATE POLICY "Organization admins can manage app configurations"
ON app_configurations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = app_configurations.organization_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'admin')
  )
);

-- Workflows policies
CREATE POLICY "Users can view their organization's workflows"
ON workflows FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = workflows.organization_id
    AND organization_members.user_id = auth.uid()
  )
);

CREATE POLICY "Organization members can create workflows"
ON workflows FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = workflows.organization_id
    AND organization_members.user_id = auth.uid()
  )
);

CREATE POLICY "Organization admins can manage workflows"
ON workflows FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = workflows.organization_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'admin')
  )
);

-- Payment methods policies
CREATE POLICY "Users can view their organization's payment methods"
ON payment_methods FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = payment_methods.organization_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Organization admins can manage payment methods"
ON payment_methods FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = payment_methods.organization_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'admin')
  )
);

-- Admin settings policies
CREATE POLICY "Only admins can view admin settings"
ON admin_settings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  )
);

CREATE POLICY "Only admins can manage admin settings"
ON admin_settings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  )
);

-- Audit logs policies
CREATE POLICY "Users can view their organization's audit logs"
ON audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = audit_logs.organization_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'admin')
  )
);

-- GoHighLevel Agency Accounts policies
CREATE POLICY "Users can view their organization's GHL agency accounts"
ON ghl_agency_accounts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = ghl_agency_accounts.organization_id
    AND organization_members.user_id = auth.uid()
  )
);

CREATE POLICY "Organization admins can manage GHL agency accounts"
ON ghl_agency_accounts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = ghl_agency_accounts.organization_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'admin')
  )
);

-- GoHighLevel Sub Accounts policies
CREATE POLICY "Users can view their organization's GHL sub accounts"
ON ghl_sub_accounts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members om
    JOIN ghl_agency_accounts gaa ON gaa.organization_id = om.organization_id
    WHERE gaa.id = ghl_sub_accounts.agency_account_id
    AND om.user_id = auth.uid()
  )
);

CREATE POLICY "Organization admins can manage GHL sub accounts"
ON ghl_sub_accounts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM organization_members om
    JOIN ghl_agency_accounts gaa ON gaa.organization_id = om.organization_id
    WHERE gaa.id = ghl_sub_accounts.agency_account_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

-- GoHighLevel Integration Settings policies
CREATE POLICY "Users can view their organization's GHL integration settings"
ON ghl_integration_settings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = ghl_integration_settings.organization_id
    AND organization_members.user_id = auth.uid()
  )
);

CREATE POLICY "Organization admins can manage GHL integration settings"
ON ghl_integration_settings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = ghl_integration_settings.organization_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'admin')
  )
);

-- GoHighLevel Webhook Subscriptions policies
CREATE POLICY "Users can view their organization's GHL webhook subscriptions"
ON ghl_webhook_subscriptions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = ghl_webhook_subscriptions.organization_id
    AND organization_members.user_id = auth.uid()
  )
);

CREATE POLICY "Organization admins can manage GHL webhook subscriptions"
ON ghl_webhook_subscriptions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = ghl_webhook_subscriptions.organization_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'admin')
  )
); 