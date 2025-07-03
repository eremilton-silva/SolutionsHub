import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token automaticamente
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para lidar com respostas e renovar token se necessário
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expirado, tentar renovar
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const response = await this.refreshToken(refreshToken);
              localStorage.setItem('access_token', response.data.access_token);
              
              // Repetir a requisição original
              const originalRequest = error.config;
              originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
              return this.api.request(originalRequest);
            } catch (refreshError) {
              // Refresh falhou, fazer logout
              this.logout();
              window.location.href = '/login';
            }
          } else {
            // Não tem refresh token, fazer logout
            this.logout();
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    department?: string;
  }) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async refreshToken(refreshToken: string) {
    return this.api.post('/auth/refresh', { refresh_token: refreshToken });
  }

  async logout() {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      // Ignorar erros de logout
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  // CRM methods
  async getClients(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
  }) {
    const response = await this.api.get('/crm/clients', { params });
    return response.data;
  }

  async getClient(id: string) {
    const response = await this.api.get(`/crm/clients/${id}`);
    return response.data;
  }

  async createClient(clientData: any) {
    const response = await this.api.post('/crm/clients', clientData);
    return response.data;
  }

  async updateClient(id: string, clientData: any) {
    const response = await this.api.patch(`/crm/clients/${id}`, clientData);
    return response.data;
  }

  async deleteClient(id: string) {
    await this.api.delete(`/crm/clients/${id}`);
  }

  async getClientStats() {
    const response = await this.api.get('/crm/clients/stats');
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.api.get('/health');
    return response.data;
  }

  // Generic method for custom requests
  async request(config: AxiosRequestConfig) {
    const response = await this.api.request(config);
    return response.data;
  }

  // Market Intelligence methods
  async getMarketStats() {
    const response = await this.api.get('/market-intelligence/dashboard/stats');
    return response.data;
  }

  async getMarketCharts() {
    const response = await this.api.get('/market-intelligence/dashboard/charts');
    return response.data;
  }

  async getTenders(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
    organizationState?: string;
    valueMin?: number;
    valueMax?: number;
    isOpportunity?: boolean;
    isMonitored?: boolean;
  }) {
    const response = await this.api.get('/market-intelligence/tenders', { params });
    return response.data;
  }

  async getTender(id: string) {
    const response = await this.api.get(`/market-intelligence/tenders/${id}`);
    return response.data;
  }

  async updateTender(id: string, data: any) {
    const response = await this.api.put(`/market-intelligence/tenders/${id}`, data);
    return response.data;
  }

  async markTenderAsOpportunity(id: string) {
    const response = await this.api.post(`/market-intelligence/tenders/${id}/mark-opportunity`);
    return response.data;
  }

  async syncTenders(params?: any) {
    const response = await this.api.post('/market-intelligence/tenders/sync', params);
    return response.data;
  }

  // Tender Monitoring
  async getMonitorings() {
    const response = await this.api.get('/market-intelligence/monitoring');
    return response.data;
  }

  async createMonitoring(data: any) {
    const response = await this.api.post('/market-intelligence/monitoring', data);
    return response.data;
  }

  async updateMonitoring(id: string, data: any) {
    const response = await this.api.put(`/market-intelligence/monitoring/${id}`, data);
    return response.data;
  }

  async deleteMonitoring(id: string) {
    await this.api.delete(`/market-intelligence/monitoring/${id}`);
  }

  async pauseMonitoring(id: string) {
    const response = await this.api.post(`/market-intelligence/monitoring/${id}/pause`);
    return response.data;
  }

  async resumeMonitoring(id: string) {
    const response = await this.api.post(`/market-intelligence/monitoring/${id}/resume`);
    return response.data;
  }

  // Market Analysis
  async getAnalyses() {
    const response = await this.api.get('/market-intelligence/analysis');
    return response.data;
  }

  async createAnalysis(data: any) {
    const response = await this.api.post('/market-intelligence/analysis', data);
    return response.data;
  }

  // PNCP Integration
  async searchPncp(params: any) {
    const response = await this.api.get('/market-intelligence/pncp/search', { params });
    return response.data;
  }

  async getPncpModalidades() {
    const response = await this.api.get('/market-intelligence/pncp/modalidades');
    return response.data;
  }

  async getPncpUfs() {
    const response = await this.api.get('/market-intelligence/pncp/ufs');
    return response.data;
  }

  // Opportunities methods
  async getOpportunities(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    source?: string;
    assignedUserId?: string;
    clientId?: string;
    estimatedValueMin?: number;
    estimatedValueMax?: number;
    probabilityMin?: number;
    probabilityMax?: number;
    expectedCloseDateFrom?: string;
    expectedCloseDateTo?: string;
    tags?: string;
    isOverdue?: boolean;
  }) {
    const response = await this.api.get('/opportunities', { params });
    return response.data;
  }

  async getOpportunity(id: string) {
    const response = await this.api.get(`/opportunities/${id}`);
    return response.data;
  }

  async createOpportunity(data: any) {
    const response = await this.api.post('/opportunities', data);
    return response.data;
  }

  async updateOpportunity(id: string, data: any) {
    const response = await this.api.patch(`/opportunities/${id}`, data);
    return response.data;
  }

  async deleteOpportunity(id: string) {
    const response = await this.api.delete(`/opportunities/${id}`);
    return response.data;
  }

  async getOpportunityStats(params?: {
    assignedUserId?: string;
    clientId?: string;
  }) {
    const response = await this.api.get('/opportunities/stats', { params });
    return response.data;
  }

  async updateOpportunityProbability(id: string, probability: number) {
    const response = await this.api.patch(`/opportunities/${id}/probability`, { probability });
    return response.data;
  }

  async addOpportunityTimelineEvent(id: string, event: string, description?: string, userId?: string) {
    const response = await this.api.post(`/opportunities/${id}/timeline`, {
      event,
      description,
      userId,
    });
    return response.data;
  }

  async getUpcomingFollowUps(userId?: string) {
    const response = await this.api.get('/opportunities/upcoming-follow-ups', {
      params: userId ? { userId } : {},
    });
    return response.data;
  }

  async getOverdueOpportunities(userId?: string) {
    const response = await this.api.get('/opportunities/overdue', {
      params: userId ? { userId } : {},
    });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
