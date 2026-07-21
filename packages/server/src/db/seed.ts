// ============================================================================
// Seed Script — Populates in-memory database with realistic gaming cafe data
// 20 PCs, 5 PS5s, 3 Pool Tables
// 50+ Games, POS items, Users, Time Slots
// ============================================================================

import { db } from './database';
import { config } from '../config/index';
import { hash, compare } from 'bcryptjs';

// --- Helper ---
function uid(prefix: string, n: number): string {
  return `${prefix}-${String(n).padStart(2, '0')}`;
}

function randomId(): string {
  return crypto.randomUUID();
}

// --- Pricing ---
const PRICING: Record<string, Record<string, number>> = {
  pc: { standard: 5, peak: 8, weekend: 7 },
  ps5: { standard: 6, peak: 10, weekend: 8 },
  pool_table: { standard: 4, peak: 6, weekend: 5 },
};

function getPricingTier(dateStr: string, hour: number): 'standard' | 'peak' | 'weekend' {
  const day = new Date(dateStr).getDay();
  if (day === 0 || day === 6) return 'weekend';
  if (hour >= 18 && hour < 22) return 'peak';
  return 'standard';
}

// --- Games Data ---
const GAMES_DATA = [
  { name: 'Counter-Strike 2', platform: ['pc'], genre: 'FPS', description: 'The next chapter in the world\'s favorite tactical shooter.', imageUrl: '/games/cs2.jpg', rating: 4.7 },
  { name: 'Valorant', platform: ['pc'], genre: 'FPS', description: 'A character-based 5v5 tactical shooter.', imageUrl: '/games/valorant.jpg', rating: 4.5 },
  { name: 'League of Legends', platform: ['pc'], genre: 'MOBA', description: 'Team-based strategy with five powerful champions.', imageUrl: '/games/lol.jpg', rating: 4.3 },
  { name: 'Dota 2', platform: ['pc'], genre: 'MOBA', description: 'Millions enter battle as one of over a hundred Dota heroes.', imageUrl: '/games/dota2.jpg', rating: 4.4 },
  { name: 'Apex Legends', platform: ['pc'], genre: 'Battle Royale', description: 'Legendary competitors battle for glory and fortune.', imageUrl: '/games/apex.jpg', rating: 4.5 },
  { name: 'Fortnite', platform: ['pc'], genre: 'Battle Royale', description: 'Be the last one standing with building mechanics.', imageUrl: '/games/fortnite.jpg', rating: 4.2 },
  { name: 'Overwatch 2', platform: ['pc'], genre: 'FPS', description: 'Team-based action with diverse heroes.', imageUrl: '/games/overwatch2.jpg', rating: 4.1 },
  { name: 'Rainbow Six Siege', platform: ['pc'], genre: 'FPS', description: 'Tactical shooter with environmental destruction.', imageUrl: '/games/r6siege.jpg', rating: 4.4 },
  { name: 'Rocket League', platform: ['pc'], genre: 'Sports', description: 'Arcade-style soccer with vehicular mayhem.', imageUrl: '/games/rocketleague.jpg', rating: 4.6 },
  { name: 'Minecraft', platform: ['pc'], genre: 'Sandbox', description: 'Build anything in procedurally generated worlds.', imageUrl: '/games/minecraft.jpg', rating: 4.8 },
  { name: 'GTA V', platform: ['pc'], genre: 'Action', description: 'Open-world action-adventure with GTA Online.', imageUrl: '/games/gtav.jpg', rating: 4.7 },
  { name: 'Elden Ring', platform: ['pc'], genre: 'RPG', description: 'Action RPG by FromSoftware.', imageUrl: '/games/eldenring.jpg', rating: 4.8 },
  { name: 'Baldur\'s Gate 3', platform: ['pc'], genre: 'RPG', description: 'Next-generation RPG in the D&D universe.', imageUrl: '/games/baldursgate3.jpg', rating: 4.9 },
  { name: 'Cyberpunk 2077', platform: ['pc'], genre: 'RPG', description: 'Open-world action-adventure in Night City.', imageUrl: '/games/cyberpunk.jpg', rating: 4.3 },
  { name: 'The Witcher 3', platform: ['pc'], genre: 'RPG', description: 'Story-driven open world RPG.', imageUrl: '/games/witcher3.jpg', rating: 4.9 },
  { name: 'Hades', platform: ['pc'], genre: 'Roguelike', description: 'Hack and slash out of the Underworld.', imageUrl: '/games/hades.jpg', rating: 4.8 },
  { name: 'Hollow Knight', platform: ['pc'], genre: 'Metroidvania', description: 'Forge your path through a vast kingdom.', imageUrl: '/games/hollowknight.jpg', rating: 4.7 },
  { name: 'Stardew Valley', platform: ['pc'], genre: 'Simulation', description: 'Build the farm of your dreams.', imageUrl: '/games/stardew.jpg', rating: 4.9 },
  { name: 'Among Us', platform: ['pc'], genre: 'Party', description: 'Social deduction game with impostors.', imageUrl: '/games/amongus.jpg', rating: 4.0 },
  { name: 'Phasmophobia', platform: ['pc'], genre: 'Horror', description: 'Cooperative paranormal investigation.', imageUrl: '/games/phasmophobia.jpg', rating: 4.5 },
  { name: 'Lethal Company', platform: ['pc'], genre: 'Horror', description: 'Co-op horror scavenging on abandoned moons.', imageUrl: '/games/lethalcompany.jpg', rating: 4.6 },
  { name: 'Helldivers 2', platform: ['pc'], genre: 'Shooter', description: 'Third-person co-op defending Super Earth.', imageUrl: '/games/helldivers2.jpg', rating: 4.5 },
  { name: 'Diablo IV', platform: ['pc'], genre: 'RPG', description: 'Endless evil. The ultimate action RPG.', imageUrl: '/games/diablo4.jpg', rating: 4.3 },
  { name: 'Final Fantasy XIV', platform: ['pc'], genre: 'MMO', description: 'Award-winning MMORPG with epic story.', imageUrl: '/games/ffxiv.jpg', rating: 4.7 },
  { name: 'Forza Horizon 5', platform: ['pc'], genre: 'Racing', description: 'Open-world racing in Mexico.', imageUrl: '/games/forzah5.jpg', rating: 4.7 },
  { name: 'Civilization VI', platform: ['pc'], genre: 'Strategy', description: 'Build an empire to stand the test of time.', imageUrl: '/games/civ6.jpg', rating: 4.5 },
  { name: 'Tekken 8', platform: ['pc'], genre: 'Fighting', description: 'The next chapter in the legendary fighting franchise.', imageUrl: '/games/tekken8.jpg', rating: 4.6 },
  { name: 'Street Fighter 6', platform: ['pc'], genre: 'Fighting', description: 'The evolution of the iconic fighting game.', imageUrl: '/games/sf6.jpg', rating: 4.5 },
  // PS5 Games
  { name: 'Spider-Man 2', platform: ['ps5'], genre: 'Action', description: 'Swing through Marvel\'s New York.', imageUrl: '/games/spiderman2.jpg', rating: 4.8 },
  { name: 'God of War Ragnarök', platform: ['ps5'], genre: 'Action', description: 'Epic journey through the Nine Realms.', imageUrl: '/games/gowragnarok.jpg', rating: 4.9 },
  { name: 'Horizon Forbidden West', platform: ['ps5'], genre: 'RPG', description: 'Join Aloy in the Forbidden West.', imageUrl: '/games/horizonfw.jpg', rating: 4.6 },
  { name: 'The Last of Us Part II', platform: ['ps5'], genre: 'Action', description: 'A complex story of hate, love, and revenge.', imageUrl: '/games/tlou2.jpg', rating: 4.8 },
  { name: 'Gran Turismo 7', platform: ['ps5'], genre: 'Racing', description: 'The real driving simulator returns.', imageUrl: '/games/gt7.jpg', rating: 4.4 },
  { name: 'Demon\'s Souls', platform: ['ps5'], genre: 'RPG', description: 'Remake of the PlayStation classic.', imageUrl: '/games/demonsouls.jpg', rating: 4.5 },
  { name: 'Ratchet & Clank: Rift Apart', platform: ['ps5'], genre: 'Action', description: 'Blast through dimensions.', imageUrl: '/games/ratchet.jpg', rating: 4.6 },
  { name: 'Returnal', platform: ['ps5'], genre: 'Roguelike', description: 'Break the cycle on an alien planet.', imageUrl: '/games/returnal.jpg', rating: 4.4 },
  { name: 'Final Fantasy XVI', platform: ['ps5'], genre: 'RPG', description: 'The latest epic entry in the legendary RPG series.', imageUrl: '/games/ff16.jpg', rating: 4.5 },
  { name: 'Resident Evil 4 Remake', platform: ['ps5'], genre: 'Horror', description: 'Survival horror reimagined.', imageUrl: '/games/re4.jpg', rating: 4.7 },
  { name: 'Mortal Kombat 1', platform: ['ps5'], genre: 'Fighting', description: 'The iconic fighting franchise reborn.', imageUrl: '/games/mk1.jpg', rating: 4.4 },
  { name: 'Astro Bot', platform: ['ps5'], genre: 'Platformer', description: 'Delightful 3D platformer for DualSense.', imageUrl: '/games/astro.jpg', rating: 4.9 },
  { name: 'Stellar Blade', platform: ['ps5'], genre: 'Action', description: 'Action-adventure with stunning visuals.', imageUrl: '/games/stellarblade.jpg', rating: 4.3 },
];

