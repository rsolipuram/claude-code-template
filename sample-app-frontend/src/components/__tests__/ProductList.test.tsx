import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductList from '../ProductList';
import { productService } from '../../services/productService';
import { Product } from '../../types/Product';

// Mock the productService
jest.mock('../../services/productService');
const mockProductService = productService as jest.Mocked<typeof productService>;

const mockProducts: Product[] = [
  { id: 1, name: 'Laptop', price: 999.99, description: 'High-performance laptop' },
  { id: 2, name: 'Mouse', price: 29.99, description: 'Wireless optical mouse' },
  { id: 3, name: 'Keyboard', price: 79.99, description: 'Mechanical gaming keyboard' },
];

describe('ProductList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockProductService.getProducts.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<ProductList />);
    
    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('renders products after successful fetch', async () => {
    mockProductService.getProducts.mockResolvedValue(mockProducts);

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Products')).toBeInTheDocument();
    });

    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('High-performance laptop')).toBeInTheDocument();
    expect(screen.getByText('$999.99')).toBeInTheDocument();

    expect(screen.getByText('Mouse')).toBeInTheDocument();
    expect(screen.getByText('Wireless optical mouse')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();

    expect(screen.getByText('Keyboard')).toBeInTheDocument();
    expect(screen.getByText('Mechanical gaming keyboard')).toBeInTheDocument();
    expect(screen.getByText('$79.99')).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    mockProductService.getProducts.mockRejectedValue(new Error('Failed to fetch'));

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to load products/)).toBeInTheDocument();
    });

    expect(screen.queryByText('Products')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
  });

  it('calls productService.getProducts on mount', () => {
    mockProductService.getProducts.mockResolvedValue(mockProducts);

    render(<ProductList />);

    expect(mockProductService.getProducts).toHaveBeenCalledTimes(1);
  });

  it('renders empty state when no products are returned', async () => {
    mockProductService.getProducts.mockResolvedValue([]);

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Products')).toBeInTheDocument();
    });

    expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
    expect(screen.queryByText('Mouse')).not.toBeInTheDocument();
    expect(screen.queryByText('Keyboard')).not.toBeInTheDocument();
  });

  it('calls onProductSelect when a product is clicked', async () => {
    const mockOnProductSelect = jest.fn();
    mockProductService.getProducts.mockResolvedValue(mockProducts);

    render(<ProductList onProductSelect={mockOnProductSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    const laptopProduct = screen.getByText('Laptop').closest('div');
    fireEvent.click(laptopProduct!);

    expect(mockOnProductSelect).toHaveBeenCalledTimes(1);
    expect(mockOnProductSelect).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('does not call onProductSelect when no callback is provided', async () => {
    mockProductService.getProducts.mockResolvedValue(mockProducts);

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    const laptopProduct = screen.getByText('Laptop').closest('div');
    
    // Should not throw error when clicked
    expect(() => fireEvent.click(laptopProduct!)).not.toThrow();
  });

  it('formats prices correctly with two decimal places', async () => {
    const productsWithDifferentPrices: Product[] = [
      { id: 1, name: 'Cheap Item', price: 5, description: 'Five dollars' },
      { id: 2, name: 'Expensive Item', price: 1234.5, description: 'Expensive' },
    ];

    mockProductService.getProducts.mockResolvedValue(productsWithDifferentPrices);

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('$5.00')).toBeInTheDocument();
      expect(screen.getByText('$1234.50')).toBeInTheDocument();
    });
  });

  it('applies correct cursor style based on onProductSelect prop', async () => {
    mockProductService.getProducts.mockResolvedValue([mockProducts[0]]);

    const { rerender } = render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    const productDiv = screen.getByText('Laptop').closest('div');
    expect(productDiv).toHaveStyle('cursor: default');

    // Re-render with onProductSelect callback
    rerender(<ProductList onProductSelect={() => {}} />);

    await waitFor(() => {
      const clickableProductDiv = screen.getByText('Laptop').closest('div');
      expect(clickableProductDiv).toHaveStyle('cursor: pointer');
    });
  });
});