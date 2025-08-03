import React, { useState } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import { Product } from './types/Product';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductCreated = (product: Product) => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sample React + .NET Core App</h1>
      </header>
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <ProductForm onProductCreated={handleProductCreated} />
        <ProductList key={refreshKey} />
      </main>
    </div>
  );
}

export default App;
