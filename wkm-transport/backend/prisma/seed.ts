/**
 * Run with:
 *   npx ts-node prisma/seed.ts
 * from the /backend directory.
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ── Admin account ──
  const password = await bcrypt.hash('Admin@2024', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@onukpaexpress.com' },
    update: {},
    create: {
      email:     'admin@onukpaexpress.com',
      password,
      firstName: 'Onukpa',
      lastName:  'Admin',
      role:      'ADMIN',
    },
  });

  console.log(`✅ Admin created: ${admin.email}`);
  console.log(`   Password: Admin@2024`);

  // ── Sample routes ──
  const routesData = [
    { 
      departure: 'Accra (Nkrumah Circle)', 
      destination: 'Kumasi (Kejetia)', 
      departureTime: new Date('2026-01-01T06:00:00Z'), 
      arrivalTime: new Date('2026-01-01T10:00:00Z'),
      price: 80, 
      totalSeats: 45,
      availableSeats: 45, 
      status: 'ACTIVE' as const 
    },
    { 
      departure: 'Kumasi (Kejetia)', 
      destination: 'Accra (Nkrumah Circle)', 
      departureTime: new Date('2026-01-01T06:00:00Z'), 
      arrivalTime: new Date('2026-01-01T10:00:00Z'),
      price: 80, 
      totalSeats: 45,
      availableSeats: 45, 
      status: 'ACTIVE' as const 
    },
    { 
      departure: 'Legon (UG Main Gate)', 
      destination: 'KNUST (Ayigya)',      
      departureTime: new Date('2026-01-01T07:00:00Z'), 
      arrivalTime: new Date('2026-01-01T11:00:00Z'),
      price: 60, 
      totalSeats: 30,
      availableSeats: 30, 
      status: 'ACTIVE' as const 
    },
    { 
      departure: 'KNUST (Ayigya)',      
      destination: 'Legon (UG Main Gate)', 
      departureTime: new Date('2026-01-01T07:00:00Z'), 
      arrivalTime: new Date('2026-01-01T11:00:00Z'),
      price: 60, 
      totalSeats: 30,
      availableSeats: 30, 
      status: 'ACTIVE' as const 
    },
    { 
      departure: 'Accra (Circle)',      
      destination: 'Cape Coast (UCC)',     
      departureTime: new Date('2026-01-01T06:30:00Z'), 
      arrivalTime: new Date('2026-01-01T09:30:00Z'),
      price: 45, 
      totalSeats: 40,
      availableSeats: 40, 
      status: 'ACTIVE' as const 
    },
    { 
      departure: 'Cape Coast (UCC)',    
      destination: 'Accra (Circle)',       
      departureTime: new Date('2026-01-01T06:30:00Z'), 
      arrivalTime: new Date('2026-01-01T09:30:00Z'),
      price: 45, 
      totalSeats: 40,
      availableSeats: 40, 
      status: 'ACTIVE' as const 
    },
    { 
      departure: 'Accra',              
      destination: 'Takoradi',              
      departureTime: new Date('2026-01-01T07:00:00Z'), 
      arrivalTime: new Date('2026-01-01T10:30:00Z'),
      price: 70, 
      totalSeats: 45,
      availableSeats: 45, 
      status: 'ACTIVE' as const 
    },
    { 
      departure: 'Kumasi',             
      destination: 'Tamale',                
      departureTime: new Date('2026-01-01T05:00:00Z'), 
      arrivalTime: new Date('2026-01-01T12:00:00Z'),
      price: 120,
      totalSeats: 45,
      availableSeats: 45, 
      status: 'ACTIVE' as const 
    },
  ];

  for (const r of routesData) {
    await prisma.route.create({ data: r }).catch(() => null);
  }

  console.log(`✅ ${routesData.length} sample routes created`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
