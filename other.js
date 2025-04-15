//const selectedIngredients = selectedTags.filter(tag => tag.dataset.type === "ingredient").map(tag => tag.dataset.name);
const selectedTags = Array.from(document.querySelectorAll('.selectTag'))
const selectedIngredients = []
 for (const t of selectedTags){
    if(t.dataset.type === "ingredient")
        selectedIngredients.push(t.dataset.name)
 }
/*
const toSearch = ["chocolat", "pomme de terre", "dsgydfgjkkh", "coco", "CAROTTES", "sucre", " "]

for (let word of toSearch) {
   filterRecipes(word)
}*/

/*
Find199
function filterRecipes(word) {
    let filtered = [];

    if (word.length > 2) {
        for (let i = 0; i < recipes.length; i++) {
            let recipe = recipes[i];
            let matchFound = false;

            // Vérifie les ingrédients
            for (let j = 0; j < recipe.ingredients.length; j++) {
                let ing = recipe.ingredients[j];
                if (ing.ingredient.toLowerCase().includes(word)) {
                    matchFound = true;
                    break;
                }
            }

            // Vérifie le nom ou la description si aucun ingrédient n'a matché
            if (!matchFound) {
                if (recipe.name.toLowerCase().includes(word) || recipe.description.toLowerCase().includes(word)) {
                    matchFound = true;
                }
            }

            if (matchFound) {
                filtered.push(recipe);
            }
        }
    } else {
        // Si le mot a 2 lettres ou moins, retourne tous les recipes
        for (let i = 0; i < recipes.length; i++) {
            filtered.push(recipes[i]);
        }
    }

    return filtered;
}
*/