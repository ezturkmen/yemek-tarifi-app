import React, { useState } from 'react';
import { Carrot, Beef, Milk, Wheat, Nut, Check, Plus, Search } from 'lucide-react';
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
    'Limon', 'Mantar', 'Bezelye', 'Fasulye (Taze)', 'Karnabahar', 'Brokoli', 'Lahana', 'Mısır',
    'Roka', 'Nane', 'Fesleğen', 'Semizotu', 'Pazı', 'Enginar', 'Kereviz', 'Turp', 'Elma', 'Armut', 
    'Muz', 'Çilek', 'Portakal', 'Mandalina', 'Avokado', 'Zencefil'
  ],
  'Et & Şarküteri': [
    'Kıyma', 'Tavuk Göğsü', 'Tavuk But', 'Kuşbaşı Et', 'Biftek', 'Köfte', 
    'Sucuk', 'Sosis', 'Salam', 'Pastırma', 'Yumurta', 'Ton Balığı',
    'Kuzu Eti', 'Ciğer', 'Hindi', 'Somon', 'Hamsi'
  ],
  'Bakliyat & Tahıl': [
    'Pirinç', 'Bulgur', 'Makarna', 'Mercimek (Kırmızı)', 'Mercimek (Yeşil)', 'Nohut', 
    'Kuru Fasulye', 'Un', 'Ekmek', 'Galeta Unu', 'İrmik', 'Yufka', 'Milföy Hamuru', 'Şehriye',
    'Kuskus', 'Erişte', 'Yulaf', 'Nişasta'
  ],
  'Süt & Kahvaltılık': [
    'Süt', 'Yoğurt', 'Beyaz Peynir', 'Kaşar Peyniri', 'Tereyağı', 'Margarin', 'Krema', 
    'Zeytin', 'Labne', 'Lor Peyniri', 'Kefir', 'Cheddar', 'Mozzarella', 'Hellim', 'Tulum Peyniri'
  ],
  'Kuruyemiş & Diğer': [
    'Ceviz', 'Fındık', 'Fıstık', 'Badem', 'Kuru Üzüm', 'Kakao', 'Çikolata', 'Hindistan Cevizi',
    'Bal', 'Pekmez', 'Tahin', 'Susam', 'Çörek Otu', 'Vanilya', 'Kabartma Tozu', 'Maya', 
    'Salça (Domates)', 'Salça (Biber)', 'Sıvı Yağ', 'Zeytinyağı', 'Sirke', 'Nar Ekşisi',
    'Tuz', 'Karabiber', 'Kekik', 'Kimyon', 'Pul Biber', 'Nane (Kuru)'
  ]
};

const CATEGORY_ICONS: Record<IngredientCategory, React.ReactNode> = {
  'Sebze & Meyve': <Carrot size={18} />,
  'Et & Şarküteri': <Beef size={18} />,
  'Bakliyat & Tahıl': <Wheat size={18} />,
  'Süt & Kahvaltılık': <Milk size={18} />,
  'Kuruyemiş & Diğer': <Nut size={18} />
};

