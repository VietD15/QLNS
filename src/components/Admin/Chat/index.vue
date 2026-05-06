<template>
    <div class="chat-wrapper my-5">
        <div class="chat-sidebar">
            <div class="chat-sidebar-content">
                <div class="tab-content" id="pills-tabContent">
                    <div class="tab-pane fade show active" id="pills-Chats">
                        <div class="chat-list">
                            <div class="list-group list-group-flush">
                                <template v-for="(value, index) in list_nhan_vien" :key="index">
                                    <a v-on:click="xemTinNhan(value)" href="javascript:;" class="list-group-item">
                                        <div class="d-flex">
                                            <div class="chat-user-online">
                                                <img src="../../../assets/images/avatars/avatar-2.png" width="42"
                                                    height="42" class="rounded-circle" alt="" />
                                            </div>
                                            <div class="flex-grow-1 ms-2">
                                                <h6 class="mb-0 chat-title">{{ value.ho_va_ten }}</h6>
                                                <p class="mb-0 chat-msg">{{ value.email }}</p>
                                            </div>
                                        </div>
                                    </a>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="chat-header d-flex align-items-center">
            <div class="chat-toggle-btn"><i class='bx bx-menu-alt-left'></i>
            </div>
        </div> -->
        <div class="chat-content" id="chatContent">
            <template v-for="(v, k) in list" :key="k">
                <div class="chat-content-leftside" v-if="tin_nhan.id != v.id_nguoi_nhan">
                    <div class="d-flex">
                        <img src="../../../assets/images/avatars/avatar-3.png" width="48" height="48"
                            class="rounded-circle" alt="" />
                        <div class="flex-grow-1 ms-2">
                            <p class="mb-0 chat-time">{{ v.ten_nguoi_nhan }}</p>
                            <p class="chat-left-msg">{{ v.noi_dung }}</p>
                        </div>
                    </div>
                </div>

                <div v-else class="chat-content-rightside">
                    <div class="d-flex ms-auto">
                        <div class="flex-grow-1 me-2">
                            <p class="mb-0 chat-time text-end">you</p>
                            <p class="chat-right-msg">{{ v.noi_dung }}</p>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class="chat-footer d-flex align-items-center">
            <div class="flex-grow-1 pe-2">
                <div class="input-group">
                    <input v-on:keyup.enter="guiTinNhan()" v-model="tin_nhan.noi_dung" type="text" class="form-control" placeholder="Type a message">
                </div>
            </div>
            <div class="chat-footer-menu">
                <button v-on:click="guiTinNhan()" class="btn btn-primary">Gửi</button>
            </div>
        </div>
        <!--start chat overlay-->
        <div class="overlay chat-toggle-btn-mobile"></div>
        <!--end chat overlay-->
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            list_nhan_vien: [],
            tin_nhan: {},
            list: [],
            intervalId: null,
        }
    },
    mounted() {
        this.loadNhanVien();
        new PerfectScrollbar(document.querySelector('.chat-list'));
        new PerfectScrollbar(document.querySelector('.chat-content'));
    },
    watch: {
        'tin_nhan.id': function () {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            this.intervalId = setInterval(() => {
                this.xemTinNhan(this.tin_nhan);
            }, 10000); 
        }
    },
    methods: {
        scrollToBottom() {
            const chatContent = document.getElementById('chatContent');
            chatContent.scrollTop = chatContent.scrollHeight;
        },

        loadNhanVien() {
            axios
                .get('/api/admin/nhan-vien/data-open-not-me', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem("tk_nhan_vien")
                    }
                })
                .then((res) => {
                    this.list_nhan_vien = res.data.data;
                    if (res.data.status == 0) {
                        this.$toast.error(res.data.message);
                    }
                })
        },
        guiTinNhan() {
            axios
                .post('/api/admin/chat/create', this.tin_nhan, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem("tk_nhan_vien")
                    }
                })
                .then((res) => {
                    this.$nextTick(() => {
                        this.scrollToBottom();
                    });
                    this.xemTinNhan(this.tin_nhan);
                    this.tin_nhan.noi_dung = ""
                })
                .catch((res) => {
                    const errors = Object.values(res.response.data.errors);
                    errors.forEach((v) => {
                        this.$toast.error(v[0]);
                    });
                });
        },
        xemTinNhan(payload) {
            this.tin_nhan.id = payload.id;
            axios
                .post('/api/admin/chat/data', payload, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem("tk_nhan_vien")
                    }
                })
                .then((res) => {
                    this.list = res.data.data
                    this.$nextTick(() => {
                        this.scrollToBottom();
                    });
                })
        }


    },

}
</script>
<style></style>
