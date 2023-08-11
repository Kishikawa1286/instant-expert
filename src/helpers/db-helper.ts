import Dexie from 'dexie';

class TenantDatabase extends Dexie {
  tenants: Dexie.Table<ITenant, number>;

  constructor() {
    super('TenantDatabase');
    this.version(1).stores({
      tenants: '++id, name',
    });
    this.tenants = this.table('tenants');
  }
}

export interface ITenant {
  id?: number;
  name: string;
}

const tenantDatabase = new TenantDatabase();

export const addTenant = async (tenant: ITenant) => {
  return await tenantDatabase.tenants.add(tenant);
};

export const getAllTenants = async () => {
  return await tenantDatabase.tenants.toArray();
};

export const deleteTenant = async (id: number) => {
  await tenantDatabase.tenants.delete(id);
};

class SummaryDatabase extends Dexie {
  summaries: Dexie.Table<ISummary, number>;

  constructor() {
    super('SummaryDatabase');
    this.version(1).stores({
      summaries: '++id, tenantId, original, summary, vector',
    });
    this.summaries = this.table('summaries');
  }
}

export interface ISummary {
  id?: number;
  tenantId: number;
  original: string;
  summary: string;
  vector: number[];
  normalizedVector: number[];
  vectorMagnitude: number;
  url: string;
  index: number;
}

const summaryDatabase = new SummaryDatabase();

export const addSummary = async (summary: ISummary) => {
  return await summaryDatabase.summaries.add(summary);
};

export const getSummary = async (id: number) => {
  return await summaryDatabase.summaries.get(id);
};

export const updateSummary = async (id: number, changes: Partial<ISummary>) => {
  return await summaryDatabase.summaries.update(id, changes);
};

export const deleteSummary = async (id: number) => {
  await summaryDatabase.summaries.delete(id);
};

export const getAllSummaries = async (tenantId: number) => {
  return await summaryDatabase.summaries
    .where('tenantId')
    .equals(tenantId)
    .toArray();
};

export const deleteSummariesByTenant = async (tenantId: number) => {
  return await summaryDatabase.summaries
    .where('tenantId')
    .equals(tenantId)
    .delete();
};
