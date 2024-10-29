<template>
    <div class="modal-backdrop">
        <div class="sk-fading-circle">
            <div class="sk-circle1 sk-circle"></div>
            <div class="sk-circle2 sk-circle"></div>
            <div class="sk-circle3 sk-circle"></div>
            <div class="sk-circle4 sk-circle"></div>
            <div class="sk-circle5 sk-circle"></div>
            <div class="sk-circle6 sk-circle"></div>
            <div class="sk-circle7 sk-circle"></div>
            <div class="sk-circle8 sk-circle"></div>
            <div class="sk-circle9 sk-circle"></div>
            <div class="sk-circle10 sk-circle"></div>
            <div class="sk-circle11 sk-circle"></div>
            <div class="sk-circle12 sk-circle"></div>
        </div>
    </div>
</template>

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

.sk-fading-circle {
    margin: 100px auto;
    width: 32px;
    height: 32px;
    position: relative;
    background: #ffffff;
    box-shadow: 2px 2px 20px 1px;
    border-radius: 4px;
    overflow-wrap: break-word;
}

.sk-fading-circle .sk-circle {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}

.sk-fading-circle .sk-circle::before {
    content: '';
    display: block;
    margin: 0 auto;
    width: 3px;
    height: 9px;
    background-color: #000;
    border-radius: 1.5px;
    animation: sk-circleFadeDelay 994ms infinite ease-in-out both;
}

.sk-fading-circle .sk-circle2 {
    transform: rotate(30deg);
}

.sk-fading-circle .sk-circle3 {
    transform: rotate(60deg);
}

.sk-fading-circle .sk-circle4 {
    transform: rotate(90deg);
}

.sk-fading-circle .sk-circle5 {
    transform: rotate(120deg);
}

.sk-fading-circle .sk-circle6 {
    transform: rotate(150deg);
}

.sk-fading-circle .sk-circle7 {
    transform: rotate(180deg);
}

.sk-fading-circle .sk-circle8 {
    transform: rotate(210deg);
}

.sk-fading-circle .sk-circle9 {
    transform: rotate(240deg);
}

.sk-fading-circle .sk-circle10 {
    transform: rotate(270deg);
}

.sk-fading-circle .sk-circle11 {
    transform: rotate(300deg);
}

.sk-fading-circle .sk-circle12 {
    transform: rotate(330deg);
}

.sk-fading-circle .sk-circle2::before {
    animation-delay: -911ms;
}

.sk-fading-circle .sk-circle3::before {
    animation-delay: -828ms;
}

.sk-fading-circle .sk-circle4::before {
    animation-delay: -745ms;
}

.sk-fading-circle .sk-circle5::before {
    animation-delay: -662ms;
}

.sk-fading-circle .sk-circle6::before {
    animation-delay: -579ms;
}

.sk-fading-circle .sk-circle7::before {
    animation-delay: -496ms;
}

.sk-fading-circle .sk-circle8::before {
    animation-delay: -413ms;
}

.sk-fading-circle .sk-circle9::before {
    animation-delay: -330ms;
}

.sk-fading-circle .sk-circle10::before {
    animation-delay: -247ms;
}

.sk-fading-circle .sk-circle11::before {
    animation-delay: -164ms;
}

.sk-fading-circle .sk-circle12::before {
    animation-delay: -83ms;
}

@keyframes sk-circleFadeDelay {
    0%, 39%, 100% {
        opacity: 0.15;
    }
    40% {
        opacity: 0.5;
    }
}
</style>