-- Organizations policies
CREATE POLICY "Users can view their own organizations"
ON organizations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = organizations.id
    AND organization_members.user_id = auth.uid()
  )
);

CREATE POLICY "Organization owners can manage their organizations"
ON organizations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = organizations.id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role = 'owner'
  )
);

-- Users policies
CREATE POLICY "Users can view their own profile"
ON users FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (id = auth.uid());

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

-- GHL Agency Accounts policies
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

-- GHL Sub Accounts policies
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

CREATE POLICY "Organization admins can manage workflows"
ON workflows FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = workflows.organization_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'admin')
  )
);

-- App Configurations policies
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

-- Payment methods policies
CREATE POLICY "Users can view their organization's payment methods"
ON payment_methods FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_members.organization_id = payment_methods.organization_id
    AND organization_members.user_id = auth.uid()
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