const INGREDIENT_EMOJIS: Record<string, string> = {
  'Domates': '🍅', 'Salatalık': '🥒', 'Kuru Soğan': '🧅', 'Patates': '🥔', 'Sarımsak': '🧄', 'Biber (Yeşil)': '🫑', 'Biber (Kırmızı)': '🌶️', 
  'Patlıcan': '🍆', 'Kabak': '🥒', 'Havuç': '🥕', 'Ispanak': '🍃', 'Maydanoz': '🌿', 'Dereotu': '🌿', 'Taze Soğan': '🧅', 'Marul': '🥬', 
  'Limon': '🍋', 'Mantar': '🍄', 'Bezelye': '🫛', 'Fasulye (Taze)': '🫘', 'Karnabahar': '🥦', 'Brokoli': '🥦', 'Lahana': '🥬', 'Mısır': '🌽',
  'Roka': '🌿', 'Nane': '🌿', 'Fesleğen': '🌿', 'Semizotu': '🌿', 'Pazı': '🥬', 'Enginar': '🪷', 'Kereviz': '🥬', 'Turp': '🫚', 'Elma': '🍎', 'Armut': '🍐', 
  'Muz': '🍌', 'Çilek': '🍓', 'Portakal': '🍊', 'Mandalina': '🍊', 'Avokado': '🥑', 'Zencefil': '🫚',
  'Kıyma': '🥩', 'Tavuk Göğsü': '🍗', 'Tavuk But': '🍗', 'Kuşbaşı Et': '🥩', 'Biftek': '🥩', 'Köfte': '🧆', 
  'Sucuk': '🌭', 'Sosis': '🌭', 'Salam': '🥓', 'Pastırma': '🥓', 'Yumurta': '🥚', 'Ton Balığı': '🐟',
  'Kuzu Eti': '🥩', 'Ciğer': '🥩', 'Hindi': '🦃', 'Somon': '🍣', 'Hamsi': '🐟',
  'Pirinç': '🍚', 'Bulgur': '🌾', 'Makarna': '🍝', 'Mercimek (Kırmızı)': '🫘', 'Mercimek (Yeşil)': '🫘', 'Nohut': '🧆', 
  'Kuru Fasulye': '🫘', 'Un': '🌾', 'Ekmek': '🍞', 'Galeta Unu': '🥖', 'İrmik': '🌾', 'Yufka': '🫓', 'Milföy Hamuru': '🥐', 'Şehriye': '🍝',
  'Kuskus': '🍚', 'Erişte': '🍝', 'Yulaf': '🥣', 'Nişasta': '🌾',
  'Süt': '🥛', 'Yoğurt': '🥣', 'Beyaz Peynir': '🧀', 'Kaşar Peyniri': '🧀', 'Tereyağı': '🧈', 'Margarin': '🧈', 'Krema': '🥛', 
  'Zeytin': '🫒', 'Labne': '🧀', 'Lor Peyniri': '🧀', 'Kefir': '🥛', 'Cheddar': '🧀', 'Mozzarella': '🧀', 'Hellim': '🧀', 'Tulum Peyniri': '🧀',
  'Ceviz': '🌰', 'Fındık': '🌰', 'Fıstık': '🥜', 'Badem': '🌰', 'Kuru Üzüm': '🍇', 'Kakao': '🍫', 'Çikolata': '🍫', 'Hindistan Cevizi': '🥥',
  'Bal': '🍯', 'Pekmez': '🍯', 'Tahin': '🫙', 'Susam': '🌾', 'Çörek Otu': '🖤', 'Vanilya': '🌼', 'Kabartma Tozu': '🧂', 'Maya': '🍞', 
  'Salça (Domates)': '🥫', 'Salça (Biber)': '🥫', 'Sıvı Yağ': '🛢️', 'Zeytinyağı': '🫒', 'Sirke': '🍾', 'Nar Ekşisi': '🏺',
  'Tuz': '🧂', 'Karabiber': '🧂', 'Kekik': '🌿', 'Kimyon': '🧂', 'Pul Biber': '🌶️', 'Nane (Kuru)': '🌿'
};

