function getShadowWrapper() {
    return document.querySelector('#cr-loader-wrapper') as HTMLElement;
}

export function shadowScreen() {
    let elm = getShadowWrapper();
    elm.style.opacity = '0.6';
    elm.style.display = 'block';
}

export function unshadowScreen() {
    let elm = getShadowWrapper();

    elm.addEventListener('transitionend', function () {
        elm.style.display = 'none';
    }, { once: true });
    
    elm.style.opacity = '0';
}