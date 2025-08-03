import React, { useState } from 'react';
import { Product } from '../types/Product';
import { productService } from '../services/productService';

interface ProductFormProps {
  onProductCreated: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onProductCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newProduct = await productService.createProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
      });
      onProductCreated(newProduct);
      setFormData({ name: '', price: '', description: '' });
    } catch (err) {
      setError('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Creating...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;