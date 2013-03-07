db.products.remove();
db.categories.remove();

db.products.ensureIndex({"category_id": 1});


db.categories.save({_id: 1, name: "Fresh vegetables"});
db.products.save({_id: 1, name: 'Asparagus', category_id: 1});
db.products.save({_id: 2, name: 'Broccoli', category_id: 1});
db.products.save({_id: 3, name: 'Carrots', category_id: 1});
db.products.save({_id: 4, name: 'Cauliflower', category_id: 1});
db.products.save({_id: 5, name: 'Celery', category_id: 1});
db.products.save({_id: 6, name: 'Corn', category_id: 1});
db.products.save({_id: 7, name: 'Cucumbers', category_id: 1});
db.products.save({_id: 8, name: 'Lettuce / Greens', category_id: 1});
db.products.save({_id: 9, name: 'Mushrooms', category_id: 1});
db.products.save({_id: 10, name: 'Onions', category_id: 1});
db.products.save({_id: 11, name: 'Peppers', category_id: 1});
db.products.save({_id: 12, name: 'Potatoes', category_id: 1});
db.products.save({_id: 13, name: 'Spinach', category_id: 1});
db.products.save({_id: 14, name: 'Squash', category_id: 1});
db.products.save({_id: 15, name: 'Zucchini', category_id: 1});

db.categories.save({_id: 2, name: "Fresh fruits"});
db.products.save({_id: 16, name: 'Tomatoes', category_id: 2});
db.products.save({_id: 17, name: 'Apples', category_id: 2});
db.products.save({_id: 18, name: 'Avocados', category_id: 2});
db.products.save({_id: 19, name: 'Bananas', category_id: 2});
db.products.save({_id: 20, name: 'Berries', category_id: 2});
db.products.save({_id: 21, name: 'Cherries', category_id: 2});
db.products.save({_id: 22, name: 'Grapefruit', category_id: 2});
db.products.save({_id: 23, name: 'Grapes', category_id: 2});
db.products.save({_id: 24, name: 'Kiwis', category_id: 2});
db.products.save({_id: 25, name: 'Lemons / Limes', category_id: 2});
db.products.save({_id: 26, name: 'Melon', category_id: 2});
db.products.save({_id: 27, name: 'Nectarines', category_id: 2});
db.products.save({_id: 28, name: 'Oranges', category_id: 2});
db.products.save({_id: 29, name: 'Peaches', category_id: 2});
db.products.save({_id: 30, name: 'Pears', category_id: 2});
db.products.save({_id: 31, name: 'Plums', category_id: 2});

db.categories.save({_id: 3, name: "Refrigerated items"});
db.products.save({_id: 32, name: 'Bagels', category_id: 3});
db.products.save({_id: 33, name: 'Chip dip', category_id: 3});
db.products.save({_id: 34, name: 'Eggs / Fake eggs', category_id: 3});
db.products.save({_id: 35, name: 'English muffins', category_id: 3});
db.products.save({_id: 36, name: 'Fruit juice', category_id: 3});
db.products.save({_id: 37, name: 'Hummus', category_id: 3});
db.products.save({_id: 38, name: 'Ready-bake breads', category_id: 3});
db.products.save({_id: 39, name: 'Tofu', category_id: 3});
db.products.save({_id: 40, name: 'Tortillas', category_id: 3});


db.categories.save({_id: 4, name: "Frozen"});
db.products.save({_id: 41, name: 'Breakfasts (frozen)', category_id: 4});
db.products.save({_id: 42, name: 'Burritos (frozen)', category_id: 4});
db.products.save({_id: 43, name: 'Fish sticks (frozen)', category_id: 4});
db.products.save({_id: 44, name: 'Fries / Tater tots (frozen)', category_id: 4});
db.products.save({_id: 45, name: 'Ice cream / Sorbet (frozen)', category_id: 4});
db.products.save({_id: 46, name: 'Juice concentrate (frozen)', category_id: 4});
db.products.save({_id: 47, name: 'Pizza (frozen)', category_id: 4});
db.products.save({_id: 48, name: 'Pizza Rolls (frozen)', category_id: 4});
db.products.save({_id: 49, name: 'Popsicles (frozen)', category_id: 4});
db.products.save({_id: 50, name: 'TV dinners (frozen)', category_id: 4});
db.products.save({_id: 51, name: 'Vegetables (frozen)', category_id: 4});

