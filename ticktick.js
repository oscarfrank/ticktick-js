// ticktick.js

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

class TickTick {
  constructor() {
    this.clientId = process.env.TICKTICK_CLIENT_ID;
    this.clientSecret = process.env.TICKTICK_CLIENT_SECRET;
    this.baseUrl = 'https://api.ticktick.com/api/v2';
    this.token = null;
    this.tokenExpiry = null;
  }

  async authenticate() {
    if (this.token && this.tokenExpiry > Date.now()) {
      return;
    }

    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': this.clientId,
        'client_secret': this.clientSecret
      })
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.token = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000);
  }

  async request(endpoint, method = 'GET', body = null) {
    await this.authenticate();

    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };

    const options = {
      method,
      headers
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async addTask(title, content = '', dueDate = null, priority = 0, listId = null) {
    const task = {
      title,
      content,
      dueDate,
      priority
    };
    if (listId) task.projectId = listId;

    return this.request('/task', 'POST', task);
  }

  async updateTask(taskId, updates) {
    return this.request(`/task/${taskId}`, 'PATCH', updates);
  }

  async deleteTask(taskId) {
    return this.request(`/task/${taskId}`, 'DELETE');
  }

  async getTask(taskId) {
    return this.request(`/task/${taskId}`);
  }

  async listTasks(filter = 'all', startDate = null, endDate = null, listId = null) {
    let endpoint = '/task';
    const queryParams = [];

    if (filter !== 'all') {
      queryParams.push(`status=${filter}`);
    }
    if (startDate) {
      queryParams.push(`startDate=${startDate}`);
    }
    if (endDate) {
      queryParams.push(`endDate=${endDate}`);
    }
    if (listId) {
      queryParams.push(`projectId=${listId}`);
    }

    if (queryParams.length > 0) {
      endpoint += '?' + queryParams.join('&');
    }

    return this.request(endpoint);
  }

  async createList(title) {
    return this.request('/project', 'POST', { name: title });
  }

  async updateList(listId, updates) {
    return this.request(`/project/${listId}`, 'PATCH', updates);
  }

  async deleteList(listId) {
    return this.request(`/project/${listId}`, 'DELETE');
  }

  async getLists() {
    return this.request('/project');
  }

  async completeTask(taskId) {
    return this.updateTask(taskId, { status: 2 });
  }

  async uncompleteTask(taskId) {
    return this.updateTask(taskId, { status: 0 });
  }

  async moveTask(taskId, toListId) {
    return this.updateTask(taskId, { projectId: toListId });
  }

  async searchTasks(keyword) {
    return this.request(`/task/search?keyword=${encodeURIComponent(keyword)}`);
  }
}

export default TickTick;