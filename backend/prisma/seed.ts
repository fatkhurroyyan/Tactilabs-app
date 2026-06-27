import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding database...');

  // 1. Clear database
  await prisma.refreshToken.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.questProgress.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.classMember.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.quest.deleteMany();

  console.log('Database cleared.');

  // 2. Create Institutions
  const inst1 = await prisma.institution.create({
    data: {
      name: 'Telkom University',
      type: 'UNIVERSITY',
      licenseType: 'PREMIUM',
      maxStudents: 100,
    },
  });

  const inst2 = await prisma.institution.create({
    data: {
      name: 'SMK Negeri 1 Bandung',
      type: 'VOCATIONAL',
      licenseType: 'BASIC',
      maxStudents: 50,
    },
  });

  console.log('Institutions created.');

  // 3. Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@tactilabs.com',
      password: hashedPassword,
      name: 'Admin Utama',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const educator = await prisma.user.create({
    data: {
      email: 'dosen@telkomuniversity.ac.id',
      password: hashedPassword,
      name: 'Dr. Budi Santoso',
      role: 'EDUCATOR',
      status: 'ACTIVE',
      institutionId: inst1.id,
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: 'thoriq@student.telkomuniversity.ac.id',
      password: hashedPassword,
      name: 'Thoriq',
      role: 'STUDENT',
      status: 'ACTIVE',
      institutionId: inst1.id,
      xp: 450,
      level: 1,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'siswasmk@student.smk.id',
      password: hashedPassword,
      name: 'Rian Kurnia',
      role: 'STUDENT',
      status: 'ACTIVE',
      institutionId: inst2.id,
      xp: 120,
      level: 1,
    },
  });

  console.log('Users created.');

  // 4. Create Classes
  const classA = await prisma.class.create({
    data: {
      name: 'Praktikum Rangkaian Listrik I-A',
      educatorId: educator.id,
      institutionId: inst1.id,
      inviteCode: 'TELK-A',
    },
  });

  await prisma.classMember.createMany({
    data: [
      { classId: classA.id, studentId: student1.id },
    ],
  });

  console.log('Classes created.');

  // 5. Create Badges
  const badgeOhm = await prisma.badge.create({
    data: {
      name: 'Ohm Master',
      description: 'Menyelesaikan seluruh tantangan terkait hukum Ohm.',
      iconUrl: 'ohm_master',
      criteriaType: 'TOPIC_MASTERY',
      criteriaValue: JSON.stringify({ topic: 'OHM_LAW' }),
    },
  });

  const badgeExplorer = await prisma.badge.create({
    data: {
      name: 'Sirkuit Pioneer',
      description: 'Menyelesaikan minimal 1 sirkuit pembelajaran.',
      iconUrl: 'circuit_pioneer',
      criteriaType: 'QUEST_COUNT',
      criteriaValue: JSON.stringify({ count: 1 }),
    },
  });

  const badgeExpert = await prisma.badge.create({
    data: {
      name: 'Elektronika Elite',
      description: 'Menyelesaikan minimal 5 sirkuit pembelajaran.',
      iconUrl: 'electronics_elite',
      criteriaType: 'QUEST_COUNT',
      criteriaValue: JSON.stringify({ count: 5 }),
    },
  });

  console.log('Badges created.');

  // 6. Create Quests
  const q1 = await prisma.quest.create({
    data: {
      title: 'Hukum Ohm: Rangkaian Seri Dasar',
      description: 'Hubungkan baterai ke resistor dan LED secara seri. Periksa apakah arus yang mengalir sesuai dengan rentang target kelistrikan.',
      topic: 'OHM_LAW',
      difficulty: 'BEGINNER',
      xpReward: 100,
      orderIndex: 1,
      circuitConfig: JSON.stringify({
        components: ['BATTERY', 'RESISTOR', 'LED'],
        connections: [
          { from: 'BATTERY_POS', to: 'RESISTOR_1' },
          { from: 'RESISTOR_2', to: 'LED_POS' },
          { from: 'LED_NEG', to: 'BATTERY_NEG' }
        ],
        validation: {
          minCurrentMA: 10,
          maxCurrentMA: 30,
          minVoltageV: 2.0,
          maxVoltageV: 4.5
        }
      }),
      instructions: JSON.stringify([
        'Pasang modul BATERAI (5V) pada sirkuit.',
        'Hubungkan kabel positif baterai ke pin input RESISTOR (100 Ohm).',
        'Hubungkan pin output RESISTOR ke kaki positif LED (Anoda).',
        'Hubungkan kaki negatif LED (Katoda) kembali ke pin negatif BATERAI.',
        'Perhatikan aliran elektron neon menyala dan indikator parameter arus beroperasi!'
      ]),
      hint: 'Pastikan LED dipasang dengan polaritas yang benar (kaki positif/anoda ke arah resistor, kaki negatif/katoda ke arah kutub negatif baterai).',
    },
  });

  const q2 = await prisma.quest.create({
    data: {
      title: 'Membagi Tegangan (Voltage Divider)',
      description: 'Rangkai dua resistor dengan nilai sama secara seri untuk membagi tegangan masukan menjadi setengahnya di titik tengah.',
      topic: 'VOLTAGE',
      difficulty: 'INTERMEDIATE',
      xpReward: 200,
      orderIndex: 2,
      prerequisiteQuestId: q1.id,
      circuitConfig: JSON.stringify({
        components: ['BATTERY', 'RESISTOR', 'RESISTOR'],
        connections: [
          { from: 'BATTERY_POS', to: 'RESISTOR1_1' },
          { from: 'RESISTOR1_2', to: 'RESISTOR2_1' },
          { from: 'RESISTOR2_2', to: 'BATTERY_NEG' }
        ],
        validation: {
          targetVoltageAtNodeV: 2.5,
          toleranceV: 0.2
        }
      }),
      instructions: JSON.stringify([
        'Gunakan dua buah RESISTOR dengan nilai hambatan yang sama (misalnya 10K Ohm).',
        'Hubungkan input Resistor 1 ke kutub positif Baterai.',
        'Hubungkan output Resistor 1 ke input Resistor 2.',
        'Hubungkan output Resistor 2 ke kutub negatif Baterai.',
        'Ukur tegangan pada titik sambungan kedua resistor. Tegangan di titik ini harus bernilai setengah dari tegangan baterai!'
      ]),
      hint: 'Dua resistor berukuran sama membagi tegangan input (5V) secara rata sehingga output bernilai tepat 2.5V.',
    },
  });

  const q3 = await prisma.quest.create({
    data: {
      title: 'Gerbang Logika AND dengan Saklar',
      description: 'Implementasikan gerbang logika AND menggunakan dua saklar seri. Arus hanya boleh mengalir jika kedua saklar dinyalakan.',
      topic: 'LOGIC_GATE',
      difficulty: 'ADVANCED',
      xpReward: 300,
      orderIndex: 3,
      prerequisiteQuestId: q2.id,
      circuitConfig: JSON.stringify({
        components: ['BATTERY', 'SWITCH', 'SWITCH', 'LED'],
        connections: [
          { from: 'BATTERY_POS', to: 'SWITCH1_1' },
          { from: 'SWITCH1_2', to: 'SWITCH2_1' },
          { from: 'SWITCH2_2', to: 'LED_POS' },
          { from: 'LED_NEG', to: 'BATTERY_NEG' }
        ],
        validation: {
          requireBothSwitchesOn: true,
          ledState: 'ON'
        }
      }),
      instructions: JSON.stringify([
        'Pasang modul BATERAI, dua SAKLAR (Switch), dan satu LED.',
        'Hubungkan saklar 1 dan saklar 2 secara seri (saklar 1 terhubung ke saklar 2).',
        'Hubungkan ujung sirkuit ke LED.',
        'Uji logika: Nyalakan salah satu saklar (LED mati). Nyalakan kedua saklar (LED menyala!).'
      ]),
      hint: 'Rangkaian seri saklar merepresentasikan gerbang logika AND fisik, di mana kedua kondisi saklar wajib berstatus ON agar aliran listrik menyala.',
    },
  });

  console.log('Quests created.');

  // Create Assignment
  await prisma.assignment.create({
    data: {
      classId: classA.id,
      questId: q1.id,
      educatorId: educator.id,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  console.log('Assignments created.');
  console.log('Database seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