db.categories.save({_id: 5, name: "Condiments / Sauces"});
db.products.save({_id: 52, name: 'BBQ sauce', category_id: 5});
db.products.save({_id: 53, name: 'Gravy', category_id: 5});
db.products.save({_id: 54, name: 'Honey', category_id: 5});
db.products.save({_id: 55, name: 'Hot sauce', category_id: 5});
db.products.save({_id: 56, name: 'Jam / Jelly / Preserves', category_id: 5});
db.products.save({_id: 57, name: 'Ketchup / Mustard', category_id: 5});
db.products.save({_id: 58, name: 'Mayonnaise', category_id: 5});
db.products.save({_id: 59, name: 'Pasta sauce', category_id: 5});
db.products.save({_id: 60, name: 'Relish', category_id: 5});
db.products.save({_id: 61, name: 'Salad dressing', category_id: 5});
db.products.save({_id: 62, name: 'Salsa', category_id: 5});
db.products.save({_id: 63, name: 'Soy sauce', category_id: 5});
db.products.save({_id: 64, name: 'Steak sauce', category_id: 5});
db.products.save({_id: 65, name: 'Syrup', category_id: 5});
db.products.save({_id: 66, name: 'Worcestershire sauce', category_id: 5});

db.categories.save({_id: 6, name: "Various groceries"});
db.products.save({_id: 67, name: 'Bouillon cubes', category_id: 6});
db.products.save({_id: 68, name: 'Cereal', category_id: 6});
db.products.save({_id: 69, name: 'Coffee / Filters', category_id: 6});
db.products.save({_id: 70, name: 'Instant potatoes', category_id: 6});
db.products.save({_id: 71, name: 'Lemon / Lime juice', category_id: 6});
db.products.save({_id: 72, name: 'Mac & cheese', category_id: 6});
db.products.save({_id: 73, name: 'Olive oil', category_id: 6});
db.products.save({_id: 74, name: 'Packaged meals', category_id: 6});
db.products.save({_id: 75, name: 'Pancake / Waffle mix', category_id: 6});
db.products.save({_id: 76, name: 'Pasta', category_id: 6});
db.products.save({_id: 77, name: 'Peanut butter', category_id: 6});
db.products.save({_id: 78, name: 'Pickles', category_id: 6});
db.products.save({_id: 79, name: 'Rice', category_id: 6});
db.products.save({_id: 80, name: 'Tea', category_id: 6});
db.products.save({_id: 81, name: 'Vegetable oil', category_id: 6});
db.products.save({_id: 82, name: 'Vinegar', category_id: 6});


db.categories.save({_id: 7, name: "Canned foods"});
db.products.save({_id: 83, name: 'Applesauce (can)', category_id: 7});
db.products.save({_id: 84, name: 'Baked beans (can)', category_id: 7});
db.products.save({_id: 85, name: 'Broth (can)', category_id: 7});
db.products.save({_id: 86, name: 'Fruit (can)', category_id: 7});
db.products.save({_id: 87, name: 'Olives (can)', category_id: 7});
db.products.save({_id: 88, name: 'Tinned meats (can)', category_id: 7});
db.products.save({_id: 89, name: 'Tuna / Chicken (can)', category_id: 7});
db.products.save({_id: 90, name: 'Soup / Chili (can)', category_id: 7});
db.products.save({_id: 91, name: 'Tomatoes (can)', category_id: 7});
db.products.save({_id: 92, name: 'Veggies (can)', category_id: 7});


db.categories.save({_id: 8, name: "Spices & herbs"});
db.products.save({_id: 93, name: 'Basil', category_id: 8});
db.products.save({_id: 94, name: 'Black pepper', category_id: 8});
db.products.save({_id: 95, name: 'Cilantro', category_id: 8});
db.products.save({_id: 96, name: 'Cinnamon', category_id: 8});
db.products.save({_id: 97, name: 'Garlic', category_id: 8});
db.products.save({_id: 98, name: 'Ginger', category_id: 8});
db.products.save({_id: 99, name: 'Mint', category_id: 8});
db.products.save({_id: 100, name: 'Oregano', category_id: 8});
db.products.save({_id: 101, name: 'Paprika', category_id: 8});
db.products.save({_id: 102, name: 'Parsley', category_id: 8});
db.products.save({_id: 103, name: 'Red pepper', category_id: 8});
db.products.save({_id: 104, name: 'Salt', category_id: 8});
db.products.save({_id: 105, name: 'Vanilla extract', category_id: 8});

