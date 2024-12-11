import config from './config.js';

export class DataHandler {
  constructor() {
    this.testimonialPage = 0;
    this.testimonialLimit = 3;
    this.baseUrl = config.baseUrl;
  }

  async loadServices() {
    try {
      const response = await fetch(`${this.baseUrl}/data/services.json`);
      const data = await response.json();
      return data.featured;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error loading services:', error);
      return [];
    }
  }

  async loadTestimonials(page = 0) {
    try {
      const response = await fetch(`${this.baseUrl}/data/testimonials.json`);
      const data = await response.json();
      const start = page * this.testimonialLimit;
      return {
        testimonials: data.testimonials.slice(start, start + this.testimonialLimit),
        hasMore: start + this.testimonialLimit < data.testimonials.length,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error loading testimonials:', error);
      return { testimonials: [], hasMore: false };
    }
  }

  async loadHours() {
    try {
      const response = await fetch(`${this.baseUrl}/data/hours.json`);
      const data = await response.json();
      return data.hours;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error loading hours:', error);
      return {};
    }
  }
}
