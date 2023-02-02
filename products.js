import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

let writeProductModal = null;
let deleteProductModal = null;

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'tunafin',
      products: [],
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
          alert(err.data.message)
          this.redirectToSigninPage();
        });
    },

    /**
     * 取得所有產品
     */
    getProducts() {
      this.isWaitResponse = true;
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
      axios.get(url)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
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
    openProductModel(mode, product) {
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

    /**
     * 送出新增/編輯/刪除產品的請求
     */
    sendProductRequest() {
      let url;

      switch (this.tempMode) {
        case 'new':
          url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
          axios.post(url, { data: this.tempProduct }).then(res => {
            alert(res.data.message);
            writeProductModal.hide();
            this.tempMode = null;
            this.getProducts();
          }).catch(err => {
            alert(err.data.message);
          });
          break;

        case 'edit':
          url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
          axios.put(url, { data: this.tempProduct }).then(res => {
            alert(res.data.message);
            writeProductModal.hide();
            this.tempMode = null;
            this.getProducts();
          }).catch(err => alert(err.data.message));
          break;

        case 'delete':
          url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
          axios.delete(url).then(res => {
            alert(res.data.message);
            deleteProductModal.hide();
            this.tempMode = null;
            this.getProducts();
          }).catch(err => alert(err.data.message));
          break;
      }
    },

    logout() {
      const url = `${this.apiUrl}/logout`;
      axios.post(url)
        .then((res) => {
        })
        .catch((err) => {
          alert(err.data.message);
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
    // 建立model實體
    writeProductModal = new bootstrap.Modal(document.getElementById('writeProductModal'), {
      keyboard: false
    });
    deleteProductModal = new bootstrap.Modal(document.getElementById('deleteProductModal'), {
      keyboard: false
    });

    // 取出token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin();
  }
}).mount('#app');
