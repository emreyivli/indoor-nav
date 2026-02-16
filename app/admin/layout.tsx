'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const auth = sessionStorage.getItem('admin_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded password for prototype
        if (password === 'admin123') {
            sessionStorage.setItem('admin_auth', 'true');
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Hatalı şifre!');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Lock className="w-8 h-8" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Yönetici Girişi</h1>
                        <p className="text-gray-500 mt-2">Devam etmek için şifre girin.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Şifre"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                        >
                            Giriş Yap
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
