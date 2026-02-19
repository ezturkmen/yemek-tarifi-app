import React from 'react';
import { X, Clock, CheckCircle2, ChevronRight, ChefHat, AlertCircle, ShoppingBasket, Globe, Tag } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onClose }) => {
  const imageId = recipe.title.length % 50 + 50;
  const imageUrl = `https://picsum.photos/id/${imageId}/800/400`;

  // Helper to check if an ingredient is in the missing list
  const isMissing = (ing: string) => {
    return recipe.missingIngredients?.some(missing => ing.toLowerCase().includes(missing.toLowerCase()));
  };

  const availableIngredients = recipe.ingredients.filter(ing => !isMissing(ing));
  const missingIngredients = recipe.missingIngredients || [];

  // Construct a safe Google Search URL
  const searchQuery = `${recipe.title} tarifi ${recipe.sourceName || ''}`;
  const safeUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        {/* Header Image */}
        <div className="relative h-48 sm:h-64 flex-shrink-0">
          <img 
            src={imageUrl} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white text-gray-800 transition-colors shadow-lg"
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 mb-2">
                 <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold">
                    <Globe size={12} />
                    {recipe.sourceName || 'Web Kaynağı'}
                </div>
                {recipe.recipeCategory && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/80 backdrop-blur-md rounded-full text-white text-xs font-semibold">
                        <Tag size={12} />
                        {recipe.recipeCategory}
                    </div>
                )}
            </div>
           
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2 shadow-sm">
              {recipe.title}
            </h2>
            <div className="flex items-center gap-4 text-white/90 text-sm font-medium">
              <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                <Clock size={16} />
                {recipe.prepTime}
              </span>
              <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                <ChefHat size={16} />
                {recipe.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-grow overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Ingredients Column */}
            <div className="md:col-span-1 space-y-6">
              
              {/* Missing Ingredients Section */}
              {missingIngredients.length > 0 && (
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                  <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                    <ShoppingBasket size={20} />
                    Eksik Malzemeler
                  </h3>
                  <ul className="space-y-2">
                    {missingIngredients.map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-red-700 text-sm">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Available Ingredients Section */}
              <div className="bg-brand-50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-brand-600" />
                  Elinizdekiler & Diğer
                </h3>
                <ul className="space-y-2">
                  {/* Show all non-missing ingredients */}
                  {availableIngredients.length > 0 ? availableIngredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 flex-shrink-0"></div>
                      <span>{ing}</span>
                    </li>
                  )) : (
                    recipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                         <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 flex-shrink-0"></div>
                        <span>{ing}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* Instructions Column */}
            <div className="md:col-span-2 space-y-6">
               <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-brand-500 rounded-full"></span>
                  Hazırlanışı
                </h3>
                <p className="text-gray-600 mb-6 italic border-l-4 border-gray-200 pl-4 py-2">
                  {recipe.description}
                </p>
                <div className="space-y-6">
                  {recipe.instructions.map((step, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-bold flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 mt-1 leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Footer Link */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-center flex-shrink-0">
          <a 
            href={safeUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1 transition-colors"
          >
            Tarifin tamamını kaynağında incele <ChevronRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;