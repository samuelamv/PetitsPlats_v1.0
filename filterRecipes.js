import { recipes } from './recipes.js';

const closeMark = document.querySelector(".remove-button");
const searchBar = document.querySelector(".search-bar");
const template = document.querySelector('.card');
const galerie = document.querySelector('.galerie');

function displayRecipes(xRecipes){
    galerie.replaceChildren();

    const oldMessage = document.getElementById("no-result-message");
    if (oldMessage) oldMessage.remove();

    const keyword = document.querySelector(".search-bar").value.trim();

    if (xRecipes.length === 0) {
        const message = document.createElement("p");
        message.id = "no-result-message";
        message.textContent = `Aucune recette ne contient "${keyword}"`;
        message.style.fontFamily =  "Anton";
        message.style.fontWeight = "400";
        message.style.marginTop = "1rem";
        message.style.color = "#00000";

        galerie.appendChild(message);
    } else {
    xRecipes.forEach(recipes => {
        const clone = template.content.cloneNode(true);
        const box = clone.querySelector('.box');
        const img = clone.querySelector('.image');
        const h2 = clone.querySelector('.title');
        const p = clone.querySelector('.description');
        const time = clone.querySelector('.timer-recipe');
        const div = clone.querySelector('.ingrédient-gallerie');

        box.setAttribute('recipesid', recipes.id);
        img.src = `./medias/${recipes.image}`;
        img.alt = recipes.name;
        h2.textContent = recipes.name;
        p.textContent  = recipes.description;
        time.textContent = recipes.time + "min";

            recipes.ingredients.forEach(ing => {
                const ingredientName = ing.ingredient;
                const ingredient = document.createElement('p');
                ingredient.classList.add('ingrédients');
                ingredient.textContent = ingredientName;

                const divIngQty = document.createElement('div');
                divIngQty.classList.add('ing-qty');

                const quantity = ing.quantity;
                const unit = ing.unit ? ` ${ing.unit}` : '';
                const quantitySpan = document.createElement('span');
                quantitySpan.classList.add('qte');
                quantitySpan.textContent = `${quantity || ''}${unit}`;

                divIngQty.appendChild(ingredient);
                divIngQty.appendChild(quantitySpan);
                div.appendChild(divIngQty);
            });
            galerie.appendChild(clone);
        });
    }   
    document.getElementById("recipe-count").textContent = `${xRecipes.length} recette${xRecipes.length > 1 ? 's' : ''}`;

}

function createDropdownList(set, className, labelClass, type) {
    const div = document.querySelector(className);
    div.innerHTML = "";
    const selectedTagsContainer = document.getElementById('selectedTags');

    set.forEach(item => {
        const container = document.createElement('div');
        container.classList.add(`${type}-container`);
        container.dataset.name = item;
        container.dataset.type = type;
        const label = document.createElement('label');
        label.classList.add(`${labelClass}-label`);
        label.textContent = item;
        container.appendChild(label);
        div.appendChild(container);

        container.addEventListener('click', function () {
            if (document.querySelector(`.selectTag[data-name="${item}"]`)) return;
            const selectTag = document.createElement("div");
            selectTag.textContent = item;
            selectTag.classList.add("selectTag");
            selectTag.dataset.name = item;
            selectTag.dataset.type = type;
            /*if(container.dataset.name === selectTag.dataset.name){
                let selectedContainer = document.querySelector(`${type}-container[data-name="${item}"]`)
                selectedContainer.classList.add("selected")
            }*/
            
            const x = document.createElement("button");
            x.textContent = "x";
            x.classList.add("remove-tag");
            x.addEventListener("click", function () {
                selectTag.remove();
                const recipes = filterRecipes();
                displayRecipes(recipes);
                updateDropdowns(recipes);
            });

            selectTag.appendChild(x);
            selectedTagsContainer.appendChild(selectTag);

            const filteredRecipes = filterRecipes();
            displayRecipes(filteredRecipes);
            updateDropdowns(filteredRecipes);
        });
    });
}

function displayUniqueIngredients(xRecipes) {
    const set = new Set();
    xRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => set.add(ing.ingredient.toLowerCase()));
    });
    createDropdownList(set, '.dropdown-listIng', 'ingredient', 'ingredient');
}

function displayUniqueAppliances(xRecipes) {
    const set = new Set();
    xRecipes.forEach(recipe => set.add(recipe.appliance.toLowerCase()));
    createDropdownList(set, '.dropdown-listApp', 'appliance', 'appliance');
}

function displayUniqueUstensils(xRecipes) {
    const set = new Set();
    xRecipes.forEach(recipe => {
        recipe.ustensils.forEach(ust => set.add(ust.toLowerCase()));
    });
    createDropdownList(set, '.dropdown-listUst', 'ustensil', 'ustensil');
}