db.categories.save({_id: 9, name: "Diary"});
db.products.save({_id: 106, name: 'Butter / Margarine', category_id: 9});
db.products.save({_id: 107, name: 'Cottage cheese', category_id: 9});
db.products.save({_id: 108, name: 'Half & half', category_id: 9});
db.products.save({_id: 109, name: 'Milk', category_id: 9});
db.products.save({_id: 110, name: 'Sour cream', category_id: 9});
db.products.save({_id: 111, name: 'Whipped cream', category_id: 9});
db.products.save({_id: 112, name: 'Yogurt', category_id: 9});

db.categories.save({_id: 10, name: "Cheese"});
db.products.save({_id: 113, name: 'Bleu cheese', category_id: 10});
db.products.save({_id: 114, name: 'Cheddar', category_id: 10});
db.products.save({_id: 115, name: 'Cottage cheese', category_id: 10});
db.products.save({_id: 116, name: 'Cream cheese', category_id: 10});
db.products.save({_id: 117, name: 'Feta', category_id: 10});
db.products.save({_id: 118, name: 'Goat cheese', category_id: 10});
db.products.save({_id: 119, name: 'Mozzarella', category_id: 10});
db.products.save({_id: 120, name: 'Parmesan', category_id: 10});
db.products.save({_id: 121, name: 'Provolone', category_id: 10});
db.products.save({_id: 122, name: 'Ricotta', category_id: 10});
db.products.save({_id: 123, name: 'Sandwich slices', category_id: 10});
db.products.save({_id: 124, name: 'Swiss cheese', category_id: 10});


db.categories.save({_id: 11, name: "Meat"});
db.products.save({_id: 125, name: 'Bacon / Sausage', category_id: 11});
db.products.save({_id: 126, name: 'Beef', category_id: 11});
db.products.save({_id: 127, name: 'Chicken', category_id: 11});
db.products.save({_id: 128, name: 'Ground beef / Turkey', category_id: 11});
db.products.save({_id: 129, name: 'Ham / Pork', category_id: 11});
db.products.save({_id: 130, name: 'Hot dogs', category_id: 11});
db.products.save({_id: 131, name: 'Lunchmeat', category_id: 11});
db.products.save({_id: 132, name: 'Turkey', category_id: 11});


db.categories.save({_id: 12, name: "Seafood"});
db.products.save({_id: 133, name: 'Catfish', category_id: 12});
db.products.save({_id: 134, name: 'Crab', category_id: 12});
db.products.save({_id: 135, name: 'Lobster', category_id: 12});
db.products.save({_id: 136, name: 'Mussels', category_id: 12});
db.products.save({_id: 137, name: 'Oysters', category_id: 12});
db.products.save({_id: 138, name: 'Salmon', category_id: 12});
db.products.save({_id: 139, name: 'Shrimp', category_id: 12});
db.products.save({_id: 140, name: 'Tilapia', category_id: 12});
db.products.save({_id: 141, name: 'Tuna', category_id: 12});

db.categories.save({_id: 13, name: "Beverages"});
db.products.save({_id: 142, name: 'Beer', category_id: 13});
db.products.save({_id: 143, name: 'Club soda / Tonic', category_id: 13});
db.products.save({_id: 144, name: 'Champagne', category_id: 13});
db.products.save({_id: 145, name: 'Gin', category_id: 13});
db.products.save({_id: 146, name: 'Juice', category_id: 13});
db.products.save({_id: 147, name: 'Mixers', category_id: 13});
db.products.save({_id: 148, name: 'Red wine / White wine', category_id: 13});
db.products.save({_id: 149, name: 'Rum', category_id: 13});
db.products.save({_id: 150, name: 'Saké', category_id: 13});
db.products.save({_id: 151, name: 'Soda pop', category_id: 13});
db.products.save({_id: 152, name: 'Sports drink', category_id: 13});
db.products.save({_id: 153, name: 'Whiskey', category_id: 13});
db.products.save({_id: 154, name: 'Vodka', category_id: 13});

