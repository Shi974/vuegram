<template>
    <header>
        <section>
            <div class="col1">
                <router-link to="dashboard">
                    <h3>Vuegram</h3>
                </router-link>
                <ul class="inline">
                    <li>
                        <router-link to="dashboard">Tableau de bord <i class="fas fa-chart-line"></i></router-link>
                    </li>
                    <li>
                        <router-link to="settings">Paramètres <i class="fas fa-cogs"></i></router-link>
                    </li>
                    <li><a @click="logout">Déconnexion <i class="fas fa-sign-out-alt"></i></a></li>
                </ul>
            </div>
        </section>
    </header>
</template>

<script>
    const fb = require('../firebaseConfig.js')
    export default {
        methods: {
            logout() {
                fb.auth.signOut().then(() => {
                    this.$store.dispatch('clearData')
                    this.$router.push('/login')
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>