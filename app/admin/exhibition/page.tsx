'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExhibitionPage() {
  const router = useRouter();
  const [exhibition, setExhibition] = useState({ image: '', enabled: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchExhibition();
  }, []);

  async function fetchExhibition() {
    try {
      const res = await fetch('/api/admin/exhibition');
      const data = await res.json();
      setExhibition(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/exhibition', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(exhibition)
      });
      
      if (res.ok) {
        setMessage('保存成功！');
      } else {
        setMessage('保存失败');
      }
    } catch (err) {
      setMessage('保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.url) {
        setExhibition({ ...exhibition, image: data.url });
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div className="p-8">加载中...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">展会横幅设置</h1>
      
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block mb-2 font-medium">Banner 图片</label>
          {exhibition.image && (
            <div className="mb-2">
              <img 
                src={exhibition.image} 
                alt="Exhibition Banner" 
                className="max-w-md border rounded"
              />
            </div>
          )}
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="enabled"
            checked={exhibition.enabled}
            onChange={(e) => setExhibition({ ...exhibition, enabled: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="enabled">启用展会横幅</label>
        </div>
        
        <button 
          type="submit" 
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存'}
        </button>
        
        {message && <p className="text-green-600">{message}</p>}
      </form>
    </div>
  );
}