db.categories.save({_id: 14, name: "Baked goods"});
db.products.save({_id: 155, name: 'Bagels / Croissants', category_id: 14});
db.products.save({_id: 156, name: 'Buns / Rolls', category_id: 14});
db.products.save({_id: 157, name: 'Cake / Cookies', category_id: 14});
db.products.save({_id: 158, name: 'Donuts / Pastries', category_id: 14});
db.products.save({_id: 159, name: 'Fresh bread', category_id: 14});
db.products.save({_id: 160, name: 'Pie! Pie! Pie!', category_id: 14});
db.products.save({_id: 161, name: 'Pita bread', category_id: 14});
db.products.save({_id: 162, name: 'Sliced bread', category_id: 14});

db.categories.save({_id: 15, name: "Baking"});
db.products.save({_id: 163, name: 'Baking powder / Soda', category_id: 15});
db.products.save({_id: 164, name: 'Bread crumbs', category_id: 15});
db.products.save({_id: 165, name: 'Cake / Brownie mix', category_id: 15});
db.products.save({_id: 166, name: 'Cake icing / Decorations', category_id: 15});
db.products.save({_id: 167, name: 'Chocolate chips / Cocoa', category_id: 15});
db.products.save({_id: 168, name: 'Flour', category_id: 15});
db.products.save({_id: 169, name: 'Shortening', category_id: 15});
db.products.save({_id: 170, name: 'Sugar', category_id: 15});
db.products.save({_id: 171, name: 'Sugar substitute', category_id: 15});
db.products.save({_id: 172, name: 'Yeast', category_id: 15});
db.products.save({_id: 173, name: '', category_id: 15});


db.categories.save({_id: 16, name: "Snacks"});
db.products.save({_id: 174, name: 'Candy / Gum', category_id: 16});
db.products.save({_id: 175, name: 'Cookies', category_id: 16});
db.products.save({_id: 176, name: 'Crackers', category_id: 16});
db.products.save({_id: 177, name: 'Dried fruit', category_id: 16});
db.products.save({_id: 178, name: 'Granola bars / Mix', category_id: 16});
db.products.save({_id: 179, name: 'Nuts / Seeds', category_id: 16});
db.products.save({_id: 180, name: 'Oatmeal', category_id: 16});
db.products.save({_id: 181, name: 'Popcorn', category_id: 16});
db.products.save({_id: 182, name: 'Potato / Corn chips', category_id: 16});
db.products.save({_id: 183, name: 'Pretzels', category_id: 16});

db.categories.save({_id: 17, name: "Themed meals"});
db.products.save({_id: 184, name: 'Burger night', category_id: 17});
db.products.save({_id: 185, name: 'Chili night', category_id: 17});
db.products.save({_id: 186, name: 'Pizza night', category_id: 17});
db.products.save({_id: 187, name: 'Spaghetti night', category_id: 17});
db.products.save({_id: 188, name: 'Taco night', category_id: 17});
db.products.save({_id: 189, name: 'Take-out deli food', category_id: 17});

db.categories.save({_id: 18, name: "Baby stuff"});
db.products.save({_id: 190, name: 'Baby food', category_id: 18});
db.products.save({_id: 191, name: 'Diapers', category_id: 18});
db.products.save({_id: 192, name: 'Formula', category_id: 18});
db.products.save({_id: 193, name: 'Lotion', category_id: 18});
db.products.save({_id: 194, name: 'Baby wash', category_id: 18});
db.products.save({_id: 195, name: 'Wipes', category_id: 18});

db.categories.save({_id: 19, name: "Pets"});
db.products.save({_id: 196, name: 'Cat food / Treats', category_id: 19});
db.products.save({_id: 197, name: 'Cat litter', category_id: 19});
db.products.save({_id: 198, name: 'Dog food / Treats', category_id: 19});
db.products.save({_id: 199, name: 'Flea treatment', category_id: 19});
db.products.save({_id: 200, name: 'Pet shampoo', category_id: 19});

