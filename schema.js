/**
 * Flower Language Database Schema & Initial Data
 * Purpose: Complete data model for emotion tracking platform
 * Version: 1.0.0
 */

// ============================================
// DATABASE SCHEMA DESIGN
// ============================================

const DatabaseSchema = {
  // User Table - Regular Users
  users: {
    userId: "UUID (Primary Key)",
    username: "String (Unique)",
    email: "String (Unique)",
    passwordHash: "String (Bcrypt hashed, never stored plain)",
    createdAt: "DateTime",
    updatedAt: "DateTime",
    totalPoints: "Integer (Default: 0)",
    totalDiaries: "Integer (Default: 0)",
    avatarFlower: "Foreign Key -> flowers.flowerId",
    isActive: "Boolean (Default: true)"
  },

  // Admin Table - Administrator Users
  admins: {
    adminId: "UUID (Primary Key)",
    username: "String (Unique)",
    email: "String (Unique)",
    passwordHash: "String",
    role: "Enum (SUPER_ADMIN, CONTENT_ADMIN, COMMUNITY_ADMIN)",
    createdAt: "DateTime",
    lastLogin: "DateTime",
    permissions: "JSON Array of permission strings"
  },

  // Flowers Table - Flower Catalog
  flowers: {
    flowerId: "UUID (Primary Key)",
    flowerName: "String (Unique)",
    chineseName: "String",
    flowerLanguage: "String (Main emotion/meaning)",
    emotionTags: "JSON Array (e.g., ['peaceful', 'joyful', 'brave'])",
    valenceScore: "Float (-1 to 1, Russell X-axis: negative to positive)",
    arousalScore: "Float (-1 to 1, Russell Y-axis: low to high energy)",
    description: "Text (Story/background of flower)",
    imageUrl: "String (URI to flower image)",
    symbolism: "Text (Cultural significance)",
    createdBy: "Foreign Key -> admins.adminId",
    createdAt: "DateTime",
    updatedAt: "DateTime",
    isActive: "Boolean (Default: true)"
  },

  // Diaries Table - User Journals
  diaries: {
    diaryId: "UUID (Primary Key)",
    userId: "Foreign Key -> users.userId",
    title: "String (Optional)",
    content: "Text (Long-form journal entry)",
    selectedFlower: "Foreign Key -> flowers.flowerId",
    userValence: "Float (User-selected X value)",
    userArousal: "Float (User-selected Y value)",
    backgroundTheme: "String (CSS class name for background)",
    decorations: "JSON Array (Sticker placements: {x, y, stickerType})",
    isPublished: "Boolean (Published to public forum or private)",
    createdAt: "DateTime",
    updatedAt: "DateTime",
    viewCount: "Integer (Default: 0)"
  },

  // ShopItems Table - Purchasable Products
  shopItems: {
    itemId: "UUID (Primary Key)",
    itemName: "String",
    category: "Enum (BACKGROUND, STICKER, BGM, FRAME, OTHER)",
    description: "Text",
    pointsCost: "Integer (Price in flower points)",
    previewUrl: "String (Image/preview URI)",
    cssClass: "String (CSS class for applying effect)",
    quantity: "Integer (Stock, -1 = unlimited)",
    createdBy: "Foreign Key -> admins.adminId",
    createdAt: "DateTime",
    isActive: "Boolean (Default: true)",
    isLimitedTime: "Boolean",
    expiresAt: "DateTime (Optional, for limited items)"
  },

  // Orders Table - Purchase History
  orders: {
    orderId: "UUID (Primary Key)",
    userId: "Foreign Key -> users.userId",
    itemId: "Foreign Key -> shopItems.itemId",
    pointsSpent: "Integer",
    purchasedAt: "DateTime",
    isRedeemed: "Boolean (Default: true)"
  },

  // Posts Table - Anonymous Public Posts
  posts: {
    postId: "UUID (Primary Key)",
    userId: "Foreign Key -> users.userId",
    anonymousName: "String (e.g., 'Sunflower #083')",
    selectedFlower: "Foreign Key -> flowers.flowerId",
    content: "Text (Diary excerpt or new content)",
    createdAt: "DateTime",
    isVisible: "Boolean (Default: true)",
    flaggedCount: "Integer (Moderation flag count)",
    reportReasons: "JSON Array"
  },

  // Reactions Table - Community Interactions
  reactions: {
    reactionId: "UUID (Primary Key)",
    postId: "Foreign Key -> posts.postId",
    userId: "Foreign Key -> users.userId",
    reactionType: "Enum (HUG, FLOWER, EMPATHY)",
    createdAt: "DateTime"
  },

  // UserInventory Table - Purchased Items
  userInventory: {
    inventoryId: "UUID (Primary Key)",
    userId: "Foreign Key -> users.userId",
    itemId: "Foreign Key -> shopItems.itemId",
    quantity: "Integer (Default: 1)",
    acquiredAt: "DateTime",
    isEquipped: "Boolean (For active background/theme)"
  }
};

