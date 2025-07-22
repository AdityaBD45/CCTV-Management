const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Delete existing data (for clean slate during development)
  await prisma.incident.deleteMany();
  await prisma.camera.deleteMany();

  // Create cameras
  console.log('📹 Creating cameras...');
  const cameras = await Promise.all([
    prisma.camera.create({
      data: {
        name: 'Shop Floor A',
        location: 'Main Production Area'
      }
    }),
    prisma.camera.create({
      data: {
        name: 'Vault',
        location: 'Secure Storage Room'
      }
    }),
    prisma.camera.create({
      data: {
        name: 'Main Entrance',
        location: 'Front Door Security'
      }
    }),
    prisma.camera.create({
      data: {
        name: 'Parking Lot',
        location: 'Outdoor Surveillance'
      }
    })
  ]);

  console.log(`✅ Created ${cameras.length} cameras`);

  // Incident types
  const incidentTypes = [
    'Unauthorised Access',
    'Gun Threat',
    'Face Recognised',
    'Suspicious Activity',
    'Break In Attempt',
    'Weapon Detection'
  ];

  // Create incidents spread across 24 hours
  console.log('🚨 Creating incidents...');
  const incidents = [];
  const now = new Date();
  
  for (let i = 0; i < 15; i++) {
    const randomCamera = cameras[Math.floor(Math.random() * cameras.length)];
    const randomType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
    
    // Create incidents spread across the last 24 hours
    const hoursAgo = Math.random() * 24;
    const startTime = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
    const endTime = new Date(startTime.getTime() + (30000 + Math.random() * 120000)); // 30 seconds to 2.5 minutes
    
    incidents.push({
      cameraId: randomCamera.id,
      type: randomType,
      tsStart: startTime,
      tsEnd: endTime,
      thumbnailUrl: `/thumbnails/incident-${i + 1}.jpg`,
      resolved: Math.random() > 0.6 // 40% chance of being resolved
    });
  }

  // Sort incidents by start time (newest first) before inserting
  incidents.sort((a, b) => b.tsStart - a.tsStart);

  // Create incidents in database
  for (const incidentData of incidents) {
    await prisma.incident.create({
      data: incidentData
    });
  }

  console.log(`✅ Created ${incidents.length} incidents`);

  // Show summary
  const totalCameras = await prisma.camera.count();
  const totalIncidents = await prisma.incident.count();
  const unresolvedIncidents = await prisma.incident.count({
    where: { resolved: false }
  });

  console.log('\n📊 Database Summary:');
  console.log(`   📹 Cameras: ${totalCameras}`);
  console.log(`   🚨 Total Incidents: ${totalIncidents}`);
  console.log(`   ⚠️  Unresolved Incidents: ${unresolvedIncidents}`);
  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
