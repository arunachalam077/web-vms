import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import VisitorRegistrationForm from '../components/VisitorRegistrationForm';
import CheckoutPage from '../pages/CheckoutPage';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Visitor Management System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('VisitorRegistrationForm', () => {
    it('should register a new visitor successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            exitCode: 'VST1234_1430'
          },
          message: 'Visitor registered successfully'
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      render(
        <BrowserRouter>
          <VisitorRegistrationForm />
        </BrowserRouter>
      );

      // Fill in the form
      fireEvent.change(screen.getByLabelText(/visitor name/i), {
        target: { value: 'John Doe' }
      });
      fireEvent.change(screen.getByLabelText(/phone number/i), {
        target: { value: '1234567890' }
      });
      fireEvent.change(screen.getByLabelText(/purpose of visit/i), {
        target: { value: 'Meeting' }
      });
      fireEvent.change(screen.getByLabelText(/visiting whom/i), {
        target: { value: 'Jane Smith' }
      });
      fireEvent.change(screen.getByLabelText(/guard name/i), {
        target: { value: 'Mike Johnson' }
      });
      fireEvent.change(screen.getByLabelText(/guard id/i), {
        target: { value: 'G123' }
      });

      // Submit the form
      fireEvent.click(screen.getByText(/register visitor/i));

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/visitor registered successfully/i)).toBeInTheDocument();
        expect(screen.getByText(/exit code: VST1234_1430/i)).toBeInTheDocument();
      });
    });
  });

  describe('CheckoutPage', () => {
    it('should checkout a visitor successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Visitor VST1234_1430 has been successfully checked out'
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      render(
        <BrowserRouter>
          <CheckoutPage />
        </BrowserRouter>
      );

      // Enter exit code
      fireEvent.change(screen.getByLabelText(/exit code/i), {
        target: { value: 'VST1234_1430' }
      });

      // Submit the form
      fireEvent.click(screen.getByText(/check out/i));

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/visitor VST1234_1430 has been successfully checked out/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid exit code', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: {
            message: 'Visitor not found'
          }
        }
      });

      render(
        <BrowserRouter>
          <CheckoutPage />
        </BrowserRouter>
      );

      // Enter invalid exit code
      fireEvent.change(screen.getByLabelText(/exit code/i), {
        target: { value: 'INVALID_CODE' }
      });

      // Submit the form
      fireEvent.click(screen.getByText(/check out/i));

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/visitor not found/i)).toBeInTheDocument();
      });
    });
  });
}); 