const IngredientSelector: React.FC<IngredientSelectorProps> = ({ 
  selectedIngredients, 
  onToggleIngredient,
  disabled 
}) => {
  const [activeCategory, setActiveCategory] = useState<IngredientCategory>('Sebze & Meyve');
  const [customIngredient, setCustomIngredient] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userAddedIngredients, setUserAddedIngredients] = useState<Record<IngredientCategory, string[]>>({
    'Sebze & Meyve': [],
    'Et & Şarküteri': [],
    'Bakliyat & Tahıl': [],
    'Süt & Kahvaltılık': [],
    'Kuruyemiş & Diğer': []
  });

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customIngredient.trim();
    if (trimmed) {
      const existsInCatalog = CATALOG[activeCategory].some(i => i.toLowerCase() === trimmed.toLowerCase());
      const existsInUser = userAddedIngredients[activeCategory].some(i => i.toLowerCase() === trimmed.toLowerCase());
      
      let actualName = trimmed;
      
      if (!existsInCatalog && !existsInUser) {
        setUserAddedIngredients(prev => ({
          ...prev,
          [activeCategory]: [...prev[activeCategory], trimmed]
        }));
      } else {
        const found = CATALOG[activeCategory].find(i => i.toLowerCase() === trimmed.toLowerCase()) || 
                      userAddedIngredients[activeCategory].find(i => i.toLowerCase() === trimmed.toLowerCase());
        if (found) actualName = found;
      }

      if (!selectedIngredients.includes(actualName)) {
        onToggleIngredient(actualName);
      }
      setCustomIngredient('');
    }
  };

  // Filter ingredients based on search term
  const allCategoryIngredients = [...CATALOG[activeCategory], ...userAddedIngredients[activeCategory]];
  const filteredIngredients = allCategoryIngredients.filter(ing => 
    ing.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Search and Custom Add */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Malzeme ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
          />
        </div>
        <form onSubmit={handleAddCustom} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Listede yoksa ekle..." 
            value={customIngredient}
            onChange={(e) => setCustomIngredient(e.target.value)}
            className="flex-grow md:w-64 px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={!customIngredient.trim() || disabled}
            className="bg-gray-900 text-white px-4 py-3 rounded-xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Ekle</span>
          </button>
        </form>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {(Object.keys(CATALOG) as IngredientCategory[]).map((cat) => {
          const allCatItems = [...CATALOG[cat], ...userAddedIngredients[cat]];
          const selectedCount = allCatItems.filter(i => selectedIngredients.includes(i)).length;
          const hasSelected = selectedCount > 0;
          return (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            disabled={disabled}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all border-2 ${
              activeCategory === cat
                ? 'bg-white border-brand-500 text-black shadow-sm'
                : hasSelected
                  ? 'bg-brand-50 border-brand-200 text-brand-700'
                  : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <div className={hasSelected && activeCategory !== cat ? 'text-brand-500' : ''}>
              {CATEGORY_ICONS[cat]}
            </div>
            {cat}
            {hasSelected && (
              <span className="ml-1 bg-brand-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {selectedCount}
              </span>
            )}
          </button>
        )})}
      </div>

      {/* Ingredients Grid */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm min-h-[300px]">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          {CATEGORY_ICONS[activeCategory]}
          {activeCategory}
          <span className="text-sm font-normal text-gray-400 ml-auto">
             {allCategoryIngredients.filter(i => selectedIngredients.includes(i)).length} seçildi
          </span>
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredIngredients.map((ingredient) => {
            const isSelected = selectedIngredients.includes(ingredient);
            return (
              <button
                key={ingredient}
                onClick={() => onToggleIngredient(ingredient)}
                disabled={disabled}
                className={`relative px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 text-left flex items-center justify-between group border-2 ${
                  isSelected
                    ? 'bg-gradient-to-br from-brand-500 to-orange-400 border-transparent text-white shadow-lg shadow-brand-500/30 transform scale-[1.03]'
                    : 'bg-white border-gray-100 text-gray-700 hover:border-brand-300 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <span className="truncate mr-2 drop-shadow-sm">
                  {ingredient} {INGREDIENT_EMOJIS[ingredient] && <span className="ml-1">{INGREDIENT_EMOJIS[ingredient]}</span>}
                </span>
                {isSelected && (
                  <div className="bg-white/20 rounded-full p-1 animate-fadeIn">
                    <Check size={14} className="text-white drop-shadow-sm" />
                  </div>
                )}
              </button>
            );
          })}
          {filteredIngredients.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-400">
              Bu kategoride aradığınız malzeme bulunamadı. Yukarıdan ekleyebilirsiniz.
            </div>
          )}
        </div>
      </div>
      
      {/* Selection Summary (Mobile mainly) */}
      {selectedIngredients.length > 0 && (
         <div className="mt-6 p-5 bg-white border border-gray-200 text-gray-800 rounded-3xl flex flex-col gap-3 shadow-sm">
            <div className="w-full flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="text-sm font-medium flex items-center gap-2">
                    <div className="bg-brand-100 text-brand-600 px-2.5 py-1 rounded-lg font-bold">{selectedIngredients.length}</div> 
                    <span>Malzeme Seçildi</span>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                {selectedIngredients.map(ing => (
                    <span 
                      key={ing} 
                      onClick={() => onToggleIngredient(ing)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-xl text-sm border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors group cursor-pointer shadow-sm"
                    >
                        {ing} {INGREDIENT_EMOJIS[ing] || ''}
                        <Plus size={14} className="rotate-45 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </span>
                ))}
            </div>
         </div>
      )}
    </div>
  );
};

export default IngredientSelector;