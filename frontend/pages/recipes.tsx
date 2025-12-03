import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const RECIPES = [
  {
    title: 'Lotus Moon Milk',
    herb: 'Lotus Flower',
    image: 'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['Lotus petals', 'cardamom', 'oat milk', 'wild honey'],
    description:
      'A calming moon-time beverage infused with lotus petals and cardamom for serene evenings.',
  },
  {
    title: 'Clove & Tamarind Tonic',
    herb: 'Cloves',
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['Clove buds', 'tamarind pulp', 'cinnamon', 'palm sugar'],
    description:
      'A warming immune-support tonic brewed with eugenol-rich cloves and tangy tamarind.',
  },
  {
    title: 'Ashwagandha Golden Paste',
    herb: 'Ashwagandha',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['Ashwagandha root', 'turmeric', 'black pepper', 'ghee'],
    description:
      'An adaptogenic paste to stir into bedtime drinks, supporting relaxation and steady energy.',
  },
  {
    title: 'Moringa Energy Bites',
    herb: 'Moringa',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['Moringa powder', 'dates', 'cashews', 'coconut'],
    description:
      'No-bake bites loaded with chlorophyll, perfect for quick morning nourishment.',
  },
  {
    title: 'Lemongrass Detox Steam',
    herb: 'Lemongrass',
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=80',
    ingredients: ['Lemongrass stalks', 'ginger', 'sea salt', 'eucalyptus oil'],
    description:
      'A restorative steam ritual to open airways and refresh skin after a long day.',
  },
];

const RecipesPage = () => {
  return (
    <>
      <Head>
        <title>Recipes | DeeDees Health &amp; Wellness</title>
      </Head>
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">
              Botanical Recipes
            </p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">Herbal &amp; Skincare Formulas</h1>
            <p className="mt-4 text-lg text-slate-600">
              Sign in with Google to unlock full preparation steps, dosing, and ritual guidance for
              each recipe.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/signin?callback=/recipes"
                className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-primary-700"
              >
                Sign in with Google
              </Link>
            </div>
          </header>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {RECIPES.map((recipe) => (
              <article
                key={recipe.title}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative h-64 w-full">
                  <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
                </div>
                <div className="p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">
                    {recipe.herb}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">{recipe.title}</h2>
                  <p className="mt-3 text-sm font-semibold text-slate-500">Key Ingredients</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                    {recipe.ingredients.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="mt-4 text-slate-600">{recipe.description}</p>
                  <div className="mt-6">
                    <Link
                      href="/auth/signin?callback=/recipes"
                      className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                    >
                      Sign in to view full recipe →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipesPage;

