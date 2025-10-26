import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

export interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryDelayMultiplier: number;
  maxRetryDelay: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  retries: 3,
  retryDelay: 500,
  retryDelayMultiplier: 2,
  maxRetryDelay: 5000,
};

export class HttpClient {
  private client: AxiosInstance;
  private retryConfig: RetryConfig;

  constructor(
    baseURL?: string,
    timeout = 10000,
    retryConfig: Partial<RetryConfig> = {}
  ) {
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
    
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for logging in development
    this.client.interceptors.request.use(
      (config) => {
        if (import.meta.env.DEV) {
          console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data,
          });
        }
        return config;
      },
      (error) => {
        if (import.meta.env.DEV) {
          console.error('[HTTP] Request error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor with retry logic
    this.client.interceptors.response.use(
      (response) => {
        if (import.meta.env.DEV) {
          console.log(`[HTTP] ${response.status} ${response.config.url}`, {
            data: response.data,
          });
        }
        return response;
      },
      async (error: AxiosError) => {
        if (import.meta.env.DEV) {
          console.error('[HTTP] Response error:', error.message, {
            status: error.response?.status,
            data: error.response?.data,
          });
        }

        const config = error.config as AxiosRequestConfig & { _retryCount?: number };
        
        if (!config || !this.shouldRetry(error, config)) {
          return Promise.reject(error);
        }

        config._retryCount = (config._retryCount || 0) + 1;
        
        const delay = await this.getRetryDelay(error, config._retryCount);
        
        if (import.meta.env.DEV) {
          console.log(`[HTTP] Retrying request (${config._retryCount}/${this.retryConfig.retries}) after ${delay}ms`);
        }

        await this.sleep(delay);
        return this.client.request(config);
      }
    );
  }

  private shouldRetry(error: AxiosError, config: AxiosRequestConfig & { _retryCount?: number }): boolean {
    const retryCount = config._retryCount || 0;
    
    if (retryCount >= this.retryConfig.retries) {
      return false;
    }

    // Don't retry if it's a client error (4xx), except for 429 (Too Many Requests)
    if (error.response?.status && error.response.status >= 400 && error.response.status < 500) {
      return error.response.status === 429;
    }

    // Retry on network errors, timeouts, and 5xx server errors
    return (
      !error.response || // Network error
      error.code === 'ECONNABORTED' || // Timeout
      (error.response.status >= 500) // Server error
    );
  }

  private async getRetryDelay(error: AxiosError, retryCount: number): Promise<number> {
    // Handle 429 (Too Many Requests) with Retry-After header
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      if (retryAfter) {
        const retryAfterMs = parseInt(retryAfter, 10) * 1000;
        return Math.min(retryAfterMs, this.retryConfig.maxRetryDelay);
      }
    }

    // Exponential backoff with jitter
    const baseDelay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.retryDelayMultiplier, retryCount - 1);
    const jitter = Math.random() * 0.1 * baseDelay; // Add up to 10% jitter
    const delay = baseDelay + jitter;
    
    return Math.min(delay, this.retryConfig.maxRetryDelay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public methods for HTTP operations
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Method to get the underlying axios instance for advanced usage
  public getInstance(): AxiosInstance {
    return this.client;
  }
}

// Default client instances
export const weatherApiClient = new HttpClient('https://api.open-meteo.com/v1');
export const airQualityApiClient = new HttpClient('https://api.openaq.org/v2');

// Generic HTTP client for other APIs
export const httpClient = new HttpClient();