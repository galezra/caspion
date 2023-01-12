import React from 'react';
import logsIcon from '../../assets/card-text.svg';
import settingsIcon from '../../assets/gear.svg';
import resultsIcon from '../../assets/results.svg';
import {
  Account as AccountType, AccountStatus, AccountType as TypeOfAccount, ModalStatus
} from '../../types';
import Account, { ActionButton } from './Account';
import NewAccount from './NewAccount';

type ImportersProps = {
    accounts: AccountType[];
    isScraping: boolean;
    showModal: (AccountType, ModalStatus) => void;
    handleNewAccountClicked?: () => void
}

function Importers({
  accounts, isScraping, showModal, handleNewAccountClicked
}: ImportersProps) {
  return (
        <>
            {
                accounts.map((account) => {
                  return <Account key={account.id} account={account} actionButtons={getActionButtons(showModal, account, isScraping)} />;
                })
            }
            {handleNewAccountClicked ? (
                <NewAccount onClick={handleNewAccountClicked} />
            ) : null
            }
        </>
  );
}

export function getActionButtons(showModal, account: AccountType, isScraping, includeOpenResults = false): ActionButton[] {
  const logsActionButton = {
    icon: logsIcon,
    tooltipText: 'לוגים',
    clickHandler: () => showModal(account, ModalStatus.Logs)
  };

  const accountSettingsActionButton = {
    icon: settingsIcon,
    tooltipText: 'הגדרות',
    clickHandler: () => showModal(account, account.type === TypeOfAccount.IMPORTER ? ModalStatus.ImporterSettings : ModalStatus.SettingsExporter)
  };

  const openResults = {
    icon: resultsIcon,
    tooltipText: 'פתיחת תוצאות',
    clickHandler: () => {}
  };

  const actionButtons: ActionButton[] = [];

  const shouldLog = account.status !== AccountStatus.PENDING && account.status !== AccountStatus.IDLE;

  if (shouldLog) {
    actionButtons.push(logsActionButton);
  }

  if (!isScraping) {
    actionButtons.push(accountSettingsActionButton);
  }

  if (includeOpenResults) {
    actionButtons.push(openResults);
  }

  return actionButtons;
}

export default Importers;
