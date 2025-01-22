import config from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const baseUrl = config.baseUrl;

  // Initialize services section
  const servicesGrid = document.querySelector('.services-grid');
  if (servicesGrid) {
    const servicesPath = `${baseUrl}/data/services.json`;
    servicesGrid.setAttribute('hx-get', servicesPath);
    htmx.process(servicesGrid);
    htmx.trigger(servicesGrid, 'load');
  }

  // Initialize hours section
  const hoursDiv = document.querySelector('.footer-hours > div');
  if (hoursDiv) {
    const hoursPath = `${baseUrl}/data/hours.json`;
    hoursDiv.setAttribute('hx-get', hoursPath);
    htmx.process(hoursDiv);
    htmx.trigger(hoursDiv, 'load');
  }

  // Initialize book now buttons
  document.querySelectorAll('.book-now-btn, .cta-button').forEach(button => {
    const bookingPath = `${baseUrl}/data/booking-form.json`;
    button.setAttribute('hx-get', bookingPath);
    htmx.process(button);
  });

  // Testimonials handling
  let currentPage = 0;
  const ITEMS_PER_PAGE = 1;

  const renderTestimonialPage = async () => {
    try {
      const response = await fetch(`${baseUrl}/data/testimonials.json`);
      const data = await response.json();
      const testimonials = data.testimonials;

      const start = currentPage * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const pageTestimonials = testimonials.slice(start, end);

      const container = document.querySelector('.testimonials-slider');

      container.innerHTML = pageTestimonials
        .map(
          testimonial => `
          <div class="testimonial">
            <p class="testimonial-text">${testimonial.text}</p>
            <div class="testimonial-meta">
              <span class="name">${testimonial.name}</span>
              <span class="date">${new Date(testimonial.date).toLocaleDateString()}</span>
              <div class="rating">${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}</div>
            </div>
          </div>
        `
        )
        .join('');

      const prevBtn = document.querySelector('.prev-btn');
      const nextBtn = document.querySelector('.next-btn');

      prevBtn.disabled = currentPage === 0;
      nextBtn.disabled = end >= testimonials.length;
    } catch (error) {
      console.error('Error loading testimonials:', error);
      const container = document.querySelector('.testimonials-slider');
      container.innerHTML =
        '<p class="error-message">Error loading testimonials. Please try again later.</p>';
    }
  };

  // Initial testimonials render
  renderTestimonialPage();

  // Testimonial navigation handlers
  document.querySelector('.prev-btn')?.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      renderTestimonialPage();
    }
  });

  document.querySelector('.next-btn')?.addEventListener('click', () => {
    currentPage++;
    renderTestimonialPage();
  });

  // Helper function to render a service card
  const renderServiceCard = service => `
    <div class="service-card">
      <h3>${service.title || 'Service'}</h3>
      <p class="subtitle">${service.subTitle || ''}</p>
      <p class="price">${service.price || ''}</p>
      <p class="description">${service.description || ''}</p>
      <button class="btn btn-primary"
              hx-get="${baseUrl}/data/booking-form.json"
              hx-target="#booking-modal"
              hx-trigger="click">
        Book Now
      </button>
    </div>
  `;

  document.body.addEventListener('htmx:afterRequest', event => {
    const target = event.detail.target;

    if (!event.detail.successful) {
      target.innerHTML =
        '<p class="error-message">Failed to load content. Please try again later.</p>';
      return;
    }

    try {
      const response = event.detail.xhr.response;
      const data = typeof response === 'string' ? JSON.parse(response) : response;

      if (target.matches('.services-grid')) {
        const services = data.featured || [];
        target.innerHTML = services.length
          ? services.map(renderServiceCard).join('')
          : '<p class="no-services">No services available at the moment.</p>';
      } else if (target.matches('.footer-hours > div')) {
        const hours = data.hours || {};
        target.innerHTML = Object.entries(hours)
          .map(
            ([day, time]) => `
            <p class="hours-row">
              <strong>${day}:</strong> 
              <span>${time}</span>
            </p>
          `
          )
          .join('');
      }
    } catch (error) {
      console.warn('Error processing response:', error);
      target.innerHTML =
        '<p class="error-message">Error loading content. Please try again later.</p>';
    }
  });

  document.body.addEventListener('htmx:responseError', event => {
    console.error('HTMX Response Error:', {
      target: event.detail.target,
      error: event.detail.error,
      xhr: event.detail.xhr,
    });

    const target = event.detail.target;
    if (target) {
      target.innerHTML =
        '<p class="error-message">Failed to load content. Please try again later.</p>';
    }
  });

  // Booking modal handler
  document.body.addEventListener('htmx:afterOnLoad', event => {
    if (event.target.id === 'booking-modal') {
      event.target.classList.add('active');
    }
  });

  // Process any dynamically added HTMX elements
  document.body.addEventListener('htmx:afterSwap', event => {
    const container = event.detail.target;
    htmx.process(container);
  });
});
