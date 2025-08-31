import { productService } from '../productService';
import { Product } from '../../types/Product';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('productService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  describe('getProducts', () => {
    it('fetches products successfully', async () => {
      const mockProducts: Product[] = [
        { id: 1, name: 'Laptop', price: 999.99, description: 'High-performance laptop' },
        { id: 2, name: 'Mouse', price: 29.99, description: 'Wireless optical mouse' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const result = await productService.getProducts();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:5219/api/products');
      expect(result).toEqual(mockProducts);
    });

    it('throws error when fetch fails with non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(productService.getProducts()).rejects.toThrow('Failed to fetch products');
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:5219/api/products');
    });

    it('throws error when fetch throws network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(productService.getProducts()).rejects.toThrow('Network error');
    });

    it('returns empty array when API returns empty array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await productService.getProducts();

      expect(result).toEqual([]);
    });
  });

  describe('getProduct', () => {
    it('fetches single product successfully', async () => {
      const mockProduct: Product = {
        id: 1,
        name: 'Laptop',
        price: 999.99,
        description: 'High-performance laptop',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      const result = await productService.getProduct(1);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:5219/api/products/1');
      expect(result).toEqual(mockProduct);
    });

    it('throws error when product not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(productService.getProduct(999)).rejects.toThrow('Failed to fetch product');
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:5219/api/products/999');
    });

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(productService.getProduct(1)).rejects.toThrow('Failed to fetch product');
    });

    it('handles different product IDs correctly', async () => {
      const mockProduct: Product = {
        id: 42,
        name: 'Test Product',
        price: 123.45,
        description: 'A test product',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      const result = await productService.getProduct(42);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:5219/api/products/42');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('createProduct', () => {
    it('creates product successfully', async () => {
      const newProduct = {
        name: 'New Product',
        price: 19.99,
        description: 'A new product',
      };

      const createdProduct: Product = {
        id: 4,
        ...newProduct,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdProduct,
      });

      const result = await productService.createProduct(newProduct);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:5219/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      expect(result).toEqual(createdProduct);
    });

    it('throws error when creation fails', async () => {
      const newProduct = {
        name: 'New Product',
        price: 19.99,
        description: 'A new product',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(productService.createProduct(newProduct)).rejects.toThrow('Failed to create product');
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:5219/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
    });

    it('sends correct JSON payload', async () => {
      const newProduct = {
        name: 'JSON Test Product',
        price: 123.45,
        description: 'Testing JSON serialization',
      };

      const createdProduct: Product = {
        id: 5,
        ...newProduct,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdProduct,
      });

      await productService.createProduct(newProduct);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5219/api/products',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct),
        })
      );
    });

    it('handles server errors during creation', async () => {
      const newProduct = {
        name: 'Error Product',
        price: 1.00,
        description: 'This will cause an error',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(productService.createProduct(newProduct)).rejects.toThrow('Failed to create product');
    });

    it('handles network errors during creation', async () => {
      const newProduct = {
        name: 'Network Error Product',
        price: 1.00,
        description: 'This will cause a network error',
      };

      mockFetch.mockRejectedValueOnce(new Error('Network connection failed'));

      await expect(productService.createProduct(newProduct)).rejects.toThrow('Network connection failed');
    });

    it('creates product with decimal prices correctly', async () => {
      const newProduct = {
        name: 'Decimal Price Product',
        price: 99.95,
        description: 'Product with decimal price',
      };

      const createdProduct: Product = {
        id: 6,
        ...newProduct,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdProduct,
      });

      const result = await productService.createProduct(newProduct);

      expect(result.price).toBe(99.95);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5219/api/products',
        expect.objectContaining({
          body: JSON.stringify(newProduct),
        })
      );
    });
  });

  describe('API endpoints', () => {
    it('uses correct base URL for all endpoints', () => {
      const expectedBaseUrl = 'http://localhost:5219/api';
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      // Test all endpoints use the correct base URL
      productService.getProducts();
      expect(mockFetch).toHaveBeenCalledWith(`${expectedBaseUrl}/products`);

      productService.getProduct(1);
      expect(mockFetch).toHaveBeenCalledWith(`${expectedBaseUrl}/products/1`);

      productService.createProduct({ name: 'Test', price: 1, description: 'Test' });
      expect(mockFetch).toHaveBeenCalledWith(
        `${expectedBaseUrl}/products`,
        expect.any(Object)
      );
    });
  });
});