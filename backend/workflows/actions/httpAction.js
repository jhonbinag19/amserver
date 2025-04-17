export const httpAction = {
  type: 'http',
  
  async execute(config, variables) {
    const {
      method = 'GET',
      url,
      headers = {},
      body,
      queryParams = {}
    } = config;

    // Replace variables in URL and headers
    const processedUrl = this.replaceVariables(url, variables);
    const processedHeaders = this.replaceVariables(headers, variables);
    const processedBody = this.replaceVariables(body, variables);
    const processedQueryParams = this.replaceVariables(queryParams, variables);

    // Construct final URL with query parameters
    const finalUrl = new URL(processedUrl);
    Object.entries(processedQueryParams).forEach(([key, value]) => {
      finalUrl.searchParams.append(key, value);
    });

    try {
      const response = await fetch(finalUrl.toString(), {
        method,
        headers: processedHeaders,
        body: processedBody ? JSON.stringify(processedBody) : undefined
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { response: data };
    } catch (error) {
      throw new Error(`HTTP action failed: ${error.message}`);
    }
  },

  // Helper method to replace variables in objects
  replaceVariables(obj, variables) {
    if (typeof obj === 'string') {
      return obj.replace(/\${([^}]+)}/g, (match, key) => {
        return variables[key] || match;
      });
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const result = Array.isArray(obj) ? [] : {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.replaceVariables(value, variables);
      }
      return result;
    }
    
    return obj;
  }
}; 