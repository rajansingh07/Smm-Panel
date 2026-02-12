const axios = require('axios');
const config = require('../config');

class SMMProvider {
  constructor() {
    this.baseUrl = config.smmProvider.url;
    this.apiKey = config.smmProvider.apiKey;
  }

  /**
   * Make API request to SMM provider
   * @param {Object} params - Request parameters
   * @returns {Promise<Object>} - API response
   */
  async makeRequest(params) {
    try {
      const response = await axios.post(this.baseUrl, {
        key: this.apiKey,
        ...params,
      });

      return response.data;
    } catch (error) {
      console.error('SMM Provider API Error:', error.message);
      throw new Error(
        error.response?.data?.error || 'SMM Provider API request failed'
      );
    }
  }

  /**
   * Create an order on SMM provider
   * @param {string} serviceId - Provider service ID
   * @param {string} link - Target link
   * @param {number} quantity - Order quantity
   * @returns {Promise<Object>} - Order response with order ID
   */
  async createOrder(serviceId, link, quantity) {
    const params = {
      action: 'add',
      service: serviceId,
      link: link,
      quantity: quantity,
    };

    const response = await this.makeRequest(params);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Check status of an order
   * @param {string} orderId - Provider order ID
   * @returns {Promise<Object>} - Order status
   */
  async checkOrderStatus(orderId) {
    const params = {
      action: 'status',
      order: orderId,
    };

    const response = await this.makeRequest(params);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Check status of multiple orders
   * @param {Array<string>} orderIds - Array of provider order IDs
   * @returns {Promise<Object>} - Orders statuses
   */
  async checkMultipleOrderStatus(orderIds) {
    const params = {
      action: 'status',
      orders: orderIds.join(','),
    };

    const response = await this.makeRequest(params);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Get available services from provider
   * @returns {Promise<Array>} - List of services
   */
  async getServices() {
    const params = {
      action: 'services',
    };

    const response = await this.makeRequest(params);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Get account balance
   * @returns {Promise<Object>} - Balance info
   */
  async getBalance() {
    const params = {
      action: 'balance',
    };

    const response = await this.makeRequest(params);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Cancel an order
   * @param {string} orderId - Provider order ID
   * @returns {Promise<Object>} - Cancel response
   */
  async cancelOrder(orderId) {
    const params = {
      action: 'cancel',
      order: orderId,
    };

    const response = await this.makeRequest(params);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Request refill for an order
   * @param {string} orderId - Provider order ID
   * @returns {Promise<Object>} - Refill response
   */
  async refillOrder(orderId) {
    const params = {
      action: 'refill',
      order: orderId,
    };

    const response = await this.makeRequest(params);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }
}

module.exports = new SMMProvider();
