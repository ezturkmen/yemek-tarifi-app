import React, { useState, KeyboardEvent } from 'react';
import { Plus, X, Carrot, Beef, Milk, Wheat, MoreHorizontal } from 'lucide-react';
import { Ingredient, IngredientCategory } from '../types';

interface IngredientInputProps {
  ingredients: Ingredient[];
  onAddIngredient: (ing: Ingredient) => void;
  onRemoveIngredient: (ingName: string) => void;
  disabled?: boolean;
}

const CATEGORIES: { label: IngredientCategory; icon: React.ReactNode; color: string }[] = [
  { label: 'Sebze & Meyve', icon: <Carrot size={16} />, color: 'bg-green-100 text-green-700 border-green-200' },
  { label: 'Et & Şarküteri', icon: <Beef size={16} />, color: 'bg-red-100 text-red-700 border-red-200' },
  { label: 'Süt & Kahvaltılık', icon: <Milk size={16} />, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { label: 'Bakliyat & Tahıl', icon: <Wheat size={16} />, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { label: 'Kuruyemiş & Diğer', icon: <MoreHorizontal size={16} />, color: 'bg-gray-100 text-gray-700 border-gray-200' },
];

const IngredientInput: React.FC<IngredientInputProps> = ({ 
  ingredients, 
  onAddIngredient, 
  onRemoveIngredient, 
  disabled 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory>('Sebze & Meyve');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.some(i => i.name.toLowerCase() === trimmed.toLowerCase())) {
      onAddIngredient({ name: trimmed, category: selectedCategory });
      setInputValue('');
    }
  };

  // Group ingredients for display
  const groupedIngredients = CATEGORIES.reduce((acc, cat) => {
    acc[cat.label] = ingredients.filter(i => i.category === cat.label);
    return acc;
  }, {} as Record<IngredientCategory, Ingredient[]>);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                {CATEGORIES.find(c => c.label === selectedCategory)?.icon}
            </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as IngredientCategory)}
            disabled={disabled}
            className="absolute inset-y-0 left-0 pl-9 pr-2 py-4 bg-transparent border-none text-transparent focus:ring-0 w-[160px] cursor-pointer appearance-none sm:text-sm z-20"
            title="Kategori Seç"
          >
             {CATEGORIES.map(cat => (
                 <option key={cat.label} value={cat.label}>{cat.label}</option>
             ))}
          </select>
          {/* Visible custom select trigger area to allow typing in input next to it comfortably */}
           <div className="absolute inset-y-1 left-1 w-[180px] bg-gray-50 rounded-l-full border-r border-gray-200 flex items-center pl-2 pointer-events-none hidden sm:flex">
             <span className="text-sm font-medium text-gray-600 truncate">{selectedCategory}</span>
           </div>
           
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Malzeme adı (örn: Patates)..."
            className="w-full pl-4 sm:pl-[190px] pr-14 py-4 text-lg bg-white border-2 border-brand-200 rounded-full focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all shadow-sm placeholder-gray-400 text-gray-700"
          />
          <button
            onClick={addIngredient}
            disabled={!inputValue.trim() || disabled}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-brand-500 hover:bg-brand-600 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-20"
          >
            <Plus size={24} />
          </button>
        </div>
        
        {/* Mobile Category Select Fallback */}
        <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as IngredientCategory)}
            disabled={disabled}
            className="sm:hidden p-3 bg-white border-2 border-brand-200 rounded-2xl text-gray-700"
          >
             {CATEGORIES.map(cat => (
                 <option key={cat.label} value={cat.label}>{cat.label}</option>
             ))}
        </select>
      </div>

      <div className="min-h-[60px] bg-gray-50/50 rounded-2xl p-4 border border-dashed border-gray-200">
        {ingredients.length === 0 && (
          <p className="text-gray-400 text-sm italic w-full text-center py-4">
            Henüz malzeme eklenmedi. Yukarıdan kategori seçip malzeme ekleyin.
          </p>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map(cat => {
                const items = groupedIngredients[cat.label];
                if (items.length === 0) return null;
                
                return (
                    <div key={cat.label} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                            {cat.icon}
                            {cat.label.split('&')[0]}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {items.map(ing => (
                                <span 
                                    key={ing.name} 
                                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${cat.color} bg-opacity-50`}
                                >
                                    {ing.name}
                                    <button
                                        onClick={() => onRemoveIngredient(ing.name)}
                                        className="ml-1.5 opacity-60 hover:opacity-100"
                                        disabled={disabled}
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default IngredientInput;