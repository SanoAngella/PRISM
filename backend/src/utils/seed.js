/**
 * Seed script — wipes and repopulates the database with realistic demo data,
 * then runs the AI detection pass so outbreak alerts are generated from sales.
 *
 * Usage: npm run seed
 */
import mongoose from 'mongoose'
import env from '../config/env.js'
import { connectDB, disconnectDB } from '../config/db.js'
import logger from './logger.js'
import { ROLES } from './constants.js'

import User from '../models/User.js'
import Pharmacy from '../models/Pharmacy.js'
import Medicine from '../models/Medicine.js'
import Inventory from '../models/Inventory.js'
import Sale from '../models/Sale.js'
import Reservation from '../models/Reservation.js'
import Alert from '../models/Alert.js'
import { runDetection } from '../services/aiAlertService.js'

const DAY = 86400_000

const PHARMACIES = [
  { name: 'CityMed Pharmacy', licenseNo: 'RW-PHM-2019-0451', district: 'Nyarugenge', sector: 'Nyamirambo', address: 'KN 2 Ave, Nyamirambo', phone: '+250 788 100 201', coordinates: [30.0456, -1.9706], rating: 4.6, reviews: 214 },
  { name: 'Hope Pharmacy', licenseNo: 'RW-PHM-2018-0322', district: 'Gasabo', sector: 'Kacyiru', address: 'KG 7 Ave, Kacyiru', phone: '+250 788 100 202', coordinates: [30.0912, -1.9412], rating: 4.4, reviews: 168 },
  { name: 'Kigali Care Pharmacy', licenseNo: 'RW-PHM-2020-0588', district: 'Gasabo', sector: 'Remera', address: 'KG 11 Ave, Remera', phone: '+250 788 100 203', coordinates: [30.1127, -1.9578], rating: 4.7, reviews: 302 },
  { name: 'Royal Pharmacy', licenseNo: 'RW-PHM-2017-0210', district: 'Kicukiro', sector: 'Kicukiro', address: 'KK 15 Rd, Kicukiro', phone: '+250 788 100 204', coordinates: [30.1024, -1.9889], rating: 4.2, reviews: 121 },
  { name: 'Community Pharmacy', licenseNo: 'RW-PHM-2021-0640', district: 'Kicukiro', sector: 'Gikondo', address: 'KK 3 Ave, Gikondo', phone: '+250 788 100 205', coordinates: [30.0761, -1.9781], rating: 4.5, reviews: 189 },
  { name: 'Amani Pharmacy', licenseNo: 'RW-PHM-2019-0477', district: 'Gasabo', sector: 'Kimironko', address: 'KG 201 St, Kimironko', phone: '+250 788 100 206', coordinates: [30.1246, -1.9503], rating: 4.3, reviews: 97 },
]

