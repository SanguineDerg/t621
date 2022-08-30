import axios, { AxiosRequestConfig } from "axios";
import { useMemo } from "react";
import { useLocation } from "react-router";
import { DEFAULT_SITE, UserAccount } from "./features/accounts/accountsSlice";

const USER_AGENT = `t621/${process.env.npm_package_version || "0.1.0"} (by SanguineDerg on e621)`

// Gets the current user account from local storage
function getUser(): UserAccount | null {
  const selectedAccount = localStorage.getItem("selectedAccount");
  if (selectedAccount === null) return null;
  const currentUid = JSON.parse(selectedAccount) as string | null;
  if (currentUid === null) return null;
  const site = localStorage.getItem(`accounts:${currentUid}:site`)
  const username = localStorage.getItem(`accounts:${currentUid}:username`)
  const apiKey = localStorage.getItem(`accounts:${currentUid}:apiKey`)
  if (site !== null && username !== null && apiKey !== null) {
    return {
      site: site,
      username: username,
      apiKey: apiKey,
    }
  } else {
    return null;
  }
}

const axiosInstance = axios.create({
  params: {"_client": USER_AGENT},
})

export function apiFetch<T>(path: string, config: AxiosRequestConfig = {}) {
  // Build url
  const user = getUser();
  config.baseURL = user !== null ? user.site : DEFAULT_SITE;
  config.url = `${path}.json`;
  // Apply user auth
  if (user !== null) {
    config.auth = {
      username: user.username,
      password: user.apiKey,
    }
  }
  // Make the request
  return axiosInstance.request<T>(config).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    throw new Error(response.statusText);
  })
}

export function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

