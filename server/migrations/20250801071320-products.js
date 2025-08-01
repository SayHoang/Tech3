export default {
  async up(db, client) {
    // 1. Add new manufacturers from chuyentactical.com
    const newManufacturers = [
      { name: "5.11 Tactical" },
      { name: "Helikon Tex" },
      { name: "Direct Action" },
      { name: "Crye Precision" },
      { name: "Blackhawk" },
      { name: "ChuyenTactical" },
      { name: "Sofirn" },
      { name: "DoD" },
      { name: "Mechanix" },
      { name: "Oakley" },
      { name: "Under Armour" },
      { name: "Condor" },
      { name: "Magpul" },
      { name: "Mystery Ranch" },
      { name: "Arc'teryx" },
      { name: "Salomon" },
      { name: "Merrell" },
      { name: "Danner" },
      { name: "Leatherman" },
      { name: "Gerber" },
    ];

    // Insert manufacturers if they don't exist
    for (const manufacturer of newManufacturers) {
      await db
        .collection("manufacturers")
        .updateOne(
          { name: manufacturer.name },
          { $setOnInsert: manufacturer },
          { upsert: true }
        );
    }

    // 2. Fetch categories and manufacturers for mapping
    const categories = await db.collection("categories").find({}).toArray();
    const manufacturers = await db
      .collection("manufacturers")
      .find({})
      .toArray();

    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    const manufacturerMap = {};
    manufacturers.forEach((manu) => {
      manufacturerMap[manu.name] = manu._id;
    });

    // 3. Define additional products based on chuyentactical.com data
    const newProducts = [
      // TENT CATEGORY - Tactical Shelters & Camping Gear
      {
        name: "CT15 V3.0 Backpack Tent Shelter",
        price: 1490000,
        categoryName: "Tent",
        manufacturerName: "ChuyenTactical",
      },
      {
        name: "5.11 Tactical Field Shelter",
        price: 2800000,
        categoryName: "Tent",
        manufacturerName: "5.11 Tactical",
      },
      {
        name: "Helikon Tex Supertarp",
        price: 1200000,
        categoryName: "Tent",
        manufacturerName: "Helikon Tex",
      },
      {
        name: "Direct Action Tarp Poncho",
        price: 890000,
        categoryName: "Tent",
        manufacturerName: "Direct Action",
      },
      {
        name: "Crye Precision Field Shelter",
        price: 3200000,
        categoryName: "Tent",
        manufacturerName: "Crye Precision",
      },
      {
        name: "Blackhawk Tactical Bivvy",
        price: 1800000,
        categoryName: "Tent",
        manufacturerName: "Blackhawk",
      },
      {
        name: "Mystery Ranch Tent Stakes Kit",
        price: 450000,
        categoryName: "Tent",
        manufacturerName: "Mystery Ranch",
      },
      {
        name: "Arc'teryx Alpha SV Bivy",
        price: 4500000,
        categoryName: "Tent",
        manufacturerName: "Arc'teryx",
      },
      {
        name: "MSR Carbon Reflex 2",
        price: 6800000,
        categoryName: "Tent",
        manufacturerName: "MSR",
      },
      {
        name: "Coleman Tactical Dome 6P",
        price: 2200000,
        categoryName: "Tent",
        manufacturerName: "Coleman",
      },
      {
        name: "NatureHike Cloud Up 3 Pro",
        price: 1850000,
        categoryName: "Tent",
        manufacturerName: "NatureHike",
      },
      {
        name: "5.11 Tactical Outpost Shelter",
        price: 3500000,
        categoryName: "Tent",
        manufacturerName: "5.11 Tactical",
      },
      {
        name: "Helikon Tex Woodsman Tarp",
        price: 980000,
        categoryName: "Tent",
        manufacturerName: "Helikon Tex",
      },
      {
        name: "Direct Action Dragon Egg Shelter",
        price: 1650000,
        categoryName: "Tent",
        manufacturerName: "Direct Action",
      },
      {
        name: "Condor Tactical Tarp",
        price: 750000,
        categoryName: "Tent",
        manufacturerName: "Condor",
      },

      // CLOTHES CATEGORY - Tactical Apparel
      {
        name: "5.11 Tactical ICON PANT - KANGAROO",
        price: 2390000,
        categoryName: "Clothes",
        manufacturerName: "5.11 Tactical",
      },
      {
        name: "5.11 Tactical ICON PANT - RANGER GREEN",
        price: 2390000,
        categoryName: "Clothes",
        manufacturerName: "5.11 Tactical",
      },
      {
        name: "5.11 Stryke Pant",
        price: 2350000,
        categoryName: "Clothes",
        manufacturerName: "5.11 Tactical",
      },
      {
        name: "MBDU SHIRT - NYCO RIPSTOP",
        price: 2350000,
        categoryName: "Clothes",
        manufacturerName: "ChuyenTactical",
      },
      {
        name: "5.11 BOONIE HAT",
        price: 520000,
        categoryName: "Clothes",
        manufacturerName: "5.11 Tactical",
      },
      {
        name: "Boonie Hat Mk2 - NyCo Ripstop",
        price: 690000,
        categoryName: "Clothes",
        manufacturerName: "ChuyenTactical",
      },
      {
        name: "BBC Cap",
        price: 580000,
        categoryName: "Clothes",
        manufacturerName: "ChuyenTactical",
      },
      {
        name: "EXTREME COLD WEATHER BALACLAVA - Black",
        price: 520000,
        categoryName: "Clothes",
        manufacturerName: "ChuyenTactical",
      },
      {
        name: "Helikon Tex CPU Pants",
        price: 1890000,
        categoryName: "Clothes",
        manufacturerName: "Helikon Tex",
      },
      {
        name: "Crye Precision Combat Shirt",
        price: 3800000,
        categoryName: "Clothes",
        manufacturerName: "Crye Precision",
      },
      {
        name: "Under Armour Tactical Polo",
        price: 1200000,
        categoryName: "Clothes",
        manufacturerName: "Under Armour",
      },
      {
        name: "Oakley SI Assault Gloves",
        price: 890000,
        categoryName: "Clothes",
        manufacturerName: "Oakley",
      },
      {
        name: "Mechanix Original Gloves",
        price: 650000,
        categoryName: "Clothes",
        manufacturerName: "Mechanix",
      },
      {
        name: "Arc'teryx LEAF Alpha Jacket",
        price: 12000000,
        categoryName: "Clothes",
        manufacturerName: "Arc'teryx",
      },
      {
        name: "Condor Tactical Vest",
        price: 2800000,
        categoryName: "Clothes",
        manufacturerName: "Condor",
      },
      {
        name: "Blackhawk Warrior Wear Pants",
        price: 2100000,
        categoryName: "Clothes",
        manufacturerName: "Blackhawk",
      },

      // SHOES CATEGORY - Tactical Footwear
      {
        name: '5.11 Tactical ATAC 8" Boots',
        price: 3200000,
        categoryName: "Shoes",
        manufacturerName: "5.11 Tactical",
      },
      {
        name: "Salomon Forces Quest 4D",
        price: 4500000,
        categoryName: "Shoes",
        manufacturerName: "Salomon",
      },
      {
        name: "Merrell MOAB 3 Tactical",
        price: 2800000,
        categoryName: "Shoes",
        manufacturerName: "Merrell",
      },
      {
        name: 'Danner Tachyon 8"',
        price: 5200000,
        categoryName: "Shoes",
        manufacturerName: "Danner",
      },
      {
        name: "Under Armour Valsetz RTS",
        price: 2400000,
        categoryName: "Shoes",
        manufacturerName: "Under Armour",
      },
      {
        name: "Oakley Light Assault Boot",
        price: 3800000,
        categoryName: "Shoes",
        manufacturerName: "Oakley",
      },
      {
        name: "Blackhawk Warrior Wear Boots",
        price: 2900000,
        categoryName: "Shoes",
        manufacturerName: "Blackhawk",
      },
      {
        name: "Helikon Tex Range Shoes",
        price: 1800000,
        categoryName: "Shoes",
        manufacturerName: "Helikon Tex",
      },
      {
        name: "Arc'teryx Bora2 Mid Hiking",
        price: 6800000,
        categoryName: "Shoes",
        manufacturerName: "Arc'teryx",
      },
      {
        name: "Salomon X Ultra 3 GTX",
        price: 3600000,
        categoryName: "Shoes",
        manufacturerName: "Salomon",
      },
      {
        name: "Nike SFB Gen 2",
        price: 2800000,
        categoryName: "Shoes",
        manufacturerName: "Nike",
      },
      {
        name: "Adidas GSG-9.7",
        price: 2200000,
        categoryName: "Shoes",
        manufacturerName: "Adidas",
      },
      {
        name: "New Balance 990v5 Tactical",
        price: 2600000,
        categoryName: "Shoes",
        manufacturerName: "New Balance",
      },
      {
        name: 'Danner Acadia 8"',
        price: 4800000,
        categoryName: "Shoes",
        manufacturerName: "Danner",
      },
      {
        name: "Merrell Jungle Moc Tactical",
        price: 1800000,
        categoryName: "Shoes",
        manufacturerName: "Merrell",
      },

      // PLIERS CATEGORY - Multi-tools & Equipment
      {
        name: "Leatherman Wave Plus",
        price: 2800000,
        categoryName: "Pliers",
        manufacturerName: "Leatherman",
      },
      {
        name: "Leatherman MUT EOD",
        price: 4200000,
        categoryName: "Pliers",
        manufacturerName: "Leatherman",
      },
      {
        name: "Gerber Center-Drive",
        price: 2400000,
        categoryName: "Pliers",
        manufacturerName: "Gerber",
      },
      {
        name: "5.11 Tactical TPT EDC",
        price: 1200000,
        categoryName: "Pliers",
        manufacturerName: "5.11 Tactical",
      },
      {
        name: "Magpul Technical Gloves",
        price: 650000,
        categoryName: "Pliers",
        manufacturerName: "Magpul",
      },
      {
        name: "EDC MAGNETIC BELT",
        price: 890000,
        categoryName: "Pliers",
        manufacturerName: "ChuyenTactical",
      },
      {
        name: "EDC LARGE WALLET",
        price: 990000,
        categoryName: "Pliers",
        manufacturerName: "ChuyenTactical",
      },
      {
        name: "EDC MEDIUM WALLET",
        price: 880000,
        categoryName: "Pliers",
        manufacturerName: "ChuyenTactical",
      },
      {
        name: 'PARACORD BUCKLE 3/8"',
        price: 120000,
        categoryName: "Pliers",
        manufacturerName: "ChuyenTactical",
      },
      {
        name: "Gerber Suspension NXT",
        price: 1400000,
        categoryName: "Pliers",
        manufacturerName: "Gerber",
      },
      {
        name: "Leatherman Surge Heavy Duty",
        price: 3600000,
        categoryName: "Pliers",
        manufacturerName: "Leatherman",
      },
      {
        name: "Stanley FatMax Xtreme",
        price: 450000,
        categoryName: "Pliers",
        manufacturerName: "Stanley",
      },
      {
        name: "Knipex Cobra Pliers",
        price: 890000,
        categoryName: "Pliers",
        manufacturerName: "Knipex",
      },
      {
        name: "Channellock Blue Point",
        price: 650000,
        categoryName: "Pliers",
        manufacturerName: "Channellock",
      },
    ];

    // 4. Map names to IDs and add imageUrl
    const productsToInsert = newProducts.map((p) => ({
      name: p.name,
      price: p.price,
      categoryId: categoryMap[p.categoryName],
      manufacturerId: manufacturerMap[p.manufacturerName],
      imageUrl: null, // Will be added later when we implement image uploads
    }));

    // 5. Insert new products
    await db.collection("products").insertMany(productsToInsert);

    console.log(
      `Đã thêm ${productsToInsert.length} sản phẩm mới từ ChuyenTactical.com`
    );
  },

  async down(db, client) {
    // Remove the products we added (optional rollback)
    const productNames = [
      "CT15 V3.0 Backpack Tent Shelter",
      "5.11 Tactical Field Shelter",
      "Helikon Tex Supertarp",
      "5.11 Tactical ICON PANT - KANGAROO",
      "5.11 Tactical ICON PANT - RANGER GREEN",
      "5.11 Stryke Pant",
      '5.11 Tactical ATAC 8" Boots',
      "Salomon Forces Quest 4D",
      "Merrell MOAB 3 Tactical",
      "Leatherman Wave Plus",
      "Leatherman MUT EOD",
      "Gerber Center-Drive",
      "SOG PowerAccess Deluxe",
    ];

    await db.collection("products").deleteMany({
      name: { $in: productNames },
    });
  },
};
