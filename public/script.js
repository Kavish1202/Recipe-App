document.addEventListener('DOMContentLoaded', () => {
    fetchRecipes();
  
    document.getElementById('recipeForm').addEventListener('submit', addRecipe);
  });
  
  async function fetchRecipes() {
    const response = await fetch('/api/recipes');
    const recipes = await response.json();
    const recipesTableBody = document.getElementById('recipesTable').querySelector('tbody');
    recipesTableBody.innerHTML = '';
    recipes.forEach(recipe => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${recipe.title}</td>
        <td>${recipe.ingredients.join(', ')}</td>
        <td>${recipe.instructions}</td>
        <td>${recipe.cookingTime}</td>
        <td class="action-buttons">
        <button class="action-button delete-button" onclick="deleteRecipe('${recipe._id}')">Delete</button>
        <button class="action-button edit-button" onclick="editRecipe('${recipe._id}')">Edit</button>
      </td>
      `;
      recipesTableBody.appendChild(row);
    });
  }
  
  async function addRecipe(event) {
    event.preventDefault();
    const id = document.getElementById('recipeId').value;
    const title = document.getElementById('title').value;
    const ingredients = document.getElementById('ingredients').value.split(', ');
    const instructions = document.getElementById('instructions').value;
    const cookingTime = document.getElementById('cookingTime').value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/recipes/${id}` : '/api/recipes';
  
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, ingredients, instructions, cookingTime }),
    });
    if (response.ok) {
      fetchRecipes();
      document.getElementById('recipeForm').reset();
    } else {
      console.error('Failed to save the recipe');
    }
  }
  
  async function deleteRecipe(id) {
    const response = await fetch(`/api/recipes/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      fetchRecipes();
    } else {
      console.error('Failed to delete the recipe');
    }
  }
  
  async function editRecipe(id) {
    const response = await fetch(`/api/recipes/${id}`);
    const recipe = await response.json();
    document.getElementById('recipeId').value = recipe._id;
    document.getElementById('title').value = recipe.title;
    document.getElementById('ingredients').value = recipe.ingredients.join(', ');
    document.getElementById('instructions').value = recipe.instructions;
    document.getElementById('cookingTime').value = recipe.cookingTime;
  }
  