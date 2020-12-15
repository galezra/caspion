// eslint-disable-next-line max-classes-per-file
import { BudgetTrackingEvent } from '@/originalBudgetTrackingApp';
import { Levels } from '@/components/shared/log/types';
import { UnwrapRef } from '@vue/composition-api';
import { AccountStatus, AccountType } from '@/originalBudgetTrackingApp/eventEmitters/EventEmitter';

export class AccountState {
  id: string;

  name: string;

  status: AccountStatus;

  events: BudgetTrackingEvent[];

  constructor({ id, name }) {
    this.id = id;
    this.name = name;
    this.status = AccountStatus.IDLE;
    this.events = [];
  }

  clear() {
    this.status = AccountStatus.IDLE;
    this.events = [];
  }
}

export class ImporterState extends AccountState {

}

export class ExporterState extends AccountState {

}

export class AccountsState {
  importers: ImporterState[];

  exporters: ExporterState[];

  constructor(importersConfig: readonly { id: string, name: string }[], exportersConfig: readonly { id: string, name: string }[]) {
    this.importers = [];
    this.exporters = [];

    importersConfig.forEach(({ id, name }) => {
      this.importers.push(new ImporterState({ id, name }));
    });

    exportersConfig.forEach(({ id, name }) => {
      this.exporters.push(new ExporterState({ id, name }));
    });
  }

  clear() {
    this.importers.forEach((importer) => importer.clear());
    this.exporters.forEach((exporter) => exporter.clear());
  }

  setPendingStatus() {
    this.importers.forEach((importer) => importer.status = AccountStatus.PENDING);
    this.exporters.forEach((exporter) => exporter.status = AccountStatus.PENDING);
  }
}

export function handleEvent(event: BudgetTrackingEvent & { level: Levels }, accountsState: UnwrapRef<AccountsState>) {
  let accountState: AccountState | undefined;
  if (event.accountType === AccountType.IMPORTER) {
    accountState = accountsState.importers.find(({ name }) => name === event.vendorName);
  } else if (event.accountType === AccountType.EXPORTER) {
    accountState = accountsState.exporters.find(({ name }) => name === event.vendorName);
  }

  if (accountState) {
    accountState.events.push(event);
    if (event.accountStatus) {
      accountState.status = event.accountStatus;
    }
  }
}