// --- POS Items ---
const POS_ITEMS = [
  { name: 'Nachos with Cheese', category: 'snack' as const, price: 4.50, stock: 50 },
  { name: 'Popcorn (Large)', category: 'snack' as const, price: 3.50, stock: 40 },
  { name: 'Chicken Wings (6pc)', category: 'snack' as const, price: 8.00, stock: 30 },
  { name: 'Loaded Fries', category: 'snack' as const, price: 5.50, stock: 35 },
  { name: 'Hot Dog', category: 'snack' as const, price: 3.50, stock: 40 },
  { name: 'Coca-Cola', category: 'drink' as const, price: 2.50, stock: 100 },
  { name: 'Pepsi', category: 'drink' as const, price: 2.50, stock: 100 },
  { name: 'Red Bull', category: 'drink' as const, price: 4.00, stock: 60 },
  { name: 'Monster Energy', category: 'drink' as const, price: 4.00, stock: 60 },
  { name: 'Bottled Water', category: 'drink' as const, price: 1.50, stock: 150 },
  { name: 'Iced Coffee', category: 'drink' as const, price: 4.50, stock: 40 },
  { name: 'Smoothie', category: 'drink' as const, price: 5.50, stock: 30 },
  { name: 'GameEdge T-Shirt', category: 'merchandise' as const, price: 25.00, stock: 20 },
  { name: 'GameEdge Cap', category: 'merchandise' as const, price: 18.00, stock: 15 },
  { name: 'Gaming Mouse Pad (XL)', category: 'merchandise' as const, price: 22.00, stock: 10 },
  { name: 'GameEdge Mug', category: 'merchandise' as const, price: 12.00, stock: 25 },
  { name: 'PC Hour Package (1h)', category: 'hour_package' as const, price: 5.00, stock: 999 },
  { name: 'PC Hour Package (3h)', category: 'hour_package' as const, price: 13.50, stock: 999 },
  { name: 'PS5 Hour Package (1h)', category: 'hour_package' as const, price: 6.00, stock: 999 },
  { name: 'Pool Table Hour (1h)', category: 'hour_package' as const, price: 4.00, stock: 999 },
];

