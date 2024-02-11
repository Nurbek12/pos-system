<template>
    <v-layout>
        <v-main>
            <v-container fluid style="height: 100vh;" class="bg-background">
                <v-row justify="center" align="center" class="h-100">
                    <v-card max-width="400" width="100%" rounded="xl" flat>
                        <v-card-title class="text-center text-primary">Tizimga kirish</v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" class="pb-0">
                                    <v-text-field density="comfortable" hide-details variant="outlined" rounded flat label="Login"></v-text-field>
                                </v-col>
                                <v-col cols="12" class="pb-0">
                                    <v-text-field density="comfortable" hide-details variant="outlined" rounded flat label="Parol"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-btn to="/admin" color="primary" height="45" rounded flat block>Kirish</v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-row>
            </v-container>
        </v-main>
    </v-layout>
</template>