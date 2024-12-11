document.addEventListener('DOMContentLoaded', () => {
  // Keep track of current page
  let currentPage = 0;
  const ITEMS_PER_PAGE = 1;

  // Function to render testimonials
  const renderTestimonialPage = async () => {
    try {
      const response = await fetch('/data/testimonials.json');
      const data = await response.json();
      const testimonials = data.testimonials;

      // Calculate start and end indices for current page
      const start = currentPage * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const pageTestimonials = testimonials.slice(start, end);

      // Get the container
      const container = document.querySelector('.testimonials-slider');

      // Render testimonials
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

      // Update button states
      const prevBtn = document.querySelector('.prev-btn');
      const nextBtn = document.querySelector('.next-btn');

      prevBtn.disabled = currentPage === 0;
      nextBtn.disabled = end >= testimonials.length;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading testimonials:', error);
    }
  };

  // Initial render
  renderTestimonialPage();

  // Handle button clicks
  document.querySelector('.prev-btn').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      renderTestimonialPage();
    }
  });

  document.querySelector('.next-btn').addEventListener('click', () => {
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
              hx-get="/data/booking-form.json"
              hx-target="#booking-modal"
              hx-trigger="click">
        Book Now
      </button>
    </div>
  `;

  // Handle services loading
  document.body.addEventListener('htmx:afterOnLoad', event => {
    if (event.target.matches('.services-grid')) {
      try {
        const data =
          typeof event.detail.xhr.response === 'string'
            ? JSON.parse(event.detail.xhr.response)
            : event.detail.xhr.response;

        const services = data.featured || [];

        event.target.innerHTML = services.length
          ? services.map(renderServiceCard).join('')
          : '<p class="no-services">No services available at the moment.</p>';
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Error rendering services:', error);
        event.target.innerHTML =
          '<p class="error-message">Error loading services. Please try again later.</p>';
      }
    }
  });

  // Handle hours loading
  document.body.addEventListener('htmx:afterOnLoad', event => {
    if (event.target.matches('.footer-hours div')) {
      try {
        const data =
          typeof event.detail.xhr.response === 'string'
            ? JSON.parse(event.detail.xhr.response)
            : event.detail.xhr.response;

        const hours = data.hours || {};

        event.target.innerHTML = Object.entries(hours)
          .map(
            ([day, time]) => `
            <p class="hours-row">
              <strong>${day}:</strong> 
              <span>${time}</span>
            </p>
          `
          )
          .join('');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Error rendering hours:', error);
        event.target.innerHTML =
          '<p class="error-message">Error loading hours. Please try again later.</p>';
      }
    }
  });

  // Initialize booking modal handlers
  document.body.addEventListener('htmx:afterOnLoad', event => {
    if (event.target.id === 'booking-modal') {
      // Initialize any booking form handlers here
      event.target.classList.add('active');
    }
  });
});