function openList(className, idName) {
    document.getElementById(idName).addEventListener('click', function () {
        const filter = document.querySelector(className);
        filter.style.display = (filter.style.display === 'block') ? 'none' : 'block';
        filter.style.height = (filter.style.display === 'block') ? '300px' : '0';
    });
}

function filterRecipes() {
    const selectedTags = Array.from(document.querySelectorAll('.selectTag'));
    const word = document.querySelector(".search-bar").value.trim().toLowerCase();
    let filtered = recipes;

    const selectedIngredients = [];
    const selectedAppliances = [];
    const selectedUstensils = [];

    for (const tag of selectedTags) {
        if (tag.dataset.type === "ingredient") {
            selectedIngredients.push(tag.dataset.name);
        } else if (tag.dataset.type === "appliance") {
            selectedAppliances.push(tag.dataset.name);
        } else if (tag.dataset.type === "ustensil") {
            selectedUstensils.push(tag.dataset.name);
        }
    }

    if (selectedIngredients.length) {
        const temp = [];
        for (const recipe of filtered) {
            let allMatch = true;
            for (const tag of selectedIngredients) {
                let found = false;
                for (const ing of recipe.ingredients) {
                    if (ing.ingredient.toLowerCase().includes(tag)) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    allMatch = false;
                    break;
                }
            }
            if (allMatch) {
                temp.push(recipe);
            }
        }
        filtered = temp;
    }

    if (selectedAppliances.length) {
        const temp = [];
        for (const recipe of filtered) {
            let allMatch = true;
            for (const tag of selectedAppliances) {
                if (!recipe.appliance.toLowerCase().includes(tag)) {
                    allMatch = false;
                    break;
                }
            }
            if (allMatch) {
                temp.push(recipe);
            }
        }
        filtered = temp;
    }

    if (selectedUstensils.length) {
        const temp = [];
        for (const recipe of filtered) {
            let allMatch = true;
            for (const tag of selectedUstensils) {
                let found = false;
                for (const ust of recipe.ustensils) {
                    if (ust.toLowerCase().includes(tag)) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    allMatch = false;
                    break;
                }
            }
            if (allMatch) {
                temp.push(recipe);
            }
        }
        filtered = temp;
    }

    if (word.length > 2) {
        const temp = [];
        for (const recipe of filtered) {
            let match = false;

            for (const ing of recipe.ingredients) {
                if (ing.ingredient.toLowerCase().includes(word)) {
                    match = true;
                    break;
                }
            }

            if (!match && !recipe.name.toLowerCase().includes(word) && !recipe.description.toLowerCase().includes(word)) {
                continue;
            }

            temp.push(recipe);
        }
        filtered = temp;
    }

    return filtered;
}

function updateDropdowns(recipes) {
    displayUniqueIngredients(recipes);
    displayUniqueAppliances(recipes);
    displayUniqueUstensils(recipes);
}

// Search bar reset and logic
searchBar.addEventListener("input", function () {
    closeMark.style.display = searchBar.value.trim() !== "" ? "inline" : "none";
});

document.querySelector(".remove-button").addEventListener('click', function(event) {
    event.preventDefault();
    document.querySelector("form").reset();
    const allRecipes = filterRecipes();
    displayRecipes(allRecipes);
    updateDropdowns(allRecipes);
});

document.querySelector(".formSearch").addEventListener('submit', function (event) {
    event.preventDefault();
    const newRecipes = filterRecipes();
    displayRecipes(newRecipes);
    updateDropdowns(newRecipes);
});


["Ing", "App", "Ust"].forEach(type => {
    document.querySelector(`.search${type}-button`).addEventListener("click", function (event) {
        event.preventDefault();
        const input = document.querySelector(`.search-dropdown${type}`);
        const value = input.value.trim().toLowerCase();
        const list = document.querySelector(`.dropdown-list${type}`);

        if (value !== "") {
            const filtered = Array.from(list.children).filter(container =>
                container.textContent.toLowerCase().includes(value)
            );
            list.innerHTML = "";
            filtered.forEach(el => list.appendChild(el));
        }
    });

    document.querySelector(`.remove${type}-button`).addEventListener("click", function () {
        document.querySelector(`.search-dropdown${type}`).value = "";
        ["Ing", "App", "Ust"].forEach(type => {
            document.querySelector(`.remove${type}-button`).addEventListener("click", function () {
                document.querySelector(`.search-dropdown${type}`).value = "";
                updateDropdowns(filterRecipes());
            });
        });        
    });
});

// Init
openList('.tag-ing', 'ingredientsDropdown');
openList('.tag-app', 'applianceDropdown');
openList('.tag-ust', 'ustensilDropdown');
displayRecipes(recipes);
updateDropdowns(recipes);
