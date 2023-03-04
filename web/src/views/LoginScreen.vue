<template>
    <div class="background">
        <div class="form">
            <v-img
                contain
                src="@/assets/images/drtroittoir_logo.png"
            ></v-img>
            <br>
            <v-text-field
                v-model="email"
                :prepend-inner-icon="'mdi-email'"
                label="E-mail"
                type="text"
                required    
            ></v-text-field>
            <v-text-field
                v-model="password"
                :prepend-inner-icon="'mdi-lock'"
                :append-inner-icon="showPsswd ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPsswd ? 'text' : 'password'"
                label="Wachtwoord"
                @click:append-inner="showPsswd = !showPsswd"
                bg
            ></v-text-field>
            <div>
                <p class="float-l">
                Nog geen account? 
                    <span 
                        @click="snackbar = true"
                        class="clickable-text"
                    >
                        Contacteer ons
                    </span>
                </p>
                <v-btn 
                    class="float-r"
                    @click="handleSubmit"
                >
                    Login            
                </v-btn> 
            </div>
             
        </div>
    </div>
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
<style lang="scss">
    

    .background{
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .form {
        width: 600px;
        max-width: 90%;
        padding: 10px;
        align-content: center;
    }

    .clickable-text{
        text-decoration: underline;
        cursor: pointer;
        color: #069;
    }

    .float-l{
        float: left;
    }

    .float-r{
        float: right;
    }

</style>