import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

createApp({
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      issignining: false
    }
  },
  methods: {

    // 登入
    signin() {
      this.issignining = true;

      const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
      axios.post(api, this.form).then((res) => {
        const { token, expired } = res.data;

        // 將token與有效期限寫入cookie
        document.cookie = `token=${token};expires=${new Date(expired)}; path=/`;

        this.redirect();
      }).catch((err) => {
        alert(err.data.message);

        this.issignining = false;
      });
    },

    // 跳轉到產品頁面
    redirect() {
      window.location = 'products.html';
    }
  },
  mounted() {
    // 若已有token則直接跳轉頁面
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    if (token && token != 0) {
      this.redirect();
    }
  }
}).mount('#app');
