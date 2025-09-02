import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProductForm from '../ProductForm';
import { productService } from '../../services/productService';
import { Product } from '../../types/Product';

// Mock the productService
jest.mock('../../services/productService');
const mockProductService = productService as jest.Mocked<typeof productService>;

const mockCreatedProduct: Product = {
  id: 4,
  name: 'Test Product',
  price: 19.99,
  description: 'A test product',
};

describe('ProductForm', () => {
  const mockOnProductCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnProductCreated.mockClear();
  });

  it('renders all form fields and submit button', () => {
    render(<ProductForm onProductCreated={mockOnProductCreated} />);

    expect(screen.getByText('Add New Product')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument();
  });

  it('updates form fields when user types', async () => {
    const user = userEvent.setup();
    render(<ProductForm onProductCreated={mockOnProductCreated} />);

    const nameInput = screen.getByLabelText(/name/i);
    const priceInput = screen.getByLabelText(/price/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.type(nameInput, 'Test Product');
    await user.type(priceInput, '19.99');
    await user.type(descriptionInput, 'A test description');

    expect(nameInput).toHaveValue('Test Product');
    expect(priceInput).toHaveValue(19.99);
    expect(descriptionInput).toHaveValue('A test description');
  });

  it('submits form with correct data when all fields are filled', async () => {
    const user = userEvent.setup();
    mockProductService.createProduct.mockResolvedValue(mockCreatedProduct);

    render(<ProductForm onProductCreated={mockOnProductCreated} />);

    await user.type(screen.getByLabelText(/name/i), 'Test Product');
    await user.type(screen.getByLabelText(/price/i), '19.99');
    await user.type(screen.getByLabelText(/description/i), 'A test description');

    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(mockProductService.createProduct).toHaveBeenCalledWith({
        name: 'Test Product',
        price: 19.99,
        description: 'A test description',
      });
    });
  });

  it('calls onProductCreated callback after successful submission', async () => {
    const user = userEvent.setup();
    mockProductService.createProduct.mockResolvedValue(mockCreatedProduct);

    render(<ProductForm onProductCreated={mockOnProductCreated} />);

    await user.type(screen.getByLabelText(/name/i), 'Test Product');
    await user.type(screen.getByLabelText(/price/i), '19.99');
    await user.type(screen.getByLabelText(/description/i), 'A test description');

    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(mockOnProductCreated).toHaveBeenCalledWith(mockCreatedProduct);
    });
  });

  it('resets form fields after successful submission', async () => {
    const user = userEvent.setup();
    mockProductService.createProduct.mockResolvedValue(mockCreatedProduct);

    render(<ProductForm onProductCreated={mockOnProductCreated} />);

    const nameInput = screen.getByLabelText(/name/i);
    const priceInput = screen.getByLabelText(/price/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.type(nameInput, 'Test Product');
    await user.type(priceInput, '19.99');
    await user.type(descriptionInput, 'A test description');

    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(priceInput).toHaveValue(null);
      expect(descriptionInput).toHaveValue('');
    });
  });

  it('shows error message when submission fails', async () => {
    const user = userEvent.setup();
    mockProductService.createProduct.mockRejectedValue(new Error('Server error'));

    render(<ProductForm onProductCreated={mockOnProductCreated} />);

    await user.type(screen.getByLabelText(/name/i), 'Test Product');
    await user.type(screen.getByLabelText(/price/i), '19.99');
    await user.type(screen.getByLabelText(/description/i), 'A test description');

    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to create product')).toBeInTheDocument();
    });

    expect(mockOnProductCreated).not.toHaveBeenCalled();
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    // Mock a slow promise that doesn't resolve immediately
    mockProductService.createProduct.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<ProductForm onProductCreated={mockOnProductCreated} />);

    await user.type(screen.getByLabelText(/name/i), 'Test Product');
    await user.type(screen.getByLabelText(/price/i), '19.99');
    await user.type(screen.getByLabelText(/description/i), 'A test description');

    await user.click(screen.getByRole('button', { name: /add product/i }));

    expect(screen.getByText('Creating...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disables submit button during loading', async () => {
    const user = userEvent.setup();
    mockProductService.createProduct.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<ProductForm onProductCreated={mockOnProductCreated} />);

    await user.type(screen.getByLabelText(/name/i), 'Test Product');
    await user.type(screen.getByLabelText(/price/i), '19.99');
    await user.type(screen.getByLabelText(/description/i), 'A test description');

    const submitButton = screen.getByRole('button', { name: /add product/i });
    
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveStyle('cursor: not-allowed');
  });

  it('clears error message when form is resubmitted', async () => {
    const user = userEvent.setup();
    
    // First submission fails
    mockProductService.createProduct.mockRejectedValueOnce(new Error('Server error'));
    
    render(<ProductForm onProductCreated={mockOnProductCreated} />);

    await user.type(screen.getByLabelText(/name/i), 'Test Product');
    await user.type(screen.getByLabelText(/price/i), '19.99');
    await user.type(screen.getByLabelText(/description/i), 'A test description');

    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to create product')).toBeInTheDocument();
    });

    // Second submission succeeds
    mockProductService.createProduct.mockResolvedValueOnce(mockCreatedProduct);

    await user.type(screen.getByLabelText(/name/i), 'Another Product');
    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(screen.queryByText('Failed to create product')).not.toBeInTheDocument();
    });
  });

  it('prevents form submission when fields are empty', async () => {
    render(<ProductForm onProductCreated={mockOnProductCreated} />);

    const form = screen.getByRole('button', { name: /add product/i }).closest('form');
    fireEvent.submit(form!);

    expect(mockProductService.createProduct).not.toHaveBeenCalled();
  });

  it('handles decimal prices correctly', async () => {
    const user = userEvent.setup();
    mockProductService.createProduct.mockResolvedValue(mockCreatedProduct);

    render(<ProductForm onProductCreated={mockOnProductCreated} />);

    await user.type(screen.getByLabelText(/name/i), 'Decimal Product');
    await user.type(screen.getByLabelText(/price/i), '123.45');
    await user.type(screen.getByLabelText(/description/i), 'Product with decimal price');

    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(mockProductService.createProduct).toHaveBeenCalledWith({
        name: 'Decimal Product',
        price: 123.45,
        description: 'Product with decimal price',
      });
    });
  });
});