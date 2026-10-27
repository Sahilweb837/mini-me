import { 
  CharacterConfig, 
  HairstyleType, 
  OutfitType, 
  ShoesType, 
  HeadAccessoryType, 
  GlassesType, 
  BackItemType, 
  HandItemType, 
  ExpressionType, 
  BackgroundThemeType,
  PersonalityTrait,
  LifeDream
} from '../types/character';

export const SKIN_TONES = [
  { id: 'porcelain', name: 'Porcelain', color: '#FFF0E5' },
  { id: 'peach', name: 'Sunny Peach', color: '#FBD3B6' },
  { id: 'warm_beige', name: 'Warm Beige', color: '#F2B988' },
  { id: 'golden_tan', name: 'Golden Tan', color: '#DE9961' },
  { id: 'caramel', name: 'Rich Caramel', color: '#B36D39' },
  { id: 'deep_cocoa', name: 'Deep Cocoa', color: '#6A3B1B' },
  { id: 'fairy_pink', name: 'Fairy Blossom', color: '#FFD1DC' },
  { id: 'star_mint', name: 'Alien Mint', color: '#B4F8C8' },
  { id: 'sky_lavender', name: 'Cosmic Lavender', color: '#E0BBE4' },
];

export const EYE_COLORS = [
  { id: 'ocean_blue', name: 'Ocean Blue', color: '#2563EB' },
  { id: 'emerald_green', name: 'Emerald', color: '#059669' },
  { id: 'chocolate_brown', name: 'Chestnut', color: '#78350F' },
  { id: 'amethyst_purple', name: 'Amethyst', color: '#7C3AED' },
  { id: 'amber_gold', name: 'Amber Glow', color: '#D97706' },
  { id: 'charcoal_black', name: 'Obsidian', color: '#1E293B' },
  { id: 'ruby_red', name: 'Ruby Glow', color: '#DC2626' },
];

export const HAIR_COLORS = [
  { id: 'jet_black', name: 'Midnight', color: '#1E222A' },
  { id: 'chestnut', name: 'Chocolate', color: '#4A2810' },
  { id: 'golden_blonde', name: 'Sunbeam Gold', color: '#FBBF24' },
  { id: 'strawberry_red', name: 'Flame Red', color: '#E11D48' },
  { id: 'bubblegum_pink', name: 'Sweet Pink', color: '#F472B6' },
  { id: 'ocean_cyan', name: 'Ocean Blue', color: '#06B6D4' },
  { id: 'neon_purple', name: 'Magic Violet', color: '#8B5CF6' },
  { id: 'silver_white', name: 'Cloud Silver', color: '#E2E8F0' },
  { id: 'mint_green', name: 'Matcha Green', color: '#10B981' },
];

export const OUTFIT_PALETTES = [
  { name: 'Berry Punch', primary: '#E11D48', secondary: '#FDE047' },
  { name: 'Sky High', primary: '#0284C7', secondary: '#F8FAFC' },
  { name: 'Dino Jungle', primary: '#16A34A', secondary: '#FACC15' },
  { name: 'Cosmic Star', primary: '#6366F1', secondary: '#EC4899' },
  { name: 'Sunny Honey', primary: '#F59E0B', secondary: '#EF4444' },
  { name: 'Bubblegum Fun', primary: '#EC4899', secondary: '#38BDF8' },
  { name: 'Royal Velvet', primary: '#4F46E5', secondary: '#FBBF24' },
  { name: 'Mint Cocoa', primary: '#0D9488', secondary: '#78350F' },
  { name: 'Midnight Hero', primary: '#1E293B', secondary: '#EF4444' },
];

export const PERSONALITY_TRAITS: PersonalityTrait[] = [
  'Adventurous',
  'Super Creative',
  'Curious Scientist',
  'Kind Hearted',
  'Playful Dreamer',
  'Brave Explorer',
];

export const LIFE_DREAMS: LifeDream[] = [
  'Future Astronaut 🚀',
  'Dino Explorer 🦖',
  'Master Pastry Chef 🧁',
  'Magical Wizard 🪄',
  'Animal Whisperer 🐾',
  'Video Game Creator 🎮',
  'Ocean Deep Diver 🐬',
];

export const HAIRSTYLE_OPTIONS: { id: HairstyleType; label: string; icon: string }[] = [
  { id: 'bouncy_bob', label: 'Bouncy Bob', icon: '💇' },
  { id: 'fluffy_curls', label: 'Fluffy Curls', icon: '✨' },
  { id: 'high_ponytail', label: 'High Ponytail', icon: '🎀' },
  { id: 'spiky_pixie', label: 'Spiky Cool', icon: '⭐' },
  { id: 'space_buns', label: 'Space Buns', icon: '🛸' },
  { id: 'explorer_cap', label: 'Adventure Cap', icon: '🧢' },
  { id: 'shaggy_cut', label: 'Shaggy Waves', icon: '🌊' },
];

