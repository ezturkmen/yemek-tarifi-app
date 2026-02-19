import React, { useState } from 'react';
import { ChefHat, Search, Loader2, Sparkles, UtensilsCrossed, Refrigerator, ArrowRight } from 'lucide-react';
import IngredientSelector from './components/IngredientSelector';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import { generateRecipesFromIngredients } from './services/geminiService';
import { Recipe } from './types';

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleToggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredient)) {
        return prev.filter(i => i !== ingredient);
      } else {
        return [...prev, ingredient];
      }
    });
  };

  const handleSearch = async () => {
    if (selectedIngredients.length === 0) return;
    
    setLoading(true);
    setError(null);
    setRecipes([]);
    setHasSearched(true);

    try {
      const result = await generateRecipesFromIngredients(selectedIngredients);
      setRecipes(result);
      
      setTimeout(() => {
        const resultsElement = document.getElementById('results-section');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
    } catch (err) {
      setError("Tarifler bulunurken bir hata oluştu. Lütfen tekrar deneyin veya farklı malzemeler seçin.");
    } finally {
      setLoading(false);
    }
  };

  // Group recipes by category for display
  const groupedRecipes = {
    "Başlangıç & Çorba": recipes.filter(r => r.recipeCategory === "Başlangıç & Çorba"),
    "Ana Yemek": recipes.filter(r => r.recipeCategory === "Ana Yemek"),
    "Tatlı": recipes.filter(r => r.recipeCategory === "Tatlı"),
    "Diğer": recipes.filter(r => !["Başlangıç & Çorba", "Ana Yemek", "Tatlı"].includes(r.recipeCategory || ""))
  };

  const displayOrder = ["Başlangıç & Çorba", "Ana Yemek", "Tatlı", "Diğer"];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      
      <div className="absolute top-4 right-4 z-50 font-sans text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gray-400 select-none pointer-events-none opacity-80 mix-blend-multiply">
        EDIT BY @EZTURKMEN
      </div>

      {/* Header */}
      <header className="bg-white border-b border-brand-100 relative overflow-hidden pb-12">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-100 rounded-full opacity-50 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-yellow-100 rounded-full opacity-50 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-2xl mb-6 shadow-sm">
            <ChefHat size={40} className="text-brand-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">
            Akıllı Mutfak Asistanı <br />
            <span className="text-brand-600">Lezzet Bulucu</span>
          </h1>
          <p className="max-w-2xl text-lg text-gray-600 mb-10 leading-relaxed">
            Mutfak envanterinizde ne varsa işaretleyin, yapay zeka size en az 10 farklı tarif alternatifi sunsun.
          </p>
          
          <div className="w-full flex flex-col items-center gap-8">
             <div className="w-full bg-white/50 backdrop-blur-sm rounded-3xl p-1 md:p-6 border border-white/50 shadow-sm">
                 <div className="flex items-center gap-2 mb-4 px-4 text-gray-700 font-semibold md:justify-center">
                    <Refrigerator className="text-brand-500" size={20} />
                    <span>Malzeme Kataloğu</span>
                 </div>
                 
                 <IngredientSelector 
                    selectedIngredients={selectedIngredients}
                    onToggleIngredient={handleToggleIngredient}
                    disabled={loading}
                 />
             </div>
             
             <div className="fixed bottom-6 left-0 right-0 px-4 z-40 md:static md:px-0 md:mt-4 pointer-events-none md:pointer-events-auto">
               <div className="max-w-md mx-auto pointer-events-auto">
                 <button
                    onClick={handleSearch}
                    disabled={loading || selectedIngredients.length === 0}
                    className="w-full py-4 bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-2xl shadow-gray-400/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-lg border border-gray-700/50"
                 >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Menü Hazırlanıyor...
                      </>
                    ) : (
                      <>
                        <Search size={24} className="text-brand-400" />
                        <span>{selectedIngredients.length} Malzeme ile Menü Oluştur</span>
                        <ArrowRight size={20} className="opacity-70" />
                      </>
                    )}
                 </button>
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="results-section" className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 flex items-center gap-3 border border-red-100 animate-fadeIn">
             <div className="bg-red-100 p-2 rounded-full"><UtensilsCrossed size={20} /></div>
             {error}
          </div>
        )}

        {recipes.length > 0 ? (
          <div className="space-y-12 animate-fadeIn">
            
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
               <div className="bg-brand-100 p-2 rounded-lg text-brand-600">
                    <Sparkles size={24} />
               </div>
               <div>
                  <h2 className="text-3xl font-serif font-bold text-gray-900">Size Özel Menü</h2>
                  <p className="text-gray-500">Seçtiğiniz malzemelere göre oluşturulan tam kapsamlı öneriler.</p>
               </div>
            </div>

            {/* Display by Sections */}
            {displayOrder.map(category => {
               const categoryRecipes = groupedRecipes[category as keyof typeof groupedRecipes] || [];
               if (categoryRecipes.length === 0) return null;

               return (
                 <div key={category} className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 pl-2 border-l-4 border-brand-500">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {categoryRecipes.map((recipe) => (
                          <RecipeCard 
                            key={recipe.id} 
                            recipe={recipe} 
                            onClick={() => setSelectedRecipe(recipe)}
                          />
                      ))}
                    </div>
                 </div>
               )
            })}
          </div>
        ) : (
          hasSearched && !loading && !error && (
            <div className="text-center py-20 text-gray-500">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                <UtensilsCrossed size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Maalesef uygun tarif bulunamadı.</h3>
              <p>Farklı malzemeler seçerek tekrar deneyebilirsiniz.</p>
            </div>
          )
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-gray-500 text-sm mb-20 md:mb-0">
        <p>&copy; {new Date().getFullYear()} Lezzet Bulucu. Yapay zeka destekli tarif asistanı.</p>
      </footer>

      {/* Modal */}
      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
    </div>
  );
}

export default App;