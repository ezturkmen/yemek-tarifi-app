import React from 'react';
import { ChevronRight, AlertCircle, CheckCircle2, Tag } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const missingCount = recipe.missingIngredients ? recipe.missingIngredients.length : 0;

  // Category Color Map
  const categoryColors: Record<string, string> = {
    "Ana Yemek": "bg-orange-500",
    "Başlangıç & Çorba": "bg-emerald-500",
    "Tatlı": "bg-pink-500",
    "Diğer": "bg-blue-500"
  };

  const badgeColor = categoryColors[recipe.recipeCategory || "Diğer"] || "bg-gray-500";

  return (
    <div 
      className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer relative gap-4"
      onClick={onClick}
    >
      {/* Top Badges */}
      <div className="flex justify-between items-start">
        <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold text-white shadow-sm uppercase tracking-wider ${badgeColor}`}>
          {recipe.recipeCategory}
        </div>
        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${missingCount === 0 ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {missingCount === 0 ? (
            <><CheckCircle2 size={12} /> Tamam</>
          ) : (
            <><AlertCircle size={12} /> {missingCount} eksik</>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex items-center justify-between mt-2">
        <h3 className="text-lg font-serif font-bold text-gray-800 line-clamp-2 group-hover:text-brand-600 transition-colors pr-4">
          {recipe.title}
        </h3>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-50 transition-colors flex-shrink-0">
          <ChevronRight size={18} className="text-gray-400 group-hover:text-brand-500 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;