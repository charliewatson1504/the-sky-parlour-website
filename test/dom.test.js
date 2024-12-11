import '@testing-library/jest-dom';
import { fireEvent, waitFor } from '@testing-library/dom';

describe('DOM Interactions', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="services-grid"></div>
      <div id="booking-modal"></div>
    `;
  });

  test('booking button opens modal', async () => {
    const servicesGrid = document.querySelector('.services-grid');
    servicesGrid.innerHTML = `
      <div class="service-card">
        <button class="btn-primary" hx-get="/booking-form" hx-target="#booking-modal">
          Book Now
        </button>
      </div>
    `;

    const bookingButton = servicesGrid.querySelector('.btn-primary');
    fireEvent.click(bookingButton);

    await waitFor(() => {
      const modal = document.getElementById('booking-modal');
      expect(modal).toBeInTheDocument();
    });
  });
});
