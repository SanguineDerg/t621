import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, /* AppThunk */ } from '../../app/store';

export const DEFAULT_SITE = "https://e621.net";

export type UserAccount = {
  site: string,
  username: string,
  apiKey: string,
}

export interface AccountsState {
  accounts: {[uid: string]: UserAccount};
  selectedAccount: string | null;
}

// Load state from localstorage
function loadState(): AccountsState {
  // Accounts
  //   accounts = '["uid1"]'
  //   accounts:uid1:site = 'https://e621.net'
  //   accounts:uid1:username = 'username'
  //   accounts:uid1:apiKey = 'api_key'
  const loadedAccounts: {[uid: string]: UserAccount} = {}
  const accounts = localStorage.getItem("accounts")
  if (accounts !== null) {
    const uidList: string[] = JSON.parse(accounts)
    for (const uid of uidList) {
      const site = localStorage.getItem(`accounts:${uid}:site`)
      const username = localStorage.getItem(`accounts:${uid}:username`)
      const apiKey = localStorage.getItem(`accounts:${uid}:apiKey`)
      if (site !== null && username !== null && apiKey !== null) {
        loadedAccounts[uid] = {
          site: site,
          username: username,
          apiKey: apiKey,
        }
      }
    }
  }
  // SelectedAccount
  //   selectedAccount = '"uid1"'
  const selectedAccount = localStorage.getItem("selectedAccount");
  const loadedSelectedAccount = selectedAccount !== null ? JSON.parse(selectedAccount) as string | null : null;

  const initialState = {
    accounts: loadedAccounts,
    selectedAccount: loadedSelectedAccount,
  };
  // Save state to clear errors
  saveState(initialState);
  return initialState;
}

// Save state to localstorage
function saveState(state: AccountsState) {
  // Accounts
  //   accounts = '["uid1"]'
  //   accounts:uid1:site = 'https://e621.net'
  //   accounts:uid1:username = 'username'
  //   accounts:uid1:apiKey = 'api_key'
  const uids = Object.keys(state.accounts);
  localStorage.setItem("accounts", JSON.stringify(uids));
  for (const [uid, account] of Object.entries(state.accounts)) {
    localStorage.setItem(`accounts:${uid}:site`, account.site);
    localStorage.setItem(`accounts:${uid}:username`, account.username);
    localStorage.setItem(`accounts:${uid}:apiKey`, account.apiKey);
  }
  // SelectedAccount
  //   selectedAccount = '"uid1"'
  localStorage.setItem("selectedAccount", JSON.stringify(state.selectedAccount))
}

const initialState = loadState();

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<string | null>) => {
      state.selectedAccount = action.payload;
      saveState(state);
    },
    addAccount: (state, action: PayloadAction<UserAccount>) => {
      // Generate a unique id for the new account
      let uid: string;
      do {
        uid = (Math.random() + 1).toString(36).substring(7);
      } while (state.accounts.hasOwnProperty(uid))
      state.accounts[uid] = action.payload;
      state.selectedAccount = uid;
      saveState(state);
    },
    removeAccount: (state, action: PayloadAction<string>) => {
      if (state.accounts.hasOwnProperty(action.payload)) {
        delete state.accounts[action.payload];
      }
      if (state.selectedAccount === action.payload) {
        state.selectedAccount = null;
      }
      saveState(state);
    },
  },
});

export const { setAccount, addAccount, removeAccount } = accountsSlice.actions;

export const selectAllAccounts = (state: RootState) => state.accounts.accounts;
export const selectSelectedAccountId = (state: RootState) => state.accounts.selectedAccount;

export const selectSelectedAccount = createSelector([selectAllAccounts, selectSelectedAccountId], (accounts, uid) => (uid !== null && accounts.hasOwnProperty(uid)) ? accounts[uid] : null);
export const selectCurrentSite = createSelector([selectSelectedAccount], (account) => account !== null ? account.site : DEFAULT_SITE);

export default accountsSlice.reducer;