db.categories.save({_id: 20, name: "Personal care"});
db.products.save({_id: 201, name: 'Antiperspirant / Deodorant', category_id: 20});
db.products.save({_id: 202, name: 'Bath soap / Hand soap', category_id: 20});
db.products.save({_id: 203, name: 'Condoms / Other b.c.', category_id: 20});
db.products.save({_id: 204, name: 'Cosmetics', category_id: 20});
db.products.save({_id: 205, name: 'Cotton swabs / Balls', category_id: 20});
db.products.save({_id: 206, name: 'Facial cleanser', category_id: 20});
db.products.save({_id: 207, name: 'Facial tissue', category_id: 20});
db.products.save({_id: 208, name: 'Feminine products', category_id: 20});
db.products.save({_id: 209, name: 'Floss', category_id: 20});
db.products.save({_id: 210, name: 'Hair gel / Spray', category_id: 20});
db.products.save({_id: 211, name: 'Lip balm', category_id: 20});
db.products.save({_id: 212, name: 'Moisturizing lotion', category_id: 20});
db.products.save({_id: 213, name: 'Mouthwash', category_id: 20});
db.products.save({_id: 214, name: 'Razors / Shaving cream', category_id: 20});
db.products.save({_id: 215, name: 'Shampoo / Conditioner', category_id: 20});
db.products.save({_id: 216, name: 'Sunblock', category_id: 20});
db.products.save({_id: 217, name: 'Toilet paper', category_id: 20});
db.products.save({_id: 218, name: 'Toothpaste', category_id: 20});
db.products.save({_id: 219, name: 'Vitamins / Supplements', category_id: 20});

db.categories.save({_id: 21, name: "Medicine"});
db.products.save({_id: 220, name: 'Allergy', category_id: 21});
db.products.save({_id: 221, name: 'Antibiotic', category_id: 21});
db.products.save({_id: 222, name: 'Antidiarrheal', category_id: 21});
db.products.save({_id: 223, name: 'Aspirin', category_id: 21});
db.products.save({_id: 224, name: 'Antacid', category_id: 21});
db.products.save({_id: 225, name: 'Band-aids / Medical', category_id: 21});
db.products.save({_id: 226, name: 'Cold / Flu / Sinus', category_id: 21});
db.products.save({_id: 227, name: 'Pain reliever', category_id: 21});
db.products.save({_id: 228, name: 'Prescription pick-up', category_id: 21});

db.categories.save({_id: 22, name: "Kitchen"});
db.products.save({_id: 229, name: 'Napkins', category_id: 22});
db.products.save({_id: 230, name: 'Non-stick spray', category_id: 22});
db.products.save({_id: 231, name: 'Paper towels', category_id: 22});
db.products.save({_id: 232, name: 'Plastic wrap', category_id: 22});
db.products.save({_id: 233, name: 'Sandwich / Freezer bags', category_id: 22});
db.products.save({_id: 234, name: 'Wax paper', category_id: 22});

db.categories.save({_id: 23, name: "Cleaning products"});
db.products.save({_id: 235, name: 'Air freshener', category_id: 23});
db.products.save({_id: 236, name: 'Bathroom cleaner', category_id: 23});
db.products.save({_id: 237, name: 'Bleach / Detergent', category_id: 23});
db.products.save({_id: 238, name: 'Dish / Dishwasher soap', category_id: 23});
db.products.save({_id: 239, name: 'Garbage bags', category_id: 23});
db.products.save({_id: 240, name: 'Glass cleaner', category_id: 23});
db.products.save({_id: 241, name: 'Mop head / Vacuum bags', category_id: 23});
db.products.save({_id: 242, name: 'Sponges / Scrubbers', category_id: 23});

db.categories.save({_id: 24, name: "Office supplies"});
db.products.save({_id: 243, name: 'CDRs / DVDRs', category_id: 24});
db.products.save({_id: 244, name: 'Notepad / Envelopes', category_id: 24});
db.products.save({_id: 245, name: 'Glue / Tape', category_id: 24});
db.products.save({_id: 246, name: 'Printer paper', category_id: 24});
db.products.save({_id: 247, name: 'Pens / Pencils', category_id: 24});
db.products.save({_id: 248, name: 'Postage stamps', category_id: 24});

db.categories.save({_id: 25, name: "Other"});
db.products.save({_id: 249, name: 'Automotive', category_id: 25});
db.products.save({_id: 250, name: 'Batteries', category_id: 25});
db.products.save({_id: 251, name: 'Charcoal / Propane', category_id: 25});
db.products.save({_id: 252, name: 'Flowers / Greeting card', category_id: 25});
db.products.save({_id: 253, name: 'Insect repellent', category_id: 25});
db.products.save({_id: 254, name: 'Light bulbs', category_id: 25});
db.products.save({_id: 255, name: 'Newspaper / Magazine', category_id: 25});
db.products.save({_id: 256, name: 'Random impulse buy', category_id: 25});

