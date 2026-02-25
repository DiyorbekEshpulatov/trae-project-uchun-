'use client';

// @ts-nocheck
// Mock React hooks
const useState = (initial: any) => [initial, (newState: any) => {}];
const useEffect = (callback: () => void, deps?: any[]) => {};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockProducts: 0,
  });

  useEffect(() => {
    // API dan ma'lumot olish
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/reports/dashboard');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Jami Mahsulotlar</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Jami Qiymat</h3>
            <p className="text-3xl font-bold text-green-600">${stats.totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Kam Qoldiq</h3>
            <p className="text-3xl font-bold text-red-600">{stats.lowStockProducts}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Oxirgi Mahsulotlar</h2>
          <div className="space-y-4">
            {stats.recentProducts?.map((product: any) => (
              <div key={product.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-600">Kod: {product.code}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{product.quantity} dona</p>
                  <p className="text-sm text-gray-600">${product.price}</p>
                </div>
              </div>
            )) || <p className="text-gray-500">Mahsulotlar topilmadi</p>}
          </div>
        </div>
      </div>
    </div>
  );
}