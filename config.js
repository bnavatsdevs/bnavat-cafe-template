// SINGLE-FILE CLIENT CUSTOMIZATION CONFIG
// Change values below to rebrand this 3D template for any Cafe or Restaurant in 2 minutes.

export const CAFE_CONFIG = {
  brandName: "NOIR & CREMA",
  eyebrow: "SMALL-BATCH ROASTERY & KITCHEN",
  heroTitle: "Crafted in Fire,\nPoured in Silence.",
  heroSubtitle: "Single-origin pour-overs, wood-fired sourdough plates, and an intimate vinyl listening lounge.",
  whatsappNumber: "919876543210", // Country code + number without '+'
  displayPhone: "+91 98765 43210",
  address: "14 Rajpur Road, Dehradun, Uttarakhand",
  hours: "08:30 AM – 11:00 PM",
  googleMapsUrl: "https://maps.google.com/?q=Rajpur+Road+Dehradun",

  theme: {
    accentHex: "#d97736",
    woodColor: 0x4a2e1b,
    stoneColor: 0x1b1918,
    brassColor: 0xd4a359
  },

  hotspots: [
    {
      id: "bar",
      tag: "01 / ESPRESSO BAR",
      title: "Precision Pour-Over Bar",
      desc: "93°C temperature-locked extraction using washed Chikmagalur & Ethiopian micro-lots.",
      position: [-0.9, 1.45, 0.3],
      cameraView: "counter"
    },
    {
      id: "roaster",
      tag: "02 / MICRO-ROASTERY",
      title: "Small-Batch Drum Roasting",
      desc: "Roasted every Tuesday & Friday in 6kg batches for peak sweetness and zero bitterness.",
      position: [1.35, 1.55, -0.5],
      cameraView: "roastery"
    },
    {
      id: "lounge",
      tag: "03 / PRIVATE LOUNGE",
      title: "Evening Wood-Fired Table",
      desc: "Warm candlelight, analog acoustics, and curated tasting menus for intimate evenings.",
      position: [0.1, 1.15, 1.35],
      cameraView: "lounge"
    }
  ],

  menu: {
    coffee: [
      { name: "Smoked Maple Cortado", price: "₹260", tag: "Signature", desc: "Double ristretto, velvety micro-foam, charred maple glaze." },
      { name: "Chikmagalur V60 Pour-Over", price: "₹290", tag: "Single Origin", desc: "Honey-processed estate lot with notes of cacao and blood orange." },
      { name: "Yuzu Espresso Tonic", price: "₹310", tag: "Cold", desc: "Bright citrus botanical tonic layered under cold-extracted espresso." },
      { name: "Salted Hazelnut Flat White", price: "₹280", tag: "Bestseller", desc: "House-roasted Piedmont hazelnut praline with silky steamed milk." }
    ],
    plates: [
      { name: "Truffle Mushroom Sourdough", price: "₹460", tag: "Vegetarian", desc: "48-hour fermented country loaf, wild mushrooms, aged parmesan." },
      { name: "Wood-Fired Burrata Flatbread", price: "₹540", tag: "Chef's Pick", desc: "Blistered crust, heirloom cherry tomatoes, basil oil, fresh burrata." },
      { name: "Harissa Grilled Chicken Bowl", price: "₹520", tag: "High Protein", desc: "Charred herb chicken, roasted peppers, whipped feta, ancient grains." },
      { name: "Crispy Avocado Tartine", price: "₹440", tag: "Vegan Option", desc: "Smashed Hass avocado, pickled shallots, toasted dukkah, chili oil." }
    ],
    desserts: [
      { name: "Burnt Basque Cheesecake", price: "₹360", tag: "Signature", desc: "Caramelized dark crust with a molten Madagascar vanilla center." },
      { name: "70% Dark Espresso Tiramisu", price: "₹390", tag: "Must Try", desc: "House-baked savoiardi soaked in cold brew, mascarpone zabaglione." },
      { name: "Cardamom Olive Oil Cake", price: "₹320", tag: "Warm", desc: "Crushed green cardamom, roasted pistachios, orange blossom cream." }
    ]
  },

  craft: [
    { eyebrow: "01 / SOURCING", title: "Direct Estate Micro-Lots", desc: "Traceable high-altitude beans roasted weekly for clean, expressive clarity." },
    { eyebrow: "02 / KITCHEN", title: "Live Wood-Fired Hearth", desc: "Naturally leavened sourdough and seasonal plates finished over seasoned oak." },
    { eyebrow: "03 / SPACE", title: "Acoustic Listening Room", desc: "Designed for deep conversation, unhurried mornings, and warm evening dining." }
  ]
};
