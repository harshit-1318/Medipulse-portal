import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';

const siteData = {
  id: '65e0123456789abcdef00001',
  _id: '65e0123456789abcdef00001',
  name: 'MediPulse Healthcare Portal',
  domain: 'localhost',
  key: 'site_key_local_123',
  is_active: true,
  logo: '/medipulse-logo.svg',
  small_icon_url: '/favicon.svg',
  company_name: 'MediPulse',
  settings: {
    themeColor: '#0284c7',
    allowRegistrations: true,
  },
};

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: siteData,
      message: 'Site info retrieved successfully',
    });
  } catch (error: any) {
    console.error('Error in get-info-by-domain API:', error);
    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: siteData,
      message: 'Site info retrieved successfully',
    });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: siteData,
      message: 'Site info retrieved successfully',
    });
  } catch (error: any) {
    console.error('Error in get-info-by-domain API:', error);
    return NextResponse.json({
      status: 'SUCCESS',
      success: true,
      data: siteData,
      message: 'Site info retrieved successfully',
    });
  }
}
