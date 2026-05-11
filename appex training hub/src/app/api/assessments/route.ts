import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Assessment data for all courses
const assessments: Record<string, {
  courseId: string;
  courseTitle: string;
  passingScore: number;
  questions: Array<{
    id: number;
    text: string;
    options: string[];
    correct: number;
    explanation: string;
  }>;
}> = {
  "retail-management": {
    courseId: "retail-management",
    courseTitle: "AppEx Retail Management System",
    passingScore: 16,
    questions: [
      {
        id: 1,
        text: "What is the primary function of AppEx Retail POS system?",
        options: [
          "A) Inventory counting only",
          "B) Processing sales transactions and managing daily operations",
          "C) Employee payroll management",
          "D) Customer email marketing"
        ],
        correct: 1,
        explanation: "The POS system is designed to process sales, manage inventory, track customers, and handle daily retail operations efficiently."
      },
      {
        id: 2,
        text: "How do you add a new product to inventory?",
        options: [
          "A) Settings → Products → Add New Product",
          "B) Sales → New Sale → Add Product",
          "C) Reports → Inventory → Add",
          "D) Dashboard → Quick Actions → New Product"
        ],
        correct: 0,
        explanation: "Navigate to Settings → Products → Add New Product to add items to your inventory catalog."
      },
      {
        id: 3,
        text: "What is the shortcut to open a new sale in POS?",
        options: [
          "A) F1",
          "B) F2",
          "C) Ctrl + N",
          "D) Alt + S"
        ],
        correct: 1,
        explanation: "Press F2 on your keyboard to quickly open a new sale transaction."
      },
      {
        id: 4,
        text: "Which payment methods are integrated with AppEx Retail?",
        options: [
          "A) Cash only",
          "B) Credit cards only",
          "C) Cash, EcoCash, OneMoney, ZimSwitch, and Bank Transfer",
          "D) Cryptocurrency only"
        ],
        correct: 2,
        explanation: "AppEx supports multiple Zimbabwean payment methods including cash, EcoCash, OneMoney, ZimSwitch, and bank transfers."
      },
      {
        id: 5,
        text: "What does the Low Stock Alert feature do?",
        options: [
          "A) Sends an email to customers",
          "B) Notifies you when inventory falls below minimum levels",
          "C) Automatically orders products",
          "D) Deletes out-of-stock items"
        ],
        correct: 1,
        explanation: "Low Stock Alerts notify you when products reach your defined minimum stock levels so you can reorder in time."
      },
      {
        id: 6,
        text: "How can you process a customer return?",
        options: [
          "A) Sales → Sales History → Select transaction → Process Return",
          "B) Inventory → Adjust Stock",
          "C) Reports → Returns",
          "D) Cannot process returns"
        ],
        correct: 0,
        explanation: "Go to Sales → Sales History, find the original transaction, and click 'Process Return'."
      },
      {
        id: 7,
        text: "What is the purpose of barcode scanner integration?",
        options: [
          "A) To print price tags",
          "B) To quickly add products to cart by scanning barcodes",
          "C) To track employee attendance",
          "D) To generate customer receipts"
        ],
        correct: 1,
        explanation: "Barcode scanners allow you to add products instantly by scanning their barcodes, speeding up checkout."
      },
      {
        id: 8,
        text: "How do you apply a discount to a sale?",
        options: [
          "A) Cannot apply discounts",
          "B) Click 'Add Discount' in cart, enter percentage or amount",
          "C) Discounts are automatic",
          "D) Call support to apply discount"
        ],
        correct: 1,
        explanation: "In cart, click 'Add Discount', enter discount percentage or fixed amount, and select reason."
      },
      {
        id: 9,
        text: "What information is shown on dashboard quick stats cards?",
        options: [
          "A) Today's Sales, Transactions, Customers, Low Stock Items",
          "B) Employee birthdays only",
          "C) Weather forecast",
          "D) Social media feeds"
        ],
        correct: 0,
        explanation: "Dashboard stats show Today's Sales, Today's Transactions, Customers Served, and Low Stock Alerts."
      },
      {
        id: 10,
        text: "How do you print a receipt after a sale?",
        options: [
          "A) Automatically prints",
          "B) Click 'Print Receipt' in receipt options after payment",
          "C) Receipts are email only",
          "D) Cannot print receipts"
        ],
        correct: 1,
        explanation: "After completing payment, you can click 'Print Receipt' to print via thermal printer."
      },
      {
        id: 11,
        text: "What is the function of the Search Bar in POS?",
        options: [
          "A) Search for products by name or barcode",
          "B) Search for employees",
          "C) Search for supplier information",
          "D) Search for tax rates"
        ],
        correct: 0,
        explanation: "The search bar allows you to quickly find products by typing the product name or scanning/typing a barcode."
      },
      {
        id: 12,
        text: "How do you create a new customer during a sale?",
        options: [
          "A) Cannot create during sale",
          "B) Click 'Customer' field → 'Add New Customer'",
          "C) Must exit sale to add customer",
          "D) Customer is optional"
        ],
        correct: 1,
        explanation: "Click on the customer field, then click 'Add New Customer' to create a customer record on the fly."
      },
      {
        id: 13,
        text: "What does the Stock Count feature do?",
        options: [
          "A) Counts money in cash drawer",
          "B) Performs physical inventory count to reconcile with system",
          "C) Counts number of employees",
          "D) Counts daily transactions"
        ],
        correct: 1,
        explanation: "Stock Count allows you to perform physical inventory counts and reconcile differences with system records."
      },
      {
        id: 14,
        text: "How can you view daily sales reports?",
        options: [
          "A) Reports → Sales Reports → Daily Summary",
          "B) Dashboard only shows live sales",
          "C) Cannot view daily reports",
          "D) Email support for reports"
        ],
        correct: 0,
        explanation: "Navigate to Reports → Sales Reports → Daily Summary to view detailed daily sales data."
      },
      {
        id: 15,
        text: "What is the purpose of the Customer Loyalty Program?",
        options: [
          "A) Track employee performance",
          "B) Reward repeat customers with points and discounts",
          "C) Manage supplier relationships",
          "D) Track inventory movement"
        ],
        correct: 1,
        explanation: "The loyalty program allows you to reward customers with points for purchases, which can be redeemed for discounts."
      },
      {
        id: 16,
        text: "How do you process a split payment?",
        options: [
          "A) Split payment not supported",
          "B) Select multiple payment methods in the payment section",
          "C) Process two separate sales",
          "D) Customer must pay with one method"
        ],
        correct: 1,
        explanation: "In the payment section, you can select multiple payment methods and enter amounts for each to split the payment."
      },
      {
        id: 17,
        text: "What happens when you mark a product as 'Inactive'?",
        options: [
          "A) Product is deleted permanently",
          "B) Product is hidden from POS but remains in database",
          "C) Product price doubles",
          "D) Product is automatically reordered"
        ],
        correct: 1,
        explanation: "Inactive products are hidden from the POS and cannot be sold, but their data remains for reporting purposes."
      },
      {
        id: 18,
        text: "How do you export sales data to Excel?",
        options: [
          "A) Reports → Select report → Export → Excel",
          "B) Cannot export data",
          "C) Copy and paste manually",
          "D) Take screenshots"
        ],
        correct: 0,
        explanation: "Generate any report, then click the 'Export' button and select Excel format."
      },
      {
        id: 19,
        text: "What is the VAT rate configured by default in AppEx?",
        options: [
          "A) 10%",
          "B) 12.5%",
          "C) 14.5%",
          "D) 20%"
        ],
        correct: 2,
        explanation: "The default Zimbabwe VAT rate of 14.5% is pre-configured in AppEx."
      },
      {
        id: 20,
        text: "How do you add a new staff user to the system?",
        options: [
          "A) Settings → Users → Add User",
          "B) Sales → Staff Management",
          "C) Inventory → Staff",
          "D) Cannot add staff users"
        ],
        correct: 0,
        explanation: "Go to Settings → Users, click 'Add User', enter details, and assign a role with appropriate permissions."
      }
    ]
  },
  "hardware-management": {
    courseId: "hardware-management",
    courseTitle: "AppEx Hardware Store Management System",
    passingScore: 16,
    questions: [
      {
        id: 1,
        text: "What is primary feature for managing fresh produce in AppEx Grocery?",
        options: [
          "A) Serial number tracking",
          "B) Perishable goods tracking with expiry date management",
          "C) Barcode scanning only",
          "D) Customer loyalty points"
        ],
        correct: 1,
        explanation: "Perishable goods tracking allows you to manage expiry dates, receive alerts, and ensure fresh products are sold first (FEFO - First Expiry, First Out)."
      },
      {
        id: 2,
        text: "How does weight scale integration work in grocery POS?",
        options: [
          "A) Manual weight entry required",
          "B) Scale automatically sends weight to POS via Bluetooth/USB",
          "C) Weight is estimated",
          "D) Only pre-packaged items allowed"
        ],
        correct: 1,
        explanation: "Connected scales automatically transmit weight to POS, ensuring accurate pricing for items sold by weight like produce, meat, and bulk items."
      },
      {
        id: 3,
        text: "What happens when a perishable item is about to expire?",
        options: [
          "A) Nothing",
          "B) System sends alerts and can automatically apply markdown discounts",
          "C) Item is deleted",
          "D) Customer receives notification"
        ],
        correct: 1,
        explanation: "The system alerts staff when items approach expiry and can automatically apply markdown discounts to encourage quick sale."
      },
      {
        id: 4,
        text: "How do you set up bulk pricing tiers for wholesale customers?",
        options: [
          "A) Settings → Pricing → Bulk Pricing Rules",
          "B) Cannot set bulk pricing",
          "C) Only for retail customers",
          "D) Manual calculation only"
        ],
        correct: 0,
        explanation: "Navigate to Settings → Pricing → Bulk Pricing Rules to configure quantity-based discounts (e.g., 10+ units = 5% off, 50+ units = 10% off)."
      },
      {
        id: 5,
        text: "What is purpose of FEFO (First Expiry, First Out) system?",
        options: [
          "A) Sell cheapest items first",
          "B) Automatically suggest selling items with earliest expiry dates first",
          "C) Track employee performance",
          "D) Manage customer queues"
        ],
        correct: 1,
        explanation: "FEFO ensures that products with earlier expiry dates are suggested or prioritized for sale, reducing waste from expired goods."
      },
      {
        id: 6,
        text: "How do you record waste for spoiled produce?",
        options: [
          "A) Inventory → Waste Tracking → Record Waste",
          "B) Delete product from inventory",
          "C) Ignore spoiled items",
          "D) Sell at discount"
        ],
        correct: 0,
        explanation: "Use Waste Tracking feature to record spoiled or damaged items, which helps track shrinkage and identify problem areas."
      },
      {
        id: 7,
        text: "What information is tracked for each perishable batch?",
        options: [
          "A) Batch number, expiry date, received date, quantity",
          "B) Only product name",
          "C) Supplier name only",
          "D) Customer information"
        ],
        correct: 0,
        explanation: "Each batch tracks batch number, expiry date, manufacturing date, received date, quantity, and remaining quantity for accurate stock management."
      },
      {
        id: 8,
        text: "How do you process a sale for loose produce like tomatoes?",
        options: [
          "A) Scan barcode",
          "B) Select product → enter weight from scale or manually → add to cart",
          "C) Only pre-packaged allowed",
          "D) Estimate weight"
        ],
        correct: 1,
        explanation: "For variable weight items, select product, enter weight (auto-populated from scale or manual entry), and price calculates automatically."
      },
      {
        id: 9,
        text: "What is the purpose of Supplier Management module?",
        options: [
          "A) Track employee schedules",
          "B) Manage vendor information, purchase orders, and delivery performance",
          "C) Track customer purchases",
          "D) Manage loyalty program"
        ],
        correct: 1,
        explanation: "Supplier Management centralizes vendor information, tracks purchase orders, monitors delivery performance, and manages supplier relationships."
      },
      {
        id: 10,
        text: "How do you create a purchase order for grocery items?",
        options: [
          "A) Suppliers → Purchase Orders → New Purchase Order",
          "B) Inventory → Add Product",
          "C) Sales → New Sale",
          "D) Cannot create purchase orders"
        ],
        correct: 0,
        explanation: "Navigate to Suppliers → Purchase Orders, click 'New Purchase Order', select supplier, add items and quantities, and send to supplier."
      },
      {
        id: 11,
        text: "What happens when a perishable item reaches its expiry date?",
        options: [
          "A) System blocks sale and marks as expired",
          "B) Item is automatically deleted",
          "C) Customer can still purchase",
          "D) Price increases"
        ],
        correct: 0,
        explanation: "Expired items are blocked from sale and flagged for disposal, ensuring customer safety and regulatory compliance."
      },
      {
        id: 12,
        text: "How do you receive a delivery of fresh produce with expiry dates?",
        options: [
          "A) Inventory → Receive Stock → enter quantities and expiry dates per batch",
          "B) Just add to stock",
          "C) No expiry needed",
          "D) Manual tracking only"
        ],
        correct: 0,
        explanation: "When receiving perishable items, you must enter batch numbers and expiry dates for proper FEFO tracking and inventory management."
      },
      {
        id: 13,
        text: "What is the function of Stock Count feature?",
        options: [
          "A) Count customer visits",
          "B) Perform physical inventory reconciliation",
          "C) Count employee hours",
          "D) Count daily transactions"
        ],
        correct: 1,
        explanation: "Stock Count allows you to perform physical inventory counts and reconcile differences between system records and actual stock."
      },
      {
        id: 14,
        text: "How do you view expiry report for all perishable items?",
        options: [
          "A) Reports → Inventory Reports → Expiry Report",
          "B) Dashboard shows only",
          "C) Cannot view expiry report",
          "D) Check each product individually"
        ],
        correct: 0,
        explanation: "The Expiry Report shows all items with expiry dates, sorted by days remaining, helping you plan markdowns and prevent waste."
      },
      {
        id: 15,
        text: "What is the purpose of Markdown feature for expiring items?",
        options: [
          "A) Increase prices",
          "B) Automatically apply discounts to expiring items to encourage quick sale",
          "C) Delete items",
          "D) Hide items from customers"
        ],
        correct: 1,
        explanation: "Markdowns automatically apply discounts to items approaching expiry, helping sell them before they spoil and reducing waste."
      },
      {
        id: 16,
        text: "How do you track inventory across multiple grocery store locations?",
        options: [
          "A) Separate systems for each store",
          "B) Multi-store inventory sync with stock transfers",
          "C) Manual tracking only",
          "D) Cannot track multiple locations"
        ],
        correct: 1,
        explanation: "The system supports multi-store inventory with stock transfers, allowing you to move products between locations and maintain centralized visibility."
      },
      {
        id: 17,
        text: "What information is shown in grocery dashboard?",
        options: [
          "A) Today's Sales, Transactions, Low Stock Items, Expiring Items",
          "B) Employee birthdays only",
          "C) Weather forecast",
          "D) Social media feeds"
        ],
        correct: 0,
        explanation: "The dashboard displays key metrics including today's sales, transaction count, customers served, low stock alerts, and expiring items alerts."
      },
      {
        id: 18,
        text: "How do you set up automatic reorder points for grocery items?",
        options: [
          "A) Product settings → set minimum stock and reorder point",
          "B) Automatic only",
          "C) Manual reorder only",
          "D) Cannot set reorder points"
        ],
        correct: 0,
        explanation: "In each product's settings, set minimum stock level and reorder point. When stock falls below, system suggests reordering."
      },
      {
        id: 19,
        text: "What is the purpose of Department categorization in grocery?",
        options: [
          "A) Organize products by store section (Produce, Dairy, Meat, etc.) for easier POS selection",
          "B) Track employee departments",
          "C) Separate customer types",
          "D) Organize suppliers"
        ],
        correct: 0,
        explanation: "Departments organize products logically for quick POS access and provide departmental sales reporting (e.g., Produce sales vs. Dairy sales)."
      },
      {
        id: 20,
        text: "How do you generate a waste and shrinkage report?",
        options: [
          "A) Reports → Perishable Reports → Waste Report",
          "B) Cannot generate waste reports",
          "C) Manual calculation",
          "D) Dashboard only"
        ],
        correct: 0,
        explanation: "The Waste Report shows waste by product, department, reason, and date, helping identify problem areas and reduce shrinkage."
      }
    ]
  },
  "pharmacy-management": {
    courseId: "pharmacy-management",
    courseTitle: "AppEx Pharmacy Management System",
    passingScore: 16,
    questions: [
      {
        id: 1,
        text: "What is required to dispense a prescription drug?",
        options: [
          "A) Customer phone number only",
          "B) Valid prescription, patient identification, pharmacist verification",
          "C) Cash payment only",
          "D) Manager approval only"
        ],
        correct: 1,
        explanation: "Dispensing prescription drugs requires a valid prescription, patient ID, and pharmacist verification."
      },
      {
        id: 2,
        text: "How does the Controlled Drug Register work?",
        options: [
          "A) Manual entry required",
          "B) Automatically logs all controlled substance transactions",
          "C) Optional feature",
          "D) Only for inventory"
        ],
        correct: 1,
        explanation: "The system automatically logs all controlled drug transactions for regulatory compliance."
      },
      {
        id: 3,
        text: "How do you add a new prescription to the system?",
        options: [
          "A) Prescriptions → New Prescription → enter patient, prescriber, medication details",
          "B) Cannot add prescriptions",
          "C) Use external system",
          "D) Write on paper only"
        ],
        correct: 0,
        explanation: "Navigate to Prescriptions, click 'New Prescription', and enter all required details including patient and prescriber information."
      },
      {
        id: 4,
        text: "What happens when a controlled substance is dispensed?",
        options: [
          "A) Nothing special",
          "B) Requires pharmacist double verification and logs to controlled drug register",
          "C) Customer must sign waiver",
          "D) Manager approval only"
        ],
        correct: 1,
        explanation: "Controlled substances require pharmacist verification and are automatically logged in the controlled drug register."
      },
      {
        id: 5,
        text: "How do you check for drug interactions?",
        options: [
          "A) System automatically checks patient's current medications and alerts pharmacist",
          "B) Manual check required",
          "C) No interaction checking",
          "D) Call doctor for each prescription"
        ],
        correct: 0,
        explanation: "The system automatically checks new prescriptions against patient's current medications and alerts for potential interactions."
      },
      {
        id: 6,
        text: "What is the purpose of patient medication history?",
        options: [
          "A) Track patient payments only",
          "B) View all past prescriptions for clinical decisions and interaction checking",
          "C) Marketing purposes",
          "D) Inventory tracking"
        ],
        correct: 1,
        explanation: "Patient medication history helps pharmacists make informed clinical decisions and check for potential issues."
      },
      {
        id: 7,
        text: "How do you process a medical aid claim?",
        options: [
          "A) During checkout, select patient's medical aid scheme",
          "B) Cannot process claims",
          "C) Customer pays full amount",
          "D) Submit paper claim"
        ],
        correct: 0,
        explanation: "During checkout, select patient's medical aid scheme, and the system calculates the insurance portion."
      },
      {
        id: 8,
        text: "What information is required on a prescription label?",
        options: [
          "A) Patient name, medication, dosage, instructions, pharmacy details, date, pharmacist initials",
          "B) Only medication name",
          "C) Only patient name",
          "D) Price only"
        ],
        correct: 0,
        explanation: "Prescription labels must include patient name, medication, dosage instructions, pharmacy information, date, and dispensing details."
      },
      {
        id: 9,
        text: "How do you handle a prescription refill?",
        options: [
          "A) Search original prescription → Process Refill",
          "B) Create new prescription",
          "C) Cannot refill",
          "D) Customer must see doctor again"
        ],
        correct: 0,
        explanation: "Find the original prescription, verify refills remaining, and click 'Process Refill' to dispense."
      },
      {
        id: 10,
        text: "What is the purpose of expiry date tracking in pharmacy?",
        options: [
          "A) Track employee expiry",
          "B) Prevent dispensing expired medications and manage stock rotation",
          "C) Track customer expiry",
          "D) Marketing purposes"
        ],
        correct: 1,
        explanation: "Expiry tracking ensures expired medications are not dispensed and helps manage stock rotation (FEFO)."
      },
      {
        id: 11,
        text: "How do you record a temperature reading for cold chain items?",
        options: [
          "A) Inventory → Cold Chain → Temperature Logs → New Reading",
          "B) Cannot record temperatures",
          "C) Manual log only",
          "D) Automatic only"
        ],
        correct: 0,
        explanation: "Record temperature readings in the Cold Chain section to maintain compliance for temperature-sensitive medications."
      },
      {
        id: 12,
        text: "What happens when a temperature breach is detected?",
        options: [
          "A) System alerts pharmacist and generates breach report",
          "B) Nothing happens",
          "C) System shuts down",
          "D) Deletes inventory"
        ],
        correct: 0,
        explanation: "The system immediately alerts staff and generates a breach report documenting the incident."
      },
      {
        id: 13,
        text: "How do you generate a ZIMRA tax report?",
        options: [
          "A) Reports → Compliance Reports → ZIMRA → select period → Generate",
          "B) Cannot generate tax reports",
          "C) Manual calculation",
          "D) External accountant only"
        ],
        correct: 0,
        explanation: "Navigate to Reports → Compliance Reports → ZIMRA to generate tax reports for filing."
      },
      {
        id: 14,
        text: "What is the purpose of MCAZ compliance report?",
        options: [
          "A) Track employee performance",
          "B) Generate reports required by Medicines Control Authority of Zimbabwe",
          "C) Track customer purchases",
          "D) Manage inventory"
        ],
        correct: 1,
        explanation: "MCAZ compliance reports provide documentation required for regulatory inspections and submissions."
      },
      {
        id: 15,
        text: "How do you add a new patient to the system?",
        options: [
          "A) Patients → Add New Patient → enter details",
          "B) Cannot add patients",
          "C) Use external system",
          "D) Only during prescription"
        ],
        correct: 0,
        explanation: "Go to Patients, click 'Add New Patient', and enter their personal and medical information."
      },
      {
        id: 16,
        text: "What information is stored in a patient's medical history?",
        options: [
          "A) Allergies, chronic conditions, current medications, past prescriptions",
          "B) Only name and phone",
          "C) Payment history only",
          "D) Inventory items"
        ],
        correct: 0,
        explanation: "Patient medical history includes clinical information essential for safe dispensing."
      },
      {
        id: 17,
        text: "How do you process a return of a dispensed medication?",
        options: [
          "A) Sales → Sales History → Process Return",
          "B) Cannot return medications",
          "C) Discard medication",
          "D) Customer keeps medication"
        ],
        correct: 0,
        explanation: "Returns can be processed with appropriate documentation and verification, subject to regulations."
      },
      {
        id: 18,
        text: "What is the purpose of Stock Take feature?",
        options: [
          "A) Count employee attendance",
          "B) Perform physical inventory count to reconcile with system",
          "C) Count customer visits",
          "D) Count prescriptions filled"
        ],
        correct: 1,
        explanation: "Stock Take allows you to perform physical counts and reconcile differences between system records and actual stock."
      },
      {
        id: 19,
        text: "How do you view a patient's prescription history?",
        options: [
          "A) Patient profile → Prescriptions tab",
          "B) Cannot view history",
          "C) Request from doctor",
          "D) Check paper records"
        ],
        correct: 0,
        explanation: "In the patient's profile, the Prescriptions tab shows all past and active prescriptions."
      },
      {
        id: 20,
        text: "What happens when a prescription expires?",
        options: [
          "A) System marks as expired and prevents dispensing",
          "B) Prescription remains active",
          "C) Customer is notified",
          "D) Prescription is deleted"
        ],
        correct: 0,
        explanation: "Expired prescriptions are automatically marked and cannot be dispensed without a new prescription."
      }
    ]
  },
  "grocery-management": {
    courseId: "grocery-management",
    courseTitle: "AppEx Grocery Store Management System",
    passingScore: 16,
    questions: [
      {
        id: 1,
        text: "What is primary feature for managing fresh produce in AppEx Grocery?",
        options: [
          "A) Serial number tracking",
          "B) Perishable goods tracking with expiry date management",
          "C) Barcode scanning only",
          "D) Customer loyalty points"
        ],
        correct: 1,
        explanation: "Perishable goods tracking allows you to manage expiry dates, receive alerts, and ensure fresh products are sold first (FEFO - First Expiry, First Out)."
      },
      {
        id: 2,
        text: "How does weight scale integration work in grocery POS?",
        options: [
          "A) Manual weight entry required",
          "B) Scale automatically sends weight to POS via Bluetooth/USB",
          "C) Weight is estimated",
          "D) Only pre-packaged items allowed"
        ],
        correct: 1,
        explanation: "Connected scales automatically transmit weight to POS, ensuring accurate pricing for items sold by weight like produce, meat, and bulk items."
      },
      {
        id: 3,
        text: "What happens when a perishable item is about to expire?",
        options: [
          "A) Nothing",
          "B) System sends alerts and can automatically apply markdown discounts",
          "C) Item is deleted",
          "D) Customer receives notification"
        ],
        correct: 1,
        explanation: "The system alerts staff when items approach expiry and can automatically apply markdown discounts to encourage quick sale."
      },
      {
        id: 4,
        text: "How do you set up bulk pricing tiers for wholesale customers?",
        options: [
          "A) Settings → Pricing → Bulk Pricing Rules",
          "B) Cannot set bulk pricing",
          "C) Only for retail customers",
          "D) Manual calculation only"
        ],
        correct: 0,
        explanation: "Navigate to Settings → Pricing → Bulk Pricing Rules to configure quantity-based discounts (e.g., 10+ units = 5% off, 50+ units = 10% off)."
      },
      {
        id: 5,
        text: "What is the purpose of FEFO (First Expiry, First Out) system?",
        options: [
          "A) Sell cheapest items first",
          "B) Automatically suggest selling items with earliest expiry dates first",
          "C) Track employee performance",
          "D) Manage customer queues"
        ],
        correct: 1,
        explanation: "FEFO ensures that products with earlier expiry dates are suggested or prioritized for sale, reducing waste from expired goods."
      },
      {
        id: 6,
        text: "How do you record waste for spoiled produce?",
        options: [
          "A) Inventory → Waste Tracking → Record Waste",
          "B) Delete product from inventory",
          "C) Ignore spoiled items",
          "D) Sell at discount"
        ],
        correct: 0,
        explanation: "Use Waste Tracking feature to record spoiled or damaged items, which helps track shrinkage and identify problem areas."
      },
      {
        id: 7,
        text: "What information is tracked for each perishable batch?",
        options: [
          "A) Batch number, expiry date, received date, quantity",
          "B) Only product name",
          "C) Supplier name only",
          "D) Customer information"
        ],
        correct: 0,
        explanation: "Each batch tracks batch number, expiry date, manufacturing date, received date, quantity, and remaining quantity for accurate stock management."
      },
      {
        id: 8,
        text: "How do you process a sale for loose produce like tomatoes?",
        options: [
          "A) Scan barcode",
          "B) Select product → enter weight from scale or manually → add to cart",
          "C) Only pre-packaged allowed",
          "D) Estimate weight"
        ],
        correct: 1,
        explanation: "For variable weight items, select product, enter weight (auto-populated from scale or manual entry), and price calculates automatically."
      },
      {
        id: 9,
        text: "What is the purpose of Supplier Management module?",
        options: [
          "A) Track employee schedules",
          "B) Manage vendor information, purchase orders, and delivery performance",
          "C) Track customer purchases",
          "D) Manage loyalty program"
        ],
        correct: 1,
        explanation: "Supplier Management centralizes vendor information, tracks purchase orders, monitors delivery performance, and manages supplier relationships."
      },
      {
        id: 10,
        text: "How do you create a purchase order for grocery items?",
        options: [
          "A) Suppliers → Purchase Orders → New Purchase Order",
          "B) Inventory → Add Product",
          "C) Sales → New Sale",
          "D) Cannot create purchase orders"
        ],
        correct: 0,
        explanation: "Navigate to Suppliers → Purchase Orders, click 'New Purchase Order', select supplier, add items and quantities, and send to supplier."
      },
      {
        id: 11,
        text: "What happens when a perishable item reaches its expiry date?",
        options: [
          "A) System blocks sale and marks as expired",
          "B) Item is automatically deleted",
          "C) Customer can still purchase",
          "D) Price increases"
        ],
        correct: 0,
        explanation: "Expired items are blocked from sale and flagged for disposal, ensuring customer safety and regulatory compliance."
      },
      {
        id: 12,
        text: "How do you receive a delivery of fresh produce with expiry dates?",
        options: [
          "A) Inventory → Receive Stock → enter quantities and expiry dates per batch",
          "B) Just add to stock",
          "C) No expiry needed",
          "D) Manual tracking only"
        ],
        correct: 0,
        explanation: "When receiving perishable items, you must enter batch numbers and expiry dates for proper FEFO tracking and inventory management."
      },
      {
        id: 13,
        text: "What is the function of Stock Count feature?",
        options: [
          "A) Count customer visits",
          "B) Perform physical inventory reconciliation",
          "C) Count employee hours",
          "D) Count daily transactions"
        ],
        correct: 1,
        explanation: "Stock Count allows you to perform physical inventory counts and reconcile differences between system records and actual stock."
      },
      {
        id: 14,
        text: "How do you view expiry report for all perishable items?",
        options: [
          "A) Reports → Inventory Reports → Expiry Report",
          "B) Dashboard shows only",
          "C) Cannot view expiry report",
          "D) Check each product individually"
        ],
        correct: 0,
        explanation: "The Expiry Report shows all items with expiry dates, sorted by days remaining, helping you plan markdowns and prevent waste."
      },
      {
        id: 15,
        text: "What is the purpose of Markdown feature for expiring items?",
        options: [
          "A) Increase prices",
          "B) Automatically apply discounts to expiring items to encourage quick sale",
          "C) Delete items",
          "D) Hide items from customers"
        ],
        correct: 1,
        explanation: "Markdowns automatically apply discounts to items approaching expiry, helping sell them before they spoil and reducing waste."
      },
      {
        id: 16,
        text: "How do you track inventory across multiple grocery store locations?",
        options: [
          "A) Separate systems for each store",
          "B) Multi-store inventory sync with stock transfers",
          "C) Manual tracking only",
          "D) Cannot track multiple locations"
        ],
        correct: 1,
        explanation: "The system supports multi-store inventory with stock transfers, allowing you to move products between locations and maintain centralized visibility."
      },
      {
        id: 17,
        text: "What information is shown in grocery dashboard?",
        options: [
          "A) Today's Sales, Transactions, Low Stock Items, Expiring Items",
          "B) Employee birthdays only",
          "C) Weather forecast",
          "D) Social media feeds"
        ],
        correct: 0,
        explanation: "The dashboard displays key metrics including today's sales, transaction count, customers served, low stock alerts, and expiring items alerts."
      },
      {
        id: 18,
        text: "How do you set up automatic reorder points for grocery items?",
        options: [
          "A) Product settings → set minimum stock and reorder point",
          "B) Automatic only",
          "C) Manual reorder only",
          "D) Cannot set reorder points"
        ],
        correct: 0,
        explanation: "In each product's settings, set minimum stock level and reorder point. When stock falls below, system suggests reordering."
      },
      {
        id: 19,
        text: "What is the purpose of Department categorization in grocery?",
        options: [
          "A) Organize products by store section (Produce, Dairy, Meat, etc.) for easier POS selection",
          "B) Track employee departments",
          "C) Separate customer types",
          "D) Organize suppliers"
        ],
        correct: 0,
        explanation: "Departments organize products logically for quick POS access and provide departmental sales reporting (e.g., Produce sales vs. Dairy sales)."
      },
      {
        id: 20,
        text: "How do you generate a waste and shrinkage report?",
        options: [
          "A) Reports → Perishable Reports → Waste Report",
          "B) Cannot generate waste reports",
          "C) Manual calculation",
          "D) Dashboard only"
        ],
        correct: 0,
        explanation: "The Waste Report shows waste by product, department, reason, and date, helping identify problem areas and reduce shrinkage."
      }
    ]
  },
  "butchery-management": {
    courseId: "butchery-management",
    courseTitle: "AppEx Butchery Management System",
    passingScore: 16,
    questions: [
      {
        id: 1,
        text: "What is primary function of Meat Processing module?",
        options: [
          "A) Track employee schedules",
          "B) Record breakdown of whole carcasses into individual cuts",
          "C) Manage customer loyalty",
          "D) Process payments only"
        ],
        correct: 1,
        explanation: "The Meat Processing module allows you to record how whole carcasses are broken down into various cuts, tracking input weight, output weight, and waste."
      },
      {
        id: 2,
        text: "How does weight scale integration work for butchery?",
        options: [
          "A) Manual entry only",
          "B) Scale automatically sends weight to POS for accurate pricing",
          "C) Estimate weight",
          "D) Only pre-packaged items"
        ],
        correct: 1,
        explanation: "Connected scales automatically transmit weight to POS, ensuring accurate pricing for meat sold by weight (per kg)."
      },
      {
        id: 3,
        text: "What information is tracked in a meat processing batch?",
        options: [
          "A) Source product, input weight, output products with weights, waste",
          "B) Only customer name",
          "C) Payment method only",
          "D) Employee name only"
        ],
        correct: 0,
        explanation: "Processing batches track source carcass, input weight, each output cut with its weight, waste weight and percentage, and operator information."
      },
      {
        id: 4,
        text: "How do you calculate waste percentage in meat processing?",
        options: [
          "A) Manual calculation only",
          "B) System automatically calculates: (Input Weight - Total Output Weight) / Input Weight × 100",
          "C) Cannot calculate waste",
          "D) Estimate only"
        ],
        correct: 1,
        explanation: "The system automatically calculates waste percentage based on input weight versus total output weight, helping track processing efficiency."
      },
      {
        id: 5,
        text: "What is the purpose of freshness tracking in butchery?",
        options: [
          "A) Track employee attendance",
          "B) Monitor meat age and ensure quality products are sold before expiry",
          "C) Track customer preferences",
          "D) Manage supplier payments"
        ],
        correct: 1,
        explanation: "Freshness tracking monitors meat age from processing date, provides expiry alerts, and ensures older stock is sold first (FEFO - First Expiry, First Out)."
      },
      {
        id: 6,
        text: "How do you record a new processing batch from a whole carcass?",
        options: [
          "A) Processing → New Processing Batch → select source → enter input weight → add output cuts",
          "B) Inventory → Add Product",
          "C) Sales → New Sale",
          "D) Cannot record processing"
        ],
        correct: 0,
        explanation: "Navigate to Processing → New Processing Batch, select the source carcass, enter input weight, and add each output cut with its weight."
      },
      {
        id: 7,
        text: "What happens to inventory when you complete a processing batch?",
        options: [
          "A) Nothing changes",
          "B) Source product quantity decreases, output products increase",
          "C) All products are deleted",
          "D) Only source product is affected"
        ],
        correct: 1,
        explanation: "The system automatically reduces the source carcass inventory and adds processed cuts to inventory, accurately tracking stock levels."
      },
      {
        id: 8,
        text: "How do you set different prices for different meat cuts?",
        options: [
          "A) Products → select product → set selling price per kg",
          "B) All cuts same price",
          "C) Prices are automatic",
          "D) Cannot set different prices"
        ],
        correct: 0,
        explanation: "Each cut can have its own price per kg in product settings, allowing premium cuts to be priced higher than standard cuts."
      },
      {
        id: 9,
        text: "What is the purpose of quality control feature in butchery?",
        options: [
          "A) Track employee performance",
          "B) Record quality checks on meat products including temperature, appearance, and notes",
          "C) Track customer satisfaction",
          "D) Manage supplier quality"
        ],
        correct: 1,
        explanation: "Quality control records temperature checks, appearance inspections, and notes to ensure meat products meet safety and quality standards."
      },
      {
        id: 10,
        text: "How do you process a sale for a custom cut ordered by a customer?",
        options: [
          "A) Special Order → create custom order → process when ready",
          "B) Cannot do custom cuts",
          "C) Regular sale only",
          "D) Manual process only"
        ],
        correct: 0,
        explanation: "Use Special Orders to create custom cut requests, collect deposit if needed, and track until the order is ready for pickup."
      },
      {
        id: 11,
        text: "What temperature ranges are monitored in butchery cold storage?",
        options: [
          "A) Chiller: 0-4°C, Freezer: -18°C or below",
          "B) Any temperature is fine",
          "C) Room temperature only",
          "D) Only freezer monitored"
        ],
        correct: 0,
        explanation: "Proper cold chain requires chiller temperatures of 0-4°C for fresh meat and freezer temperatures of -18°C or below for frozen products."
      },
      {
        id: 12,
        text: "How do you handle a temperature breach alert?",
        options: [
          "A) Ignore alert",
          "B) System alerts staff, generate breach report, inspect affected products",
          "C) Delete products automatically",
          "D) Continue selling"
        ],
        correct: 0,
        explanation: "When a temperature breach occurs, the system alerts staff, generates a breach report, and affected products should be inspected before sale."
      },
      {
        id: 13,
        text: "What is the purpose of batch tracking in butchery?",
        options: [
          "A) Track employee batches",
          "B) Trace meat back to source carcass and processing date",
          "C) Track customer batches",
          "D) Track supplier batches"
        ],
        correct: 1,
        explanation: "Batch tracking allows you to trace any meat product back to the original carcass, processing date, and batch for quality and safety purposes."
      },
      {
        id: 14,
        text: "How do you view processing efficiency reports?",
        options: [
          "A) Reports → Processing Reports → Yield Analysis",
          "B) Cannot view efficiency",
          "C) Dashboard only",
          "D) Manual calculation"
        ],
        correct: 0,
        explanation: "Processing efficiency reports show actual vs expected yield percentages, waste analysis, and operator performance."
      },
      {
        id: 15,
        text: "What is shelf life setting for different meat products?",
        options: [
          "A) All products same shelf life",
          "B) Configurable per product (e.g., fresh mince 3 days, vacuum-packed 7 days, frozen 90 days)",
          "C) No shelf life tracking",
          "D) Automatic only"
        ],
        correct: 1,
        explanation: "Each product can have a configured shelf life in days, and the system tracks age from processing date and alerts when approaching expiry."
      },
      {
        id: 16,
        text: "How do you record by-product sales (e.g., bones, offal)?",
        options: [
          "A) Add as regular products in POS",
          "B) Cannot sell by-products",
          "C) Discard only",
          "D) Give away free"
        ],
        correct: 0,
        explanation: "By-products can be added as regular products with their own pricing, and they can be linked to processing batches to track yield."
      },
      {
        id: 17,
        text: "What information is shown in butchery dashboard?",
        options: [
          "A) Today's Sales, Meat Processed Today, Low Stock Items, Expiring Products",
          "B) Employee birthdays only",
          "C) Weather forecast",
          "D) Customer feedback only"
        ],
        correct: 0,
        explanation: "The dashboard displays key metrics including today's sales, meat processed (kg), low stock alerts, and expiring product alerts."
      },
      {
        id: 18,
        text: "How do you manage contractor accounts for bulk meat purchases?",
        options: [
          "A) Contractors → Add Contractor → set credit limit and trade discount",
          "B) Cannot have contractor accounts",
          "C) Regular customer only",
          "D) Cash only"
        ],
        correct: 0,
        explanation: "Contractor accounts allow you to offer special pricing, credit terms, and track bulk purchases for restaurants, hotels, and other businesses."
      },
      {
        id: 19,
        text: "What is the purpose of yield percentage calculation?",
        options: [
          "A) Track employee yield",
          "B) Calculate expected meat yield from carcass to optimize pricing and reduce waste",
          "C) Track customer yield",
          "D) Track supplier yield"
        ],
        correct: 1,
        explanation: "Yield percentages help you calculate expected output from carcasses, set accurate prices, identify processing issues, and reduce waste."
      },
      {
        id: 20,
        text: "How do you handle a return of spoiled meat?",
        options: [
          "A) Sales → Sales History → Process Return → select spoiled reason",
          "B) Cannot return meat products",
          "C) Discard and ignore",
          "D) Customer keeps product"
        ],
        correct: 0,
        explanation: "Returns can be processed with appropriate documentation and verification, and the system records the return reason (spoiled, quality issue) for tracking purposes."
      }
    ]
  },
  "restaurant-management": {
    courseId: "restaurant-management",
    courseTitle: "AppEx Restaurant Management System",
    passingScore: 16,
    questions: [
      {
        id: 1,
        text: "What does the Kitchen Display System (KDS) do?",
        options: [
          "A) Shows customer feedback",
          "B) Displays orders to kitchen staff in real-time",
          "C) Manages employee schedules",
          "D) Prints customer receipts"
        ],
        correct: 1,
        explanation: "KDS sends orders from the POS directly to kitchen screens, eliminating paper tickets and improving efficiency."
      },
      {
        id: 2,
        text: "How do you split a bill for multiple guests?",
        options: [
          "A) Cannot split bills",
          "B) Click 'Split Bill' → select split by item, amount, or equally",
          "C) Process separate transactions",
          "D) Ask customers to pay together"
        ],
        correct: 1,
        explanation: "Click 'Split Bill' and choose to split by item, by amount, or equally among guests."
      },
      {
        id: 3,
        text: "What is the purpose of Table Management?",
        options: [
          "A) Track employee seating",
          "B) Visualize floor plan, manage table status, and assign orders",
          "C) Manage food inventory",
          "D) Track customer preferences"
        ],
        correct: 1,
        explanation: "Table Management provides a visual floor plan showing which tables are available, occupied, or reserved."
      },
      {
        id: 4,
        text: "How do you add modifiers to a menu item (e.g., 'well done' for steak)?",
        options: [
          "A) Add item to cart → click item → select modifiers",
          "B) Modifiers are automatic",
          "C) Cannot add modifiers",
          "D) Call kitchen to add notes"
        ],
        correct: 0,
        explanation: "After adding an item to cart, click on it to open modifier options and select customizations."
      },
      {
        id: 5,
        text: "What happens when you click 'Send to Kitchen'?",
        options: [
          "A) Order is saved as draft",
          "B) Order appears on KDS screens and kitchen printers",
          "C) Payment is processed",
          "D) Customer is notified"
        ],
        correct: 1,
        explanation: "Sending to the kitchen immediately displays the order on kitchen screens and/or prints to kitchen printers."
      },
      {
        id: 6,
        text: "How do you create a reservation for a future date?",
        options: [
          "A) Reservations → New Reservation → enter details",
          "B) Cannot create reservations",
          "C) Call customers only",
          "D) Use calendar app"
        ],
        correct: 0,
        explanation: "Navigate to Reservations, click 'New Reservation', enter customer and reservation details."
      },
      {
        id: 7,
        text: "What do the different table colors represent in the floor plan?",
        options: [
          "A) Green: Available, Yellow: Occupied, Blue: Reserved, Red: Needs attention",
          "B) Colors are decorative only",
          "C) Red: Available, Green: Occupied",
          "D) Only one color used"
        ],
        correct: 0,
        explanation: "Color coding helps staff quickly identify table status: Green=Available, Yellow=Occupied, Blue=Reserved, Red=Needs attention."
      },
      {
        id: 8,
        text: "How do you process a takeaway order?",
        options: [
          "A) Click 'Takeaway' in POS, enter customer name, add items, place order",
          "B) Process as regular dine-in",
          "C) Cannot process takeaway",
          "D) Call customer to confirm"
        ],
        correct: 0,
        explanation: "Select 'Takeaway' mode, enter customer name and phone, add items, and place the order."
      },
      {
        id: 9,
        text: "What is the purpose of Course Management in restaurant POS?",
        options: [
          "A) Manage employee training",
          "B) Organize multi-course meals (starter, main, dessert) with proper timing",
          "C) Track food cost",
          "D) Manage supplier orders"
        ],
        correct: 1,
        explanation: "Course Management allows you to assign items to different courses and control when each course is sent to the kitchen."
      },
      {
        id: 10,
        text: "How do you add a service charge to a bill?",
        options: [
          "A) Service charge is automatic",
          "B) Click 'Add Service Charge' in bill, select percentage",
          "C) Cannot add service charge",
          "D) Add as a menu item"
        ],
        correct: 1,
        explanation: "In the bill view, click 'Add Service Charge' and select the percentage (e.g., 10%)."
      },
      {
        id: 11,
        text: "What information is shown in the KDS order tile?",
        options: [
          "A) Table number, items with modifiers, time ordered, special instructions",
          "B) Only item names",
          "C) Customer payment history",
          "D) Employee names"
        ],
        correct: 0,
        explanation: "KDS displays table number, all ordered items with modifiers, order time, and any special instructions."
      },
      {
        id: 12,
        text: "How do you mark an order as 'Ready' in the kitchen?",
        options: [
          "A) Chef clicks 'Ready' on KDS when food is plated",
          "B) Automatically marks ready",
          "C) Server marks ready",
          "D) Customer marks ready"
        ],
        correct: 0,
        explanation: "When food is ready, the chef clicks the 'Ready' button on the KDS, notifying servers."
      },
      {
        id: 13,
        text: "What is the function of the Waitlist feature?",
        options: [
          "A) Track employee breaks",
          "B) Manage walk-in customers when all tables are full",
          "C) Track supplier deliveries",
          "D) Manage inventory"
        ],
        correct: 1,
        explanation: "Waitlist allows you to add walk-in customers to a queue and notify them when tables become available."
      },
      {
        id: 14,
        text: "How do you transfer a table to a different server?",
        options: [
          "A) Click table → 'Transfer Table' → select new server",
          "B) Cannot transfer tables",
          "C) Close and reopen order",
          "D) Manager must reassign"
        ],
        correct: 0,
        explanation: "Click on the table, select 'Transfer Table', and choose the new server from the list."
      },
      {
        id: 15,
        text: "What happens when you void an item from an order?",
        options: [
          "A) Item is removed from bill and kitchen",
          "B) Item remains on kitchen screen",
          "C) Customer must pay anyway",
          "D) Item is marked as sold"
        ],
        correct: 0,
        explanation: "Voiding removes the item from the bill and cancels it in the kitchen if not yet prepared."
      },
      {
        id: 16,
        text: "How do you print a kitchen docket for a specific station (e.g., grill)?",
        options: [
          "A) Configure station printers in KDS settings",
          "B) Cannot print to specific stations",
          "C) All orders go to one printer",
          "D) Manual routing required"
        ],
        correct: 0,
        explanation: "Configure station-specific printers in the KDS settings so orders route to the correct kitchen station."
      },
      {
        id: 17,
        text: "What is the purpose of the 'Combine Tables' feature?",
        options: [
          "A) Merge multiple tables into one for large parties",
          "B) Merge employee schedules",
          "C) Merge customer accounts",
          "D) Combine inventory items"
        ],
        correct: 0,
        explanation: "Combine Tables allows you to merge multiple adjacent tables for large groups and manage them as one."
      },
      {
        id: 18,
        text: "How do you add a new menu item with modifiers?",
        options: [
          "A) Menu → Menu Items → Add Item → set modifiers",
          "B) Cannot add new items",
          "C) Call support to add",
          "D) Use external editor"
        ],
        correct: 0,
        explanation: "Navigate to Menu → Menu Items → Add New Item, then add modifiers to the item."
      },
      {
        id: 19,
        text: "What does the 'Course Hold' feature do?",
        options: [
          "A) Holds entire order until server releases",
          "B) Delays sending next course until current course is served",
          "C) Cancels order",
          "D) Doubles order"
        ],
        correct: 1,
        explanation: "Course Hold prevents the next course from being sent to the kitchen until the current course is marked as served."
      },
      {
        id: 20,
        text: "How do you view daily sales by server?",
        options: [
          "A) Reports → Sales Reports → By Server",
          "B) Dashboard only shows total sales",
          "C) Cannot view by server",
          "D) Ask each server for report"
        ],
        correct: 0,
        explanation: "Go to Reports → Sales Reports → By Server to see sales performance broken down by staff member."
      }
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("course")
    const moduleId = searchParams.get("module")

    if (courseId && assessments[courseId]) {
      return NextResponse.json({
        assessment: assessments[courseId],
        questions: assessments[courseId].questions,
        passingScore: assessments[courseId].passingScore,
        courseTitle: assessments[courseId].courseTitle
      })
    }

    // Return all available assessments
    return NextResponse.json({
      assessments: Object.keys(assessments).map(key => ({
        courseId: key,
        courseTitle: assessments[key].courseTitle,
        passingScore: assessments[key].passingScore,
        questionCount: assessments[key].questions.length
      }))
    })
  } catch (error) {
    console.error("Error fetching assessment:", error)
    return NextResponse.json(
      { error: "Failed to fetch assessment" },
      { status: 500 }
    )
  }
}
