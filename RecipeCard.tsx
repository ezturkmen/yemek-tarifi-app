import React from 'react';
import { ChevronRight, AlertCircle, CheckCircle2, Tag } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const imageId = recipe.title.length % 50 + 50; 
  const imageUrl = `https://picsum.photos/id/${imageId}/400/300`;
  
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
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer relative"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={recipe.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        
        {/* Simple Category Badge */}
        <div className={`absolute top-0 left-0 px-3 py-1.5 rounded-br-xl text-[10px] font-bold text-white shadow-sm uppercase tracking-wider ${badgeColor}`}>
          {recipe.recipeCategory}
        </div>

        {/* Missing Ingredients Indicator (Minimal) */}
        <div className={`absolute bottom-2 right-2 px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm flex items-center gap-1 backdrop-blur-md ${missingCount === 0 ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {missingCount === 0 ? (
            <CheckCircle2 size={10} />
          ) : (
            <>
              <AlertCircle size={10} />
              <span>{missingCount} eksik</span>
            </>
          )}
        </div>
      </div>
      
      {/* Content Section - Minimal Name Only */}
      <div className="p-4 flex items-center justify-between bg-white">
        <h3 className="text-md font-serif font-bold text-gray-800 line-clamp-1 group-hover:text-brand-600 transition-colors">
          {recipe.title}
        </h3>
        <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
      </div>
    </div>
  );
};

export default RecipeCard;