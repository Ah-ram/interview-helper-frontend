import { defineStore } from "pinia";
import { authenticationState } from "./authenticationState";
import { authenticationActions } from "./authenticationActions";

export const useAuthenticationStore = defineStore(
    "authenticationStore", {
        state: authenticationState,
        actions: authenticationActions
    }
)