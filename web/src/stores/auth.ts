import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { User } from "@selab-2/groep-1-orm";
import { APIError } from "@selab-2/groep-1-query/dist/api_error";

/**
 * Pinia store which holds an object which corresponds to the currently
 * logged-in user. May also be an instance of APIError, or simply null.
 */

export const useAuthStore = defineStore("auth", () => {
  /* The state of this store. */
  const auth: Ref<User | APIError | null> = ref(null);

  /**
   * Attempt to log-in using a simple API call.
   * @param username The email address of the user.
   * @param password The plaintext password.
   */
  async function logIn(username: string, password: string): Promise<void> {
    try {
      // Login Attempt. TODO: use dynamic URL using .env vars
      await fetch("http://localhost:8080/auth/login/", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        redirect: "manual",
        credentials: "include",
      });

      // Retrieve current user identifier.
      const res = await fetch("http://localhost:8080/auth", {
        credentials: "include",
      });

      // Assign result to the current store
      auth.value = await res.json();
    } catch (e) {
      // Fallback error. TODO: expand error handling.
      auth.value = { code: 500, message: "Internal Server Error" };
    }
  }

  /**
   * Attempt a logout, which will set the current state to null if successful.
   */
  async function logOut(): Promise<void> {
    throw new Error("Not Implemented"); // TODO
  }

  return { auth, logIn, logOut };
});
