export type Game = {
  id: string; title: string; genre: string; price: number; description: string;
  cover: string; accent: string; tagline: string; trailer: string; demo: boolean; featured?: boolean
}
export const initialGames: Game[] = [
  { id:'evo', title:'EVO RACING', genre:'Racing', price:29.99, description:'Own the night. Tune your machine, master impossible corners and race through a city that never slows down.', cover:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1000&q=85', accent:'#e9a64b', tagline:'THE CITY IS YOUR CIRCUIT', trailer:'', demo:true, featured:true },
  { id:'shadow', title:'SHADOW PROTOCOL', genre:'Action', price:49.99, description:'In a city built on secrets, information is the ultimate weapon. Infiltrate, adapt and uncover the signal.', cover:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1000&q=85', accent:'#b58cff', tagline:'TRUST NO SIGNAL', trailer:'', demo:false },
  { id:'kingdoms', title:'KINGDOMS', genre:'Strategy', price:24.99, description:'Build an empire from a forgotten outpost. Shape alliances, manage resources and write your own history.', cover:'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&q=85', accent:'#d8bd77', tagline:'A KINGDOM IS EARNED', trailer:'', demo:false },
  { id:'space', title:'DEEP SPACE', genre:'Sci-Fi', price:39.99, description:'A mysterious transmission pulls your crew beyond mapped space. The further you travel, the stranger it gets.', cover:'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1000&q=85', accent:'#72c8e8', tagline:'BEYOND THE KNOWN', trailer:'', demo:false },
  { id:'pixel', title:'PIXEL WORLDS', genre:'Sandbox', price:19.99, description:'A limitless creative universe. Gather, build, explore and invite friends into worlds only you can imagine.', cover:'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=85', accent:'#77d6a1', tagline:'MAKE YOUR OWN WORLD', trailer:'', demo:true },
  { id:'night', title:'NIGHTFALL', genre:'Adventure', price:34.99, description:'Follow the last lantern through a world caught between dusk and dawn. Every path has a story.', cover:'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1000&q=85', accent:'#df8b82', tagline:'WHEN THE LIGHT FADES', trailer:'', demo:false }
]
export const money = (n:number) => `€${n.toFixed(2)}`
