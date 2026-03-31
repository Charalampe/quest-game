/**
 * NPC visual definitions. Each entry defines a sprite type's appearance.
 * - `file`: optional PIPOYA sprite sheet filename (32x48, 3 frames × 4 dirs)
 * - Color fields are used for procedural fallback when file isn't available
 * - `spirit_fox` and `ghost` always use procedural rendering (supernatural)
 */
export const NPC_DEFS = [
    { name: 'librarian', file: 'npc_librarian.png', hair: '#444444', hairHi: '#5a5a5a', shirt: '#2ecc71', shirtShadow: '#22a85c', pants: '#27ae60', pantsDark: '#1e8c4d', skin: '#FDBCB4', accessory: 'glasses_vest' },
    { name: 'curator', file: 'npc_curator.png', hair: '#d4a574', hairHi: '#e0b88a', shirt: '#3498db', shirtShadow: '#2a7ab8', pants: '#2980b9', pantsDark: '#20669a', skin: '#FDBCB4', accessory: 'necklace_blazer' },
    { name: 'merchant', file: 'npc_merchant.png', hair: '#1a1a1a', hairHi: '#333333', shirt: '#e67e22', shirtShadow: '#c76a1c', pants: '#d35400', pantsDark: '#a84300', skin: '#D4A574', accessory: 'apron_mustache' },
    { name: 'guide', file: 'npc_guide.png', hair: '#c0392b', hairHi: '#d44535', shirt: '#f1c40f', shirtShadow: '#d4ac0d', pants: '#f39c12', pantsDark: '#d4850f', skin: '#FDBCB4', accessory: 'ponytail_scarf' },
    { name: 'gardener', file: 'npc_gardener.png', hair: '#2c3e50', hairHi: '#3a5068', shirt: '#1abc9c', shirtShadow: '#149c81', pants: '#16a085', pantsDark: '#128570', skin: '#D4A574', accessory: 'hat_apron' },
    { name: 'grandma', file: 'npc_grandma.png', hair: '#bdc3c7', hairHi: '#d5dade', shirt: '#9b59b6', shirtShadow: '#824a99', pants: '#8e44ad', pantsDark: '#763891', skin: '#F0C8B0', accessory: 'shawl_bun' },
    // Paris NPCs
    { name: 'artist', file: 'npc_artist.png', hair: '#6B4226', hairHi: '#7B5236', shirt: '#3498db', shirtShadow: '#2a7ab8', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#FDBCB4', accessory: 'hat_apron' },
    { name: 'flower_seller', file: 'npc_flower_seller.png', hair: '#F0D58C', hairHi: '#F5E0A0', shirt: '#27ae60', shirtShadow: '#1e8c4d', pants: '#2ecc71', pantsDark: '#22a85c', skin: '#FDBCB4', accessory: 'hat_apron' },
    { name: 'tourist', file: 'npc_tourist.png', hair: '#A0612B', hairHi: '#B07838', shirt: '#e74c3c', shirtShadow: '#c0392b', pants: '#d4a574', pantsDark: '#b8895e', skin: '#FDBCB4', accessory: 'ponytail_scarf' },
    { name: 'attendant', file: 'npc_attendant.png', hair: '#1a1a1a', hairHi: '#333333', shirt: '#c0392b', shirtShadow: '#a93226', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#FDBCB4', accessory: 'glasses_vest' },
    { name: 'photographer', file: 'npc_photographer.png', hair: '#1a1a1a', hairHi: '#333333', shirt: '#8e44ad', shirtShadow: '#763891', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#FDBCB4', accessory: 'ponytail_scarf' },
    // London NPCs
    { name: 'policeman', file: 'npc_policeman.png', hair: '#1a1a1a', hairHi: '#333333', shirt: '#2c3e80', shirtShadow: '#1a2d6b', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#FDBCB4', accessory: 'glasses_vest' },
    { name: 'professor', file: 'npc_professor.png', hair: '#95a5a6', hairHi: '#aab5b6', shirt: '#8B6914', shirtShadow: '#7B5904', pants: '#6B5420', pantsDark: '#5B4410', skin: '#FDBCB4', accessory: 'glasses_vest' },
    { name: 'schoolkid', file: 'npc_schoolkid.png', hair: '#A0612B', hairHi: '#B07838', shirt: '#2c3e80', shirtShadow: '#1a2d6b', pants: '#34495e', pantsDark: '#2c3e50', skin: '#FDBCB4', accessory: 'necklace_blazer' },
    { name: 'clerk', file: 'npc_clerk.png', hair: '#c0392b', hairHi: '#d44535', shirt: '#1abc9c', shirtShadow: '#149c81', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#FDBCB4', accessory: 'necklace_blazer' },
    // Rome NPCs
    { name: 'gelato', file: 'npc_gelato.png', hair: '#1a1a1a', hairHi: '#333333', shirt: '#ecf0f1', shirtShadow: '#bdc3c7', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#D4A574', accessory: 'apron_mustache' },
    { name: 'musician', file: 'npc_musician.png', hair: '#6B4226', hairHi: '#7B5236', shirt: '#ecf0f1', shirtShadow: '#bdc3c7', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#FDBCB4', accessory: 'ponytail_scarf' },
    { name: 'tour_guide', file: 'npc_tour_guide.png', hair: '#6B4226', hairHi: '#7B5236', shirt: '#f1c40f', shirtShadow: '#d4ac0d', pants: '#34495e', pantsDark: '#2c3e50', skin: '#FDBCB4', accessory: 'ponytail_scarf' },
    { name: 'cat_lady', file: 'npc_cat_lady.png', hair: '#95a5a6', hairHi: '#aab5b6', shirt: '#8e44ad', shirtShadow: '#763891', pants: '#6c3483', pantsDark: '#5b2c6f', skin: '#F0C8B0', accessory: 'shawl_bun' },
    // Marrakech NPCs
    { name: 'spice_merchant', file: 'npc_spice_merchant.png', hair: '#1a1a1a', hairHi: '#333333', shirt: '#e67e22', shirtShadow: '#c76a1c', pants: '#d35400', pantsDark: '#a84300', skin: '#D4A574', accessory: 'apron_mustache' },
    { name: 'storyteller', file: 'npc_storyteller.png', hair: '#ecf0f1', hairHi: '#ffffff', shirt: '#f5f5dc', shirtShadow: '#ddd8c0', pants: '#c8b88a', pantsDark: '#a09070', skin: '#D4A574', accessory: 'shawl_bun' },
    { name: 'carpet_merchant', file: 'npc_carpet_merchant.png', hair: '#1a1a1a', hairHi: '#333333', shirt: '#c0392b', shirtShadow: '#a93226', pants: '#8B6914', pantsDark: '#7B5904', skin: '#D4A574', accessory: 'glasses_vest' },
    { name: 'riad_keeper', file: 'npc_riad_keeper.png', hair: '#1a1a1a', hairHi: '#333333', shirt: '#16a085', shirtShadow: '#128570', pants: '#1abc9c', pantsDark: '#149c81', skin: '#D4A574', accessory: 'shawl_bun' },
    { name: 'desert_guide', file: 'npc_desert_guide.png', hair: '#1a1a1a', hairHi: '#333333', shirt: '#d4a574', shirtShadow: '#b8895e', pants: '#8B6914', pantsDark: '#7B5904', skin: '#D4A574', accessory: 'ponytail_scarf' },
    // Tokyo NPCs
    { name: 'ramen_chef', file: 'npc_ramen_chef.png', hair: '#1a1a1a', hairHi: '#333333', shirt: '#ecf0f1', shirtShadow: '#bdc3c7', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#F0C8B0', accessory: 'hat_apron' },
    { name: 'manga_artist', file: 'npc_manga_artist.png', hair: '#e84393', hairHi: '#f06aae', shirt: '#9b59b6', shirtShadow: '#824a99', pants: '#2c3e50', pantsDark: '#1a252f', skin: '#F0C8B0', accessory: 'ponytail_scarf' },
    { name: 'shrine_keeper', file: 'npc_shrine_keeper.png', hair: '#95a5a6', hairHi: '#aab5b6', shirt: '#ecf0f1', shirtShadow: '#bdc3c7', pants: '#c0392b', pantsDark: '#a93226', skin: '#F0C8B0', accessory: 'shawl_bun' },
    { name: 'spirit_fox', hair: '#e67e22', hairHi: '#f39c12', shirt: '#f39c12', shirtShadow: '#d4850f', pants: '#ecf0f1', pantsDark: '#bdc3c7', skin: '#f5f5dc', accessory: 'ponytail_scarf' },
    { name: 'ghost', hair: '#d7bde2', hairHi: '#e8d5f5', shirt: '#c39bd3', shirtShadow: '#a87bbf', pants: '#d7bde2', pantsDark: '#c39bd3', skin: '#e8d5f5', accessory: 'shawl_bun' }
];
