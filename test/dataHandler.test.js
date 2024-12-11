import { DataHandler } from '../js/dataHandler.js';

describe('DataHandler', () => {
  let dataHandler;

  beforeEach(() => {
    dataHandler = new DataHandler();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('loadServices returns featured services', async () => {
    const mockServices = {
      featured: [
        {
          title: 'Hair Coloring',
          subTitle: 'Full Color Service',
          price: 'From £100',
        },
      ],
    };

    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockServices),
    });

    const services = await dataHandler.loadServices();
    expect(services).toEqual(mockServices.featured);
    expect(fetch).toHaveBeenCalledWith('/data/services.json');
  });
});
