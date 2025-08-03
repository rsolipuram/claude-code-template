import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product';
import { productService } from '../services/productService';

interface ProductListProps {
  onProductSelect?: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onProductSelect }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await productService.getProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>Products</h2>
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              cursor: onProductSelect ? 'pointer' : 'default',
            }}
            onClick={() => onProductSelect?.(product)}
          >
            <h3>{product.name}</h3>
            <p style={{ color: '#666' }}>{product.description}</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
              ${product.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;