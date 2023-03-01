<template>
    <v-form>

        <v-text-field
            v-model="email"
            :prepend-icon="'mdi-email'"
            label="E-mail"
            type="text"
            required            
        ></v-text-field>

        <v-text-field
            v-model="password"
            :prepend-icon="'mdi-lock'"
            :append-icon="showPsswd ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPsswd ? 'text' : 'password'"
            label="Wachtwoord"
            @click:append="showPsswd = !showPsswd"
        ></v-text-field>
        <div>
            <v-btn
                icon="mdi-help"
                @click="snackbar = true"
            >
            </v-btn>

            <v-snackbar
                v-model="snackbar"
            >
                <h1>Help</h1>
                <p>
                    TODO: textje voor accountaanmaak en vragen verwijs door  
                    naar exaple@drtrottoir.be
                </p>
                <v-btn
                    @click="snackbar = false"
                >
                    Close
                </v-btn>
            </v-snackbar>

            <v-btn 
                @click="handleSubmit"
            >
                Login            
            </v-btn>  
        </div>

             

    </v-form>

</template>

<script lang="ts">
export default{
    data() {
        return{
            email: '',
            password: '',
            showPsswd: false,
            snackbar: false
        }
    },
    methods: {
        handleSubmit(){
            console.log('submited');
        }
    }
}

</script>