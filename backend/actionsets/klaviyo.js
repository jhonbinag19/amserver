const axios = require('axios');

class Klaviyo {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://a.klaviyo.com/api';
        this.clientBaseUrl = 'https://a.klaviyo.com/client';
    }

    // Tags
    async getTags() {
        return this._makeRequest('GET', '/tags');
    }

    async createTag(name) {
        return this._makeRequest('POST', '/tags', { name });
    }

    // Segments
    async getSegments() {
        return this._makeRequest('GET', '/segments');
    }

    async createSegment(name, conditions) {
        return this._makeRequest('POST', '/segments', { name, conditions });
    }

    // Reviews
    async getClientReviews() {
        return this._makeRequest('GET', '/client/reviews');
    }

    async createClientReview(data) {
        return this._makeRequest('POST', '/client/reviews', data);
    }

    // Lists
    async getLists() {
        return this._makeRequest('GET', '/lists');
    }

    async createList(name) {
        return this._makeRequest('POST', '/lists', { name });
    }

    // Forms
    async getForms() {
        return this._makeRequest('GET', '/forms');
    }

    async getForm(formId) {
        return this._makeRequest('GET', `/forms/${formId}`);
    }

    // Flows
    async getFlows() {
        return this._makeRequest('GET', '/flows');
    }

    async createFlow(name, trigger) {
        return this._makeRequest('POST', '/flows', { name, trigger });
    }

    // Campaigns
    async getCampaigns() {
        return this._makeRequest('GET', '/campaigns');
    }

    async createCampaign(name, type, listId) {
        return this._makeRequest('POST', '/campaigns', { name, type, list_id: listId });
    }

    // Client API
    async createClientEvent(eventName, properties, customerProperties) {
        return this._makeRequest('POST', '/client/events', {
            event: eventName,
            properties,
            customer_properties: customerProperties
        });
    }

    async createClientProfile(properties) {
        return this._makeRequest('POST', '/client/profiles', { properties });
    }

    // Helper method for making API requests
    async _makeRequest(method, endpoint, data = null) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const headers = {
                'Authorization': `Klaviyo-API-Key ${this.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const config = {
                method,
                url,
                headers
            };

            if (data) {
                config.data = data;
            }

            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error('Klaviyo API Error:', error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = Klaviyo; 