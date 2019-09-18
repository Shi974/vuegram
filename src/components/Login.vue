<template>
    <div id="login">
        <transition name="fade">
            <div v-if="performingRequest" class="loading">
                <p>Loading...</p>
            </div>
        </transition>
        <section>
            <div class="col1">
                <h1>Vuegram</h1>
                <p>Bienvenue sur mon application web de réseau social propulsée par Vue.js et Firebase.</p>
            </div>
            <div class="col2" :class="{ 'signup-form': !showLoginForm && !showForgotPassword }">
                <form v-if="showLoginForm" @submit.prevent>
                    <h1>Bon retour parmi nous !</h1>

                    <label for="email1">Email</label>
                    <input v-model.trim="loginForm.email" type="text" placeholder="nom@email.com" id="email1" />

                    <label for="password1">Mot de passe</label>
                    <input v-model.trim="loginForm.password" type="password" placeholder="******" id="password1" />

                    <button @click="login" class="button">Se connecter</button>

                    <div class="extras">
                        <a @click="togglePasswordReset">Mot de passe oublié</a>
                        <a @click="toggleForm">Créer un compte</a>
                    </div>
                </form>
                <form v-if="!showLoginForm && !showForgotPassword" @submit.prevent>
                    <h1>Inscription</h1>

                    <label for="name">Prénom</label>
                    <input v-model.trim="signupForm.name" type="text" placeholder="Annie" id="name" />

                    <label for="title">Nom</label>
                    <input v-model.trim="signupForm.title" type="text" placeholder="Yang" id="title" />

                    <label for="email2">Email</label>
                    <input v-model.trim="signupForm.email" type="text" placeholder="nom@email.com" id="email2" />

                    <label for="password2">Mot de passe</label>
                    <input v-model.trim="signupForm.password" type="password" placeholder="minimum 6 caractères"
                        id="password2" />

                    <button @click="signup" class="button">Créer un compte</button>

                    <div class="extras">
                        <a @click="toggleForm">Se connecter</a>
                    </div>
                </form>
                <form v-if="showForgotPassword" @submit.prevent class="password-reset">
                    <div v-if="!passwordResetSuccess">
                        <h1>Réinitialiser le mot de passe</h1>
                        <p>Un email vous sera envoyé pour réinitialiser le mot de passe</p>

                        <label for="email3">Email</label>
                        <input v-model.trim="passwordForm.email" type="text" placeholder="nom@email.com" id="email3" />

                        <button @click="resetPassword" class="button">Envoyer</button>

                        <div class="extras">
                            <a @click="togglePasswordReset">Se connecter</a>
                        </div>
                    </div>
                    <div v-else>
                        <h1>Email envoyé !</h1>
                        <p>Vérifiez vos emails pour réinitialiser le mot de passe</p>
                        <button @click="togglePasswordReset" class="button">Se connecter</button>
                    </div>
                </form>
                <transition name="fade">
                    <div v-if="errorMsg !== ''" class="error-msg">
                        <p>{{ errorMsg }}</p>
                    </div>
                </transition>
            </div>
        </section>
    </div>
</template>

<script>
    const fb = require('../firebaseConfig.js')
    export default {
        data() {
            return {
                loginForm: {
                    email: '',
                    password: ''
                },
                signupForm: {
                    name: '',
                    title: '',
                    email: '',
                    password: ''
                },
                passwordForm: {
                    email: ''
                },
                showLoginForm: true,
                showForgotPassword: false,
                passwordResetSuccess: false,
                performingRequest: false,
                errorMsg: ''
            }
        },
        methods: {
            toggleForm() {
                this.errorMsg = ''
                this.showLoginForm = !this.showLoginForm
            },
            togglePasswordReset() {
                if (this.showForgotPassword) {
                    this.showLoginForm = true
                    this.showForgotPassword = false
                    this.passwordResetSuccess = false
                } else {
                    this.showLoginForm = false
                    this.showForgotPassword = true
                }
            },
            login() {
                this.performingRequest = true
                fb.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password).then(user => {
                    this.$store.commit('setCurrentUser', user)
                    this.$store.dispatch('fetchUserProfile')
                    this.performingRequest = false
                    this.$router.push('/dashboard')
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            },
            signup() {
                this.performingRequest = true
                fb.auth.createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password).then(user => {
                    this.$store.commit('setCurrentUser', user)
                    // create user obj
                    fb.usersCollection.doc(user.uid).set({
                        name: this.signupForm.name,
                        title: this.signupForm.title
                    }).then(() => {
                        this.$store.dispatch('fetchUserProfile')
                        this.performingRequest = false
                        this.$router.push('/dashboard')
                    }).catch(err => {
                        console.log(err)
                        this.performingRequest = false
                        this.errorMsg = err.message
                    })
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            },
            resetPassword() {
                this.performingRequest = true
                fb.auth.sendPasswordResetEmail(this.passwordForm.email).then(() => {
                    this.performingRequest = false
                    this.passwordResetSuccess = true
                    this.passwordForm.email = ''
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            }
        }
    }
</script>