export const OUTFIT_OPTIONS: { id: OutfitType; label: string; icon: string }[] = [
  { id: 'everyday_casual', label: 'Cool Overalls', icon: '👕' },
  { id: 'space_astronaut', label: 'Astro Suit', icon: '🚀' },
  { id: 'dino_hoodie', label: 'Dino Hoodie', icon: '🦖' },
  { id: 'royal_prince', label: 'Royal Tunic', icon: '👑' },
  { id: 'superhero_cape', label: 'Hero Suit', icon: '⚡' },
  { id: 'cozy_pajamas', label: 'Star Pajamas', icon: '🌙' },
];

export const SHOES_OPTIONS: { id: ShoesType; label: string; icon: string }[] = [
  { id: 'lightup_sneakers', label: 'Light-up Kicks', icon: '👟' },
  { id: 'bunny_slippers', label: 'Bunny Slippers', icon: '🐰' },
  { id: 'royal_boots', label: 'Royal Boots', icon: '👢' },
  { id: 'roller_skates', label: 'Roller Skates', icon: '🛼' },
];

export const HEAD_ACCESSORY_OPTIONS: { id: HeadAccessoryType; label: string; icon: string }[] = [
  { id: 'none', label: 'None', icon: '🚫' },
  { id: 'golden_tiara', label: 'Golden Crown', icon: '👑' },
  { id: 'bear_ears', label: 'Bear Ears', icon: '🐻' },
  { id: 'dino_spikes', label: 'Dino Horns', icon: '🦕' },
  { id: 'party_hat', label: 'Party Cone', icon: '🎉' },
  { id: 'flower_crown', label: 'Blossom Band', icon: '🌸' },
];

export const GLASSES_OPTIONS: { id: GlassesType; label: string; icon: string }[] = [
  { id: 'none', label: 'None', icon: '🚫' },
  { id: 'round_frames', label: 'Round Specs', icon: '👓' },
  { id: 'star_shades', label: 'Star Glasses', icon: '⭐' },
  { id: 'cool_sunglasses', label: 'Cool Shades', icon: '🕶️' },
];

export const BACK_ITEM_OPTIONS: { id: BackItemType; label: string; icon: string }[] = [
  { id: 'none', label: 'None', icon: '🚫' },
  { id: 'fairy_wings', label: 'Fairy Wings', icon: '🧚' },
  { id: 'rocket_jetpack', label: 'Rocket Jetpack', icon: '🚀' },
  { id: 'school_backpack', label: 'Explorer Pack', icon: '🎒' },
  { id: 'hero_cape', label: 'Heroic Cape', icon: '🦸' },
];

export const HAND_ITEM_OPTIONS: { id: HandItemType; label: string; icon: string }[] = [
  { id: 'none', label: 'None', icon: '🚫' },
  { id: 'magic_wand', label: 'Magic Wand', icon: '🪄' },
  { id: 'teddy_bear', label: 'Teddy Bear', icon: '🧸' },
  { id: 'swirl_icecream', label: 'Ice Cream', icon: '🍦' },
  { id: 'star_balloon', label: 'Star Balloon', icon: '🎈' },
];

export const EXPRESSION_OPTIONS: { id: ExpressionType; label: string; icon: string }[] = [
  { id: 'happy', label: 'Cheerful', icon: '😊' },
  { id: 'excited', label: 'Super Excited', icon: '🤩' },
  { id: 'silly', label: 'Cheeky Tongue', icon: '😜' },
  { id: 'cool', label: 'Cool Smile', icon: '😎' },
  { id: 'wink', label: 'Playful Wink', icon: '😉' },
  { id: 'sleepy', label: 'Sleepy Eyes', icon: '😴' },
];

export const THEME_OPTIONS: { id: BackgroundThemeType; label: string; bg: string; icon: string }[] = [
  { id: 'sunny_park', label: 'Sunny Park', bg: '#BEE3F8', icon: '🌳' },
  { id: 'candyland', label: 'Candyland', bg: '#FED7E2', icon: '🍭' },
  { id: 'cosmic_space', label: 'Cosmic Space', bg: '#1E1B4B', icon: '🌌' },
  { id: 'treehouse', label: 'Treehouse', bg: '#FEF08A', icon: '🏡' },
  { id: 'pastel_cloud', label: 'Rainbow Cloud', bg: '#E9D5FF', icon: '🌈' },
];

