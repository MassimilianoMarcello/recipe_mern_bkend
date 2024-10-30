import Recipe from '../models/recipe.js';

const recipeControllers = {
    getAllRecipes: async (req, res) => {
        try {
            const recipes = await Recipe.find();
            res.status(200).json(recipes);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getRecipe: async (req, res) => {
        const { id } = req.params;
        try {
            const recipe = await Recipe.findById(id);
            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }
            res.status(200).json(recipe);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    createRecipe: async (req, res) => {
        const { title, ingredients, description, image } = req.body;
        try {
            const newRecipe = await Recipe.create({
                title,
                ingredients,
                description,
                image
            });

            newRecipe.save();
            res.status(201).json(newRecipe);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    updateRecipe: async (req, res) => {
        const { id } = req.params;
        const { title, description, ingredients, image } = req.body;
    
        try {
            const updatedRecipe = await Recipe.findByIdAndUpdate(
                id,
                { title, description, ingredients, image },
                { new: true } // restituisce il documento aggiornato
            );
    
            if (!updatedRecipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            } else {
                res.status(200).json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    
    deleteRecipe: async (req, res) => {
        const { id } = req.params;
        try {
            const deletedRecipe = await Recipe.deleteOne({ _id: id });
            if (!deletedRecipe.deletedCount) { // deletedCount indica se è stato eliminato un documento
                return res.status(404).json({ message: 'Recipe not found' });
            } else {
                res.status(200).json({ message: 'Recipe deleted successfully' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    
};

export default recipeControllers;
