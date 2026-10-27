export type CharacterGender = 'neutral' | 'boy' | 'girl' | 'villain' | 'shadow_imp' | 'cyber_rebel';

export type HairstyleType = 
  | 'bouncy_bob'
  | 'fluffy_curls'
  | 'high_ponytail'
  | 'spiky_pixie'
  | 'space_buns'
  | 'explorer_cap'
  | 'shaggy_cut'
  | 'anime_spikes'
  | 'dreadlocks_fade'
  | 'demon_horns_hair'
  | 'cyber_mohawk'
  | 'twin_braids'
  | 'afro_puff_crown'
  | 'vampire_slick'
  | 'wizard_long_flow'
  | 'messy_bedhead'
  | 'undercut_quiff'
  | 'wolf_cut'
  | 'cloud_bob';

export type OutfitType = 
  | 'everyday_casual'
  | 'space_astronaut'
  | 'dino_hoodie'
  | 'royal_prince'
  | 'superhero_cape'
  | 'cozy_pajamas'
  | 'dark_lord_cape'
  | 'cyber_shadow'
  | 'vampire_count'
  | 'mischief_ninja'
  | 'fire_demon'
  | 'candy_witch';

export type ShoesType = 
  | 'lightup_sneakers'
  | 'bunny_slippers'
  | 'royal_boots'
  | 'roller_skates'
  | 'shadow_spikes'
  | 'cyber_boots';

export type HeadAccessoryType = 
  | 'none'
  | 'golden_tiara'
  | 'bear_ears'
  | 'dino_spikes'
  | 'party_hat'
  | 'flower_crown'
  | 'demon_horns'
  | 'shadow_halo'
  | 'cyber_visor'
  | 'vampire_bat_ears'
  | 'glitch_crown'
  | 'pirate_eyepatch';

export type GlassesType = 
  | 'none'
  | 'round_frames'
  | 'star_shades'
  | 'cool_sunglasses'
  | 'cyber_monocle'
  | 'villain_goggles';

export type BackItemType = 
  | 'none'
  | 'fairy_wings'
  | 'rocket_jetpack'
  | 'school_backpack'
  | 'hero_cape'
  | 'demon_bat_wings'
  | 'shadow_tentacles'
  | 'cyber_thrusters'
  | 'dark_scythe_holster';

export type HandItemType = 
  | 'none'
  | 'magic_wand'
  | 'teddy_bear'
  | 'swirl_icecream'
  | 'star_balloon'
  | 'dark_magic_orb'
  | 'cyber_laser_blade'
  | 'poison_potion'
  | 'dragon_egg';

export type ExpressionType = 
  | 'happy'
  | 'excited'
  | 'silly'
  | 'cool'
  | 'sleepy'
  | 'wink'
  | 'evil_grin'
  | 'villain_smirk'
  | 'shadow_stare'
  | 'playful_vampire';

export type BackgroundThemeType = 
  | 'sunny_park'
  | 'candyland'
  | 'cosmic_space'
  | 'treehouse'
  | 'pastel_cloud'
  | 'shadow_dungeon'
  | 'cyber_metropolis'
  | 'spooky_graveyard';

export type PoseType = 
  | 'idle'
  | 'wave'
  | 'dance'
  | 'cheer'
  | 'sparkle'
  | 'walk'
  | 'run'
  | 'jump';

export type PersonalityTrait = 
  | 'Adventurous'
  | 'Super Creative'
  | 'Curious Scientist'
  | 'Kind Hearted'
  | 'Playful Dreamer'
  | 'Brave Explorer'
  | 'Master of Shadows'
  | 'Cybernetic Genius'
  | 'Chaos Magician'
  | 'Friendly Villain';

export type LifeDream = 
  | 'Future Astronaut 🚀'
  | 'Dino Explorer 🦖'
  | 'Master Pastry Chef 🧁'
  | 'Magical Wizard 🪄'
  | 'Animal Whisperer 🐾'
  | 'Video Game Creator 🎮'
  | 'Ocean Deep Diver 🐬'
  | 'Ruler of the Shadow Realm 👑'
  | 'Galactic Conqueror 🛸'
  | 'Mad Toy Inventor ⚡'
  | 'Dragon Tamer 🐉';

export type CategoryId = 
  | 'body' 
  | 'hair' 
  | 'outfit' 
  | 'shoes' 
  | 'accessories' 
  | 'mood' 
  | 'theme';

export interface CharacterConfig {
  id: string;
  name: string;
  gender: CharacterGender;
  personality: PersonalityTrait;
  lifeDream: LifeDream;
  
  // Appearance
  skinColor: string;
  eyeColor: string;
  blushEnabled: boolean;
  blushColor: string;
  expression: ExpressionType;
  
  // Hair
  hairstyle: HairstyleType;
  hairColor: string;
  
  // Outfit & Fashion
  outfit: OutfitType;
  outfitPrimaryColor: string;
  outfitSecondaryColor: string;
  shoes: ShoesType;
  shoesColor: string;
  
  // Accessories & Gear
  glasses: GlassesType;
  glassesColor: string;
  headAccessory: HeadAccessoryType;
  headAccessoryColor: string;
  backItem: BackItemType;
  backItemColor: string;
  handItem: HandItemType;
  
  // Stage & Scene
  backgroundTheme: BackgroundThemeType;
  
  // Timestamp
  createdAt?: number;
}