// ============================================
// INITIAL FLOWER DATA (50+ Species)
// Russell Circumplex Model Coordinates
// Valence: -1 (negative) to +1 (positive)
// Arousal: -1 (low energy) to +1 (high energy)
// ============================================

const initialFlowers = [
  // Peaceful & Low-Energy (Bottom-Left Quadrant)
  {
    id: "f001",
    name: "Lavender",
    chineseName: "薰衣草",
    language: "Serenity, Calmness, Silence",
    tags: ["peaceful", "calm", "meditative"],
    valence: 0.3,
    arousal: -0.7,
    description: "The purple meadows whisper secrets of tranquility. Lavender teaches us that peace isn't absence of chaos, but presence of mind.",
    symbol: "Widely used in aromatherapy for anxiety relief and sleep improvement",
    color: "#B19CD9"
  },
  {
    id: "f002",
    name: "Chamomile",
    chineseName: "洋甘菊",
    language: "Patience, Healing, Gentleness",
    tags: ["calm", "soothing", "healing"],
    valence: 0.4,
    arousal: -0.8,
    description: "A humble flower that brews comfort in hot water. Chamomile reminds us that the most powerful remedies are often the simplest.",
    symbol: "Traditional herbal medicine for insomnia and digestive peace",
    color: "#FFE4B5"
  },
  {
    id: "f003",
    name: "Water Lily",
    chineseName: "睡蓮",
    language: "Purity, Rebirth, Enlightenment",
    tags: ["peaceful", "spiritual", "pure"],
    valence: 0.5,
    arousal: -0.6,
    description: "Floating on still waters, the water lily rises untouched by the mud below. It symbolizes spiritual awakening through stillness.",
    symbol: "Central to Buddhist and Hindu spiritual traditions",
    color: "#E0FFFF"
  },
  {
    id: "f004",
    name: "Forget-Me-Not",
    chineseName: "勿忘草",
    language: "Remembrance, Faithfulness, Humility",
    tags: ["gentle", "loyal", "nostalgic"],
    valence: 0.2,
    arousal: -0.5,
    description: "Tiny flowers that carry enormous emotional weight. They whisper: 'I will remember, even if the world forgets.'",
    symbol: "Symbol of loyalty and enduring love across cultures",
    color: "#6495ED"
  },
  {
    id: "f005",
    name: "Sage Flower",
    chineseName: "鼠尾草",
    language: "Wisdom, Contemplation, Clarity",
    tags: ["thoughtful", "wise", "meditative"],
    valence: 0.3,
    arousal: -0.6,
    description: "Purple spikes rising from green wisdom. Sage has been burned ceremonially for thousands of years to clear mind and space.",
    symbol: "Used in smudging rituals and herbal medicine across cultures",
    color: "#9370DB"
  },

  // Happy & High-Energy (Top-Right Quadrant)
  {
    id: "f006",
    name: "Sunflower",
    chineseName: "向日葵",
    language: "Joy, Loyalty, Longevity, Happiness",
    tags: ["happy", "energetic", "warm", "positive"],
    valence: 0.95,
    arousal: 0.85,
    description: "The eternal optimist. Sunflowers always face the light, teaching us that even on dark days, we should seek brightness.",
    symbol: "Van Gogh's most famous subject; sunflowers represent the artist's hope and resilience",
    color: "#FFD700"
  },
  {
    id: "f007",
    name: "Marigold",
    chineseName: "金盞花",
    language: "Passion, Creativity, Warmth",
    tags: ["energetic", "creative", "warm", "joyful"],
    valence: 0.85,
    arousal: 0.75,
    description: "Fiery orange petals that seem to glow from within. Marigolds represent the creative fire that burns bright in artists.",
    symbol: "Used in Hindu rituals and Day of the Dead celebrations across Mexico",
    color: "#FF8C00"
  },
  {
    id: "f008",
    name: "Gerbera Daisy",
    chineseName: "非洲菊",
    language: "Cheerfulness, Innocence, Purity",
    tags: ["cheerful", "innocent", "bright", "positive"],
    valence: 0.9,
    arousal: 0.8,
    description: "Available in every color imaginable, Gerberas celebrate diversity and the beauty of standing out.",
    symbol: "Often given to celebrate achievements and new beginnings",
    color: "#FF69B4"
  },
  {
    id: "f009",
    name: "Cosmos",
    chineseName: "波斯菊",
    language: "Harmony, Peace, Modesty, Joy",
    tags: ["harmonious", "joyful", "balanced", "peaceful"],
    valence: 0.8,
    arousal: 0.6,
    description: "Named after the Greek word for 'order' and 'harmony,' Cosmos flowers bring balanced joy to gardens.",
    symbol: "Represents the order and beauty within the universe (cosmos)",
    color: "#FF1493"
  },
  {
    id: "f010",
    name: "Tulip (Red)",
    chineseName: "紅鬱金香",
    language: "Deep Love, Perfect Love, Passion",
    tags: ["passionate", "energetic", "love", "confident"],
    valence: 0.8,
    arousal: 0.7,
    description: "Deep crimson petals that speak of intense emotion. Red tulips burn with passion and confidence.",
    symbol: "Represents deep, true love and admiration",
    color: "#DC143C"
  },

  // Positive & Calm (Top-Left Quadrant)
  {
    id: "f011",
    name: "Rose (Pink)",
    chineseName: "粉紅玫瑰",
    language: "Gratitude, Admiration, Affection, Gentleness",
    tags: ["loving", "grateful", "gentle", "positive"],
    valence: 0.75,
    arousal: 0.2,
    description: "The queen of flowers. Pink roses express gratitude and admiration without overwhelming passion.",
    symbol: "Universal symbol of love, refined and elegant",
    color: "#FFB6C1"
  },
  {
    id: "f012",
    name: "Peony",
    chineseName: "牡丹",
    language: "Romance, Prosperity, Beauty, Healing",
    tags: ["romantic", "beautiful", "healing", "prosperous"],
    valence: 0.7,
    arousal: 0.3,
    description: "Lush, full blooms that take years to mature. Peonies teach patience and the beauty of delayed gratification.",
    symbol: "Symbol of wealth, prosperity, and healing in Eastern cultures",
    color: "#FFB6D9"
  },
  {
    id: "f013",
    name: "Camellia",
    chineseName: "山茶花",
    language: "Admiration, Perfection, Gratitude, Longing",
    tags: ["admiring", "perfect", "graceful", "positive"],
    valence: 0.65,
    arousal: 0.25,
    description: "Blooms in winter when few others do. Camellias represent the beauty and strength of perseverance.",
    symbol: "Valued for centuries in East Asian gardens for elegance and resilience",
    color: "#FF69B4"
  },
  {
    id: "f014",
    name: "Jasmine",
    chineseName: "茉莉花",
    language: "Grace, Elegance, Sweetness, Modesty",
    tags: ["graceful", "sweet", "elegant", "gentle"],
    valence: 0.7,
    arousal: 0.15,
    description: "Night-blooming flowers with intoxicating fragrance. Jasmine represents understated beauty and quiet confidence.",
    symbol: "National flower of several countries; used in traditional medicine for anxiety",
    color: "#FFFACD"
  },
  {
    id: "f015",
    name: "Hydrangea",
    chineseName: "繡球花",
    language: "Gratitude, Grace, Abundance, Understanding",
    tags: ["grateful", "abundant", "harmonious", "positive"],
    valence: 0.72,
    arousal: 0.3,
    description: "Massive blooms made of hundreds of tiny flowers clustered together. Hydrangeas celebrate community and abundance.",
    symbol: "Represents gratitude in Japanese culture; color changes with soil pH",
    color: "#87CEEB"
  },

  // Sad & Low-Energy (Bottom-Left Quadrant)
  {
    id: "f016",
    name: "Black Rose",
    chineseName: "黑玫瑰",
    language: "Loss, Deep Sorrow, Farewell, Rebirth",
    tags: ["mournful", "reflective", "grief", "dark"],
    valence: -0.7,
    arousal: -0.5,
    description: "Dark as midnight, these roses don't deny pain but transform it into art. They whisper: 'Even in darkness, there is beauty.'",
    symbol: "Represents deep loss, but also transformation and the acceptance of change",
    color: "#000000"
  },
  {
    id: "f017",
    name: "Cypress",
    chineseName: "柏樹花",
    language: "Sorrow, Mourning, Despair, Eternity",
    tags: ["mournful", "eternal", "sorrowful", "dark"],
    valence: -0.6,
    arousal: -0.7,
    description: "Tall, dark, and evergreen. Cypress trees have guarded cemeteries and temples for millennia.",
    symbol: "Symbol of mourning and eternal rest in Western and Eastern cultures",
    color: "#2F4F4F"
  },
  {
    id: "f018",
    name: "Iris (Purple)",
    chineseName: "紫鳶尾",
    language: "Sorrow, Despair, Wisdom, Valor",
    tags: ["contemplative", "sorrowful", "wise", "introspective"],
    valence: -0.2,
    arousal: -0.4,
    description: "Van Gogh painted irises during his struggle with mental illness. They symbolize the raw beauty in pain and introspection.",
    symbol: "Often given to express despair, but also associated with resilience",
    color: "#9370DB"
  },
  {
    id: "f019",
    name: "Broken Heart Flower",
    chineseName: "斷腸花",
    language: "Heartbreak, Sorrow, Loss, Longing",
    tags: ["heartbroken", "sorrowful", "melancholic", "longing"],
    valence: -0.75,
    arousal: -0.3,
    description: "Legend has it these flowers bloom where tears of unrequited love have fallen. They validate deep emotional pain.",
    symbol: "Represents the ache of missing someone deeply",
    color: "#8B0000"
  },
  {
    id: "f020",
    name: "Thistle",
    chineseName: "薊花",
    language: "Defiance, Sorrow, Protection, Nobility",
    tags: ["defiant", "prickly", "protective", "sorrowful"],
    valence: -0.4,
    arousal: -0.3,
    description: "Prickly flowers that grow in harsh conditions. Thistles represent the nobility of surviving hardship.",
    symbol: "National emblem of Scotland; represents protection and defiance",
    color: "#9932CC"
  },

  // Anxious & High-Energy (Top-Right, but negative/anxious)
  {
    id: "f021",
    name: "Buttercup",
    chineseName: "毛茛",
    language: "Cheerfulness, Happiness, Childishness, but also Desire",
    tags: ["bright", "anxious", "energetic", "youthful"],
    valence: 0.5,
    arousal: 0.65,
    description: "Shiny, simple, joyful—but also can represent unfulfilled yearning for childhood innocence.",
    symbol: "Represents 'do you like butter?' - a child's game, innocent yet insistent",
    color: "#FFD700"
  },
  {
    id: "f022",
    name: "Ranunculus",
    chineseName: "毛茛屬",
    language: "Charm, Attraction, Radiance, but also Uncertainty",
    tags: ["radiant", "charming", "energetic", "vibrant"],
    valence: 0.6,
    arousal: 0.7,
    description: "Layered petals of intense color. Ranunculus can represent both the radiance of attraction and the anxiety of being seen.",
    symbol: "Used to represent charm and attraction in Victorian flower language",
    color: "#FF6347"
  },

  // Angry & High-Energy
  {
    id: "f023",
    name: "Red Carnation",
    chineseName: "紅康乃馨",
    language: "Strength, Energy, Admiration, but also Anger",
    tags: ["strong", "energetic", "passionate", "powerful"],
    valence: 0.4,
    arousal: 0.8,
    description: "Bold, unflinching red. Red carnations speak of strength, resolve, and the power to take action.",
    symbol: "Used to represent strength, sacrifice, and admiration",
    color: "#DC143C"
  },
  {
    id: "f024",
    name: "Ginger Flower",
    chineseName: "薑花",
    language: "Strength, Passion, Resilience, Fire",
    tags: ["passionate", "strong", "fiery", "energetic"],
    valence: 0.5,
    arousal: 0.85,
    description: "Spicy fragrance and bold form. Ginger flowers represent the heat of passion and the strength to overcome.",
    symbol: "Used in traditional medicine for inflammation and pain relief",
    color: "#FF8C00"
  },

  // Hopeful & Moderate Energy (Right side, positive)
  {
    id: "f025",
    name: "Daffodil",
    chineseName: "水仙花",
    language: "Hope, New Beginnings, Prosperity, Resilience",
    tags: ["hopeful", "optimistic", "brave", "new-beginning"],
    valence: 0.85,
    arousal: 0.55,
    description: "First flower of spring, bright yellow face turned toward the sun. Daffodils embody hope and renewal.",
    symbol: "Represents resilience and the triumph of spring over winter",
    color: "#FFD700"
  },
  {
    id: "f026",
    name: "Iris (Yellow)",
    chineseName: "黃鳶尾",
    language: "Valor, Wisdom, Courage, Hope",
    tags: ["brave", "wise", "hopeful", "courageous"],
    valence: 0.75,
    arousal: 0.5,
    description: "Golden and proud, yellow irises represent the courage to be yourself and face challenges.",
    symbol: "Represents protection and valor in heraldry across Europe",
    color: "#FFD700"
  },
  {
    id: "f027",
    name: "Lily (White)",
    chineseName: "白合",
    language: "Purity, Rebirth, Hope, Spirituality",
    tags: ["pure", "spiritual", "hopeful", "innocent"],
    valence: 0.7,
    arousal: 0.3,
    description: "Virgin white petals opening toward light. White lilies represent the soul's journey toward hope and transcendence.",
    symbol: "Considered the most spiritually significant flower across many religions",
    color: "#FFFFFF"
  },
  {
    id: "f028",
    name: "Butterfly Orchid",
    chineseName: "蝴蝶蘭",
    language: "Transformation, Beauty, Resilience, Hope",
    tags: ["beautiful", "transformative", "hopeful", "graceful"],
    valence: 0.8,
    arousal: 0.5,
    description: "Delicate yet resilient, orchids transform humble roots into exquisite blooms. They remind us that beauty emerges from struggle.",
    symbol: "Represents refinement, strength, and transformation",
    color: "#FFB6D9"
  },
  {
    id: "f029",
    name: "Tulip (Yellow)",
    chineseName: "黃鬱金香",
    language: "Cheerfulness, Playfulness, Positive Energy",
    tags: ["cheerful", "playful", "optimistic", "energetic"],
    valence: 0.85,
    arousal: 0.65,
    description: "Golden yellow petals that dance in the breeze. Yellow tulips spread pure joy and positive vibrations.",
    symbol: "Represents perfect love, cheerfulness, and optimism",
    color: "#FFD700"
  },
  {
    id: "f030",
    name: "Poppy (Red)",
    chineseName: "紅罌粟",
    language: "Pleasure, Imagination, Determination, but also Danger",
    tags: ["passionate", "imaginative", "intense", "brave"],
    valence: 0.5,
    arousal: 0.75,
    description: "Bright petals that seem to shimmer with inner fire. Poppies represent both the pleasure and peril of living fully.",
    symbol: "Used to represent both comfort and danger in literature and art",
    color: "#FF0000"
  },

  // Thoughtful & Moderate (Left-middle)
  {
    id: "f031",
    name: "Pansy",
    chineseName: "三色堇",
    language: "Thinking of You, Memories, Tender Emotions",
    tags: ["thoughtful", "gentle", "nostalgic", "reflective"],
    valence: 0.3,
    arousal: 0.2,
    description: "Velvety petals with 'faces' that seem to gaze into your soul. Pansies represent quiet contemplation and tender memories.",
    symbol: "Victorian symbol of loving thoughts and deep affection",
    color: "#9932CC"
  },
  {
    id: "f032",
    name: "Violet",
    chineseName: "紫羅蘭",
    language: "Modesty, Virtue, Faithfulness, Affection",
    tags: ["modest", "faithful", "tender", "gentle"],
    valence: 0.4,
    arousal: 0.15,
    description: "Humble and hidden, violets bloom in secret corners. They teach that true beauty doesn't demand attention.",
    symbol: "Victorian symbol of faithfulness and modesty",
    color: "#8B00FF"
  },
  {
    id: "f033",
    name: "Morning Glory",
    chineseName: "牽牛花",
    language: "Affection, Mortality, Transience, the Fragility of Life",
    tags: ["tender", "reflective", "bittersweet", "transient"],
    valence: 0.3,
    arousal: 0.4,
    description: "Beautiful for only one day, morning glories remind us to cherish each moment. They represent the bittersweet nature of life.",
    symbol: "In Japanese tradition, symbolizes the transience and fragility of life",
    color: "#4169E1"
  },
  {
    id: "f034",
    name: "Snowdrop",
    chineseName: "雪花蓮",
    language: "Hope, Consolation, Resurrection, Perseverance",
    tags: ["hopeful", "persevering", "gentle", "resilient"],
    valence: 0.45,
    arousal: -0.2,
    description: "First delicate white flowers pushing through snow. Snowdrops promise that spring always comes after winter.",
    symbol: "Symbol of resilience, consolation, and hope in the darkest times",
    color: "#FFFFFF"
  },
  {
    id: "f035",
    name: "Freesia",
    chineseName: "小蒼蘭",
    language: "Innocence, Cheerfulness, Friendship, Trust",
    tags: ["innocent", "cheerful", "friendly", "trustworthy"],
    valence: 0.65,
    arousal: 0.35,
    description: "Delicate and fragrant, Freesias represent the simple joy of true friendship and genuine connection.",
    symbol: "Given to express friendship, trust, and innocent joy",
    color: "#FFD700"
  },

  // Additional varieties to reach 50+
  {
    id: "f036",
    name: "Chrysanthemum",
    chineseName: "菊花",
    language: "Joy, Optimism, Longevity, Cheerfulness",
    tags: ["joyful", "optimistic", "eternal", "cheerful"],
    valence: 0.75,
    arousal: 0.4,
    description: "Symbol of happiness in Eastern cultures. Chrysanthemums bloom in autumn, bringing color when nature begins to fade.",
    symbol: "National flower of Japan; represents joy, longevity, and friendship",
    color: "#FFD700"
  },
  {
    id: "f037",
    name: "Cherry Blossom",
    chineseName: "櫻花",
    language: "Beauty, Transience, Renewal, Life Cycle",
    tags: ["beautiful", "transient", "hopeful", "poetic"],
    valence: 0.7,
    arousal: 0.5,
    description: "Blooms for mere weeks, celebrated worldwide. Cherry blossoms teach that beauty is precious precisely because it's fleeting.",
    symbol: "Represents the ephemeral nature of life in Japanese culture",
    color: "#FFB6C1"
  },
  {
    id: "f038",
    name: "Magnolia",
    chineseName: "木蘭花",
    language: "Nobility, Dignity, Perseverance, Sweetness",
    tags: ["noble", "dignified", "sweet", "persevering"],
    valence: 0.72,
    arousal: 0.3,
    description: "Ancient flowers that predate bees. Magnolias represent quiet dignity and the persistence of beauty through ages.",
    symbol: "Represents nobility, perseverance, and the ancient history of nature",
    color: "#FFB6D9"
  },
  {
    id: "f039",
    name: "Geranium",
    chineseName: "天竺葵",
    language: "Comfort, Health, Friendship, Happy Surprise",
    tags: ["comforting", "healthy", "friendly", "cheerful"],
    valence: 0.7,
    arousal: 0.45,
    description: "Sturdy and reliable, Geraniums bloom prolifically. They represent the steady comfort of reliable friendship.",
    symbol: "Symbolizes comfort, health, and the health of friends and loved ones",
    color: "#FF69B4"
  },
  {
    id: "f040",
    name: "Sweet Pea",
    chineseName: "香豌豆",
    language: "Delicate Pleasures, Blissful Pleasure, Thank You",
    tags: ["delicate", "joyful", "grateful", "sweet"],
    valence: 0.8,
    arousal: 0.35,
    description: "Fragrant climbers that bring gentle sweetness. Sweet peas represent life's delicate pleasures and simple joys.",
    symbol: "Victorian flower language: represents delicate pleasures and gratitude",
    color: "#FFB6D9"
  },
  {
    id: "f041",
    name: "Zinnia",
    chineseName: "百日菊",
    language: "Thoughts of Friends, Goodness, Endurance",
    tags: ["friendly", "good", "enduring", "cheerful"],
    valence: 0.75,
    arousal: 0.6,
    description: "Vibrant and sturdy, Zinnias bloom for months. They celebrate friendship and the enduring nature of good relationships.",
    symbol: "Represents the steadfastness of friendship across time",
    color: "#FF6B6B"
  },
  {
    id: "f042",
    name: "Bluebell",
    chineseName: "風信子",
    language: "Constancy, Humility, Gratitude, Everlasting Love",
    tags: ["constant", "humble", "grateful", "loving"],
    valence: 0.6,
    arousal: 0.2,
    description: "Carpets of blue in woodland glades. Bluebells represent constancy and the quiet depth of true, enduring love.",
    symbol: "Represents humility, constancy, and gratitude in Victorian language",
    color: "#4169E1"
  },
  {
    id: "f043",
    name: "Lotus",
    chineseName: "蓮花",
    language: "Purity, Enlightenment, Rebirth, Spiritual Awakening",
    tags: ["pure", "spiritual", "enlightened", "transformative"],
    valence: 0.65,
    arousal: 0.1,
    description: "Rising untouched from muddy water, the Lotus is the ultimate symbol of transformation and spiritual awakening.",
    symbol: "Most sacred flower in Buddhism and Hinduism; represents enlightenment",
    color: "#FFB6D9"
  },
  {
    id: "f044",
    name: "Hawthorn",
    chineseName: "山楂花",
    language: "Hope, Healing, Fertility, Compassion",
    tags: ["hopeful", "healing", "compassionate", "resilient"],
    valence: 0.65,
    arousal: 0.35,
    description: "Associated with Beltane and spring renewal. Hawthorn flowers represent hope and the healing of emotional wounds.",
    symbol: "Used in herbal medicine for heart health; represents compassion",
    color: "#FFB6D9"
  },
  {
    id: "f045",
    name: "Honeysuckle",
    chineseName: "金銀花",
    language: "Affection, Bonds of Love, Generous and Devoted Heart",
    tags: ["loving", "devoted", "generous", "sweet"],
    valence: 0.78,
    arousal: 0.4,
    description: "Sweet-scented and intertwining, Honeysuckle represents the bonds of love and generous devotion to others.",
    symbol: "Represents affection and the bonds of love that intertwine our lives",
    color: "#FFD700"
  },
  {
    id: "f046",
    name: "Fuchsia",
    chineseName: "倒掛金鐘",
    language: "Taste, Elegance, Confiding Love, Good Taste",
    tags: ["elegant", "tasty", "graceful", "refined"],
    valence: 0.7,
    arousal: 0.6,
    description: "Exotic and colorful, Fuchsias represent refined taste and elegant confidence in one's own aesthetics.",
    symbol: "Represents elegance and good taste in the Victorian flower language",
    color: "#FF1493"
  },
  {
    id: "f047",
    name: "Goldenrod",
    chineseName: "黃花菜",
    language: "Encouragement, Good Fortune, Happiness, Positivity",
    tags: ["encouraging", "fortunate", "happy", "positive"],
    valence: 0.85,
    arousal: 0.65,
    description: "Golden flowers that bring light to late summer. Goldenrod represents encouragement and good fortune.",
    symbol: "Mistakenly blamed for allergies; actually represents good fortune in some cultures",
    color: "#FFD700"
  },
  {
    id: "f048",
    name: "Gladiolus",
    chineseName: "劍蘭",
    language: "Strength, Integrity, Courage, Infatuation",
    tags: ["strong", "courageous", "noble", "passionate"],
    valence: 0.7,
    arousal: 0.75,
    description: "Tall spikes of blooms standing at attention. Gladiolus represents strength, courage, and the sword of integrity.",
    symbol: "Name means 'little sword'; represents strength and valor",
    color: "#FF69B4"
  },
  {
    id: "f049",
    name: "Snapdragon",
    chineseName: "金魚草",
    language: "Strength, Protection, Passion, Deception",
    tags: ["strong", "protective", "passionate", "mysterious"],
    valence: 0.6,
    arousal: 0.7,
    description: "Dragon-like blooms that open and close like mouths. Snapdragons represent strength, protection, and hidden mysteries.",
    symbol: "Used as a protective charm in folklore; represents both beauty and danger",
    color: "#FF6347"
  },
  {
    id: "f050",
    name: "Amaryllis",
    chineseName: "孤挺花",
    language: "Pride, Nobility, Determination, Passionate Love",
    tags: ["proud", "noble", "determined", "passionate"],
    valence: 0.75,
    arousal: 0.8,
    description: "Trumpet flowers of extraordinary size and presence. Amaryllis speaks of pride and magnificent determination.",
    symbol: "Represents the lion-hearted strength of standing tall and proud",
    color: "#FF0000"
  }
];

