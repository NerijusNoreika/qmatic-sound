let sounds = [ 
    "sounds/hard.mp3",
]

window.addEventListener('load', () => {
    let query = '#queuesModule .qm-tab-information > .qm-tab-information__text';
    let audio = new Audio(chrome.runtime.getURL("sounds/hard.mp3"));
    let firstStart = true;
    let ticketNumber = document.querySelector('#ticketNumber');
    let doc = document.querySelector(query);
    const config = {
        characterDataOldValue: true,
        characterData: true,
        attributes: true,
        childList: true,
        subtree: false
    };

    setInterval(() => {
        let currentlyNotServingCustomer = ticketNumber.textContent == 'Inactive';
        let peopleInQueue = parseInt(document.querySelector(query).textContent);
       if (document.hidden && currentlyNotServingCustomer && peopleInQueue > 0 ) {
            document.title = document.title == 'Qmatic Orchestra' ? document.title = 'PACIENTAS EILĖJE!' : 'Qmatic Orchestra';
       }
       if (!document.hidden) {
            document.title = 'Qmatic Orchestra';
       }
    }, 1000)
       
    
    let text = null; 
    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (firstStart) {
                    text = { ...mutation.addedNodes[0].textContent }
                    firstStart = false;
                } else {
                    if (mutation.addedNodes.length) {
                        if (parseInt(text[0]) < mutation.addedNodes[0].textContent) {
                            audio.play();
                            console.log(`Ding played for. Last object: ${text}. Current object ${mutation.addedNodes}`);
                        }
                        text = { ...mutation.addedNodes[0].textContent }
                    }
                }
            }
            
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(doc, config);
});

