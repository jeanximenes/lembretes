<template>
  <div class="container-fluid">

    <h2 class="text-center text-info">{{ msg }}</h2>

    <header class="row mt-4">
      <div class="col-sm-9 mb-4">
        <button type="button" class="btn btn-primary" @click="openModal">incluir</button>
      </div>
      <div class="col-sm-3">
        <div class="filter row form-inline pr-3">
            <label class="col-sm-6" for="search-element">Filtrar por título: </label>
            <input class="form-control col-sm-6" v-model="searchByTitle" id="search-element" />
        </div>
      </div>
    </header>

    <section v-if="errored">
        <p>Desculpe, mas no momento o serviço está indisponível, favor volte logo mais ;)</p>
    </section>
    <section v-else>
      <div v-if="loading">Carregando...</div>
      <div v-else>
        <table class="table table-hover table-sm">
          <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Prioridade</th>
            <th>Ações</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="lembrete in lembretesFiltered" :key="lembrete.id">
            <td>{{lembrete.id}}</td>
            <td>{{lembrete.name}}</td>
            <td>{{lembrete.desc}}</td>
            <td>{{lembrete.prio}}</td>
            <td>
              <button type="button" class="btn btn-danger" @click="del(lembrete)" title="Excluir item">
                Excluir
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"></path>
                </svg>
              </button>
              <button type="button" class="btn btn-outline-primary" @click="edit(lembrete)" title="Editar item">
                Editar
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"></path>
                </svg>
              </button>

            </td>
          </tr>

          </tbody>
        </table>
      </div>
    </section>

    <footer>

    <nav class="text-center">

      <ul class="pagination">
        <li>
          <button type="button" class="btn btn-primary" @click="page--" v-if="page != 1"> &lt; Anterior </button>
        </li>
        <li>
          <button type="button" class="btn btn-primary" @click="page++" v-if="page < Math.ceil(this.lembretes.length / this.perPage)" > Próximo &gt; </button>
        </li>
      </ul>
    </nav>

    </footer>

    <!-- Modal -->
    <div class="modal" v-show="showModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form class="form" @submit.prevent="add">

            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                <span v-show="!updateSubmit">inclusão</span>
                <span v-show="updateSubmit">edição</span>
              </h5>
              <button type="button" class="close" @click="closeModal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div class="modal-body">
                <div class="add-upd">
                  <input type="hidden" v-model="form.id">

                  <div class="row">
                    <label for="l-prioridade">Prioridade</label>
                    <select class="form-control col-12" v-model="form.prio" :disabled="updateSubmit" id="l-prioridade" required>
                      <option>baixa</option>
                      <option>média</option>
                      <option>alta</option>
                    </select>        
                  </div>
                  <div class="row">
                    <label for="l-titulo">Título do lembrete</label>
                    <input type="text" class="form-control col-12" placeholder="título" v-model="form.name" id="l-titulo" required>
                  </div>
                  <div class="row">
                    <label for="l-descricao">Descrição do lembrete</label>
                    <textarea rows="3" class="form-control col-12" placeholder="descrição" v-model="form.desc" id="l-descricao" required></textarea>
                  </div>
                </div>

            </div>
            <div class="modal-footer">
                <div v-show="!updateSubmit">
                  <button type="submit" class="btn btn-primary ml-4">salvar</button>
                  <button type="button" class="btn btn-secondary" @click="closeModal">fechar</button>
                </div>
                <div v-show="updateSubmit">
                  <button type="button" class="btn btn-primary" @click="update(form)">atualizar</button>
                  <button type="button" class="btn btn-secondary" @click="closeModal">cancelar</button>
                </div>
            </div>

          </form>
        </div>
      </div>
    </div>
    <div class="modal-backdrop" v-show="showModal"></div>
    <!-- /Modal -->

  </div>
</template>

<script>
/* eslint-disable */ 
import axios from 'axios'
export default {
  data() {
    return {
      msg: "Bem vindo ao App de lembretes",
      loading: true,
      errored: false,
      serviceURL: 'http://localhost:3000/lembretes/',
      form: {
        id: '',
        name: '',
        desc: '',
        prio: ''
      },
      lembretes: '',
      updateSubmit: false,
      searchByTitle: '',
      showModal: false,
      page: 1,
      perPage: 3,
      pages: [],  
    }
  },

  computed: {
    lembretesFiltered: function() {
      let datas = axios.get(this.serviceURL).then(res => {
        this.lembretes = res.data
      }).catch ((err) => {
        console.log(err)
        this.errored = true
      }).finally(() => this.loading = false)
      var self=this
      return this.paginate(
        this.lembretes.filter(function(cust){return cust.name.toLowerCase().indexOf(self.searchByTitle.toLowerCase())>=0;})
      );
    }
  },

  mounted() {
    this.load()
  },

  methods: {
    load() {
      axios.get(this.serviceURL).then(res => {
        this.lembretes = res.data
      }).catch ((err) => {
        console.log(err)
        this.errored = true
      }).finally(() => this.loading = false)
    },
    add(){
      axios.post(this.serviceURL, this.form).then(res => {
        this.load()
        this.form.name = ''
        this.form.desc = ''
      })
      this.showModal = false
    },
    edit(lemb) { 
      this.showModal = true
      this.updateSubmit = true
      this.form.id   = lemb.id 
      this.form.name = lemb.name 
      this.form.desc = lemb.desc 
      this.form.prio = lemb.prio 
    },
    update(form){ 
      return axios.put(this.serviceURL + form.id , {name: this.form.name, desc: this.form.desc, prio: this.form.prio}).then(res => {
        this.load()
        this.form.id = ''
        this.form.name = ''
        this.form.desc = ''
        this.form.prio = ''
        this.updateSubmit = false
        this.showModal = false
      }).catch((err) => {
        console.log(err);
      })
    },
    del(lemb){
      axios.delete(this.serviceURL + lemb.id).then(res =>{
        this.load()
        let index = this.lembretes.indexOf(form.name)
        this.lembretes.splice(index,1)
      })
    },
    reset(){
      this.$router.go()
    },
    setPages () {
      let numberOfPages = Math.ceil(this.lembretes.length / this.perPage);
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    paginate (lembretes) {
      let page = this.page;
      let perPage = this.perPage;
      let from = (page * perPage) - perPage;
      let to = (page * perPage);
      return  lembretes.slice(from, to);
    },
    openModal: function() {
      this.showModal = true
    },
    closeModal: function() {
      this.showModal = false
      this.updateSubmit = false
    }
  },

  watch: {
    lembretes() {
      this.setPages()
    }
  }

}
</script>

<style>
  @import 'assets/css/bootstrap/bootstrap.css';
  @import 'assets/css/main.css';
</style>