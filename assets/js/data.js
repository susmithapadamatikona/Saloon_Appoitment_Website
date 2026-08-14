/* ==========================================================================
   data.js — content store for the Lumière Salon Appointment Platform
   Pure data. No DOM access. Consumed by every page module.
   ========================================================================== */
(function (global) {
  'use strict';

  var CURRENCY = '₹';

  /* ---------------------------------------------------------------- brand */
  var BRAND = {
    name: 'Lumière',
    suffix: 'Studio',
    tagline: 'Beauty Appointments',
    phone: '+91 98765 43210',
    phoneHref: '+919876543210',
    email: 'hello@lumierestudio.com',
    support: 'care@lumierestudio.com',
    address: '14 Rosewood Avenue, Bandra West, Mumbai 400050',
    hours: 'Mon – Sun · 9:00 AM – 9:00 PM',
    socials: [
      { icon: 'instagram', label: 'Instagram', url: '#' },
      { icon: 'facebook', label: 'Facebook', url: '#' },
      { icon: 'twitter', label: 'Twitter', url: '#' },
      { icon: 'youtube', label: 'YouTube', url: '#' },
      { icon: 'pinterest', label: 'Pinterest', url: '#' }
    ]
  };

  /* ----------------------------------------------------------- categories */
  var CATEGORIES = [
    { id: 'hair', name: 'Hair', icon: 'scissors', desc: 'Cuts, colour & care', count: 6 },
    { id: 'skin', name: 'Skin', icon: 'droplet', desc: 'Facials & treatments', count: 4 },
    { id: 'makeup', name: 'Makeup', icon: 'brush', desc: 'Everyday to editorial', count: 3 },
    { id: 'nails', name: 'Nails', icon: 'hand', desc: 'Art, mani & pedi', count: 3 },
    { id: 'spa', name: 'Spa', icon: 'leaf', desc: 'Massage & relaxation', count: 3 },
    { id: 'bridal', name: 'Bridal', icon: 'crown', desc: 'Your big-day glow', count: 2 },
    { id: 'wellness', name: 'Wellness', icon: 'flower', desc: 'Grooming essentials', count: 3 }
  ];

  /* ------------------------------------------------------------- services */
  function svc(o) {
    o.oldPrice = o.oldPrice || Math.round(o.price * 1.3 / 50) * 50;
    o.image = o.slug;
    return o;
  }

  var SERVICES = [
    svc({
      id: 1, slug: 'haircut-styling', name: 'Haircut & Styling', cat: 'hair',
      price: 899, duration: 45, rating: 4.9, reviews: 412, popular: true, trending: true,
      short: 'Precision cut and blow-dry finish shaped to your face and hair type.',
      desc: 'A consultation-led cut that works with your natural texture rather than against it. Your stylist maps growth patterns and density before a single section is taken, then finishes with a salon blow-dry so you leave camera-ready.',
      benefits: ['Face-shape mapped sectioning', 'Texture-aware layering', 'Salon blow-dry finish', 'Home-styling walkthrough'],
      includes: ['Consultation (10 min)', 'Wash & scalp cleanse', 'Precision cut', 'Blow-dry & finish', 'Styling product'],
      tags: ['Most booked', 'Unisex'], icon: 'scissors', kind: 'hair'
    }),
    svc({
      id: 2, slug: 'hair-coloring', name: 'Hair Colouring', cat: 'hair',
      price: 2499, duration: 120, rating: 4.8, reviews: 328, popular: true,
      short: 'Global colour, balayage or highlights using ammonia-free professional dyes.',
      desc: 'Bespoke colour formulated on the spot after a strand test. We use ammonia-free professional systems with bond protection built into every mix, so shine and integrity survive the process.',
      benefits: ['Ammonia-free formulas', 'In-built bond protection', 'Custom shade matching', 'Six-week colour guarantee'],
      includes: ['Patch & strand test', 'Custom colour mix', 'Application & processing', 'Bond treatment', 'Colour-safe wash & dry'],
      tags: ['Bond protect'], icon: 'palette', kind: 'hair'
    }),
    svc({
      id: 3, slug: 'hair-spa', name: 'Hair Spa Ritual', cat: 'hair',
      price: 1299, duration: 60, rating: 4.9, reviews: 501, popular: true, trending: true,
      short: 'Deep-conditioning ritual with steam therapy and a 15-minute scalp massage.',
      desc: 'A restorative treatment for dry, chemically-treated or heat-stressed hair. Warm oil, a keratin-rich mask and steam open the cuticle so nutrients land where they matter, closed off with a cool rinse for shine.',
      benefits: ['Repairs heat & chemical damage', 'Calms flaky scalp', 'Adds visible shine', 'Reduces breakage'],
      includes: ['Warm oil scalp massage', 'Steam therapy', 'Keratin mask', 'Wash & blow-dry'],
      tags: ['Relaxing'], icon: 'droplet', kind: 'hair'
    }),
    svc({
      id: 4, slug: 'keratin-treatment', name: 'Keratin Smoothing', cat: 'hair',
      price: 4999, duration: 180, rating: 4.7, reviews: 186,
      short: 'Frizz-free, glass-smooth hair that lasts up to four months.',
      desc: 'A formaldehyde-free smoothing system that seals the cuticle and cuts drying time roughly in half. Best suited to coarse, wavy or frizz-prone hair.',
      benefits: ['Up to 4 months of smoothness', 'Halves blow-dry time', 'Formaldehyde-free', 'Humidity resistant'],
      includes: ['Clarifying wash', 'Keratin application', 'Heat sealing', 'Aftercare kit sample'],
      tags: ['Long lasting'], icon: 'wind', kind: 'hair'
    }),
    svc({
      id: 5, slug: 'facial-treatment', name: 'Signature Facial', cat: 'skin',
      price: 1599, duration: 60, rating: 4.9, reviews: 447, popular: true,
      short: 'Deep-cleansing facial with extraction, mask and lymphatic massage.',
      desc: 'Ten steps built around your skin reading on the day. Double cleanse, gentle enzymatic exfoliation, steam-assisted extractions and a mask chosen for your concern, finished with SPF.',
      benefits: ['Clears congestion', 'Evens skin tone', 'Boosts circulation', 'Immediate glow, no downtime'],
      includes: ['Skin analysis', 'Double cleanse', 'Exfoliation & steam', 'Extractions', 'Face & neck massage', 'Custom mask + SPF'],
      tags: ['Dermat approved'], icon: 'sparkles', kind: 'skin'
    }),
    svc({
      id: 6, slug: 'skin-brightening', name: 'Skin Brightening Therapy', cat: 'skin',
      price: 2199, duration: 75, rating: 4.8, reviews: 239,
      short: 'Vitamin-C and niacinamide protocol targeting pigmentation and dullness.',
      desc: 'A clinical-grade brightening course for uneven tone, sun damage and post-acne marks. Layered actives are driven in with gentle ultrasonic infusion.',
      benefits: ['Fades dark spots', 'Restores radiance', 'Antioxidant defence', 'Safe for sensitive skin'],
      includes: ['Cleanse & tone', 'Vitamin-C infusion', 'Niacinamide serum', 'Brightening mask', 'SPF finish'],
      tags: ['Vitamin C'], icon: 'sun', kind: 'skin'
    }),
    svc({
      id: 7, slug: 'anti-aging-facial', name: 'Anti-Ageing Lift Facial', cat: 'skin',
      price: 2899, duration: 90, rating: 4.8, reviews: 164,
      short: 'Collagen-boosting facial with micro-current lift and peptide serums.',
      desc: 'Micro-current stimulation re-educates facial muscles while peptides and hyaluronic acid plump fine lines. Results build across a course of six.',
      benefits: ['Visible lift', 'Softens fine lines', 'Firms jawline', 'Deep hydration'],
      includes: ['Micro-current lift', 'Peptide serum', 'Collagen sheet mask', 'Eye & lip treatment'],
      tags: ['Premium'], icon: 'zap', kind: 'skin'
    }),
    svc({
      id: 8, slug: 'party-makeup', name: 'Party Makeup', cat: 'makeup',
      price: 2499, duration: 75, rating: 4.9, reviews: 356, popular: true,
      short: 'Long-wear evening makeup with HD base and lashes included.',
      desc: 'Photo-tested, sweat-resistant makeup built for long evenings. Colour matched in daylight, set for twelve hours, with a lash strip applied free.',
      benefits: ['12-hour wear', 'Flash-photography tested', 'Lashes included', 'Cruelty-free products'],
      includes: ['Skin prep', 'HD base & contour', 'Eye look', 'Lashes', 'Setting spray'],
      tags: ['HD finish'], icon: 'brush', kind: 'makeup'
    }),
    svc({
      id: 9, slug: 'bridal-makeup', name: 'Bridal Makeup', cat: 'bridal',
      price: 14999, duration: 210, rating: 5.0, reviews: 128, popular: true, featured: true,
      short: 'Complete bridal look with trial, draping and on-the-day touch-up kit.',
      desc: 'Our most requested package. Begins with a full trial weeks before the date, so nothing is improvised on the morning itself. Includes airbrush base, saree or lehenga draping, hair styling and a touch-up kit to carry.',
      benefits: ['Full trial included', 'Airbrush base', 'Draping & hair styling', 'On-day touch-up kit'],
      includes: ['Pre-wedding trial', 'Airbrush HD makeup', 'Bridal hair styling', 'Draping', 'Jewellery setting', 'Touch-up kit'],
      tags: ['Signature', 'Trial included'], icon: 'crown', kind: 'bridal'
    }),
    svc({
      id: 10, slug: 'engagement-package', name: 'Engagement Glow Package', cat: 'bridal',
      price: 8999, duration: 150, rating: 4.9, reviews: 96,
      short: 'Makeup, hair and pre-function skin prep for your engagement day.',
      desc: 'A lighter, dewier counterpart to the bridal look — designed to read beautifully in both daylight ceremonies and evening receptions.',
      benefits: ['Dewy camera-ready base', 'Hair styling included', 'Skin prep facial', 'Two look options'],
      includes: ['Express facial', 'HD makeup', 'Hair styling', 'Draping assistance'],
      tags: ['Popular'], icon: 'sparkles', kind: 'bridal'
    }),
    svc({
      id: 11, slug: 'nail-art', name: 'Designer Nail Art', cat: 'nails',
      price: 1199, duration: 60, rating: 4.8, reviews: 287, trending: true,
      short: 'Hand-painted nail art in gel or chrome finishes that lasts three weeks.',
      desc: 'Free-hand art by specialists, from minimal French tips to chrome, marble and 3-D detailing. Gel-cured for a chip-free three weeks.',
      benefits: ['3-week wear', 'Free-hand designs', 'Gel or chrome finish', 'Cuticle care included'],
      includes: ['Nail prep & shaping', 'Cuticle care', 'Base & gel colour', 'Art detailing', 'Top coat cure'],
      tags: ['Trending'], icon: 'sparkles', kind: 'nails'
    }),
    svc({
      id: 12, slug: 'manicure', name: 'Luxury Manicure', cat: 'nails',
      price: 699, duration: 40, rating: 4.7, reviews: 344,
      short: 'Soak, scrub, cuticle care and massage with polish of your choice.',
      desc: 'A proper spa manicure — not a rushed file and paint. Includes an exfoliating scrub, paraffin-warm hydration and a five-minute hand and forearm massage.',
      benefits: ['Softens cuticles', 'Exfoliates & hydrates', 'Relieves hand tension', 'Long-wear polish'],
      includes: ['Warm soak', 'Shaping & buffing', 'Cuticle care', 'Scrub & massage', 'Polish'],
      tags: ['Quick'], icon: 'hand', kind: 'nails'
    }),
    svc({
      id: 13, slug: 'pedicure', name: 'Detox Pedicure', cat: 'nails',
      price: 899, duration: 50, rating: 4.8, reviews: 298,
      short: 'Sea-salt detox soak with callus care and an extended foot massage.',
      desc: 'Tired feet get a warm sea-salt and essential-oil soak, thorough callus work, a mineral mask and a ten-minute pressure-point massage.',
      benefits: ['Removes calluses', 'Reduces swelling', 'Deeply hydrates', 'Relieves fatigue'],
      includes: ['Sea-salt soak', 'Callus treatment', 'Nail shaping', 'Mineral mask', '10-min massage', 'Polish'],
      tags: ['Relaxing'], icon: 'droplet', kind: 'nails'
    }),
    svc({
      id: 14, slug: 'spa-massage', name: 'Aroma Spa Massage', cat: 'spa',
      price: 2299, duration: 90, rating: 4.9, reviews: 376, popular: true,
      short: 'Full-body aromatherapy massage with warm oils and guided breathing.',
      desc: 'Ninety minutes of slow, deliberate Swedish-style work with warm essential oils blended to your mood — grounding, uplifting or restorative.',
      benefits: ['Melts muscle tension', 'Lowers stress hormones', 'Improves sleep quality', 'Boosts circulation'],
      includes: ['Mood consultation', 'Warm oil blend', 'Full-body massage', 'Scalp & foot focus', 'Herbal tea'],
      tags: ['Couples available'], icon: 'leaf', kind: 'spa'
    }),
    svc({
      id: 15, slug: 'body-polishing', name: 'Body Polishing', cat: 'spa',
      price: 2999, duration: 90, rating: 4.7, reviews: 152,
      short: 'Full-body exfoliation and wrap for smooth, even-toned skin.',
      desc: 'A three-stage ritual: dry brushing, a mineral scrub and a nourishing shea wrap. Especially popular before weddings and holidays.',
      benefits: ['Evens body tone', 'Silky texture', 'Preps skin for events', 'Detoxifying'],
      includes: ['Dry brushing', 'Mineral scrub', 'Steam', 'Shea wrap', 'Moisture seal'],
      tags: ['Pre-wedding'], icon: 'sparkles', kind: 'spa'
    }),
    svc({
      id: 16, slug: 'head-massage', name: 'Champi Head Massage', cat: 'spa',
      price: 599, duration: 30, rating: 4.8, reviews: 421,
      short: 'Classic Indian oil head massage for stress relief and hair health.',
      desc: 'The traditional champi — warm oil worked through the scalp, neck and shoulders with rhythmic pressure. Thirty minutes that reset an entire week.',
      benefits: ['Relieves headaches', 'Improves scalp circulation', 'Reduces hair fall', 'Instant calm'],
      includes: ['Warm oil selection', 'Scalp massage', 'Neck & shoulder work', 'Optional wash'],
      tags: ['Under 30 min'], icon: 'flower', kind: 'spa'
    }),
    svc({
      id: 17, slug: 'waxing', name: 'Full Body Waxing', cat: 'wellness',
      price: 1799, duration: 75, rating: 4.6, reviews: 267,
      short: 'Rica or chocolate wax with post-care soothing gel included.',
      desc: 'Low-temperature Rica wax on a fresh spatula every pass — no double dipping, ever. Finished with an aloe and calendula gel to calm the skin.',
      benefits: ['Less painful formula', 'Hygienic single-use', 'Slows regrowth', 'Soothing aftercare'],
      includes: ['Pre-wax cleanse', 'Rica/chocolate wax', 'Full body coverage', 'Soothing gel'],
      tags: ['Hygienic'], icon: 'leaf', kind: 'skin'
    }),
    svc({
      id: 18, slug: 'eyebrow-threading', name: 'Eyebrow & Threading', cat: 'wellness',
      price: 199, duration: 20, rating: 4.8, reviews: 689, popular: true,
      short: 'Precision brow shaping mapped to your bone structure.',
      desc: 'Brows measured and mapped before a single thread is pulled, so the shape suits your face rather than the trend of the month.',
      benefits: ['Face-mapped shaping', 'Precise definition', 'Quick appointment', 'Aftercare gel'],
      includes: ['Brow mapping', 'Threading', 'Trim & tidy', 'Soothing gel'],
      tags: ['Under 20 min', 'Walk-in'], icon: 'ruler', kind: 'skin'
    }),
    svc({
      id: 19, slug: 'mehendi', name: 'Bridal Mehendi', cat: 'wellness',
      price: 3499, duration: 120, rating: 4.9, reviews: 143,
      short: 'Intricate organic henna in Rajasthani, Arabic or minimal styles.',
      desc: 'Chemical-free organic henna applied by specialists who work weddings every season. Deep stain guaranteed with the aftercare routine we give you.',
      benefits: ['100% organic cone', 'Deep dark stain', 'Custom motifs', 'Bride + guest packages'],
      includes: ['Design consultation', 'Full hands or hands & feet', 'Organic henna', 'Aftercare kit'],
      tags: ['Wedding season'], icon: 'flower', kind: 'bridal'
    }),
    svc({
      id: 20, slug: 'hair-extensions', name: 'Hair Extensions', cat: 'hair',
      price: 6999, duration: 150, rating: 4.7, reviews: 88,
      short: 'Tape-in or clip-in extensions matched to your natural shade.',
      desc: 'Ethically-sourced remy hair colour-matched under three lighting conditions, then cut and blended so the join is genuinely invisible.',
      benefits: ['Invisible blending', 'Remy quality hair', 'Reusable clip-ins', 'Free first refit'],
      includes: ['Shade matching', 'Application', 'Cut & blend', 'Styling', 'Care guide'],
      tags: ['Premium'], icon: 'sparkles', kind: 'hair'
    }),
    svc({
      id: 21, slug: 'kids-haircut', name: 'Kids Haircut', cat: 'wellness',
      price: 449, duration: 30, rating: 4.7, reviews: 212,
      short: 'Patient, playful cuts for children under twelve.',
      desc: 'Cartoon screens, booster seats and stylists who genuinely like children. A first-haircut certificate comes free.',
      benefits: ['Child-friendly stylists', 'Entertainment provided', 'Gentle products', 'First-cut keepsake'],
      includes: ['Consultation with parent', 'Cut & style', 'Light wash', 'Certificate'],
      tags: ['Family'], icon: 'smile', kind: 'hair'
    }),
    svc({
      id: 22, slug: 'groom-package', name: 'Groom Grooming Package', cat: 'makeup',
      price: 5999, duration: 180, rating: 4.8, reviews: 74,
      short: 'Complete pre-wedding grooming: facial, cut, beard and styling.',
      desc: 'Everything the groom needs in one sitting, timed so the results peak on the wedding day rather than the day of the appointment.',
      benefits: ['Single-sitting convenience', 'Timed for wedding day', 'Beard sculpting', 'Photo-ready finish'],
      includes: ['Deep-clean facial', 'Haircut & styling', 'Beard sculpt', 'Manicure', 'Light makeup'],
      tags: ['For grooms'], icon: 'user', kind: 'makeup'
    })
  ];

  /* ------------------------------------------------------------- stylists */
  var STYLISTS = [
    {
      id: 1, slug: 'aarohi-mehta', name: 'Aarohi Mehta', role: 'Master Hair Stylist & Colourist',
      exp: 12, rating: 4.9, reviews: 486, clients: 2400, status: 'available', salon: 'lumiere-bandra',
      specialties: ['hair'], services: [1, 2, 3, 4, 20], price: 'from ₹899',
      bio: 'Aarohi trained in London under Vidal Sassoon-lineage educators and has spent the last twelve years perfecting colour correction — the work most stylists quietly turn away. She reads hair like a diagnostician and is unusually honest about what a given head of hair can and cannot take.',
      skills: [{ n: 'Colour Correction', v: 98 }, { n: 'Precision Cutting', v: 95 }, { n: 'Balayage', v: 92 }, { n: 'Bridal Hair', v: 88 }],
      langs: ['English', 'Hindi', 'Marathi'], awards: ['Colourist of the Year 2024', 'L\'Oréal Certified Master'],
      kind: 'person'
    },
    {
      id: 2, slug: 'priya-nair', name: 'Priya Nair', role: 'Senior Skin Therapist',
      exp: 9, rating: 4.9, reviews: 392, clients: 1850, status: 'available', salon: 'lumiere-bandra',
      specialties: ['skin'], services: [5, 6, 7, 17], price: 'from ₹1,599',
      bio: 'A licensed cosmetologist with a clinical bent, Priya specialises in pigmentation and acne-prone skin. She will talk you out of a treatment your skin does not need, which is precisely why her clients stay for years.',
      skills: [{ n: 'Acne Protocols', v: 96 }, { n: 'Pigmentation', v: 94 }, { n: 'Micro-current', v: 90 }, { n: 'Chemical Peels', v: 87 }],
      langs: ['English', 'Malayalam', 'Hindi'], awards: ['Advanced Aesthetics Diploma', 'Dermalogica Expert'],
      kind: 'person'
    },
    {
      id: 3, slug: 'sana-kapoor', name: 'Sana Kapoor', role: 'Celebrity Makeup Artist',
      exp: 11, rating: 5.0, reviews: 274, clients: 1200, status: 'busy', salon: 'lumiere-juhu',
      specialties: ['makeup', 'bridal'], services: [8, 9, 10, 22], price: 'from ₹2,499',
      bio: 'Sana has worked backstage at Lakmé Fashion Week for six consecutive seasons and counts three film costume departments among her regulars. Her signature is a skin-first base — makeup that photographs as skin, not as makeup.',
      skills: [{ n: 'Bridal Makeup', v: 99 }, { n: 'Airbrush HD', v: 96 }, { n: 'Editorial', v: 93 }, { n: 'Draping', v: 90 }],
      langs: ['English', 'Hindi', 'Punjabi'], awards: ['LFW Backstage Artist', 'MAC Pro Member'],
      kind: 'person'
    },
    {
      id: 4, slug: 'ritika-shah', name: 'Ritika Shah', role: 'Nail Art Specialist',
      exp: 7, rating: 4.8, reviews: 318, clients: 1600, status: 'available', salon: 'lumiere-powai',
      specialties: ['nails'], services: [11, 12, 13], price: 'from ₹699',
      bio: 'Ritika treats a nail like a ten-millimetre canvas. Trained in Seoul in K-nail technique, she is the person clients come to with a screenshot and leave with something better than the screenshot.',
      skills: [{ n: 'Free-hand Art', v: 97 }, { n: 'Gel Extensions', v: 93 }, { n: 'Chrome & Marble', v: 91 }, { n: 'Nail Health', v: 89 }],
      langs: ['English', 'Hindi', 'Gujarati'], awards: ['K-Nail Certified', 'India Nail Expo Finalist'],
      kind: 'person'
    },
    {
      id: 5, slug: 'meera-iyer', name: 'Meera Iyer', role: 'Spa & Wellness Therapist',
      exp: 14, rating: 4.9, reviews: 445, clients: 2900, status: 'available', salon: 'lumiere-koregaon',
      specialties: ['spa'], services: [14, 15, 16], price: 'from ₹599',
      bio: 'Fourteen years and roughly nine thousand massages in, Meera can find a knot you did not know you had within ninety seconds. Trained in both Kerala Ayurvedic and Swedish traditions.',
      skills: [{ n: 'Deep Tissue', v: 96 }, { n: 'Aromatherapy', v: 95 }, { n: 'Ayurvedic Champi', v: 98 }, { n: 'Body Rituals', v: 92 }],
      langs: ['English', 'Tamil', 'Hindi'], awards: ['Kerala Ayurveda Certified', 'Spa Therapist of the Year 2023'],
      kind: 'person'
    },
    {
      id: 6, slug: 'zoya-khan', name: 'Zoya Khan', role: 'Bridal Specialist & Mehendi Artist',
      exp: 10, rating: 5.0, reviews: 231, clients: 980, status: 'busy', salon: 'lumiere-juhu',
      specialties: ['bridal'], services: [9, 10, 19], price: 'from ₹3,499',
      bio: 'Zoya has worked over four hundred weddings and has never once been late — a statistic she mentions with justified pride. Her Rajasthani mehendi detailing is exceptional even by wedding-season standards.',
      skills: [{ n: 'Bridal Mehendi', v: 99 }, { n: 'Bridal Makeup', v: 94 }, { n: 'Hair Styling', v: 90 }, { n: 'Draping', v: 95 }],
      langs: ['English', 'Hindi', 'Urdu'], awards: ['400+ Weddings', 'Organic Henna Certified'],
      kind: 'person'
    },
    {
      id: 7, slug: 'kabir-anand', name: 'Kabir Anand', role: 'Men\'s Grooming Expert',
      exp: 8, rating: 4.8, reviews: 356, clients: 2100, status: 'available', salon: 'lumiere-powai',
      specialties: ['hair', 'makeup'], services: [1, 21, 22], price: 'from ₹449',
      bio: 'Kabir specialises in beard architecture and the kind of men\'s cut that still looks intentional six weeks later. Patient with nervous first-timers and children alike.',
      skills: [{ n: 'Beard Sculpting', v: 96 }, { n: 'Fades & Tapers', v: 94 }, { n: 'Kids Cuts', v: 92 }, { n: 'Groom Styling', v: 88 }],
      langs: ['English', 'Hindi'], awards: ['Barber Championship Finalist'],
      kind: 'person'
    },
    {
      id: 8, slug: 'ananya-roy', name: 'Ananya Roy', role: 'Hair Texture Specialist',
      exp: 6, rating: 4.7, reviews: 198, clients: 890, status: 'available', salon: 'lumiere-bandra',
      specialties: ['hair'], services: [3, 4, 20], price: 'from ₹1,299',
      bio: 'Ananya works almost exclusively with curly and coily textures — a genuine specialism in a market that still defaults to straightening. Expect a cut done dry, curl by curl.',
      skills: [{ n: 'Curly Cutting', v: 95 }, { n: 'Keratin Systems', v: 91 }, { n: 'Scalp Health', v: 89 }, { n: 'Extensions', v: 86 }],
      langs: ['English', 'Bengali', 'Hindi'], awards: ['Curl Specialist Certified'],
      kind: 'person'
    },
    {
      id: 9, slug: 'divya-menon', name: 'Divya Menon', role: 'Advanced Aesthetician',
      exp: 13, rating: 4.9, reviews: 412, clients: 2300, status: 'leave', salon: 'lumiere-indiranagar',
      specialties: ['skin'], services: [5, 6, 7], price: 'from ₹1,599',
      bio: 'Divya spent five years in a dermatology clinic before moving to salon aesthetics, and it shows in how carefully she screens contraindications before any active treatment.',
      skills: [{ n: 'Anti-ageing', v: 97 }, { n: 'Micro-needling', v: 93 }, { n: 'Peels', v: 95 }, { n: 'Consultation', v: 98 }],
      langs: ['English', 'Malayalam', 'Kannada'], awards: ['Clinical Aesthetics Diploma'],
      kind: 'person'
    },
    {
      id: 10, slug: 'naina-verma', name: 'Naina Verma', role: 'Junior Stylist & Colour Assistant',
      exp: 3, rating: 4.6, reviews: 124, clients: 520, status: 'available', salon: 'lumiere-koregaon',
      specialties: ['hair', 'nails'], services: [1, 3, 12, 18], price: 'from ₹199',
      bio: 'Two years into her apprenticeship under Aarohi, Naina takes bookings at assistant rates while she builds her column. Precise, enthusiastic and noticeably good at blow-dries.',
      skills: [{ n: 'Blow-dry', v: 92 }, { n: 'Threading', v: 90 }, { n: 'Hair Spa', v: 86 }, { n: 'Manicure', v: 84 }],
      langs: ['English', 'Hindi'], awards: ['Rising Talent 2025'],
      kind: 'person'
    }
  ];

  /* ---------------------------------------------------------------- salons */
  var SALONS = [
    {
      id: 1, slug: 'lumiere-bandra', name: 'Lumière Bandra Flagship', city: 'Mumbai',
      area: 'Bandra West', address: '14 Rosewood Avenue, Linking Road, Bandra West, Mumbai 400050',
      distance: 1.2, rating: 4.9, reviews: 1284, open: true, hours: '9:00 AM – 9:00 PM',
      phone: '+91 98765 43210', flagship: true,
      services: ['hair', 'skin', 'makeup', 'nails', 'spa', 'bridal'],
      stylists: [1, 2, 8], seats: 14,
      amenities: ['Valet parking', 'Complimentary beverages', 'Free Wi-Fi', 'Air conditioned', 'Card & UPI', 'Wheelchair access', 'Kids corner', 'Private suites'],
      about: 'Our flagship: three floors on Linking Road, fourteen chairs, a dedicated bridal suite and the largest colour bar in the city. This is where our senior team trains everyone else.',
      map: { x: 22, y: 34 }, kind: 'salon'
    },
    {
      id: 2, slug: 'lumiere-juhu', name: 'Lumière Juhu Beach', city: 'Mumbai',
      area: 'Juhu', address: '7 Seaview Lane, Juhu Tara Road, Mumbai 400049',
      distance: 3.8, rating: 4.8, reviews: 942, open: true, hours: '10:00 AM – 10:00 PM',
      phone: '+91 98765 43211',
      services: ['makeup', 'bridal', 'hair', 'skin'],
      stylists: [3, 6], seats: 9,
      amenities: ['Sea-facing suites', 'Bridal green room', 'Valet parking', 'Free Wi-Fi', 'Card & UPI', 'Air conditioned'],
      about: 'Built around bridal work. Two dedicated green rooms, a photography-grade lighting bay and a team that has handled more than four hundred weddings between them.',
      map: { x: 58, y: 20 }, kind: 'salon'
    },
    {
      id: 3, slug: 'lumiere-powai', name: 'Lumière Powai Lakeside', city: 'Mumbai',
      area: 'Powai', address: '22 Lakeview Plaza, Hiranandani Gardens, Powai, Mumbai 400076',
      distance: 6.4, rating: 4.7, reviews: 668, open: true, hours: '9:30 AM – 9:00 PM',
      phone: '+91 98765 43212',
      services: ['hair', 'nails', 'skin', 'wellness'],
      stylists: [4, 7], seats: 8,
      amenities: ['Free parking', 'Nail art bar', 'Men\'s grooming floor', 'Free Wi-Fi', 'Card & UPI'],
      about: 'A relaxed neighbourhood studio with a separate men\'s grooming floor and the city\'s busiest nail art bar. Popular with the tech crowd for its early-evening slots.',
      map: { x: 76, y: 52 }, kind: 'salon'
    },
    {
      id: 4, slug: 'lumiere-koregaon', name: 'Lumière Koregaon Park', city: 'Pune',
      area: 'Koregaon Park', address: '5 North Main Road, Koregaon Park, Pune 411001',
      distance: 148, rating: 4.9, reviews: 731, open: true, hours: '9:00 AM – 8:30 PM',
      phone: '+91 98765 43213',
      services: ['spa', 'hair', 'skin', 'wellness'],
      stylists: [5, 10], seats: 10,
      amenities: ['Full spa wing', 'Steam & sauna', 'Couples suite', 'Valet parking', 'Herbal café', 'Air conditioned'],
      about: 'Our wellness-led location. A four-room spa wing with steam, sauna and a couples suite, wrapped around a small herbal tea café.',
      map: { x: 34, y: 70 }, kind: 'salon'
    },
    {
      id: 5, slug: 'lumiere-indiranagar', name: 'Lumière Indiranagar', city: 'Bengaluru',
      area: 'Indiranagar', address: '100 Feet Road, Indiranagar, Bengaluru 560038',
      distance: 842, rating: 4.8, reviews: 856, open: false, hours: '10:00 AM – 9:00 PM',
      phone: '+91 98765 43214',
      services: ['skin', 'hair', 'nails', 'makeup'],
      stylists: [9], seats: 11,
      amenities: ['Skin clinic room', 'Free Wi-Fi', 'Card & UPI', 'Air conditioned', 'Metro adjacent'],
      about: 'Clinic-grade skin treatments in a salon setting, two minutes from the metro. The advanced aesthetics room is booked out weeks ahead.',
      map: { x: 15, y: 62 }, kind: 'salon'
    },
    {
      id: 6, slug: 'lumiere-jubilee', name: 'Lumière Jubilee Hills', city: 'Hyderabad',
      area: 'Jubilee Hills', address: 'Road No. 36, Jubilee Hills, Hyderabad 500033',
      distance: 706, rating: 4.7, reviews: 522, open: true, hours: '10:00 AM – 9:30 PM',
      phone: '+91 98765 43215',
      services: ['bridal', 'makeup', 'hair', 'spa'],
      stylists: [3, 6], seats: 9,
      amenities: ['Bridal suite', 'Valet parking', 'Private rooms', 'Card & UPI', 'Free Wi-Fi'],
      about: 'A bridal-first studio for the Hyderabad wedding circuit, with two private suites and same-day trial availability during season.',
      map: { x: 66, y: 78 }, kind: 'salon'
    },
    {
      id: 7, slug: 'lumiere-anna-nagar', name: 'Lumière Anna Nagar', city: 'Chennai',
      area: 'Anna Nagar', address: '2nd Avenue, Anna Nagar East, Chennai 600102',
      distance: 1032, rating: 4.6, reviews: 389, open: true, hours: '9:30 AM – 8:30 PM',
      phone: '+91 98765 43216',
      services: ['hair', 'wellness', 'skin', 'nails'],
      stylists: [8, 10], seats: 7,
      amenities: ['Free parking', 'Family packages', 'Card & UPI', 'Air conditioned'],
      about: 'A family-oriented neighbourhood salon — kids cuts, threading and hair spa make up most of the diary, with a loyal weekend crowd.',
      map: { x: 44, y: 44 }, kind: 'salon'
    },
    {
      id: 8, slug: 'lumiere-cp', name: 'Lumière Connaught Place', city: 'Delhi',
      area: 'Connaught Place', address: 'Block N, Connaught Place, New Delhi 110001',
      distance: 1148, rating: 4.8, reviews: 917, open: true, hours: '10:00 AM – 10:00 PM',
      phone: '+91 98765 43217',
      services: ['hair', 'makeup', 'skin', 'nails', 'spa'],
      stylists: [1, 3, 7], seats: 12,
      amenities: ['Late-night slots', 'Metro adjacent', 'Express services', 'Card & UPI', 'Free Wi-Fi', 'Air conditioned'],
      about: 'Central, fast and open until ten. Built for the after-work booking — express blow-dries, thirty-minute facials and a queue that genuinely moves.',
      map: { x: 86, y: 28 }, kind: 'salon'
    }
  ];

  /* ---------------------------------------------------------------- offers */
  var OFFERS = [
    { id: 1, code: 'SPA20', title: '20% Off Hair Spa Ritual', discount: '20% OFF', type: 'percent', value: 20, desc: 'Every Tuesday and Wednesday on our signature hair spa. Walk out with a scalp that has forgotten what stress feels like.', expiry: '2026-09-30', tone: '', tag: 'Weekday', applies: [3], min: 0 },
    { id: 2, code: 'FACIAL2X', title: 'Buy 1 Get 1 Signature Facial', discount: 'B1G1', type: 'bogo', value: 50, desc: 'Book a signature facial, bring a friend and their treatment is on us. Both must be booked in the same slot.', expiry: '2026-09-15', tone: 'lav', tag: 'Bring a friend', applies: [5], min: 0 },
    { id: 3, code: 'BRIDE15', title: 'Complete Bridal Package', discount: '₹4,000 OFF', type: 'flat', value: 4000, desc: 'Bridal makeup, mehendi and pre-wedding body polishing booked together. Trial included, as always.', expiry: '2026-12-31', tone: 'deep', tag: 'Wedding season', applies: [9, 19, 15], min: 12000 },
    { id: 4, code: 'WEEKEND10', title: 'Weekend Beauty Escape', discount: '10% OFF', type: 'percent', value: 10, desc: 'Any two services booked back-to-back on Saturday or Sunday. Perfect excuse for a slow morning.', expiry: '2026-10-31', tone: 'coral', tag: 'Sat & Sun', applies: [], min: 1500 },
    { id: 5, code: 'FIRST25', title: 'First Appointment Discount', discount: '25% OFF', type: 'percent', value: 25, desc: 'New to Lumière? Your first booking with us is a quarter off, on any service at any location.', expiry: '2026-12-31', tone: 'mint', tag: 'New clients', applies: [], min: 0 },
    { id: 6, code: 'FESTIVE30', title: 'Festival Glow Special', discount: '30% OFF', type: 'percent', value: 30, desc: 'Party makeup and nail art through the festive weeks. Slots go fast — book at least a week out.', expiry: '2026-11-15', tone: 'dark', tag: 'Limited', applies: [8, 11], min: 0 },
    { id: 7, code: 'MEMBER50', title: 'Membership Signup Bonus', discount: '₹500 OFF', type: 'flat', value: 500, desc: 'Join any Lumière membership tier this month and take ₹500 off your first booking under it.', expiry: '2026-10-15', tone: 'lav', tag: 'Members', applies: [], min: 1000 },
    { id: 8, code: 'REFER300', title: 'Refer & Both Earn', discount: '₹300 EACH', type: 'flat', value: 300, desc: 'Share your code. When a friend completes their first appointment, you both get ₹300 in credit.', expiry: '2026-12-31', tone: 'coral', tag: 'Referral', applies: [], min: 800 }
  ];

  /* -------------------------------------------------------- membership --- */
  var PLANS = [
    {
      id: 'basic', name: 'Basic', icon: 'flower', price: 0, yearly: 0, sub: 'Pay as you go',
      note: 'No commitment. Cancel anytime.',
      feats: [['Online booking', 1], ['Appointment reminders', 1], ['Standard support', 1], ['Service discounts', 0], ['Priority booking', 0], ['Free birthday service', 0], ['Loyalty points', 0], ['Dedicated stylist', 0]]
    },
    {
      id: 'silver', name: 'Silver', icon: 'sparkles', price: 799, yearly: 7990, sub: 'For the regular',
      note: 'Best for monthly visitors.',
      feats: [['Online booking', 1], ['Appointment reminders', 1], ['Priority support', 1], ['5% off all services', 1], ['Priority booking', 0], ['Free birthday service', 0], ['1x loyalty points', 1], ['Dedicated stylist', 0]]
    },
    {
      id: 'gold', name: 'Gold', icon: 'award', price: 1499, yearly: 14990, sub: 'Our most popular', featured: true,
      note: 'Pays for itself in two visits.',
      feats: [['Online booking', 1], ['Appointment reminders', 1], ['Priority support', 1], ['12% off all services', 1], ['Priority booking', 1], ['Free birthday service', 1], ['2x loyalty points', 1], ['Dedicated stylist', 0]]
    },
    {
      id: 'platinum', name: 'Platinum', icon: 'diamond', price: 2999, yearly: 29990, sub: 'For the devoted',
      note: 'Includes one free service monthly.',
      feats: [['Online booking', 1], ['Appointment reminders', 1], ['24/7 concierge', 1], ['20% off all services', 1], ['Priority booking', 1], ['Free birthday service', 1], ['3x loyalty points', 1], ['Dedicated stylist', 1]]
    },
    {
      id: 'vip', name: 'VIP Atelier', icon: 'crown', price: 5999, yearly: 59990, sub: 'By invitation',
      note: 'Limited to 50 members per city.',
      feats: [['Online booking', 1], ['Appointment reminders', 1], ['Personal concierge', 1], ['30% off all services', 1], ['Instant priority booking', 1], ['Free birthday package', 1], ['5x loyalty points', 1], ['Dedicated senior stylist', 1]]
    }
  ];

  /* ----------------------------------------------------------------- blog */
  var POSTS = [
    { id: 1, slug: 'winter-hair-care-guide', title: 'The Winter Hair Care Guide Your Scalp Has Been Asking For', cat: 'Hair Care', author: 'Aarohi Mehta', authorSlug: 'aarohi-mehta', date: '2026-08-02', read: 7, featured: true, tags: ['hair', 'seasonal', 'scalp'], excerpt: 'Cold air outside, heated air inside, and hair caught between the two. Here is what actually helps — and what is marketing.', kind: 'blog' },
    { id: 2, slug: 'facial-frequency-truth', title: 'How Often Should You Really Get a Facial?', cat: 'Skin Care', author: 'Priya Nair', authorSlug: 'priya-nair', date: '2026-07-28', read: 5, tags: ['skin', 'facials'], excerpt: 'Every four weeks, every twelve, or only before weddings? The honest answer depends on three things nobody asks about.', kind: 'blog' },
    { id: 3, slug: 'bridal-beauty-timeline', title: 'A Six-Month Bridal Beauty Timeline That Actually Works', cat: 'Bridal', author: 'Sana Kapoor', authorSlug: 'sana-kapoor', date: '2026-07-19', read: 9, featured: true, tags: ['bridal', 'planning'], excerpt: 'Start too late and you are rushing. Start too early and you peak in month four. Here is the schedule we give our own brides.', kind: 'blog' },
    { id: 4, slug: 'nail-art-trends-2026', title: 'Nail Art Trends Defining 2026 (and Two That Should Retire)', cat: 'Nail Care', author: 'Ritika Shah', authorSlug: 'ritika-shah', date: '2026-07-11', read: 6, tags: ['nails', 'trends'], excerpt: 'Chrome is staying. Aura nails are evolving. And one very persistent trend needs to be laid to rest with dignity.', kind: 'blog' },
    { id: 5, slug: 'hair-colour-maintenance', title: 'Why Your Hair Colour Fades in Three Weeks', cat: 'Hair Care', author: 'Aarohi Mehta', authorSlug: 'aarohi-mehta', date: '2026-07-04', read: 6, tags: ['hair', 'colour'], excerpt: 'It is almost never the colourist. Four ordinary habits are washing your investment down the drain.', kind: 'blog' },
    { id: 6, slug: 'makeup-for-indian-skin', title: 'Foundation Matching for Indian Skin Tones: A Practical Method', cat: 'Makeup Tips', author: 'Sana Kapoor', authorSlug: 'sana-kapoor', date: '2026-06-25', read: 8, tags: ['makeup', 'foundation'], excerpt: 'Undertone is not a mystery. Three tests, five minutes, and you will never buy the wrong shade again.', kind: 'blog' },
    { id: 7, slug: 'spa-day-benefits', title: 'What Ninety Minutes on a Massage Table Does to Your Nervous System', cat: 'Salon Trends', author: 'Meera Iyer', authorSlug: 'meera-iyer', date: '2026-06-14', read: 5, tags: ['spa', 'wellness'], excerpt: 'The relaxation is the obvious part. The cortisol, sleep and circulation effects are the interesting part.', kind: 'blog' },
    { id: 8, slug: 'acne-skincare-routine', title: 'Building an Acne Routine Without Wrecking Your Barrier', cat: 'Skin Care', author: 'Divya Menon', authorSlug: 'divya-menon', date: '2026-06-03', read: 10, tags: ['skin', 'acne'], excerpt: 'Most acne routines fail by doing too much too fast. The fix is boring, sequential and genuinely effective.', kind: 'blog' },
    { id: 9, slug: 'salon-hygiene-standards', title: 'Nine Hygiene Questions Worth Asking Any Salon', cat: 'Salon Trends', author: 'Lumière Editorial', authorSlug: '', date: '2026-05-22', read: 4, tags: ['safety', 'trends'], excerpt: 'A good salon will answer all nine without hesitating. Hesitation is your answer.', kind: 'blog' }
  ];

  /* --------------------------------------------------------- testimonials */
  var TESTIMONIALS = [
    { id: 1, name: 'Kavya Reddy', role: 'Product Designer, Bengaluru', rating: 5, service: 'Hair Colouring', text: 'I came in with three years of box-dye damage and a fair amount of embarrassment about it. Aarohi did not flinch — she explained exactly what could be fixed in one sitting and what would take two. Zero upselling. The colour is the best it has been in a decade.', date: '2026-07-28' },
    { id: 2, name: 'Ishita Malhotra', role: 'Bride, Mumbai', rating: 5, service: 'Bridal Makeup', text: 'Sana arrived at 4 AM without a word of complaint and stayed until the reception ended. My makeup survived a monsoon downpour on the way to the venue. Every single photograph looks the way I hoped it would.', date: '2026-07-14' },
    { id: 3, name: 'Rohan Kapoor', role: 'Software Engineer, Pune', rating: 5, service: 'Groom Package', text: 'I had no idea what I needed and said so. Kabir walked me through it in plain language, did not push a single extra, and I looked genuinely like myself on the wedding day — just a considerably better-rested version.', date: '2026-07-02' },
    { id: 4, name: 'Sneha Pillai', role: 'Marketing Lead, Chennai', rating: 5, service: 'Signature Facial', text: 'Priya told me to stop using two of the products I had been swearing by. Six weeks later my skin has completely changed. She could have sold me a course of ten treatments and instead she gave me advice.', date: '2026-06-20' },
    { id: 5, name: 'Aditi Sharma', role: 'Doctor, Delhi', rating: 4, service: 'Aroma Spa Massage', text: 'I work long shifts and my shoulders show it. Ninety minutes with Meera undid weeks of it. The booking flow was also refreshingly simple — three taps and done, with a reminder the night before.', date: '2026-06-11' },
    { id: 6, name: 'Fatima Sheikh', role: 'Teacher, Hyderabad', rating: 5, service: 'Bridal Mehendi', text: 'Zoya did mehendi for eleven people in my family in one afternoon and every single design was different. The stain came out almost black. My grandmother, who is not easily impressed, was impressed.', date: '2026-05-30' },
    { id: 7, name: 'Nikita Joshi', role: 'Content Creator, Mumbai', rating: 5, service: 'Designer Nail Art', text: 'I brought Ritika a blurry Pinterest screenshot and she produced something better than the reference. Three weeks later there is not a single chip. I have already rebooked twice.', date: '2026-05-18' },
    { id: 8, name: 'Meghana Rao', role: 'Architect, Bengaluru', rating: 5, service: 'Hair Spa Ritual', text: 'The reminder system alone is worth it — I have never once forgotten an appointment since joining. The Gold membership paid for itself in the second month, which I did not expect.', date: '2026-05-04' },
    { id: 9, name: 'Tanvi Deshpande', role: 'HR Manager, Pune', rating: 5, service: 'Keratin Treatment', text: 'Monsoon frizz had me tying my hair up every single day. Three months after the keratin treatment it still falls straight out of the shower, and the stylist was honest about exactly how long the results would last.', date: '2026-04-19' }
  ];

  /* ------------------------------------------------------------------ faq */
  var FAQS = [
    { cat: 'Booking', q: 'How do I book an appointment?', a: 'Pick a service, choose your salon and stylist, then select a date and time from the live availability calendar. The whole flow takes under two minutes and you will get a confirmation with a booking ID immediately.' },
    { cat: 'Booking', q: 'Can I book without creating an account?', a: 'Yes. Guest checkout is available at every step. That said, an account lets you reschedule in one tap, keeps your history and earns loyalty points, so most people create one after their first visit.' },
    { cat: 'Booking', q: 'How far in advance should I book?', a: 'Two to three days is comfortable for most services. For bridal work, weekends and festival weeks, book two to four weeks ahead — senior stylists fill up first.' },
    { cat: 'Booking', q: 'Can I request a specific stylist?', a: 'Always. Step three of the booking flow shows every available stylist with their specialities and live availability. You can also choose "Any available stylist" for the widest choice of slots.' },
    { cat: 'Changes', q: 'What is your cancellation policy?', a: 'Cancel free of charge up to 4 hours before your slot and any payment is refunded in full. Inside 4 hours a 25% fee applies, since the slot can rarely be refilled at that notice.' },
    { cat: 'Changes', q: 'How do I reschedule?', a: 'Open My Appointments, hit Reschedule on the booking and pick a new date and time. You can reschedule twice free of charge per booking.' },
    { cat: 'Changes', q: 'What if I am running late?', a: 'Call the salon directly. We hold your chair for 15 minutes. Beyond that we may need to shorten the service or move you to the next free slot, depending on the day.' },
    { cat: 'Payment', q: 'What payment methods do you accept?', a: 'UPI, all major credit and debit cards, net banking, popular wallets, and cash at the salon. You can also choose Pay at Salon during checkout and settle after your service.' },
    { cat: 'Payment', q: 'Are prices inclusive of taxes?', a: 'Listed prices exclude GST, which is calculated and shown separately in your booking summary before you confirm. There are no other charges.' },
    { cat: 'Payment', q: 'How do loyalty points work?', a: 'You earn 1 point for every ₹10 spent, more on paid membership tiers. 100 points equals ₹100 off any future booking, and points never expire while your account is active.' },
    { cat: 'Services', q: 'Do you use cruelty-free products?', a: 'Every product on our shelves is cruelty-free, and the majority are vegan. Product lists for each service are available at reception and on request during booking.' },
    { cat: 'Services', q: 'Do you offer home service?', a: 'Bridal makeup and mehendi are available at your venue across all eight cities. Other services are salon-only, because the equipment and hygiene standards genuinely cannot travel.' },
    { cat: 'Services', q: 'Is there a patch test for colour?', a: 'Yes, and it is mandatory. Colour and chemical services need a patch test at least 48 hours in advance. Book it as a free 10-minute slot from the service page.' },
    { cat: 'Membership', q: 'Can I cancel my membership?', a: 'Any time, from Settings, with no cancellation fee. Your benefits stay active until the end of the paid period and unused loyalty points remain in your account.' }
  ];

  /* -------------------------------------------------------------- gallery */
  var GALLERY = [
    { id: 1, cat: 'hair', title: 'Balayage Transformation', sub: 'Aarohi Mehta · 3 hours', seed: 'gal-hair-1', kind: 'hair', tall: true },
    { id: 2, cat: 'bridal', title: 'Traditional Bridal Look', sub: 'Sana Kapoor · Mumbai', seed: 'gal-bridal-1', kind: 'bridal' },
    { id: 3, cat: 'nails', title: 'Chrome Marble Set', sub: 'Ritika Shah · Powai', seed: 'gal-nails-1', kind: 'nails' },
    { id: 4, cat: 'salon', title: 'Bandra Flagship Interior', sub: 'Ground floor colour bar', seed: 'gal-salon-1', kind: 'interior', wide: true },
    { id: 5, cat: 'skin', title: 'Signature Facial Room', sub: 'Bandra West', seed: 'gal-skin-1', kind: 'skin' },
    { id: 6, cat: 'makeup', title: 'Editorial Soft Glam', sub: 'Sana Kapoor', seed: 'gal-makeup-1', kind: 'makeup', tall: true },
    { id: 7, cat: 'hair', title: 'Curly Cut & Define', sub: 'Ananya Roy', seed: 'gal-hair-2', kind: 'hair' },
    { id: 8, cat: 'spa', title: 'Couples Spa Suite', sub: 'Koregaon Park', seed: 'gal-spa-1', kind: 'spa' },
    { id: 9, cat: 'bridal', title: 'Rajasthani Mehendi', sub: 'Zoya Khan', seed: 'gal-bridal-2', kind: 'bridal' },
    { id: 10, cat: 'ba', title: 'Colour Correction', sub: 'Before & after · 1 session', seed: 'gal-ba-1', kind: 'hair', ba: true },
    { id: 11, cat: 'nails', title: 'Minimal French Set', sub: 'Ritika Shah', seed: 'gal-nails-2', kind: 'nails' },
    { id: 12, cat: 'salon', title: 'Juhu Bridal Green Room', sub: 'Juhu Beach', seed: 'gal-salon-2', kind: 'interior' },
    { id: 13, cat: 'ba', title: 'Acne Recovery', sub: 'Before & after · 8 weeks', seed: 'gal-ba-2', kind: 'skin', ba: true },
    { id: 14, cat: 'video', title: 'A Day at Lumière', sub: 'Studio film · 2:14', seed: 'gal-video-1', kind: 'gallery', video: true, wide: true },
    { id: 15, cat: 'hair', title: 'Keratin Smoothing', sub: 'Ananya Roy · 3 hours', seed: 'gal-hair-3', kind: 'hair' },
    { id: 16, cat: 'makeup', title: 'Festive Party Glam', sub: 'Sana Kapoor', seed: 'gal-makeup-2', kind: 'makeup' },
    { id: 17, cat: 'spa', title: 'Aroma Ritual Setup', sub: 'Meera Iyer', seed: 'gal-spa-2', kind: 'spa', tall: true },
    { id: 18, cat: 'video', title: 'Bridal Day Timelapse', sub: 'Studio film · 1:48', seed: 'gal-video-2', kind: 'bridal', video: true },
    { id: 19, cat: 'salon', title: 'Connaught Place Studio', sub: 'New Delhi', seed: 'gal-salon-3', kind: 'interior' },
    { id: 20, cat: 'skin', title: 'Brightening Therapy', sub: 'Priya Nair', seed: 'gal-skin-2', kind: 'skin' }
  ];

  var GALLERY_FILTERS = [
    { id: 'all', label: 'All Work' }, { id: 'hair', label: 'Hair' }, { id: 'skin', label: 'Skin' },
    { id: 'makeup', label: 'Makeup' }, { id: 'nails', label: 'Nails' }, { id: 'bridal', label: 'Bridal' },
    { id: 'spa', label: 'Spa' }, { id: 'salon', label: 'Our Salons' }, { id: 'ba', label: 'Before & After' },
    { id: 'video', label: 'Videos' }
  ];

  /* -------------------------------------------------------- misc content */
  var FEATURES = [
    { icon: 'calendar-check', title: 'Easy Booking', desc: 'Live availability across every salon. Book, reschedule or cancel in under a minute.', tone: '' },
    { icon: 'award', title: 'Professional Stylists', desc: 'Every stylist is certified, background-checked and reviewed by real clients.', tone: 'lav' },
    { icon: 'sparkles', title: 'Premium Services', desc: 'From a twenty-minute threading to a full bridal package, held to one standard.', tone: 'coral' },
    { icon: 'shield-check', title: 'Quality Products', desc: 'Cruelty-free, salon-grade products only. Full ingredient lists on request.', tone: 'mint' }
  ];

  var STATS = [
    { icon: 'smile', value: 10000, suffix: 'K+', divide: 1000, label: 'Happy Clients' },
    { icon: 'users', value: 50, suffix: '+', label: 'Expert Stylists' },
    { icon: 'sparkles', value: 100, suffix: '+', label: 'Beauty Services' },
    { icon: 'store', value: 20, suffix: '+', label: 'Partner Salons' }
  ];

  var STEPS = [
    { icon: 'search', title: 'Choose a Service', desc: 'Browse by category or search. Every service shows price, duration and real reviews.' },
    { icon: 'map-pin', title: 'Pick Salon & Stylist', desc: 'Compare locations and specialists, then choose whoever fits you best.' },
    { icon: 'calendar', title: 'Select Date & Time', desc: 'Live slot availability, updated in real time. No calling, no waiting on hold.' },
    { icon: 'check-circle', title: 'Confirm & Relax', desc: 'Instant confirmation, calendar invite and a reminder the day before.' },
    { icon: 'bell', title: 'Get Smart Reminders', desc: 'A gentle nudge the day before and again an hour ahead — so you never miss a slot.' },
    { icon: 'star', title: 'Review & Rebook', desc: 'Rate your visit in one tap and rebook your favourite stylist for next time instantly.' }
  ];

  var TIMELINE = [
    { year: '2016', title: 'One chair in Bandra', desc: 'Aarohi Mehta opened a single-chair studio above a bookshop on Linking Road, with a second-hand basin and a waiting list of eleven.' },
    { year: '2018', title: 'The first real salon', desc: 'Six chairs, four stylists and our first bridal booking. We turned the bookshop stairwell into a colour bar.' },
    { year: '2020', title: 'Booking goes digital', desc: 'A difficult year taught us that phone-line bookings do not scale. We built the first version of this platform in nine weeks.' },
    { year: '2022', title: 'Three cities', desc: 'Juhu, Powai and Pune opened within eight months of each other. Our training academy took its first intake of twelve.' },
    { year: '2024', title: 'Twenty partner salons', desc: 'We opened the platform to independent salons meeting our standards. Ten thousand clients had now booked through us.' },
    { year: '2026', title: 'Eight cities, one standard', desc: 'Fifty stylists, over a hundred services and a client return rate of 78% — the number we are proudest of.' }
  ];

  var VALUES = [
    { icon: 'heart', title: 'Honest Advice First', desc: 'Our stylists are paid on retention, not upsells. If you do not need a treatment, you will be told so.' },
    { icon: 'shield-check', title: 'Hygiene, Non-Negotiable', desc: 'Single-use tools where it matters, hospital-grade sterilisation everywhere else, audited quarterly.' },
    { icon: 'users', title: 'Everyone Welcome', desc: 'Unisex pricing by service, not by gender. Accessible studios. Stylists trained across all hair textures.' },
    { icon: 'leaf', title: 'Kinder Products', desc: 'Cruelty-free across the board, vegan wherever a good alternative exists, refill programmes in every salon.' }
  ];

  var TEAM = [
    { name: 'Aarohi Mehta', role: 'Founder & Creative Director', slug: 'aarohi-mehta' },
    { name: 'Priya Nair', role: 'Head of Skin & Wellness', slug: 'priya-nair' },
    { name: 'Sana Kapoor', role: 'Creative Head, Makeup', slug: 'sana-kapoor' },
    { name: 'Meera Iyer', role: 'Director of Spa Operations', slug: 'meera-iyer' }
  ];

  var TIME_SLOTS = [
    { t: '09:00 AM', p: 'morning' }, { t: '09:30 AM', p: 'morning' }, { t: '10:00 AM', p: 'morning' },
    { t: '10:30 AM', p: 'morning' }, { t: '11:00 AM', p: 'morning' }, { t: '11:30 AM', p: 'morning' },
    { t: '12:00 PM', p: 'afternoon' }, { t: '12:30 PM', p: 'afternoon' }, { t: '01:00 PM', p: 'afternoon' },
    { t: '02:00 PM', p: 'afternoon' }, { t: '02:30 PM', p: 'afternoon' }, { t: '03:00 PM', p: 'afternoon' },
    { t: '03:30 PM', p: 'afternoon' }, { t: '04:00 PM', p: 'afternoon' }, { t: '04:30 PM', p: 'afternoon' },
    { t: '05:00 PM', p: 'evening' }, { t: '05:30 PM', p: 'evening' }, { t: '06:00 PM', p: 'evening' },
    { t: '06:30 PM', p: 'evening' }, { t: '07:00 PM', p: 'evening' }, { t: '07:30 PM', p: 'evening' },
    { t: '08:00 PM', p: 'evening' }
  ];

  var CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai'];

  var WORKING_HOURS = [
    { d: 'Monday', h: '9:00 AM – 9:00 PM' }, { d: 'Tuesday', h: '9:00 AM – 9:00 PM' },
    { d: 'Wednesday', h: '9:00 AM – 9:00 PM' }, { d: 'Thursday', h: '9:00 AM – 9:00 PM' },
    { d: 'Friday', h: '9:00 AM – 10:00 PM' }, { d: 'Saturday', h: '8:30 AM – 10:00 PM' },
    { d: 'Sunday', h: '10:00 AM – 7:00 PM' }
  ];

  var NOTIFICATIONS = [
    { id: 1, text: 'Your <b>Hair Spa Ritual</b> with Aarohi is confirmed for tomorrow, 11:00 AM.', time: '12 min ago', unread: true, type: 'success' },
    { id: 2, text: 'New offer unlocked — <b>25% off</b> your next facial with code FIRST25.', time: '2 hours ago', unread: true, type: 'rose' },
    { id: 3, text: 'You earned <b>240 loyalty points</b> from your last appointment.', time: 'Yesterday', unread: true, type: 'info' },
    { id: 4, text: 'Priya Nair replied to your review of Signature Facial.', time: '3 days ago', unread: false, type: 'info' },
    { id: 5, text: 'Your appointment on 12 Aug was completed. Leave a review?', time: '5 days ago', unread: false, type: 'success' }
  ];

  /* -------------------------------------------------------------- helpers */
  var API = {
    CURRENCY: CURRENCY,
    BRAND: BRAND,
    CATEGORIES: CATEGORIES,
    SERVICES: SERVICES,
    STYLISTS: STYLISTS,
    SALONS: SALONS,
    OFFERS: OFFERS,
    PLANS: PLANS,
    POSTS: POSTS,
    TESTIMONIALS: TESTIMONIALS,
    FAQS: FAQS,
    GALLERY: GALLERY,
    GALLERY_FILTERS: GALLERY_FILTERS,
    FEATURES: FEATURES,
    STATS: STATS,
    STEPS: STEPS,
    TIMELINE: TIMELINE,
    VALUES: VALUES,
    TEAM: TEAM,
    TIME_SLOTS: TIME_SLOTS,
    CITIES: CITIES,
    WORKING_HOURS: WORKING_HOURS,
    NOTIFICATIONS: NOTIFICATIONS,

    money: function (n) {
      return CURRENCY + Number(n).toLocaleString('en-IN');
    },
    duration: function (min) {
      if (min < 60) return min + ' min';
      var h = Math.floor(min / 60), m = min % 60;
      return h + 'h' + (m ? ' ' + m + 'm' : '');
    },
    service: function (idOrSlug) {
      return SERVICES.filter(function (s) { return s.id === idOrSlug || s.slug === idOrSlug; })[0] || null;
    },
    stylist: function (idOrSlug) {
      return STYLISTS.filter(function (s) { return s.id === idOrSlug || s.slug === idOrSlug; })[0] || null;
    },
    salon: function (idOrSlug) {
      return SALONS.filter(function (s) { return s.id === idOrSlug || s.slug === idOrSlug; })[0] || null;
    },
    post: function (idOrSlug) {
      return POSTS.filter(function (p) { return p.id === idOrSlug || p.slug === idOrSlug; })[0] || null;
    },
    category: function (id) {
      return CATEGORIES.filter(function (c) { return c.id === id; })[0] || { name: id, icon: 'sparkles' };
    },
    stylistsFor: function (serviceId) {
      return STYLISTS.filter(function (s) { return s.services.indexOf(serviceId) > -1; });
    },
    salonsFor: function (catId) {
      return SALONS.filter(function (s) { return s.services.indexOf(catId) > -1; });
    },
    stylistsAt: function (salonSlug) {
      return STYLISTS.filter(function (s) { return s.salon === salonSlug; });
    },
    offer: function (code) {
      code = String(code || '').toUpperCase().trim();
      return OFFERS.filter(function (o) { return o.code === code; })[0] || null;
    },
    related: function (svcObj, n) {
      return SERVICES.filter(function (s) { return s.cat === svcObj.cat && s.id !== svcObj.id; }).slice(0, n || 3);
    },
    dateLabel: function (d) {
      var dt = (d instanceof Date) ? d : new Date(d);
      return dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    },
    dateShort: function (d) {
      var dt = (d instanceof Date) ? d : new Date(d);
      return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  global.DATA = API;
})(window);
