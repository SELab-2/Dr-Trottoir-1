import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { AuthenticatedUser } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";

const defaultUser: AuthenticatedUser = {
  id: 0,
  email: "dev@trottoir.be",
  first_name: "Admin",
  last_name: "Develop",
  date_added: new Date(),
  last_login: new Date(),
  phone: "+000000000",
  address_id: 0,
  student: true,
  super_student: false,
  admin: true,
  address: {
    id: 0,
    street: "Straatnaam",
    zip_code: 9000,
    number: 123,
    city: "Gent",
    latitude: 0.0,
    longitude: 0.0,
  },
  syndicus: [{ id: 0 }, { id: 1 }, { id: 2 }],
};

/**
 * Pinia store which holds an object which corresponds to the currently
 * logged-in user. May also be an instance of APIError, or simply null.
 */
export const useAuthStore = defineStore("auth", () => {
  /* The state of this store. */
  const auth: Ref<AuthenticatedUser | null> = ref(null);

  /**
   * Attempt to log-in using a simple API call.
   * @param username The email address of the user.
   * @param password The plaintext password.
   */
  async function logIn(username: string, password: string): Promise<void> {
    await tryOrAlertAsync(async () => {
      if (process.env.VUE_APP_DISABLE_AUTHENTICATION !== "true") {
        await fetch(process.env.VUE_APP_API_SERVER_ADDRESS + "auth/login/", {
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
      }
    });
    await getAuth();
  }

  /**
   * Attempt a logout, which will set the current state to null if successful.
   */
  async function logOut(): Promise<void> {
    await tryOrAlertAsync(async () => {
      if (process.env.VUE_APP_DISABLE_AUTHENTICATION !== "true") {
        await fetch(process.env.VUE_APP_API_SERVER_ADDRESS + "auth/logout/", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          redirect: "manual",
          credentials: "include",
        });

        await getAuth();
      }
    });
  }

  async function getAuth(): Promise<void> {
    await tryOrAlertAsync(async () => {
      if (process.env.VUE_APP_DISABLE_AUTHENTICATION === "true") {
        auth.value = defaultUser;
      } else {
        // Retrieve current user identifier.
        const res = await fetch(
          process.env.VUE_APP_API_SERVER_ADDRESS + "auth",
          {
            credentials: "include",
          },
        );

        // Assign result to the current store
        if (res.ok) {
          auth.value = await res.json();
        } else {
          // Fallback APIError
          auth.value = null;
        }
      }
    });
  }

  return { auth, logIn, logOut, getAuth };
});