// ============================================
// INITIAL SHOP ITEMS
// ============================================

const initialShopItems = [
  // Backgrounds
  {
    id: "item001",
    name: "Maple Sugar Oatmeal (Default)",
    category: "BACKGROUND",
    description: "Warm beige like maple sugar on warm toast. The classic, grounding feeling.",
    cost: 0,
    cssClass: "bg-maple-sugar",
    previewColor: "#F5EBE6",
    isLimited: false
  },
  {
    id: "item002",
    name: "Dawn Maple Leaves (Limited)",
    category: "BACKGROUND",
    description: "A gentle gradient from warm orange to cream, with subtle falling leaf patterns.",
    cost: 200,
    cssClass: "bg-dawn-maple",
    previewColor: "linear-gradient(135deg, #E6A15C 0%, #FFD4A3 100%)",
    isLimited: true,
    expiresIn: 30
  },
  {
    id: "item003",
    name: "Afternoon Sunflower",
    category: "BACKGROUND",
    description: "Golden yellow with subtle sunflower watermark. Brings warmth and optimism.",
    cost: 350,
    cssClass: "bg-sunflower",
    previewColor: "#FFFACD"
  },
  {
    id: "item004",
    name: "Lavender Dreams",
    category: "BACKGROUND",
    description: "Soft lavender with subtle purple gradient. Calming and ethereal.",
    cost: 250,
    cssClass: "bg-lavender-dreams",
    previewColor: "#E6D9F2"
  },

  // Stickers
  {
    id: "item005",
    name: "Healing Flower Stickers",
    category: "STICKER",
    description: "10+ hand-drawn small flowers. Drag-and-drop to decorate your pages.",
    cost: 100,
    cssClass: "sticker-pack-flowers"
  },
  {
    id: "item006",
    name: "Warm Line Dividers",
    category: "STICKER",
    description: "Decorative separators, borders, and frame elements.",
    cost: 150,
    cssClass: "sticker-pack-lines"
  },
  {
    id: "item007",
    name: "Constellation Doodles",
    category: "STICKER",
    description: "Tiny stars, moons, and cosmic patterns.",
    cost: 120,
    cssClass: "sticker-pack-constellation"
  },

  // BGM
  {
    id: "item008",
    name: "Forest Rain Ambience",
    category: "BGM",
    description: "Soft sounds of rain in a peaceful forest. Perfect for deep journaling.",
    cost: 500,
    cssClass: "bgm-forest-rain"
  },
  {
    id: "item009",
    name: "Gentle Piano (Lofi)",
    category: "BGM",
    description: "Warm, lo-fi piano beats. Creates a focused, creative atmosphere.",
    cost: 400,
    cssClass: "bgm-piano-lofi"
  }
];

// ============================================
// UTILITY: Convert to JSON (for REST API responses)
// ============================================

function serializeFlowers(flowers) {
  return JSON.stringify(flowers, null, 2);
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DatabaseSchema,
    initialFlowers,
    initialShopItems,
    serializeFlowers
  };
}