// --- Users ---
const USERS = [
  { name: 'Admin Sarah', email: 'sarah@gameedge.com', phone: '+1-555-0101', role: 'admin' as const, password: 'admin123!' },
  { name: 'Admin Marcus', email: 'marcus@gameedge.com', phone: '+1-555-0102', role: 'admin' as const, password: 'admin123!' },
  { name: 'Staff Jake', email: 'jake@gameedge.com', phone: '+1-555-0103', role: 'staff' as const, password: 'staff123!' },
  { name: 'Staff Emily', email: 'emily@gameedge.com', phone: '+1-555-0104', role: 'staff' as const, password: 'staff123!' },
  { name: 'Staff Carlos', email: 'carlos@gameedge.com', phone: '+1-555-0105', role: 'staff' as const, password: 'staff123!' },
  { name: 'Alex Johnson', email: 'alex@email.com', phone: '+1-555-0201', role: 'customer' as const, password: 'customer123!' },
  { name: 'Maria Garcia', email: 'maria@email.com', phone: '+1-555-0202', role: 'customer' as const, password: 'customer123!' },
  { name: 'James Wilson', email: 'james@email.com', phone: '+1-555-0203', role: 'customer' as const, password: 'customer123!' },
  { name: 'Sophie Chen', email: 'sophie@email.com', phone: '+1-555-0204', role: 'customer' as const, password: 'customer123!' },
  { name: 'David Kim', email: 'david@email.com', phone: '+1-555-0205', role: 'customer' as const, password: 'customer123!' },
  { name: 'Emma Brown', email: 'emma@email.com', phone: '+1-555-0206', role: 'customer' as const, password: 'customer123!' },
  { name: 'Ryan Martinez', email: 'ryan@email.com', phone: '+1-555-0207', role: 'customer' as const, password: 'customer123!' },
  { name: 'Lisa Anderson', email: 'lisa@email.com', phone: '+1-555-0208', role: 'customer' as const, password: 'customer123!' },
  { name: 'Tom Taylor', email: 'tom@email.com', phone: '+1-555-0209', role: 'customer' as const, password: 'customer123!' },
  { name: 'Nina Patel', email: 'nina@email.com', phone: '+1-555-0210', role: 'customer' as const, password: 'customer123!' },
];

