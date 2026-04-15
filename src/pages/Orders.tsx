import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAuthStore } from '../store/useAuthStore';
import { formatCurrency } from '../lib/utils';
import { Package, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (data) setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return <div className="p-8 text-center">Please log in to view your orders.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Package className="mr-3 h-8 w-8 text-blue-600" /> My Orders
      </h1>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <Link to="/shop" className="text-blue-600 font-medium hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Placed</p>
                  <p className="font-medium">{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Just now'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'paid' ? 'bg-purple-100 text-purple-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order #</p>
                  <p className="font-mono text-sm">{order.id}</p>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <ul className="divide-y divide-gray-100">
                  {(order.items || []).map((item: any, index: number) => (
                    <li key={index} className="py-4 flex items-center">
                      <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />}
                      </div>
                      <div className="ml-4 flex-grow">
                        <Link to={`/product/${item.productId}`} className="font-medium text-gray-900 hover:text-blue-600">
                          {item.title}
                        </Link>
                        <p className="text-gray-500 text-sm">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                      </div>
                      <div className="font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              {order.crypto_tx_hash && (
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm flex items-center justify-between">
                  <span className="text-gray-500">Payment TXID:</span>
                  <a href={`https://mempool.space/tx/${order.crypto_tx_hash}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center font-mono text-xs truncate max-w-xs sm:max-w-md">
                    {order.crypto_tx_hash} <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
