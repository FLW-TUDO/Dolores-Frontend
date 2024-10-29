<template>
    <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header">
                <h2>
                    <slot name="header">
                        This is the default title!
                    </slot>
                </h2>
                <button class="btn-close" @click="close">
                    x
                </button>
            </header>

            <form @submit.prevent="formSubmit">
                <section class="modal-body">
                    <slot name="body">
                        This is the default body!
                    </slot>
                </section>

                <footer class="modal-footer">
                    <slot name="footer"/>
                </footer>
            </form>


        </div>
    </div>
</template>

<script>

export default {
    name: "Modal",
    props: {
        title: String,
        formSubmit: Function
    },
    methods: {
        close() {
            this.$emit("close");
        },
    },
};
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
}

.modal {
    background: #ffffff;
    box-shadow: 2px 2px 20px 1px;
    border-radius: 4px;
    overflow-wrap: break-word;
    min-height: 8rem;
    min-width: 24rem;
}

.modal-header {
    margin: 10px 10px 0;
    display: flex;
}

.modal-header {
    position: relative;
    border-bottom: 1px solid #eeeeee;
}

.modal-footer {
    border-top: 1px solid #eeeeee;
    padding: 10px;
}

.modal-body {
    position: relative;
    padding: 20px 10px;
}

.btn-close {
    position: absolute;
    top: 0;
    right: 0;
    width: 2rem;
    height: 2rem;
    margin: 10px 10px;
    border: none;
    font-size: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #000000;
    background: transparent;
}

.btn-close:hover:enabled {
    /* background: #f9aa33; */
    background: #f8f8f8;
}

section {
    text-align: left;
}
</style>