// --- Main Seed Function ---
export async function seedDatabase(): Promise<void> {
  console.log('Seeding GameEdge database...');

  // Clear existing data
  await Promise.all([
    db.users.clear(),
    db.devices.clear(),
    db.timeSlots.clear(),
    db.bookings.clear(),
    db.games.clear(),
    db.reviews.clear(),
    db.cafeStatus.clear(),
    db.posItems.clear(),
    db.orders.clear(),
    db.transactions.clear(),
  ]);

  const now = new Date().toISOString();

  // 1. Seed Users
  console.log('  Seeding users...');
  for (const u of USERS) {
    const passwordHash = await hash(u.password, 10);
    await db.users.add({
      id: randomId(),
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      passwordHash,
      createdAt: now,
    });
  }

  // 2. Seed Devices
  console.log('  Seeding devices...');
  const deviceIds: string[] = [];

  for (let i = 1; i <= 20; i++) {
    const id = uid('gaming-rig', i);
    deviceIds.push(id);
    await db.devices.add({
      id,
      type: 'pc',
      status: 'available',
      name: `Gaming Rig ${String(i).padStart(2, '0')}`,
      specs: { cpu: 'i9-13900K', gpu: 'RTX 4090', ram: '32GB', storage: '1TB NVMe' },
      createdAt: now,
    });
  }

  for (let i = 1; i <= 5; i++) {
    const id = uid('ps5', i);
    deviceIds.push(id);
    await db.devices.add({
      id,
      type: 'ps5',
      status: 'available',
      name: `PS5 Station ${String(i).padStart(2, '0')}`,
      specs: { console: 'PlayStation 5', storage: '1TB SSD', controller: 'DualSense' },
      createdAt: now,
    });
  }

  for (let i = 1; i <= 3; i++) {
    const id = uid('pool-table', i);
    deviceIds.push(id);
    await db.devices.add({
      id,
      type: 'pool_table',
      status: 'available',
      name: `Pool Table ${String(i).padStart(2, '0')}`,
      specs: { size: '8ft', type: 'Professional' },
      createdAt: now,
    });
  }

  // 3. Seed Time Slots (next 7 days, hourly 10am-midnight)
  console.log('  Seeding time slots...');
  const today = new Date();
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    const dateStr = date.toISOString().split('T')[0];

    for (const deviceId of deviceIds) {
      const device = await db.devices.get(deviceId);
      if (!device) continue;

      for (let hour = 10; hour < 24; hour++) {
        const tier = getPricingTier(dateStr, hour);
        const slotId = `${deviceId}_${dateStr}_${String(hour).padStart(2, '0')}`;

        await db.timeSlots.add({
          id: slotId,
          deviceId,
          date: dateStr,
          startTime: `${String(hour).padStart(2, '0')}:00`,
          endTime: `${String(hour + 1).padStart(2, '0')}:00`,
          isAvailable: true,
          pricingTier: tier,
        });
      }
    }
  }

  // 4. Seed Games
  console.log('  Seeding games...');
  for (const g of GAMES_DATA) {
    await db.games.add({
      id: randomId(),
      name: g.name,
      platform: g.platform as ('pc' | 'ps5')[],
      genre: g.genre,
      description: g.description,
      imageUrl: g.imageUrl,
      rating: g.rating,
      reviewCount: Math.floor(Math.random() * 200) + 10,
    });
  }

  // 5. Seed POS Items
  console.log('  Seeding POS items...');
  for (const item of POS_ITEMS) {
    await db.posItems.add({
      id: randomId(),
      name: item.name,
      category: item.category,
      price: item.price,
      stock: item.stock,
    });
  }

  // 6. Seed Cafe Status
  console.log('  Seeding cafe status...');
  await db.cafeStatus.add({
    id: 'cafe',
    isOpen: true,
    currentOccupancy: 12,
    maxCapacity: 80,
    lastUpdated: now,
  });

  console.log('Seed complete!');
  console.log(`   ${USERS.length} users (2 admin, 3 staff, 10 customer)`);
  console.log(`   28 devices (20 PCs, 5 PS5s, 3 Pool Tables)`);
  console.log(`   Time slots for 7 days (10am-midnight, hourly)`);
  console.log(`   ${GAMES_DATA.length} games`);
  console.log(`   ${POS_ITEMS.length} POS items`);
}
