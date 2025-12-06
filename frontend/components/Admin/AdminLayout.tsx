import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { 
  FiGrid,
  FiShoppingCart,
  FiUsers,
  FiBox,
  FiBarChart2,
  FiSettings,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  const menuItems = [
    { icon: FiGrid, label: 'Dashboard', href: '/admin' },
    { icon: FiBox, label: 'Products', href: '/admin/products' },
    { icon: FiShoppingCart, label: 'Orders', href: '/admin/orders' },
    { icon: FiUsers, label: 'Users', href: '/admin/users' },
    { icon: FiBarChart2, label: 'Analytics', href: '/admin/analytics' },
    { icon: FiSettings, label: 'Hero Banner', href: '/admin/site/hero' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
        <div className="flex items-center justify-between border-b p-4">
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>Admin Panel</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        
        <nav className="mt-8 space-y-1">
          {menuItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? router.pathname === item.href
                : router.pathname.startsWith(item.href);
            return (
              <Link
              key={item.label}
              href={item.href}
                className={`flex items-center rounded-r-full p-4 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-slate-50 hover:text-primary-600'
                }`}
            >
                <item.icon className="text-lg" />
              <span className={`ml-4 ${!sidebarOpen && 'hidden'}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-8 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <span className="relative">
                  🔔
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </span>
              </button>
              <div className="flex items-center">
                <Image
                  className="rounded-full"
                  src={session?.user?.image || '/logo-mark.png'}
                  alt={session?.user?.name || 'Admin avatar'}
                  width={32}
                  height={32}
                />
                <span className="ml-2 text-gray-700">{session?.user?.name || 'Admin User'}</span>
              </div>
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' });
                }}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary-200 hover:text-primary-600"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>
        
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;