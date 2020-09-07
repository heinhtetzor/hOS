var domRefs = {
    body: document.body,
    screen: document.querySelector('.screen'),
    systemPopup: document.querySelector('.system_popup'),
    systemPopupBody: document.querySelector('.system_popup_body'),
    systemPopupFooter: document.querySelector('.system_popup_footer'),
    startMenu: document.querySelector('.start_menu'),
    loadingContainer: document.querySelector('.loading_container'),
    bootBtn: document.querySelector('.boot_btn'),
    notAvailable: document.querySelector('.not_available'),
    taskbarRightSection: document.querySelector('.taskbar_right_section'),
    batteryLevelText: document.querySelector('.battery_level_text'),
    batteryLevelPaint: document.querySelector('.battery_level_paint'),
}
let updateBattery = () => {
    navigator.getBattery().then(data => {
        //battery level
        domRefs['batteryLevelText'].innerHTML = data.level * 100 + ' %';
        domRefs['batteryLevelPaint'].style.width = `${data.level * 100}%`;
        //battery charging
        if(data.charging) {
            domRefs['batteryLevelPaint'].classList.toggle('battery_is_charging');
        }
        data.onlevelchange = () => {
            domRefs['batteryLevelText'].innerHTML = data.level * 100 + ' %';
        }
        data.onchargingchange = () => {
            domRefs['batteryLevelPaint'].classList.toggle('battery_is_charging');
            // if(data.charging) {
            //     domRefs['batteryLevelPaint'].classList.add('battery_is_charging');
            // }
            // else {

            // }
        }
    })
}
updateBattery();

var checkUsability = width => {
    if(width > 900) {
        domRefs['notAvailable'].style.display = 'none';        
        return;
    }
    domRefs['notAvailable'].style.display = 'block';
}
checkUsability(window.innerWidth);
window.addEventListener('resize', (e) => {
    checkUsability(e.target.innerWidth);
})
let onBootClick = () => {
    domRefs['bootBtn'].classList.toggle('visibility_hidden');
    domRefs['loadingContainer'].classList.toggle('visibility_hidden');
    showSystemLoading();
}
let showSystemLoading = () => {
   let systemLoading = document.querySelector('.systemLoading');
   setTimeout(() => {
       systemLoading.style.transform = 'translateY(-100%)';
    //    systemLoading.style.display = 'none';
   }, 2000);
}
let onCancelBtnClick = () => {
    domRefs['systemPopup'].classList.toggle('visibility_hidden');
    domRefs['screen'].classList.toggle('screen_freeze');
    domRefs['systemPopupFooter'].innerHTML = '';
    domRefs['systemPopupBody'].innerHTML = '';
    //reset background
    domRefs['screen'].style.backgroundColor = getComputedStyle(domRefs['screen']).getPropertyValue('--DEFAULT_BG_COLOR');
}
let toggleStartMenu = () => {
    domRefs['startMenu'].classList.toggle('visibility_hidden');
}
let showSystemPopUp = () => {
    domRefs['systemPopup'].classList.toggle('visibility_hidden');
    domRefs['startMenu'].classList.toggle('visibility_hidden');
    domRefs['screen'].classList.toggle('screen_freeze');
    //to change later
    domRefs['screen'].style.backgroundColor = 'darkslateblue';
}
let shutdownPopup = () => {
    showSystemPopUp();
    domRefs['systemPopupBody'].appendChild(document.createTextNode('Choose operation..'));
    let shutdownBtn = document.createElement('button');
    shutdownBtn.appendChild(document.createTextNode('shutdown'));
    shutdownBtn.className += 'popup_btn red_btn';
    shutdownBtn.onclick = shutdownSystem;
    let restartBtn = document.createElement('button');
    restartBtn.onclick = restartSystem;
    restartBtn.appendChild(document.createTextNode('restart'));
    restartBtn.className += 'popup_btn orange_btn';
    domRefs['systemPopupFooter'].appendChild(shutdownBtn);
    domRefs['systemPopupFooter'].appendChild(restartBtn);
}
let goFullscreen = () => {
    document.body.requestFullscreen();
    if(document.fullscreenEnabled) document.exitFullscreen();
}

let restartSystem = () => {
    shutdownSystem();
    setTimeout(() => {
        window.location.reload();
    }, 4000)
}
let shutdownSystem = () => {
    domRefs['systemPopup'].style.display = 'none';
    let overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = '#005';
    overlay.style.color = '#fff';
    domRefs['screen'].appendChild(overlay);
    let unmountingTexts = ['Unmounting Harddisks....',
                           'Unmounting RAM....',
                           'Cutting PowerSupply....',
                            '00011000101101111101000110001011011111010001100010110111110100011000101101',
                            'xd33e01ddex323eeeddx001xxxdde323xe33e01xdxd33e01ddex323eeeddx001xxxdde3233']
    for(let i = 0; i < unmountingTexts.length + 20; i++) {
        const msg = document.createElement('b');
        msg.appendChild(document.createTextNode('PLEASE CLOSE THE TAB...'));
        setTimeout(() => {
            const textEle = document.createElement('p');
            textEle.appendChild(document.createTextNode(unmountingTexts[i] || '-'));
            overlay.appendChild(textEle);
            if(i >= 20) {
                overlay.appendChild(msg);
            }
        }, i * 200);
    }
}