export const DEFAULT_CHARACTER: CharacterConfig = {
  id: 'character_default',
  name: 'Leo Sparkle',
  gender: 'boy',
  personality: 'Adventurous',
  lifeDream: 'Future Astronaut 🚀',
  skinColor: '#FBD3B6',
  eyeColor: '#2563EB',
  blushEnabled: true,
  blushColor: '#FF6B8B',
  expression: 'happy',
  hairstyle: 'spiky_pixie',
  hairColor: '#4A2810',
  outfit: 'everyday_casual',
  outfitPrimaryColor: '#0284C7',
  outfitSecondaryColor: '#FACC15',
  shoes: 'lightup_sneakers',
  shoesColor: '#EF4444',
  glasses: 'none',
  glassesColor: '#1E293B',
  headAccessory: 'none',
  headAccessoryColor: '#F59E0B',
  backItem: 'school_backpack',
  backItemColor: '#E11D48',
  handItem: 'teddy_bear',
  backgroundTheme: 'sunny_park',
  createdAt: Date.now(),
};

export const CHARACTER_PRESETS: CharacterConfig[] = [
  {
    id: 'preset_astro',
    name: 'Stella Orbit',
    gender: 'girl',
    personality: 'Curious Scientist',
    lifeDream: 'Future Astronaut 🚀',
    skinColor: '#FFF0E5',
    eyeColor: '#7C3AED',
    blushEnabled: true,
    blushColor: '#FF6B8B',
    expression: 'excited',
    hairstyle: 'space_buns',
    hairColor: '#F472B6',
    outfit: 'space_astronaut',
    outfitPrimaryColor: '#F8FAFC',
    outfitSecondaryColor: '#0284C7',
    shoes: 'lightup_sneakers',
    shoesColor: '#06B6D4',
    glasses: 'star_shades',
    glassesColor: '#FBBF24',
    headAccessory: 'none',
    headAccessoryColor: '#FBBF24',
    backItem: 'rocket_jetpack',
    backItemColor: '#EF4444',
    handItem: 'star_balloon',
    backgroundTheme: 'cosmic_space',
  },
  {
    id: 'preset_dino',
    name: 'Rexy Roar',
    gender: 'boy',
    personality: 'Brave Explorer',
    lifeDream: 'Dino Explorer 🦖',
    skinColor: '#F2B988',
    eyeColor: '#059669',
    blushEnabled: true,
    blushColor: '#FF6B8B',
    expression: 'silly',
    hairstyle: 'explorer_cap',
    hairColor: '#1E222A',
    outfit: 'dino_hoodie',
    outfitPrimaryColor: '#16A34A',
    outfitSecondaryColor: '#FACC15',
    shoes: 'lightup_sneakers',
    shoesColor: '#16A34A',
    glasses: 'none',
    glassesColor: '#1E293B',
    headAccessory: 'dino_spikes',
    headAccessoryColor: '#F59E0B',
    backItem: 'school_backpack',
    backItemColor: '#D97706',
    handItem: 'none',
    backgroundTheme: 'sunny_park',
  },
  {
    id: 'preset_princess',
    name: 'Princess Aurelia',
    gender: 'girl',
    personality: 'Kind Hearted',
    lifeDream: 'Magical Wizard 🪄',
    skinColor: '#DE9961',
    eyeColor: '#D97706',
    blushEnabled: true,
    blushColor: '#FF6B8B',
    expression: 'wink',
    hairstyle: 'high_ponytail',
    hairColor: '#FBBF24',
    outfit: 'royal_prince',
    outfitPrimaryColor: '#4F46E5',
    outfitSecondaryColor: '#FBBF24',
    shoes: 'royal_boots',
    shoesColor: '#78350F',
    glasses: 'none',
    glassesColor: '#1E293B',
    headAccessory: 'golden_tiara',
    headAccessoryColor: '#FBBF24',
    backItem: 'fairy_wings',
    backItemColor: '#E0BBE4',
    handItem: 'magic_wand',
    backgroundTheme: 'candyland',
  },
  {
    id: 'preset_cozy',
    name: 'Pip Sleepyhead',
    gender: 'neutral',
    personality: 'Playful Dreamer',
    lifeDream: 'Animal Whisperer 🐾',
    skinColor: '#6A3B1B',
    eyeColor: '#2563EB',
    blushEnabled: true,
    blushColor: '#FF6B8B',
    expression: 'sleepy',
    hairstyle: 'fluffy_curls',
    hairColor: '#1E222A',
    outfit: 'cozy_pajamas',
    outfitPrimaryColor: '#6366F1',
    outfitSecondaryColor: '#FDE047',
    shoes: 'bunny_slippers',
    shoesColor: '#FFD1DC',
    glasses: 'round_frames',
    glassesColor: '#3B82F6',
    headAccessory: 'bear_ears',
    headAccessoryColor: '#78350F',
    backItem: 'none',
    backItemColor: '#FFFFFF',
    handItem: 'teddy_bear',
    backgroundTheme: 'pastel_cloud',
  },
];
