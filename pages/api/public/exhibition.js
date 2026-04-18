/**
 * 展会横幅公开 API (无需认证)
 */

// 内存存储 (与 admin 共享)
let exhibition = {
  id: 1,
  image: '/images/macreat/exhibition-banner.jpg',
  enabled: true
};

export default async function handler(req, res) {
  const { method } = req;
  
  if (method === 'GET') {
    return res.status(200).json(exhibition);
  }
  
  return res.status(405).json({ error: '不支持的方法' });
}

// 导出 getter/setter 供 admin API 使用
export function getExhibition() { return exhibition; }
export function setExhibition(data) { exhibition = { ...exhibition, ...data }; }