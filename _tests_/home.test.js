import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/pages/index';
import axios from 'axios';

jest.mock('axios');

const mockLaunchData = {
  docs: [
    {
      id: '1',
      name: 'Falcon 9',
      date_utc: '2024-04-09T00:00:00.000Z',
      success: true,
      upcoming: false,
      details: 'Deployed Starlink satellites.',
      failures: [],
      links: {
        patch: {
          small: '/test-patch.png',
        },
      },
    },
  ],
};

describe('Home Component', () => {
  it('renders loading state initially', () => {
    render(<Home />);
    expect(screen.getByText(/Space X Launch Tracker/i)).toBeInTheDocument();
  });

  it('fetches and displays launch data', async () => {
    axios.post.mockResolvedValueOnce({ data: mockLaunchData });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Falcon 9/i)).toBeInTheDocument();
      expect(screen.getByText(/Deployed Starlink satellites./i)).toBeInTheDocument();
    });
  });

  it('displays error on API failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('API error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Home />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
