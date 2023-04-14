import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { User } from "@selab-2/groep-1-orm";

const defaultUser: User = {
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
  hash: "?",
  salt: "?",
  deleted: false,
};

/**
 * Pinia store which holds an object which corresponds to the currently
 * logged-in user. May also be an instance of APIError, or simply null.
 */
export const useAuthStore = defineStore("auth", () => {
  /* The state of this store. */
  const auth: Ref<User | null> = ref(null);

  /**
   * Attempt to log-in using a simple API call.
   * @param username The email address of the user.
   * @param password The plaintext password.
   */
  async function logIn(username: string, password: string): Promise<void> {
    try {
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

      await getAuth();
    } catch (e) {
      // Fallback error. TODO: expand error handling.
      console.log({ code: 500, message: "Internal Server Error" });
    }
  }

  /**
   * Attempt a logout, which will set the current state to null if successful.
   */
  async function logOut(): Promise<void> {
    throw new Error("Not Implemented"); // TODO
  }

  async function getAuth(): Promise<void> {
    try {
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
        if (res.status == 200) {
          auth.value = await res.json();
        } else {
          // Fallback error. TODO: expand error handling.
          console.log(await res.json());
          auth.value = null;
        }
      }
    } catch (e) {
      // Fallback error. TODO: expand error handling.
      console.log({ code: 500, message: "Internal Server Error" });
      auth.value = null;
    }
  }

  return { auth, logIn, logOut, getAuth };
});
