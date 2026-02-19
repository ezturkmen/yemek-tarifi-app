import React, { useState } from 'react';
import { Carrot, Beef, Milk, Wheat, Nut, Check } from 'lucide-react';
import { IngredientCategory } from '../types';

interface IngredientSelectorProps {
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  disabled?: boolean;
}

const CATALOG: Record<IngredientCategory, string[]> = {
  'Sebze & Meyve': [
    'Domates', 'Salatalık', 'Kuru Soğan', 'Patates', 'Sarımsak', 'Biber (Yeşil)', 'Biber (Kırmızı)', 
    'Patlıcan', 'Kabak', 'Havuç', 'Ispanak', 'Maydanoz', 'Dereotu', 'Taze Soğan', 'Marul', 
    'Limon', 'Mantar', 'Bezelye', 'Fasulye (Taze)', 'Karnabahar', 'Brokoli', 'Lahana', 'Mısır'
  ],
  'Et & Şarküteri': [
    'Kıyma', 'Tavuk Göğsü', 'Tavuk But', 'Kuşbaşı Et', 'Biftek', 'Köfte', 
    'Sucuk', 'Sosis', 'Salam', 'Pastırma', 'Yumurta', 'Ton Balığı'
  ],
  'Bakliyat & Tahıl': [
    'Pirinç', 'Bulgur', 'Makarna', 'Mercimek (Kırmızı)', 'Mercimek (Yeşil)', 'Nohut', 
    'Kuru Fasulye', 'Un', 'Ekmek', 'Galeta Unu', 'İrmik', 'Yufka', 'Milföy Hamuru', 'Şehriye'
  ],
  'Süt & Kahvaltılık': [
    'Süt', 'Yoğurt', 'Beyaz Peynir', 'Kaşar Peyniri', 'Tereyağı', 'Margarin', 'Krema', 
    'Zeytin', 'Labne', 'Lor Peyniri'
  ],
  'Kuruyemiş & Diğer': [
    'Ceviz', 'Fındık', 'Fıstık', 'Badem', 'Kuru Üzüm', 'Kakao', 'Çikolata', 'Hindistan Cevizi',
    'Bal', 'Pekmez', 'Tahin'
  ]
};

const CATEGORY_ICONS: Record<IngredientCategory, React.ReactNode> = {
  'Sebze & Meyve': <Carrot size={18} />,
  'Et & Şarküteri': <Beef size={18} />,
  'Bakliyat & Tahıl': <Wheat size={18} />,
  'Süt & Kahvaltılık': <Milk size={18} />,
  'Kuruyemiş & Diğer': <Nut size={18} />
};

const IngredientSelector: React.FC<IngredientSelectorProps> = ({ 
  selectedIngredients, 
  onToggleIngredient,
  disabled 
}) => {
  const [activeCategory, setActiveCategory] = useState<IngredientCategory>('Sebze & Meyve');

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {(Object.keys(CATALOG) as IngredientCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            disabled={disabled}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all border-2 ${
              activeCategory === cat
                ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {CATEGORY_ICONS[cat]}
            {cat}
          </button>
        ))}
      </div>

      {/* Ingredients Grid */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm min-h-[300px]">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          {CATEGORY_ICONS[activeCategory]}
          {activeCategory}
          <span className="text-sm font-normal text-gray-400 ml-auto">
             {CATALOG[activeCategory].filter(i => selectedIngredients.includes(i)).length} seçildi
          </span>
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {CATALOG[activeCategory].map((ingredient) => {
            const isSelected = selectedIngredients.includes(ingredient);
            return (
              <button
                key={ingredient}
                onClick={() => onToggleIngredient(ingredient)}
                disabled={disabled}
                className={`relative px-3 py-3 rounded-xl text-sm font-medium transition-all text-left flex items-center justify-between group ${
                  isSelected
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-200 scale-[1.02]'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="truncate mr-2">{ingredient}</span>
                {isSelected && (
                  <div className="bg-white/20 rounded-full p-0.5 animate-fadeIn">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Selection Summary (Mobile mainly) */}
      {selectedIngredients.length > 0 && (
         <div className="mt-4 p-4 bg-gray-900 text-white rounded-2xl flex items-center justify-between shadow-lg">
            <div className="text-sm">
                <span className="font-bold text-brand-400">{selectedIngredients.length}</span> malzeme seçildi.
            </div>
            <div className="flex gap-1 overflow-hidden h-6 max-w-[60%] opacity-50 text-xs items-center">
                {selectedIngredients.slice(0, 5).join(', ')}
                {selectedIngredients.length > 5 && '...'}
            </div>
         </div>
      )}
    </div>
  );
};

export default IngredientSelector;