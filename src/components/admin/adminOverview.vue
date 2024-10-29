<template>
  <div>
    <custom-input-modal
        v-show="newUserModalVisible"
        :form-submit="newUser"
        title="newGameModal"
        @close="closeNewUserModal">
      <template v-slot:header>Neuer Benutzer</template>
      <template v-slot:body>
        <custom-input v-model="userName" placeholder="Nutzername"/>
        <custom-input v-model="password" placeholder="Password" type="password"/>
        <custom-input v-model="password_validation" placeholder="Passwort bestätigen" type="password"/>
        <span v-if="error" class="error">Passwort stimmt nicht überein!</span>
      </template>

      <template v-slot:footer>
        <custom-button style="width:150px">Bestätigen</custom-button>
        <custom-button
            style="width:150px"
            @click="closeNewUserModal">
          Abbrechen
        </custom-button>
      </template>

    </custom-input-modal>
    <custom-modal
        v-show="clearDBModalVisible"
        name="newGameModal"
        @close="clearDBModalVisible = false"
    >
      <template v-slot:header>Alle Spiele löschen</template>
      <template v-slot:body>
        <span>Willst du wirklich alle Spiele löschen?</span><br/>
        <span>Dieser Vorgang kann nicht rückgängig gemacht werden.</span>
      </template>
      <template v-slot:footer>
        <custom-button style="width:150px" @click="deleteAllGames">Bestätigen</custom-button>
        <custom-button
            style="width:150px"
            @click="clearDBModalVisible = false">
          Abbrechen
        </custom-button>
      </template>
    </custom-modal>
  </div>

  <custom-container class="menu">
    <header>
      <h2>Admin</h2>
    </header>
    <custom-button class="menu-button" @click="viewUsers">Alle Spieler ansehen</custom-button>
    <custom-button class="menu-button" @click="newUserModalVisible = true">Benutzer anlegen</custom-button>
    <custom-button class="menu-button" @click="clearDBModalVisible = true">Alle Spiele löschen</custom-button>
    <input type="file" id="fileSelector" @change="uploadFile" ref="file" style="display: none;">
    <custom-button class="menu-button" type="button" @click="startUpload">Upload</custom-button>
  </custom-container>
</template>

<script>
import CustomContainer from "../custom/Custom-Container";
import CustomModal from "../custom/Custom-Modal.vue";
import CustomInput from "../custom/Custom-Input";
import CustomInputModal from "../custom/Custom-Input-Modal";
import CustomButton from "../custom/Custom-Button";

export default {
  name: "adminOverview",
  components: {CustomButton, CustomContainer, CustomModal, CustomInput, CustomInputModal},
  data() {
    return {
      userName: '',
      password: '',
      password_validation: '',
      newUserModalVisible: false,
      clearDBModalVisible: false,
      error: false,
    }
  },
  methods: {
    startUpload() {
      document.getElementById("fileSelector").click();
    },
    uploadFile(){
      const files = this.$refs.file.files;
      if (files.length <= 0) {
        return false;
      }

      const fr = new FileReader();

      fr.onload = e => {
        const result = JSON.parse(e.target.result);
        console.log(result);
        this.$store.dispatch('uploadGame', result);
      }
      fr.readAsText(files.item(0));
    },
    deleteAllGames() {
      this.$store.dispatch('deleteAllGames');
      this.clearDBModalVisible = false;
    },
    viewUsers() {
      this.$router.push("/admin/user");
    },
    newUser() {
      if (this.password === this.password_validation) {
        this.error = false;
        this.$store.dispatch('createNewUser', {userName: this.userName, password: this.password});
        this.userName = '';
        this.newUserModalVisible = false;
      } else {
        this.error = true;
      }
      this.password = '';
      this.password_validation = '';
    },
    closeNewUserModal() {
      this.userName = '';
      this.password = '';
      this.password_validation = '';
      this.newUserModalVisible = false;
    },
  }
}
</script>

<style scoped>
.menu {
  position: relative;
  width: 16rem;
  display: inline-block;
  margin: 16rem 0;
}

.menu-button {
  width: 90%;
}

.error {
  color: #c00000;
}

</style>