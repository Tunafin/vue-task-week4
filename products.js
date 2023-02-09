import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

let writeProductModal = null;
let deleteProductModal = null;

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'tunafin',
      products: [],
      pagination: {},
      tempMode: null, // 'new' | 'edit' | 'delete' | null
      tempProduct: {
        imagesUrl: []
      },
      isWaitResponse: true
    }
  },

  methods: {
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message)
          this.redirectToSigninPage();
        });
    },

    /**
     * 取得所有產品
     */
    getProducts(page = 1) {
      this.isWaitResponse = true;

      this.tempProduct = {
        imagesUrl: []
      };

      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
      axios.get(url)
        .then((res) => {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
        .finally(() => {
          this.isWaitResponse = false;
        });
    },

    /**
     * 打開新增/編輯/刪除產品彈出視窗
     * @param {'new'|'edit'|'delete'} mode
     * @param {Product} product
     */
    openProductModal(mode, product) {
      this.tempMode = mode;
      switch (mode) {
        case 'new':
          this.tempProduct = {
            imagesUrl: [],
          };
          writeProductModal.show();
          break;

        case 'edit':
          this.tempProduct = { ...product };
          writeProductModal.show();
          break;

        case 'delete':
          this.tempProduct = { ...product };
          deleteProductModal.show();
          break;
      }
    },

    logout() {
      const url = `${this.apiUrl}/logout`;
      axios.post(url)
        .then((res) => {
          alert('登出成功');
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
        .finally(() => {
          this.redirectToSigninPage();
        })
    },
    redirectToSigninPage() {
      document.cookie = `token=0;expires=0; path=/`;
      window.location = 'signin.html';
    }
  },

  mounted() {
    // 取出token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin();
  }
});

app.component('writeProductModal', {
  template: '#writeProductModal',
  props: [
    'product', // Product
    'mode' // 'new' | 'edit'
  ],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'tunafin',
    };
  },
  methods: {
    writeProduct() {
      let url;
      switch (this.mode) {
        case 'new': {
          const url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
          axios.post(url, { data: this.product }).then(res => {
            alert(res.data.message);
            this.hideModal();
            this.$emit('update');
          }).catch(err => {
            alert(err.response.data.message);
          });
          break;
        }

        case 'edit': {
          const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
          axios.put(url, { data: this.product }).then(res => {
            alert(res.data.message);
            this.hideModal();
            this.$emit('update');
          }).catch(err => {
            alert(err.response.data.message);
          });
          break;
        }

        default:
          return;
      };
    },
    openModal() {
      writeProductModal.show();
    },
    hideModal() {
      writeProductModal.hide();
    },
  },
  mounted() {
    writeProductModal = new bootstrap.Modal(document.getElementById('writeProductModal'), {
      keyboard: false,
      backdrop: 'static',
    });
  },
});

app.component('deleteProductModal', {
  template: '#deleteProductModal',
  props: ['product'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'tunafin',
    };
  },
  methods: {
    deleteProduct() {
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`)
        .then((res) => {
          this.hideModal();
          alert('刪除成功');
          this.$emit('update');
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    openModal() {
      deleteProductModal.show();
    },
    hideModal() {
      deleteProductModal.hide();
    },
  },
  mounted() {
    deleteProductModal = new bootstrap.Modal(document.getElementById('deleteProductModal'), {
      keyboard: false,
      backdrop: 'static',
    });
  },
});

app.component('pagination', {
  template: '#pagination',
  props: ['pages'],
  methods: {
    emitPages(item) {
      this.$emit('emit-pages', item);
    },
  },
});

app.mount('#app');
