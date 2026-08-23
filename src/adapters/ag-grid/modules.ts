import { ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';
import type { Module } from 'ag-grid-community';
import {
  ExcelExportModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  LicenseManager,
} from 'ag-grid-enterprise';
import type { SHGridEnterpriseFeature } from '../../grid/types';

let registered = false;
export function registerSHGridModules(
  features: readonly SHGridEnterpriseFeature[],
  licenseKey?: string,
): void {
  if (licenseKey) LicenseManager.setLicenseKey(licenseKey);
  const modules: Module[] = [ClientSideRowModelModule];
  if (features.includes('serverSideRows')) modules.push(ServerSideRowModelModule);
  if (features.includes('excelExport')) modules.push(ExcelExportModule);
  if (features.includes('rowGrouping')) modules.push(RowGroupingModule);
  ModuleRegistry.registerModules(modules);
  registered = true;
}
export const areSHGridModulesRegistered = (): boolean => registered;
