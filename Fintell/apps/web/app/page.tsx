// @ts-nocheck
// Mock NextJS Link component
const Link = ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>;

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            SmartAccounting AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Zamonaviy buxgalteriya va inventarizatsiya boshqaruv tizimi
          </p>
          <div className="space-x-4">
            <Link 
              href="/dashboard" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Boshlash
            </Link>
            <Link 
              href="/login" 
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Kirish
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">📊 Hisobotlar</h3>
            <p className="text-gray-600">Real-time hisobotlar va analitika</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">🏢 Kompaniyalar</h3>
            <p className="text-gray-600">Bir nechta kompaniyalarni boshqarish</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">📦 Mahsulotlar</h3>
            <p className="text-gray-600">Inventarizatsiya va ombor boshqaruvi</p>
          </div>
        </div>
      </div>
    </div>
  );
}