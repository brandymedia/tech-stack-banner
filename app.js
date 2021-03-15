import tech from '/tech.js';

const bmTechStack = document.querySelector('.bm-tech-stack');
// const bmTechStackItemLength = tech.length;
let bmTechStackParentWidth, bmTechStackWidth, bmTechStackHeight, bmTechStackScale;

async function setSize() {
    bmTechStackParentWidth = bmTechStack.parentElement.clientWidth;
    bmTechStackWidth = bmTechStackParentWidth;
    bmTechStackHeight = bmTechStackParentWidth / 3;
    bmTechStack.style.width = bmTechStackWidth + 'px';
    bmTechStack.style.height = bmTechStackHeight + 'px';
    bmTechStackScale = 1500 / bmTechStackParentWidth;
}

async function buildStack(selectedTech) {
    const bmTechStackItemLength = selectedTech.length;
    bmTechStack.innerHTML = '';

    await selectedTech.forEach(element => {
        let item = tech.find(item => item.id === element);
        let bmTechStackItemWidth;
        let bmTechStackItemHeight;

        if (bmTechStackItemLength == 1) {
            bmTechStackItemWidth = bmTechStackWidth;
            bmTechStackItemHeight = bmTechStackHeight;
        } else if (bmTechStackItemLength <= 10) {
            bmTechStackItemWidth = bmTechStackWidth / bmTechStackItemLength;
        } else if (bmTechStackItemLength > 10 && bmTechStackItemLength < 30) {
            if (bmTechStackItemLength % 2 == 0) {
                bmTechStackItemWidth = (bmTechStackWidth / bmTechStackItemLength) * 2;
            } else {
                bmTechStackItemWidth = (bmTechStackWidth / (bmTechStackItemLength + 1)) * 2;
            }
            bmTechStackItemHeight = bmTechStackHeight / 2;
        } else {
            if (bmTechStackItemLength % 3 == 0) {
                bmTechStackItemWidth = (bmTechStackWidth / bmTechStackItemLength) * 3;
            } else {
                if (bmTechStackItemLength % 3 == 2) {
                    bmTechStackItemWidth = (bmTechStackWidth / (bmTechStackItemLength + 1)) * 3;
                } else {
                    bmTechStackItemWidth = (bmTechStackWidth / (bmTechStackItemLength + 2)) * 3;
                }
            }
            bmTechStackItemHeight = bmTechStackHeight / 3;
        }
    
        let bmTechStackItemClass = item.name.toLowerCase();
        bmTechStackItemClass = bmTechStackItemClass.replace(' ', '');
        bmTechStackItemClass = bmTechStackItemClass.replace('.', '');
        const bmTechStackItem = document.createElement('div');
        bmTechStackItem.classList.add('bm-tech-stack-item', bmTechStackItemClass);
        bmTechStackItem.style.backgroundColor = item.backgroundColor;
        bmTechStackItem.style.color = item.textColor;
        bmTechStackItem.style.width = bmTechStackItemWidth + 'px';
        bmTechStackItem.style.height = bmTechStackItemHeight + 'px';
    
        const bmTechStackItemIcon = document.createElement('div');
        bmTechStackItemIcon.classList.add('bm-tech-stack-item-icon');
        
        const bmTechStackItemIconI = document.createElement('i');
        bmTechStackItemIconI.classList.add('fab', item.class);
        if (bmTechStackItemLength == 1) {
            bmTechStackItemIconI.style.fontSize = bmTechStackItemWidth / 3 + 'px';

        } else {
            bmTechStackItemIconI.style.fontSize = bmTechStackItemWidth / 1.5 + 'px';
        }

        bmTechStackItemIcon.appendChild(bmTechStackItemIconI);    
        bmTechStackItem.appendChild(bmTechStackItemIcon);
        bmTechStack.appendChild(bmTechStackItem);
    })
}

const downloadButton = document.querySelector('.download');

downloadButton.addEventListener('click', () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    html2canvas(bmTechStack, {scale: bmTechStackScale}).then(canvas => {
        canvas.toBlob(function(blob) {
            let link = document.createElement('a');
            link.download = 'banner.png';
            link.href = URL.createObjectURL(blob);
            link.target = '_blank';
            link.click();
        }, 'image/png', 1);
    });
});

// map to new array
const techChoices = tech.map(item => {
    const container = {};
    container['value'] = item.id;
    container['label'] = item.name;

    return container;
})

const element = document.querySelector('.js-choice');
const choices = new Choices(element, {
    removeItemButton: true,
    duplicateItemsAllowed: false,
});

choices.setChoices(techChoices);


// Set some default technologies
// choices.setValue([techChoices[0], techChoices[1], techChoices[2]]);  
choices.setChoiceByValue([techChoices[0].value, techChoices[1].value, techChoices[2].value]);

let selectedTech = choices.getValue(true);

// Choices events
choices.passedElement.element.addEventListener('addItem', async () => {
    selectedTech = choices.getValue(true);
    await setSize();
    await buildStack(selectedTech);
});

choices.passedElement.element.addEventListener('removeItem', async () => {
    selectedTech = choices.getValue(true);
    await setSize();
    await buildStack(selectedTech);
});

// Listen for events
window.addEventListener('load', async () => {
    await setSize();
    await buildStack(selectedTech);
});

window.addEventListener('resize', async () => {
    await setSize();
    await buildStack(selectedTech);
});