const MEDICINES = [
  { name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Analgesic', form: 'Tablet', strength: '500mg', manufacturer: 'Kampala Pharma Ltd', prescriptionRequired: false, unitPrice: 250, packSize: '20 tablets', description: 'Pain reliever and fever reducer for mild to moderate pain and fever.' },
  { name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', category: 'Antibiotic', form: 'Capsule', strength: '500mg', manufacturer: 'Cipla', prescriptionRequired: true, unitPrice: 1800, packSize: '15 capsules', description: 'Broad-spectrum penicillin antibiotic for bacterial infections.' },
  { name: 'Coartem 20/120mg', genericName: 'Artemether/Lumefantrine', category: 'Antimalarial', form: 'Tablet', strength: '20/120mg', manufacturer: 'Novartis', prescriptionRequired: true, unitPrice: 3200, packSize: '24 tablets', description: 'First-line therapy for uncomplicated falciparum malaria.', tracerFor: 'malaria' },
  { name: 'ORS Sachets', genericName: 'Oral Rehydration Salts', category: 'Rehydration', form: 'Powder', strength: '20.5g/L', manufacturer: 'WHO Formula', prescriptionRequired: false, unitPrice: 400, packSize: '10 sachets', description: 'Oral rehydration salts for dehydration from diarrhoea and cholera.', tracerFor: 'cholera' },
  { name: 'Metformin 850mg', genericName: 'Metformin HCl', category: 'Antidiabetic', form: 'Tablet', strength: '850mg', manufacturer: 'Merck', prescriptionRequired: true, unitPrice: 2100, packSize: '30 tablets', description: 'First-line oral treatment for type 2 diabetes.' },
  { name: 'Insulin Glargine', genericName: 'Insulin Glargine', category: 'Antidiabetic', form: 'Injection', strength: '100IU/mL', manufacturer: 'Sanofi', prescriptionRequired: true, unitPrice: 18500, packSize: '1 pen (3mL)', description: 'Long-acting basal insulin for glucose control.' },
  { name: 'Amlodipine 5mg', genericName: 'Amlodipine', category: 'Antihypertensive', form: 'Tablet', strength: '5mg', manufacturer: 'Cipla', prescriptionRequired: true, unitPrice: 1500, packSize: '30 tablets', description: 'Calcium channel blocker for high blood pressure.' },
  { name: 'Salbutamol Inhaler', genericName: 'Salbutamol', category: 'Respiratory', form: 'Inhaler', strength: '100mcg/dose', manufacturer: 'GSK', prescriptionRequired: true, unitPrice: 4200, packSize: '200 doses', description: 'Bronchodilator for asthma and COPD relief.' },
  { name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'Gastrointestinal', form: 'Capsule', strength: '20mg', manufacturer: 'Dr. Reddy’s', prescriptionRequired: false, unitPrice: 1900, packSize: '14 capsules', description: 'Proton pump inhibitor for acid reflux and ulcers.' },
  { name: 'Zinc Sulphate 20mg', genericName: 'Zinc Sulphate', category: 'Rehydration', form: 'Tablet', strength: '20mg', manufacturer: 'Nutriset', prescriptionRequired: false, unitPrice: 600, packSize: '10 tablets', description: 'Adjunct to ORS to reduce childhood diarrhoea severity.', tracerFor: 'cholera' },
  { name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'Analgesic', form: 'Tablet', strength: '400mg', manufacturer: 'Kampala Pharma Ltd', prescriptionRequired: false, unitPrice: 700, packSize: '20 tablets', description: 'NSAID for pain, inflammation and fever.' },
  { name: 'Ceftriaxone 1g', genericName: 'Ceftriaxone', category: 'Antibiotic', form: 'Injection', strength: '1g', manufacturer: 'Roche', prescriptionRequired: true, unitPrice: 3800, packSize: '1 vial', description: 'Cephalosporin injection for severe bacterial infections.' },
  { name: 'Vitamin C 1000mg', genericName: 'Ascorbic Acid', category: 'Vitamin', form: 'Tablet', strength: '1000mg', manufacturer: 'Bayer', prescriptionRequired: false, unitPrice: 900, packSize: '20 tablets', description: 'Immune-support supplement.' },
  { name: 'Cetirizine 10mg', genericName: 'Cetirizine', category: 'Respiratory', form: 'Tablet', strength: '10mg', manufacturer: 'Cipla', prescriptionRequired: false, unitPrice: 550, packSize: '10 tablets', description: 'Antihistamine for allergic rhinitis and urticaria.' },
]

function rand(seed) {
  let s = seed
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280)
}

async function seed() {
  await connectDB()
  logger.info('Clearing existing collections…')
  await Promise.all([
    User.deleteMany({}),
    Pharmacy.deleteMany({}),
    Medicine.deleteMany({}),
    Inventory.deleteMany({}),
    Sale.deleteMany({}),
    Reservation.deleteMany({}),
    Alert.deleteMany({}),
  ])

  // Pharmacies
  const pharmacies = await Pharmacy.create(
    PHARMACIES.map((p) => ({
      name: p.name,
      licenseNo: p.licenseNo,
      district: p.district,
      sector: p.sector,
      address: p.address,
      phone: p.phone,
      rating: p.rating,
      reviews: p.reviews,
      location: { type: 'Point', coordinates: p.coordinates },
    })),
  )
  logger.info(`Seeded ${pharmacies.length} pharmacies`)

  // Medicines
  const medicines = await Medicine.create(MEDICINES)
  logger.info(`Seeded ${medicines.length} medicines`)

  // Users — demo accounts (password: "password")
  const cityMed = pharmacies[0]
  const pharmacyUser = await User.create({
    name: cityMed.name, email: 'pharmacy@prism.rw', password: 'password',
    role: ROLES.PHARMACY, organization: cityMed.name, pharmacy: cityMed._id,
  })
  cityMed.owner = pharmacyUser._id
  await cityMed.save()

  await User.create([
    { name: 'Dr. Claudine Ndayisaba', email: 'authority@prism.rw', password: 'password', role: ROLES.AUTHORITY, organization: 'Rwanda Biomedical Centre' },
    { name: 'Jean-Paul Habimana', email: 'patient@prism.rw', password: 'password', role: ROLES.PATIENT, phone: '+250 788 431 220' },
  ])
  logger.info('Seeded 3 demo users (pharmacy@ / authority@ / patient@ · password)')

  // Inventory grid
  const inventoryDocs = []
  pharmacies.forEach((ph, pi) => {
    const r = rand((pi + 1) * 137)
    medicines.forEach((med) => {
      if (r() < 0.1) return
      const reorder = med.form === 'Injection' ? 15 : 40
      let qty = Math.floor(r() * 220)
      if (r() < 0.1) qty = 0
      else if (r() < 0.18) qty = Math.floor(r() * reorder)
      inventoryDocs.push({
        pharmacy: ph._id,
        medicine: med._id,
        quantity: qty,
        reorderLevel: reorder,
        price: Math.round((med.unitPrice * (0.94 + r() * 0.18)) / 50) * 50,
        batchNo: `B${String(med._id).slice(-3)}-${pi}`,
        expiryDate: new Date(2026, 6 + (pi % 6), 15),
      })
    })
  })
  await Inventory.create(inventoryDocs)
  logger.info(`Seeded ${inventoryDocs.length} inventory records`)

  // Sales — 21 days. Inject an outbreak spike for Rehydration + Antimalarial
  // in Nyarugenge (CityMed) over the last 4 days so AI detection fires.
  const medByName = Object.fromEntries(medicines.map((m) => [m.name, m]))
  const saleDocs = []
  const r = rand(77)

  for (let d = 20; d >= 0; d--) {
    const soldBase = new Date(Date.now() - d * DAY)
    pharmacies.forEach((ph) => {
      const txns = 6 + Math.floor(r() * 8)
      for (let t = 0; t < txns; t++) {
        const med = medicines[Math.floor(r() * medicines.length)]
        const qty = 1 + Math.floor(r() * 5)
        saleDocs.push(makeSale(ph, med, qty, soldBase, r))
      }
      // Outbreak injection: CityMed (Nyarugenge), last 4 days.
      if (ph.name === 'CityMed Pharmacy' && d <= 3) {
        for (const name of ['ORS Sachets', 'Zinc Sulphate 20mg', 'Coartem 20/120mg']) {
          const med = medByName[name]
          const surge = 8 + Math.floor(r() * 10)
          saleDocs.push(makeSale(ph, med, surge, soldBase, r))
        }
      }
    })
  }
  await Sale.insertMany(saleDocs)
  logger.info(`Seeded ${saleDocs.length} sales (with outbreak spike in Nyarugenge)`)

  // Reservations
  await Reservation.create([
    { code: 'PRX-3012', medicine: medByName['ORS Sachets']._id, pharmacy: cityMed._id, patientName: 'Jean-Paul Habimana', patientPhone: '+250 788 431 220', quantity: 5, unitPrice: 400, status: 'ready' },
    { code: 'PRX-3011', medicine: medByName['Coartem 20/120mg']._id, pharmacy: cityMed._id, patientName: 'Aline Uwase', patientPhone: '+250 788 552 110', quantity: 1, unitPrice: 3200, status: 'pending' },
    { code: 'PRX-3008', medicine: medByName['Paracetamol 500mg']._id, pharmacy: cityMed._id, patientName: 'Eric Mugisha', patientPhone: '+250 788 771 004', quantity: 2, unitPrice: 250, status: 'collected' },
  ])
  logger.info('Seeded 3 reservations')

  // Run AI detection to generate alerts from the seeded sales.
  const alerts = await runDetection({ windowDays: 4 })
  logger.info(`AI detection generated ${alerts.length} alert(s)`)

  await disconnectDB()
  logger.info('Seed complete ✔')
  process.exit(0)
}

function makeSale(ph, med, qty, baseDate, r) {
  const soldAt = new Date(baseDate.getTime() + Math.floor(r() * DAY))
  return {
    pharmacy: ph._id,
    medicine: med._id,
    quantity: qty,
    unitPrice: med.unitPrice,
    total: med.unitPrice * qty,
    channel: r() > 0.5 ? 'Walk-in' : 'Reservation',
    soldAt,
  }
}

seed().catch((err) => {
  logger.error(`Seed failed: ${err.message}`)
  process.exit(1)
})
