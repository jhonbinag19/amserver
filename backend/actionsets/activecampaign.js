const axios = require('axios');

class ActiveCampaign {
    constructor(apiKey, apiUrl) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
    }

    // Automation
    async getAutomations() {
        return this._makeRequest('GET', '/automation_list');
    }

    async addContactToAutomation(automationId, contactId) {
        return this._makeRequest('POST', '/automation_contact_add', {
            automation: automationId,
            contact: contactId
        });
    }

    // Campaign
    async getCampaigns() {
        return this._makeRequest('GET', '/campaign_list');
    }

    async createCampaign(data) {
        return this._makeRequest('POST', '/campaign_create', data);
    }

    async getCampaignReport(campaignId) {
        return this._makeRequest('GET', '/campaign_report_totals', { campaignid: campaignId });
    }

    // Customer
    async getCustomerAccounts() {
        return this._makeRequest('GET', '/customer_account_list');
    }

    // Deal
    async getDeals() {
        return this._makeRequest('GET', '/deal_list');
    }

    async createDeal(data) {
        return this._makeRequest('POST', '/deal_add', data);
    }

    async updateDeal(dealId, data) {
        return this._makeRequest('POST', '/deal_edit', { ...data, id: dealId });
    }

    // Contact
    async getContacts() {
        return this._makeRequest('GET', '/contact_list');
    }

    async createContact(data) {
        return this._makeRequest('POST', '/contact_add', data);
    }

    async updateContact(contactId, data) {
        return this._makeRequest('POST', '/contact_edit', { ...data, id: contactId });
    }

    // Form
    async getForms() {
        return this._makeRequest('GET', '/form_getforms');
    }

    async getFormHtml(formId) {
        return this._makeRequest('GET', '/form_html', { id: formId });
    }

    // Group
    async getGroups() {
        return this._makeRequest('GET', '/group_list');
    }

    async createGroup(name) {
        return this._makeRequest('POST', '/group_add', { name });
    }

    // List
    async getLists() {
        return this._makeRequest('GET', '/list_list');
    }

    async createList(data) {
        return this._makeRequest('POST', '/list_add', data);
    }

    // Message
    async getMessages() {
        return this._makeRequest('GET', '/message_list');
    }

    async createMessage(data) {
        return this._makeRequest('POST', '/message_add', data);
    }

    // Segment
    async getSegments() {
        return this._makeRequest('GET', '/segment_list');
    }

    // Tags
    async getTags() {
        return this._makeRequest('GET', '/tags_list');
    }

    async addTagToContact(contactId, tagId) {
        return this._makeRequest('POST', '/contact_tag_add', {
            contact: contactId,
            tag: tagId
        });
    }

    // Helper method for making API requests
    async _makeRequest(method, endpoint, data = null) {
        try {
            const url = `${this.apiUrl}${endpoint}`;
            const headers = {
                'Api-Token': this.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            };

            const config = {
                method,
                url,
                headers
            };

            if (data) {
                config.data = new URLSearchParams(data).toString();
            }

            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error('ActiveCampaign API Error:', error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = ActiveCampaign; 