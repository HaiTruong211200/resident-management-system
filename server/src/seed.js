const path = require('path');
// Load the server .env explicitly so the script works when run from the repo
// root
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const {connectDB} = require('./config/db');
const mongoose = require('mongoose');

const PaymentType = require('./models/PaymentType');
const Household = require('./models/Household');
const Resident = require('./models/Resident');
const HouseholdPayment = require('./models/HouseholdPayment');
const Account = require('./models/Account');

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not set in .env');
    }
    await connectDB(process.env.MONGODB_URI);

    console.log('Clearing existing data...');
    await PaymentType.deleteMany({});
    await HouseholdPayment.deleteMany({});
    await Resident.deleteMany({});
    await Household.deleteMany({});
    await Account.deleteMany({});

    console.log('Creating payment types...');
    const pt1 = await PaymentType.create({
      name: 'Community fee',
      pass: 'CF2025',
      type: 'recurring',
      amount_per_person: 10
    });
    const pt2 = await PaymentType.create({
      name: 'Garbage collection',
      pass: 'GC01',
      type: 'one_time',
      amount_per_person: null
    });

    console.log('Creating households...');
    const h1 = await Household.create({
      house_number: 12,
      street: 'Lê Lợi',
      ward: 'Ward 1',
      district: 'District A'
    });
    const h2 = await Household.create({
      house_number: 34,
      street: 'Nguyễn Huệ',
      ward: 'Ward 2',
      district: 'District B'
    });

    console.log('Creating residents...');
    const r1 = await Resident.create({
      household: h1._id,
      full_name: 'Nguyen Van A',
      date_of_birth: new Date('1980-05-12'),
      gender: 'male',
      place_of_birth: 'Hanoi',
      hometown: 'Hanoi',
      ethnicity: 'Kinh',
      occupation: 'Teacher',
      workplace: 'High School 1',
      id_card_number: 'ID-A-001',
      id_card_issue_place: 'Hanoi',
      id_card_issue_date: new Date('2000-01-01'),
      residence_registration_date: new Date('2000-02-01'),
      previous_address: 'Old Street 1',
      relationship_to_head: 'head'
    });

    const r2 = await Resident.create({
      household: h1._id,
      full_name: 'Tran Thi B',
      date_of_birth: new Date('1985-07-20'),
      gender: 'female',
      place_of_birth: 'Hanoi',
      hometown: 'Hanoi',
      ethnicity: 'Kinh',
      occupation: 'Engineer',
      workplace: 'Company X',
      id_card_number: 'ID-A-002',
      id_card_issue_place: 'Hanoi',
      id_card_issue_date: new Date('2005-03-01'),
      residence_registration_date: new Date('2005-04-01'),
      previous_address: 'Old Street 2',
      relationship_to_head: 'spouse'
    });

    const r3 = await Resident.create({
      household: h2._id,
      full_name: 'Le Van C',
      date_of_birth: new Date('1990-11-02'),
      gender: 'male',
      place_of_birth: 'HCMC',
      hometown: 'HCMC',
      ethnicity: 'Kinh',
      occupation: 'Driver',
      workplace: 'Logistics',
      id_card_number: 'ID-B-001',
      id_card_issue_place: 'HCMC',
      id_card_issue_date: new Date('2010-06-15'),
      residence_registration_date: new Date('2011-01-01'),
      previous_address: 'Old Addr 3',
      relationship_to_head: 'head'
    });

    // update household heads
    h1.household_head = r1._id;
    await h1.save();
    h2.household_head = r3._id;
    await h2.save();

    console.log('Creating household payments...');
    await HouseholdPayment.create({
      household: h1._id,
      payment_type: pt1._id,
      amount_paid: 20.0,
      payment_date: new Date(),
      notes: 'Quarterly fee'
    });
    await HouseholdPayment.create({
      household: h2._id,
      payment_type: pt2._id,
      amount_paid: 50.0,
      payment_date: new Date(),
      notes: null
    });

    console.log('Creating accounts...');
    await Account.create({
      user_name: 'admin',
      pass: 'AdminPass123',
      role: 'admin',
      email: 'admin@example.com'
    });
    await Account.create({
      user_name: 'staff',
      pass: 'StaffPass123',
      role: 'staff',
      email: 'staff@example.com'
    });

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
