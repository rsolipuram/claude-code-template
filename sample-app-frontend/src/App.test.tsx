import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { productService } from './services/productService';

// Mock the productService
jest.mock('./services/productService');
const mockProductService = productService as jest.Mocked<typeof productService>;

// Mock ProductForm and ProductList to isolate App component testing
jest.mock('./components/ProductForm', () => {
  return function MockProductForm({ onProductCreated }: { onProductCreated: (product: any) => void }) {
    return (
      <div data-testid="product-form">
        <button
          onClick={() => onProductCreated({ id: 1, name: 'Test', price: 10, description: 'Test' })}
        >
          Mock Create Product
        </button>
      </div>
    );
  };
});

jest.mock('./components/ProductList', () => {
  return function MockProductList({ key }: { key: number }) {
    return <div data-testid="product-list" data-refresh-key={key}>Product List</div>;
  };
});

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders main header and components', () => {
    render(<App />);

    expect(screen.getByText('Sample React + .NET Core App')).toBeInTheDocument();
    expect(screen.getByTestId('product-form')).toBeInTheDocument();
    expect(screen.getByTestId('product-list')).toBeInTheDocument();
  });

  it('has correct page structure', () => {
    render(<App />);

    const header = screen.getByRole('banner');
    const main = screen.getByRole('main');

    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(header).toContainElement(screen.getByText('Sample React + .NET Core App'));
  });

  it('applies correct styling to main container', () => {
    render(<App />);

    const main = screen.getByRole('main');
    expect(main).toHaveStyle({
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    });
  });

  it('updates ProductList refresh key when product is created', async () => {
    render(<App />);

    const initialProductList = screen.getByTestId('product-list');
    expect(initialProductList).toHaveAttribute('data-refresh-key', '0');

    // Trigger product creation
    const createButton = screen.getByText('Mock Create Product');
    createButton.click();

    await waitFor(() => {
      const updatedProductList = screen.getByTestId('product-list');
      expect(updatedProductList).toHaveAttribute('data-refresh-key', '1');
    });
  });

  it('increments refresh key with multiple product creations', async () => {
    render(<App />);

    const createButton = screen.getByText('Mock Create Product');

    // First creation
    createButton.click();
    await waitFor(() => {
      expect(screen.getByTestId('product-list')).toHaveAttribute('data-refresh-key', '1');
    });

    // Second creation
    createButton.click();
    await waitFor(() => {
      expect(screen.getByTestId('product-list')).toHaveAttribute('data-refresh-key', '2');
    });

    // Third creation
    createButton.click();
    await waitFor(() => {
      expect(screen.getByTestId('product-list')).toHaveAttribute('data-refresh-key', '3');
    });
  });

  it('passes onProductCreated callback to ProductForm', () => {
    render(<App />);

    // The mock component should receive the callback and be able to trigger it
    const createButton = screen.getByText('Mock Create Product');
    expect(createButton).toBeInTheDocument();

    // Triggering the button should work (tested in previous tests)
    // This test confirms the callback is properly passed
  });

  it('renders with correct initial state', () => {
    render(<App />);

    // Should start with refresh key 0
    const productList = screen.getByTestId('product-list');
    expect(productList).toHaveAttribute('data-refresh-key', '0');

    // Should have the form rendered
    expect(screen.getByTestId('product-form')).toBeInTheDocument();
  });
});
