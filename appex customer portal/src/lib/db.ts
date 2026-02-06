import Dexie, { type Table } from 'dexie';
import type { Product, Customer, Sale, SyncOperation, Communication, Warehouse } from '@/types';

export class AppexDatabase extends Dexie {
    products!: Table<Product, string>;
    customers!: Table<Customer, string>;
    sales!: Table<Sale, string>;
    syncQueue!: Table<SyncOperation, string>;
    communications!: Table<Communication, string>;
    warehouses!: Table<Warehouse, string>;

    constructor() {
        super('AppexDB');
        this.version(3).stores({
            products: 'id, sku, barcode, category',
            customers: 'id, phone, email, name',
            sales: 'id, receiptNumber, customerId, status, createdAt',
            syncQueue: 'id, status, type, createdAt',
            communications: 'id, customerId, type, status, createdAt',
            warehouses: 'id, name, branchId, isActive'
        });
    }
}

export const db = new AppexDatabase();
