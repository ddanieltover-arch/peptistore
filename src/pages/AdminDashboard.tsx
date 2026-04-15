import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuthStore } from '../store/useAuthStore';
import { formatCurrency } from '../lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import {
  referenceSeedCategories,
  referenceSeedProducts,
} from '../data/seedCatalog';

export default function AdminDashboard() {
  const { profile } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [inventory, setInventory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProduct = {
        title,
        description,
        price: parseFloat(price),
        inventory: parseInt(inventory),
        images: imageUrl ? [imageUrl] : [],
        categories: [],
        specifications: [],
        rating: 5,
        review_count: 0
      };
      const { error } = await supabase.from('products').insert([newProduct]);
      if (error) throw error;
      
      setTitle('');
      setDescription('');
      setPrice('');
      setInventory('');
      setImageUrl('');
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Check console.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const seedReferenceCatalog = async () => {
    setIsSeeding(true);
    try {
      const { data: categories } = await supabase.from('categories').select('slug');
      const existingCategorySlugs = new Set((categories || []).map(c => c.slug));

      const { data: existingProds } = await supabase.from('products').select('title');
      const existingProductTitles = new Set((existingProds || []).map(p => p.title.toLowerCase().trim()));

      const categoriesToCreate = referenceSeedCategories.filter(
        c => !existingCategorySlugs.has(c.slug)
      );

      const productsToCreate = referenceSeedProducts.filter(
        p => !existingProductTitles.has(p.title.toLowerCase().trim())
      ).map(p => ({
        title: p.title,
        description: p.description,
        price: p.price,
        inventory: p.inventory,
        images: [p.image],
        categories: p.categories,
        specifications: p.specifications,
        rating: p.rating,
        review_count: p.reviewCount
      }));

      if (categoriesToCreate.length > 0) {
        const { error: catError } = await supabase.from('categories').insert(categoriesToCreate);
        if (catError) console.error(catError);
      }

      if (productsToCreate.length > 0) {
        const { error: prodError } = await supabase.from('products').insert(productsToCreate);
        if (prodError) console.error(prodError);
      }

      await fetchProducts();
      alert(`Reference catalog synced. Added ${categoriesToCreate.length} categories and ${productsToCreate.length} products.`);
    } catch (error) {
      console.error('Error seeding reference catalog:', error);
      alert('Could not seed reference catalog. Please check console logs.');
    } finally {
      setIsSeeding(false);
    }
  };

  const clearAndReseed = async () => {
    if (!window.confirm('WARNING: This will delete ALL current products and categories and re-seed from the local catalog. Proceed?')) return;
    setIsSeeding(true);
    try {
      // Clear products and categories
      await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Re-seed categories
      const { error: catError } = await supabase.from('categories').insert(referenceSeedCategories);
      if (catError) throw catError;

      // Re-seed products
      const productsToCreate = referenceSeedProducts.map(p => ({
        title: p.title,
        description: p.description,
        price: p.price,
        inventory: p.inventory,
        images: [p.image],
        categories: p.categories,
        specifications: p.specifications,
        rating: p.rating,
        review_count: p.reviewCount
      }));
      const { error: prodError } = await supabase.from('products').insert(productsToCreate);
      if (prodError) throw prodError;

      await fetchProducts();
      alert('Database wiped and re-seeded with Euro prices!');
    } catch (error) {
      console.error('Error re-seeding catalog:', error);
      alert('Migration failed. Check console.');
    } finally {
      setIsSeeding(false);
    }
  };

  if (profile?.role !== 'admin') {
    return <div className="p-8 text-center text-red-600">Access Denied. Admins only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center"><Plus className="mr-2" /> Add Product</h2>
          <div className="space-y-2 mb-4">
            <button
              type="button"
              onClick={seedReferenceCatalog}
              disabled={isSeeding || isSyncing}
              className="w-full bg-gray-900 text-white py-2 rounded-md font-medium hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSeeding ? 'Syncing...' : 'Sync Missing Reference Items'}
            </button>
            <button
              type="button"
              onClick={clearAndReseed}
              disabled={isSeeding || isSyncing}
              className="w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Wipe & Re-seed (Migration to €)
            </button>
          </div>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input required type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inventory</label>
                <input required type="number" min="0" value={inventory} onChange={e => setInventory(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="https://..." />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700">
              Add Product
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">Manage Products</h2>
            </div>
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading products...</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {products.map(product => (
                  <li key={product.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-gray-200 rounded-md overflow-hidden mr-4">
                        {product.images?.[0] && <img src={product.images[0]} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{product.title}</h3>
                        <p className="text-sm text-gray-500">{formatCurrency(product.price)} | Stock: {product.inventory}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700 p-2">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </li>
                ))}
                {products.length === 0 && (
                  <li className="p-6 text-center text-gray-500">No products found.</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
