import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import Store from '@/models/Store';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { city, zipCode, latitude, longitude } = req.query;

    let query: any = { isOpen: true };

    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    if (zipCode) {
      query['address.zipCode'] = zipCode;
    }

    let stores = await Store.find(query);

    // If coordinates provided, sort by distance (simple implementation)
    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);

      stores = stores.sort((a, b) => {
        const distA = Math.sqrt(
          Math.pow(a.location.latitude - lat, 2) + Math.pow(a.location.longitude - lng, 2)
        );
        const distB = Math.sqrt(
          Math.pow(b.location.latitude - lat, 2) + Math.pow(b.location.longitude - lng, 2)
        );
        return distA - distB;
      });
    }

    res.status(200).json({ stores });
  } catch (error: any) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

